# Quick Start Guide

Get your first game running in under 2 minutes!

## Step 1: Start the Server

```bash
node server.js
```

You should see:
```
Server running at http://localhost:3000/
Press Ctrl+C to stop the server
```

## Step 2: Open Your Browser

Navigate to: **http://localhost:3000/**

## Step 3: Try an Example

Click the **"Load Example"** button to load a pre-made game, then click **"Generate Game"**.

## Step 4: Play!

- **Arrow Keys** or **WASD**: Move left and right
- **Space** or **Up Arrow**: Jump
- **R**: Restart

## Step 5: Create Your Own

Try typing these commands in the text area:

```
create a platformer game
add player at 100 500 colored blue
add platform at 0 550 width 800 height 50
add platform at 300 400 width 200 height 20
add coin at 350 350 colored gold
add enemy at 400 360 colored red
set gravity to 0.6
```

Click **"Generate Game"** and play your creation!

## Tips for Beginners

1. **Always add a ground platform first**: This prevents your player from falling off-screen
   ```
   add platform at 0 550 width 800 height 50
   ```

2. **Place the player above ground**: Make sure the Y coordinate is less than 550
   ```
   add player at 100 500 colored blue
   ```

3. **Space platforms for jumping**: A jump height is about 150 pixels
   ```
   add platform at 200 450 width 150 height 20
   add platform at 400 350 width 150 height 20
   ```

4. **Add collectibles**: Coins make your game more fun!
   ```
   add coin at 300 200 colored gold
   ```

5. **Add challenges**: Enemies add excitement
   ```
   add enemy at 500 300 colored red
   ```

## Common Commands Cheat Sheet

| Command | Example |
|---------|---------|
| Create game | `create a platformer game` |
| Add player | `add player at 100 200 colored blue` |
| Add platform | `add platform at 50 400 width 700 height 20` |
| Add enemy | `add enemy at 500 300 colored red` |
| Add coin | `add coin at 300 200 colored gold` |
| Set gravity | `set gravity to 0.5` |
| Set background | `set background to skyblue` |

## Troubleshooting

**Q: Player is falling through platforms?**
- Make sure platform Y coordinate is greater than player Y + player height (30)
- Check that platforms have proper width and height values

**Q: Can't jump high enough?**
- Reduce gravity: `set gravity to 0.3`
- Space platforms closer vertically

**Q: Game is too fast/slow?**
- Adjust gravity between 0.3 (slow, floaty) and 0.8 (fast, snappy)

**Q: Commands not working?**
- Check spelling and syntax
- Make sure each command is on a new line
- See the help section in the UI for correct syntax

## Next Steps

1. Experiment with different colors
2. Create multiple platforms at different heights
3. Add several coins to collect
4. Place enemies strategically
5. Try different gravity values
6. Change the background color

## Keyboard Shortcuts

- **Ctrl/Cmd + Enter**: Generate game (no need to click button)
- **R**: Restart current game
- **Arrow Keys**: Move player
- **Space**: Jump

---

**Have fun creating games!**

For more details, see README.md
