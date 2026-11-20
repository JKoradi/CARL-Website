# CARL — Project Website

A dark technical portfolio for **CARL (Capstan Actuated Robot Locomotion)**, a custom 12-DoF quadruped robotics project.

## Live website

After enabling GitHub Pages: https://jkoradi.github.io/CARL-Website/

## Publish on GitHub Pages

1. Add these files to the root of the `JKoradi/CARL-Website` repository on the `main` branch.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**, then **main** and **/(root)**.
4. Save. The first deployment may take a few minutes.

## Add your own media

- Put a robot photograph at `assets/photos/carl-hero.jpg`.
- Put a CAD/mechanism render at `assets/renders/mechanism.jpg`.
- In `css/style.css`, the image paths are already configured. **Important:** The current placeholder text overlays remain visible until you remove the `.visual-center` content in `index.html` and the label text inside `.feature-art`.
- Add videos to `assets/videos/` or embed hosted videos; large videos are usually better hosted externally.

## Customize before sharing applications

- Verify technical claims and current development status.
- Add actual robot photos, CAD renders and demo videos.
- Add contact/LinkedIn details and a short project timeline.
- Link to a public software repository only if you intend to publish it.

## Technology

Static HTML, CSS and vanilla JavaScript. No build step, dependencies or tracking.
