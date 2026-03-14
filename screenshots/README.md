# Screenshots

This directory contains screenshots of the Steam Analytics Dashboard for the GitHub README.

## Required Screenshots

Please add the following screenshots to this directory:

### 1. `dashboard.png`
- **Description**: Main dashboard overview showing the header and stats
- **What to capture**: Full page view of the dashboard in grid mode
- **Recommended size**: 1920x1080 or similar

### 2. `grid-view.png`
- **Description**: Grid view showing game cards with inline charts
- **What to capture**: Focus on the game cards section with 4-6 visible cards
- **Recommended size**: 1600x900 or similar

### 3. `table-view.png`
- **Description**: Table view showing 100 games with sparkline charts
- **What to capture**: The full table with multiple rows visible, showing sparkline charts
- **Recommended size**: 1920x1080 or similar

### 4. `game-detail.png`
- **Description**: Game detail page with blurred background
- **What to capture**: Full game detail page for a popular game (e.g., Counter-Strike 2)
- **Recommended size**: 1920x1080 or similar

## How to Take Screenshots

1. Run the application: `npm run dev`
2. Navigate to http://localhost:3000
3. Take screenshots using your OS screenshot tool:
   - **macOS**: Cmd + Shift + 4
   - **Windows**: Win + Shift + S
   - **Linux**: Use your screenshot tool

4. Save screenshots with the exact filenames listed above
5. Place them in this directory

## Tips for Great Screenshots

- Use a clean browser window (hide bookmarks bar, extensions)
- Ensure the application has data loaded
- Capture at a standard resolution (1920x1080 recommended)
- Make sure text is readable
- Show the most interesting/impressive features
- Consider using a tool like [Shottr](https://shottr.cc/) for better quality

## Alternative: Use Placeholder Images

If you want to publish to GitHub before taking screenshots, you can use placeholder images:

```bash
# Create placeholder images (requires ImageMagick)
convert -size 1920x1080 xc:gray -pointsize 72 -fill white -gravity center \
  -annotate +0+0 "Dashboard Screenshot\nComing Soon" dashboard.png

convert -size 1600x900 xc:gray -pointsize 72 -fill white -gravity center \
  -annotate +0+0 "Grid View Screenshot\nComing Soon" grid-view.png

convert -size 1920x1080 xc:gray -pointsize 72 -fill white -gravity center \
  -annotate +0+0 "Table View Screenshot\nComing Soon" table-view.png

convert -size 1920x1080 xc:gray -pointsize 72 -fill white -gravity center \
  -annotate +0+0 "Game Detail Screenshot\nComing Soon" game-detail.png
```
