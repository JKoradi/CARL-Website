# CARL — Project Website

Website for **CARL (Capstan Actuated Robot Locomotion)**, a custom-built 12-degree-of-freedom quadruped robot. The site documents the robot's mechanical design, electronics, software, control development, and physical testing.

**[Visit the live website](https://jkoradi.github.io/CARL-Website/)** · **[Open the full-screen leg simulator](https://jkoradi.github.io/CARL-Website/kinematics.html)** · **[Technical CARL repository](https://github.com/JKoradi/CARL)**

## Website features

- **Project overview** — purpose and key characteristics of the CARL platform.
- **Engineering** — capstan transmissions, mechanical design, BLDC actuation, and embedded hardware.
- **Software & architecture** — control stack and Raspberry Pi / Pi3Hat / CAN-FD communication.
- **Interactive inverse-kinematics simulation** — adjustable five-bar linkage geometry, leg selection, workspace visualization, and forward/reverse gait animations. Available both on the homepage and in a [standalone full-screen view](https://jkoradi.github.io/CARL-Website/kinematics.html).
- **Development log** — completed milestones, ongoing work, and planned features.
- **CARL in Action** — videos of physical robot testing, including homing, body control, leg movement, and jump experiments.
- **Engineering skills** — project-based skills and links to the separate [CARL technical repository](https://github.com/JKoradi/CARL).

## Repository structure

```text
index.html                  Homepage
kinematics.html             Standalone interactive IK simulator
css/style.css               Website styling and responsive layouts
js/main.js                  Homepage interactions
js/kinematics-embed.js      Homepage-embedded IK simulation
assets/photos/              Robot photographs
assets/renders/             CAD and mechanism renders
assets/videos/              Robot motion MP4 videos
```

This is a static site built with HTML, CSS, and vanilla JavaScript. No package installation or build step is required.

## Updating images

- **Hero photograph:** replace `assets/photos/carl-hero.jpg`.
- **Mechanical render:** replace `assets/renders/mechanism.jpg`.

Keep the filenames and paths unchanged to update the images without editing HTML. The mechanism render is displayed directly in the Engineering section.

## Adding a new video

1. Export your footage as an **MP4 with H.264 video** for broad browser compatibility. For reliable GitHub browser uploads, keep each file under **25 MB**.
2. Upload it to `assets/videos/` in this repository. Use a descriptive lowercase filename with hyphens, such as `walking-test.mp4`.
3. Open `index.html` and locate `<div class="video-grid">` in the **CARL IN ACTION** section.
4. Copy an existing `<article class="video-card"> ... </article>` element and paste it inside that grid.
5. Update the video `src`, `aria-label`, category, heading, and description. Commit the changes.

Example card:

```html
<article class="video-card">
  <div class="video-frame">
    <video controls playsinline muted preload="metadata" aria-label="Walking test">
      <source src="assets/videos/walking-test.mp4" type="video/mp4">
      Your browser does not support HTML5 video.
    </video>
    <div class="video-unavailable" hidden>Video upload pending</div>
  </div>
  <div class="video-details">
    <span class="video-type">LOCOMOTION TEST</span>
    <h3>Walking Test</h3>
    <p>Testing coordinated leg movements on the physical robot.</p>
  </div>
</article>
```

The gallery layout adapts automatically to additional cards. Videos are muted by default, with native playback and volume controls. The page also attempts to show an early video frame as a preview; for consistent thumbnails across browsers, dedicated `poster` images can be added later.

**Important:** GitHub Pages serves the file at the exact path specified in `src`. Filenames are case-sensitive. Uploading a ZIP file instead of its extracted MP4 files will not work.

## Publishing

The website is published using **GitHub Pages** from this repository:

- Repository: [JKoradi/CARL-Website](https://github.com/JKoradi/CARL-Website)
- Live URL: https://jkoradi.github.io/CARL-Website/
- To check or change deployment settings: **Settings → Pages** in GitHub.

Changes committed to the publishing branch are reflected on the website after GitHub Pages finishes deploying. If a recent CSS or JavaScript change is not visible, refresh the browser and check asset caching.

## Related project

The separate **[JKoradi/CARL](https://github.com/JKoradi/CARL)** repository contains the technical project structure and documentation. This repository is dedicated to the public-facing website.

---

CARL is an ongoing independent robotics project. The website distinguishes implemented features from development plans.
