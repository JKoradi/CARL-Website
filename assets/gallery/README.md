# CARL photo gallery

Upload your project photographs into this folder (`assets/gallery/`).

For each photo, add an entry to the `photos` array near the bottom of [`js/main.js`](../../js/main.js), for example:

```js
{ src: "assets/gallery/capstan-drive.jpg", caption: "Capstan drive", alt: "Close-up of CARL's capstan drive" },
```

Use web-friendly JPEG or WebP images with simple lowercase filenames (for example, `robot-assembly.jpg`). The paths and filename capitalization must match exactly. GitHub's browser upload limit is 25 MB per file, but smaller compressed photos will load faster.

The slideshow will display photos in the order they appear in the array. The README file is not itself displayed as a photo.
