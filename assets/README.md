# Assets Folder

This folder contains the app's visual assets.

## Required Images

You'll need to add these images before building the app:

### App Icons
- **icon.png** - App icon (1024x1024px)
- **adaptive-icon.png** - Android adaptive icon foreground (1024x1024px)
- **favicon.png** - Web favicon (48x48px or larger)

### Splash Screen
- **splash.png** - App splash screen (1284x2778px for iOS)

### Notifications
- **notification-icon.png** - Notification icon (96x96px for Android)

## Temporary Placeholders

For now, you can use simple colored squares as placeholders:
- Create a 1024x1024px image with a solid color for icon.png and adaptive-icon.png
- Create a 1284x2778px image for splash.png
- Create a 96x96px image for notification-icon.png
- Create a 48x48px image for favicon.png

You can use any image editing tool or online services like:
- https://www.canva.com/
- https://www.figma.com/
- https://placeholder.com/

Or generate simple placeholders with ImageMagick:
```bash
# Install ImageMagick first: brew install imagemagick
convert -size 1024x1024 xc:#6366f1 icon.png
convert -size 1024x1024 xc:#6366f1 adaptive-icon.png
convert -size 1284x2778 xc:#6366f1 splash.png
convert -size 96x96 xc:#6366f1 notification-icon.png
convert -size 48x48 xc:#6366f1 favicon.png
```
