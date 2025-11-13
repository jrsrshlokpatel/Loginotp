// Initialize the game engine
const canvas = document.getElementById('gameCanvas');
const gameEngine = new GameEngine(canvas);

// UI Elements
const commandInput = document.getElementById('commandInput');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const examplesBtn = document.getElementById('examplesBtn');
const scoreDisplay = document.getElementById('score');
const statusDisplay = document.getElementById('status');

// Example games
const examples = [
    {
        name: 'Simple Platformer',
        commands: `create a platformer game
add player at 50 100 colored blue
add platform at 0 550 width 800 height 50
add platform at 200 450 width 150 height 20
add platform at 400 350 width 150 height 20
add platform at 600 250 width 150 height 20
add coin at 250 400 colored gold
add coin at 450 300 colored gold
add coin at 650 200 colored gold
add enemy at 300 500 colored red
set gravity to 0.6`
    },
    {
        name: 'Coin Collector',
        commands: `create a platformer game
add player at 100 100 colored purple
add platform at 50 500 width 700 height 20
add platform at 100 400 width 100 height 15
add platform at 300 350 width 100 height 15
add platform at 500 300 width 100 height 15
add coin at 150 350 colored gold
add coin at 350 300 colored gold
add coin at 550 250 colored gold
add coin at 400 450 colored gold
add coin at 200 250 colored gold
set background to lightblue
set gravity to 0.5`
    },
    {
        name: 'Enemy Maze',
        commands: `create a maze game
add player at 50 50 colored green
add platform at 0 580 width 800 height 20
add platform at 0 0 width 20 height 600
add platform at 780 0 width 20 height 600
add platform at 150 100 width 20 height 200
add platform at 300 300 width 20 height 200
add platform at 450 100 width 20 height 300
add platform at 600 250 width 20 height 250
add enemy at 200 530 colored red
add enemy at 350 530 colored orange
add enemy at 500 530 colored red
add coin at 700 530 colored gold
set gravity to 0.4`
    },
    {
        name: 'Challenge Course',
        commands: `create a platformer game
add player at 50 500 colored cyan
add platform at 0 550 width 800 height 50
add platform at 150 450 width 100 height 15
add platform at 300 380 width 80 height 15
add platform at 450 320 width 100 height 15
add platform at 600 380 width 100 height 15
add enemy at 200 410 colored red
add enemy at 350 280 colored red
add enemy at 500 280 colored orange
add coin at 200 400 colored gold
add coin at 350 270 colored gold
add coin at 500 270 colored gold
add coin at 650 330 colored gold
add obstacle at 120 520 width 30 height 30
add obstacle at 420 520 width 30 height 30
set gravity to 0.7
set background to skyblue`
    }
];

let currentExampleIndex = 0;

// Generate game from commands
generateBtn.addEventListener('click', () => {
    const commands = commandInput.value.trim();

    if (!commands) {
        updateStatus('Please enter some commands!', 'error');
        return;
    }

    try {
        gameEngine.stop();
        const errors = gameEngine.parseCommands(commands);

        if (errors.length > 0) {
            console.warn('Parsing warnings:', errors);
        }

        gameEngine.start();
        updateStatus('Game running! Use arrow keys to play', 'success');

        // Update score display
        updateScoreLoop();
    } catch (error) {
        updateStatus('Error generating game: ' + error.message, 'error');
        console.error(error);
    }
});

// Reset game
resetBtn.addEventListener('click', () => {
    gameEngine.stop();
    gameEngine.reset();
    commandInput.value = '';
    updateStatus('Ready to generate game', 'ready');
    scoreDisplay.textContent = '0';
});

// Load example
examplesBtn.addEventListener('click', () => {
    const example = examples[currentExampleIndex];
    commandInput.value = example.commands;
    updateStatus(`Loaded: ${example.name}`, 'info');

    // Cycle through examples
    currentExampleIndex = (currentExampleIndex + 1) % examples.length;

    // Auto-generate after a short delay
    setTimeout(() => {
        generateBtn.click();
    }, 500);
});

// Update status message
function updateStatus(message, type) {
    statusDisplay.textContent = message;
    statusDisplay.className = 'status-display';

    if (type === 'error') {
        statusDisplay.style.background = '#ffe7e7';
        statusDisplay.style.color = '#cc0000';
    } else if (type === 'success') {
        statusDisplay.style.background = '#e7ffe7';
        statusDisplay.style.color = '#00cc00';
    } else if (type === 'info') {
        statusDisplay.style.background = '#fff3cd';
        statusDisplay.style.color = '#856404';
    } else {
        statusDisplay.style.background = '#e7f3ff';
        statusDisplay.style.color = '#0066cc';
    }
}

// Update score display
function updateScoreLoop() {
    if (gameEngine.gameRunning) {
        scoreDisplay.textContent = gameEngine.score;
        requestAnimationFrame(updateScoreLoop);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generateBtn.click();
    }
});

// Load first example on page load
window.addEventListener('load', () => {
    updateStatus('Click "Load Example" to try a demo game!', 'info');
});

// Add some helpful console messages
console.log('%c2D Game Generator Ready!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cTry these commands:', 'color: #764ba2; font-size: 14px; font-weight: bold;');
console.log('- create a platformer game');
console.log('- add player at 100 200 colored blue');
console.log('- add platform at 50 400 width 700 height 20');
console.log('- add enemy at 500 300 colored red');
console.log('- add coin at 300 200 colored gold');
console.log('- set gravity to 0.5');
