# 2D Game Generator

A simple web-based 2D game generator that allows users to create platformer games using natural language commands. No coding required!

## Features

- **Natural Language Interface**: Create games by typing simple commands
- **Interactive Gameplay**: Play your generated games immediately with arrow keys
- **Multiple Game Elements**:
  - Player characters
  - Platforms
  - Enemies with patrol behavior
  - Collectible coins
  - Obstacles
  - Customizable colors and sizes
- **Physics Engine**: Built-in gravity and collision detection
- **Particle Effects**: Visual feedback for collecting items and taking damage
- **Pre-built Examples**: Load example games to get started quickly
- **Score Tracking**: Collect coins to increase your score
- **Responsive Controls**: Smooth keyboard controls for gameplay

## How to Use

### Starting the Server

1. Make sure you have Node.js installed
2. Run the following command:
   ```bash
   node server.js
   ```
3. Open your browser and navigate to `http://localhost:3000/`

### Creating Your First Game

1. Enter commands in the text area on the left
2. Click "Generate Game" to create your game
3. Use arrow keys to move and spacebar to jump
4. Press 'R' to restart the game

### Available Commands

#### Game Type
```
create a [type] game
```
Types: `platformer`, `shooter`, `maze`

#### Player
```
add player at X Y [colored COLOR]
```
Example: `add player at 100 200 colored blue`

#### Platform
```
add platform at X Y width W height H [colored COLOR]
```
Example: `add platform at 50 400 width 700 height 20`

#### Enemy
```
add enemy at X Y [colored COLOR]
```
Example: `add enemy at 500 300 colored red`

#### Coin
```
add coin at X Y [colored COLOR]
```
Example: `add coin at 300 200 colored gold`

#### Obstacle
```
add obstacle at X Y width W height H
```
Example: `add obstacle at 200 450 width 50 height 50`

#### Settings
```
set gravity to VALUE
set background to COLOR
```
Examples:
- `set gravity to 0.5`
- `set background to skyblue`

### Available Colors
- red, blue, green, yellow, purple, orange
- brown, black, white, gold, silver
- pink, cyan, skyblue, lightblue

### Controls
- **Arrow Keys / WASD**: Move left and right
- **Space / Up Arrow / W**: Jump
- **R**: Restart game
- **Ctrl/Cmd + Enter**: Generate game (keyboard shortcut)

## Example Games

### Simple Platformer
```
create a platformer game
add player at 50 100 colored blue
add platform at 0 550 width 800 height 50
add platform at 200 450 width 150 height 20
add platform at 400 350 width 150 height 20
add coin at 250 400 colored gold
add enemy at 300 500 colored red
set gravity to 0.6
```

### Coin Collector
```
create a platformer game
add player at 100 100 colored purple
add platform at 50 500 width 700 height 20
add platform at 100 400 width 100 height 15
add platform at 300 350 width 100 height 15
add coin at 150 350 colored gold
add coin at 350 300 colored gold
add coin at 550 250 colored gold
set background to lightblue
```

### Challenge Course
```
create a platformer game
add player at 50 500 colored cyan
add platform at 0 550 width 800 height 50
add platform at 150 450 width 100 height 15
add enemy at 200 410 colored red
add coin at 200 400 colored gold
add obstacle at 120 520 width 30 height 30
set gravity to 0.7
```

## Technical Details

### Files Structure
```
.
├── index.html       # Main HTML file with UI
├── style.css        # Styling and layout
├── game-engine.js   # Game engine and physics
├── app.js          # Application logic
├── server.js       # Simple HTTP server
└── README.md       # This file
```

### Game Engine Features
- **Canvas Rendering**: Uses HTML5 Canvas for smooth 2D graphics
- **Physics System**: Gravity, velocity, and collision detection
- **Entity System**: Modular game objects (Player, Platform, Enemy, Coin, etc.)
- **Particle System**: Visual effects for game events
- **Command Parser**: Interprets natural language into game objects

### Browser Compatibility
Works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- CSS Grid

## Tips for Creating Games

1. **Always add a ground platform**: `add platform at 0 550 width 800 height 50`
2. **Adjust gravity for different feels**: Lower gravity (0.3) for floaty jumps, higher (0.8) for snappy jumps
3. **Space platforms vertically**: Leave enough room for the player to jump between platforms
4. **Add multiple coins**: Each coin is worth 10 points
5. **Use colors creatively**: Different colors help distinguish game elements
6. **Test iteratively**: Generate, play, adjust, and regenerate

## Keyboard Shortcuts

- **Ctrl/Cmd + Enter**: Generate game from commands
- **R**: Restart current game
- **Arrow Keys**: Movement
- **Space**: Jump

## Future Enhancements (Ideas)

- More game types (shooter, puzzle, etc.)
- Power-ups and special abilities
- Multiple levels
- Save/load game designs
- Export to standalone HTML
- Mobile touch controls
- Sound effects and music
- Multiplayer support

## License

MIT License - Feel free to use and modify!

## Credits

Created with HTML5, CSS3, and vanilla JavaScript. No external libraries required!

---

Enjoy creating your own 2D games!
