class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
    }

    reset() {
        this.gameType = 'platformer';
        this.entities = [];
        this.player = null;
        this.gravity = 0.5;
        this.backgroundColor = '#87ceeb';
        this.score = 0;
        this.keys = {};
        this.gameRunning = false;
        this.particles = [];

        // Set up key listeners
        this.setupControls();
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === 'r' || e.key === 'R') {
                this.restart();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    parseCommands(commandText) {
        this.reset();
        const lines = commandText.split('\n').filter(line => line.trim());
        const errors = [];

        for (let line of lines) {
            line = line.trim().toLowerCase();
            if (!line) continue;

            try {
                // Create game type
                if (line.includes('create') && line.includes('game')) {
                    if (line.includes('platformer')) this.gameType = 'platformer';
                    else if (line.includes('shooter')) this.gameType = 'shooter';
                    else if (line.includes('maze')) this.gameType = 'maze';
                }
                // Add player
                else if (line.includes('add player')) {
                    const coords = this.extractCoordinates(line);
                    const color = this.extractColor(line) || 'blue';
                    this.player = new Player(coords.x, coords.y, color);
                    this.entities.push(this.player);
                }
                // Add platform
                else if (line.includes('add platform')) {
                    const coords = this.extractCoordinates(line);
                    const width = this.extractNumber(line, 'width') || 100;
                    const height = this.extractNumber(line, 'height') || 20;
                    const color = this.extractColor(line) || 'brown';
                    this.entities.push(new Platform(coords.x, coords.y, width, height, color));
                }
                // Add enemy
                else if (line.includes('add enemy')) {
                    const coords = this.extractCoordinates(line);
                    const color = this.extractColor(line) || 'red';
                    this.entities.push(new Enemy(coords.x, coords.y, color));
                }
                // Add coin
                else if (line.includes('add coin')) {
                    const coords = this.extractCoordinates(line);
                    const color = this.extractColor(line) || 'gold';
                    this.entities.push(new Coin(coords.x, coords.y, color));
                }
                // Add obstacle
                else if (line.includes('add obstacle')) {
                    const coords = this.extractCoordinates(line);
                    const width = this.extractNumber(line, 'width') || 50;
                    const height = this.extractNumber(line, 'height') || 50;
                    this.entities.push(new Obstacle(coords.x, coords.y, width, height));
                }
                // Set gravity
                else if (line.includes('set gravity')) {
                    this.gravity = this.extractNumber(line, 'to') || 0.5;
                }
                // Set background
                else if (line.includes('set background')) {
                    this.backgroundColor = this.extractColor(line) || '#87ceeb';
                }
            } catch (error) {
                errors.push(`Error parsing: ${line}`);
            }
        }

        if (!this.player) {
            errors.push('Warning: No player added. Adding default player.');
            this.player = new Player(100, 100, 'blue');
            this.entities.push(this.player);
        }

        return errors;
    }

    extractCoordinates(line) {
        const numbers = line.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            return { x: parseInt(numbers[0]), y: parseInt(numbers[1]) };
        }
        return { x: 100, y: 100 };
    }

    extractNumber(line, keyword) {
        const regex = new RegExp(keyword + '\\s+(\\d+)', 'i');
        const match = line.match(regex);
        return match ? parseFloat(match[1]) : null;
    }

    extractColor(line) {
        const colors = {
            'red': '#ff4444',
            'blue': '#4444ff',
            'green': '#44ff44',
            'yellow': '#ffff44',
            'purple': '#ff44ff',
            'orange': '#ff8844',
            'brown': '#8B4513',
            'black': '#000000',
            'white': '#ffffff',
            'gold': '#ffd700',
            'silver': '#c0c0c0',
            'pink': '#ff69b4',
            'cyan': '#00ffff'
        };

        for (let color in colors) {
            if (line.includes(color)) {
                return colors[color];
            }
        }
        return null;
    }

    start() {
        this.gameRunning = true;
        this.gameLoop();
    }

    stop() {
        this.gameRunning = false;
    }

    restart() {
        if (this.player) {
            this.player.reset();
            this.score = 0;
            // Reset all entities
            this.entities.forEach(entity => {
                if (entity.reset) entity.reset();
            });
        }
    }

    gameLoop() {
        if (!this.gameRunning) return;

        this.update();
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Update all entities
        this.entities.forEach(entity => {
            if (entity.update) {
                entity.update(this);
            }
        });

        // Update particles
        this.particles = this.particles.filter(p => {
            p.update();
            return p.life > 0;
        });

        // Check collisions
        this.checkCollisions();
    }

    checkCollisions() {
        if (!this.player) return;

        this.entities.forEach(entity => {
            if (entity === this.player) return;

            if (this.isColliding(this.player, entity)) {
                if (entity.type === 'coin' && !entity.collected) {
                    entity.collect();
                    this.score += 10;
                    this.createParticles(entity.x, entity.y, entity.color);
                } else if (entity.type === 'enemy' && !this.player.invulnerable) {
                    this.player.hit();
                    this.createParticles(this.player.x, this.player.y, '#ff0000');
                } else if (entity.type === 'platform') {
                    this.handlePlatformCollision(this.player, entity);
                }
            }
        });
    }

    isColliding(entity1, entity2) {
        return entity1.x < entity2.x + entity2.width &&
               entity1.x + entity1.width > entity2.x &&
               entity1.y < entity2.y + entity2.height &&
               entity1.y + entity1.height > entity2.y;
    }

    handlePlatformCollision(player, platform) {
        const playerBottom = player.y + player.height;
        const playerRight = player.x + player.width;
        const platformRight = platform.x + platform.width;
        const platformBottom = platform.y + platform.height;

        // Check if player is falling onto platform
        if (player.velocityY > 0 && playerBottom > platform.y &&
            player.y < platform.y &&
            playerRight > platform.x && player.x < platformRight) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isOnGround = true;
        }
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render all entities
        this.entities.forEach(entity => {
            if (entity.render) {
                entity.render(this.ctx);
            }
        });

        // Render particles
        this.particles.forEach(p => p.render(this.ctx));
    }
}

// Base Entity Class
class Entity {
    constructor(x, y, width, height, color, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
        this.initialX = x;
        this.initialY = y;
    }

    reset() {
        this.x = this.initialX;
        this.y = this.initialY;
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Player Class
class Player extends Entity {
    constructor(x, y, color) {
        super(x, y, 30, 30, color, 'player');
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpPower = -12;
        this.isOnGround = false;
        this.health = 3;
        this.invulnerable = false;
    }

    update(game) {
        // Horizontal movement
        if (game.keys['ArrowLeft'] || game.keys['a']) {
            this.velocityX = -this.speed;
        } else if (game.keys['ArrowRight'] || game.keys['d']) {
            this.velocityX = this.speed;
        } else {
            this.velocityX = 0;
        }

        // Jumping
        if ((game.keys[' '] || game.keys['ArrowUp'] || game.keys['w']) && this.isOnGround) {
            this.velocityY = this.jumpPower;
            this.isOnGround = false;
        }

        // Apply gravity
        this.velocityY += game.gravity;

        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Boundary checks
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > game.canvas.width) this.x = game.canvas.width - this.width;

        // Ground collision
        if (this.y + this.height >= game.canvas.height) {
            this.y = game.canvas.height - this.height;
            this.velocityY = 0;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }

        // Reset if fall off screen
        if (this.y > game.canvas.height + 100) {
            this.reset();
        }
    }

    hit() {
        this.health--;
        this.invulnerable = true;
        setTimeout(() => {
            this.invulnerable = false;
        }, 1000);
    }

    render(ctx) {
        if (!this.invulnerable || Math.floor(Date.now() / 100) % 2) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x + 8, this.y + 8, 6, 6);
            ctx.fillRect(this.x + 16, this.y + 8, 6, 6);
        }
    }

    reset() {
        super.reset();
        this.velocityX = 0;
        this.velocityY = 0;
        this.health = 3;
        this.invulnerable = false;
    }
}

// Platform Class
class Platform extends Entity {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color, 'platform');
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

// Enemy Class
class Enemy extends Entity {
    constructor(x, y, color) {
        super(x, y, 30, 30, color, 'enemy');
        this.velocityX = 2;
        this.minX = x - 50;
        this.maxX = x + 50;
    }

    update(game) {
        this.x += this.velocityX;
        if (this.x <= this.minX || this.x >= this.maxX) {
            this.velocityX *= -1;
        }
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 5, this.y + 5, 8, 8);
        ctx.fillRect(this.x + 17, this.y + 5, 8, 8);
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 10, this.y + 20, 10, 3);
    }

    reset() {
        super.reset();
        this.velocityX = Math.abs(this.velocityX) * (Math.random() > 0.5 ? 1 : -1);
    }
}

// Coin Class
class Coin extends Entity {
    constructor(x, y, color) {
        super(x, y, 20, 20, color, 'coin');
        this.collected = false;
        this.rotation = 0;
    }

    update(game) {
        this.rotation += 0.1;
    }

    collect() {
        this.collected = true;
    }

    render(ctx) {
        if (this.collected) return;

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    reset() {
        super.reset();
        this.collected = false;
    }
}

// Obstacle Class
class Obstacle extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height, '#666', 'obstacle');
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

// Particle Class
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.velocityX = (Math.random() - 0.5) * 6;
        this.velocityY = (Math.random() - 0.5) * 6;
        this.life = 60;
        this.color = color;
        this.size = Math.random() * 5 + 2;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += 0.2;
        this.life--;
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 60;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}
