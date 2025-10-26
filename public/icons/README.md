# Icons Directory

This directory should contain the Progressive Web App (PWA) icons in various sizes.

## Required Icon Sizes:

- icon-72x72.png
- icon-96x96.png  
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Icon Generation:

You can generate these icons from a single high-resolution image (1024x1024 or larger) using:

1. **Online Tools:**
   - https://favicon.io/favicon-generator/
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/imageGenerator

2. **Command Line Tools:**
   - ImageMagick: `convert icon.png -resize 192x192 icon-192x192.png`
   - Sharp (Node.js): `sharp('icon.png').resize(192, 192).png().toFile('icon-192x192.png')`

## Design Guidelines:

- Use a simple, recognizable design
- Ensure good contrast and readability at small sizes
- Consider using your app's logo or a graduation cap/education symbol
- Use your brand colors (primary: #667eea, secondary: #764ba2)
- Make icons "maskable" by keeping important content in the safe zone
