# Photo Palettes — Sunset

A single static landing page for the sunset Photo Palettes project. Plain
HTML/CSS, no build step, no JavaScript framework. Styled to match Photo Palettes
(Satoshi typeface, grayscale UI, sharp corners) with light/dark support via
`prefers-color-scheme`.

## Files

- `index.html` — the page (styles are inlined)
- `favicon.png` — app icon
- `fonts/` — Satoshi variable font (woff2 / woff / ttf)

All asset paths are relative, so you can preview by opening `index.html`
directly in a browser — no server needed.

## Deploy (NearlyFreeSpeech)

There is no build — the files are uploaded as-is.

The `nfs_photo-palettes` SSH host is configured in `~/.ssh/config` and referenced
by `REMOTE_HOST` in `deploy.sh`. To publish:

```bash
./deploy.sh     # rsyncs the page + assets to the remote /home/public
```
