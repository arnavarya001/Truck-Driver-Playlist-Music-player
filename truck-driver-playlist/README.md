# Truck Driver Playlist — Horn OK Please Radio

A truck-themed music player UI ("ट्रक वाला — Horn OK Please Radio") with a YouTube-playlist-backed
player bar, rotating truck-photo background, and a horn button.

## Structure

```
truck-driver-playlist/
├── client/                  # Front end (static site)
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── assets/
│       └── images/
│           ├── truck1.jpg   # background image 1 (add this file — see note below)
│           └── truck2.jpg   # background image 2 (add this file — see note below)
├── server/                  # Optional Node/Express audio-proxy backend
│   ├── server.js
│   └── package.json
└── README.md
```

## Client

Static HTML/CSS/JS — no build step. Serve `client/` with any static file server
(e.g. `npx serve client`) and open it in a browser.

The YouTube IFrame API drives the playlist (`player.js`'s `list` ID in `app.js`); it needs
internet access and is subject to YouTube's own playback restrictions/ads.

## Server

`server/server.js` is a small Express proxy that pipes YouTube audio through `/api/stream?id=<videoId>`
using `@distube/ytdl-core`.

```bash
cd server
npm install
npm start
```

**Note:** extracting/streaming audio this way sits outside YouTube's Terms of Service and can break
whenever YouTube changes its player internals — treat it as a fragile, unofficial integration rather
than a production dependency.

## Adding the truck background images

I wasn't able to pull the raw bytes of `truck1.jpg` / `truck2.jpg` from this session (only image
previews came through, not the files themselves), so `client/assets/images/` is currently empty.
Drop your two truck photos in there with those exact filenames and the background rotation in
`app.js` will pick them up automatically.
