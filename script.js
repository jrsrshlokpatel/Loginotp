const titleInput = document.getElementById('title-input');
const commandInput = document.getElementById('command-input');
const generateBtn = document.getElementById('generate-btn');
const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');
const restartBtn = document.getElementById('restart-btn');
const h1 = document.querySelector('h1');

generateBtn.addEventListener('click', () => {
    const command = commandInput.value;
    const title = titleInput.value;
    h1.textContent = title;
    console.log(`Generating game with command: ${command}`);
    generateGame(command);
});

restartBtn.addEventListener('click', () => {
    const command = commandInput.value;
    generateGame(command);
    restartBtn.style.display = 'none';
});

function generateGame(command) {
    const heroColorMatch = command.match(/with a (.*) hero/);
    const heroColor = heroColorMatch ? heroColorMatch[1] : 'blue';

    const platformCountMatch = command.match(/with (\d+) platforms/);
    const platformCount = platformCountMatch ? parseInt(platformCountMatch[1], 10) : 3;

    const enemyCountMatch = command.match(/with (\d+) enemies/);
    const enemyCount = enemyCountMatch ? parseInt(enemyCountMatch[1], 10) : 1;

    const enemySpeedMatch = command.match(/enemies at speed (\d+)/);
    const enemySpeed = enemySpeedMatch ? parseInt(enemySpeedMatch[1], 10) : 2;

    const platformColorMatch = command.match(/with (.*?) platforms/);
    let platformColor = 'gray';
    if (platformColorMatch) {
        const parts = platformColorMatch[1].split(' ');
        const color = parts.find(p => isNaN(parseInt(p,10)));
        if (color) {
            platformColor = color;
        }
    }

    const enemyColorMatch = command.match(/with (.*?) enemies/);
    let enemyColor = 'red';
    if (enemyColorMatch) {
        const parts = enemyColorMatch[1].split(' ');
        const color = parts.find(p => isNaN(parseInt(p,10)));
        if (color) {
            enemyColor = color;
        }
    }

    const collectibleColorMatch = command.match(/with a (.*) collectible/);
    const collectibleColor = collectibleColorMatch ? collectibleColorMatch[1] : 'gold';

    const heroSizeMatch = command.match(/hero of size (\d+)/);
    const heroSize = heroSizeMatch ? parseInt(heroSizeMatch[1], 10) : 20;

    const enemySizeMatch = command.match(/enemies of size (\d+)/);
    const enemySize = enemySizeMatch ? parseInt(enemySizeMatch[1], 10) : 20;

    const collectibleSizeMatch = command.match(/collectible of size (\d+)/);
    const collectibleSize = collectibleSizeMatch ? parseInt(collectibleSizeMatch[1], 10) : 15;

    const platformWidthMatch = command.match(/platforms of width (\d+)/);
    const platformWidth = platformWidthMatch ? parseInt(platformWidthMatch[1], 10) : 80;

    const platformHeightMatch = command.match(/platforms of height (\d+)/);
    const platformHeight = platformHeightMatch ? parseInt(platformHeightMatch[1], 10) : 20;

    const gravityMatch = command.match(/with gravity (\d+\.\d+)/);
    const gravity = gravityMatch ? parseFloat(gravityMatch[1]) : 0.5;

    const jumpForceMatch = command.match(/jump force of (\d+)/);
    const jumpForce = jumpForceMatch ? parseInt(jumpForceMatch[1], 10) : 10;

    const heroSpeedMatch = command.match(/hero speed of (\d+)/);
    const heroSpeed = heroSpeedMatch ? parseInt(heroSpeedMatch[1], 10) : 3;

    const backgroundColorMatch = command.match(/with a (.*) background/);
    const backgroundColor = backgroundColorMatch ? backgroundColorMatch[1] : 'white';

    const scoreFontMatch = command.match(/score font of '(.*)'/);
    const scoreFont = scoreFontMatch ? scoreFontMatch[1] : '20px Arial';

    const hero = {
        x: 50,
        y: 50,
        width: heroSize,
        height: heroSize,
        color: heroColor,
        dx: 0,
        dy: 0,
        jumping: false
    };

    const platforms = [];
    platforms.push({ x: 0, y: gameCanvas.height - 20, width: gameCanvas.width, height: 20 }); // Ground

    for (let i = 0; i < platformCount - 1; i++) {
        platforms.push({
            x: Math.random() * (gameCanvas.width - platformWidth),
            y: gameCanvas.height - 80 - (i * 60),
            width: platformWidth,
            height: platformHeight
        });
    }

    const lastPlatform = platforms[platforms.length - 1];
    const collectible = {
        x: lastPlatform.x + lastPlatform.width / 2 - collectibleSize / 2,
        y: lastPlatform.y - collectibleSize - 5,
        width: collectibleSize,
        height: collectibleSize,
        color: collectibleColor
    };

    const enemies = [];
    for (let i = 0; i < enemyCount; i++) {
        enemies.push({
            x: Math.random() * (gameCanvas.width - enemySize),
            y: gameCanvas.height - 40,
            width: enemySize,
            height: enemySize,
            color: enemyColor,
            dx: enemySpeed
        });
    }

    let score = 0;
    let gameOver = false;
    let win = false;
    let animationFrameId;

    function drawHero() {
        ctx.fillStyle = hero.color;
        ctx.fillRect(hero.x, hero.y, hero.width, hero.height);
    }

    function drawPlatforms() {
        ctx.fillStyle = platformColor;
        platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
    }

    function drawCollectible() {
        ctx.fillStyle = collectible.color;
        ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
    }

    function drawEnemies() {
        enemies.forEach(enemy => {
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    function drawRestartScreen() {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText(win ? 'You Win!' : 'Game Over!', gameCanvas.width / 2 - 80, gameCanvas.height / 2);
        restartBtn.style.display = 'block';
    }

    function gameLoop() {
        if (gameOver) {
            drawRestartScreen();
            cancelAnimationFrame(animationFrameId);
            return;
        }

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Apply gravity
        hero.dy += gravity;
        hero.y += hero.dy;

        // Move hero
        hero.x += hero.dx;

        // Move enemies
        enemies.forEach(enemy => {
            enemy.x += enemy.dx;
            if (enemy.x + enemy.width > gameCanvas.width || enemy.x < 0) {
                enemy.dx *= -1;
            }
        });

        // Collision with platforms
        platforms.forEach(platform => {
            if (
                hero.x < platform.x + platform.width &&
                hero.x + hero.width > platform.x &&
                hero.y < platform.y + platform.height &&
                hero.y + hero.height > platform.y
            ) {
                hero.dy = 0;
                hero.jumping = false;
                hero.y = platform.y - hero.height;
            }
        });

        // Collision with collectible
        if (
            hero.x < collectible.x + collectible.width &&
            hero.x + hero.width > collectible.x &&
            hero.y < collectible.y + collectible.height &&
            hero.y + hero.height > collectible.y
        ) {
            score++;
            win = true;
            gameOver = true;
        }

        // Collision with enemies
        enemies.forEach(enemy => {
            if (
                hero.x < enemy.x + enemy.width &&
                hero.x + hero.width > enemy.x &&
                hero.y < enemy.y + enemy.height &&
                hero.y + hero.height > enemy.y
            ) {
                gameOver = true;
            }
        });

        drawPlatforms();
        drawCollectible();
        drawEnemies();
        drawHero();
        drawScore();

        animationFrameId = requestAnimationFrame(gameLoop);
    }

    function drawScore() {
        ctx.fillStyle = 'black';
        ctx.font = scoreFont;
        ctx.fillText(`Score: ${score}`, 10, 25);
    }

    // Keyboard controls
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') {
            hero.dx = -heroSpeed;
        } else if (e.key === 'ArrowRight') {
            hero.dx = heroSpeed;
        } else if (e.key === ' ' && !hero.jumping) {
            hero.dy = -jumpForce;
            hero.jumping = true;
        }
    });

    document.addEventListener('keyup', e => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            hero.dx = 0;
        }
    });

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    gameLoop();
}
