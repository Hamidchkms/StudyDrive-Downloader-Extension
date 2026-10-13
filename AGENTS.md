# Repository overview
Unpacked Manifest V3 browser extension. No dependencies or build step.

# Important files and behavior
- `background.js` registers the document context menu and handles toolbar clicks.
- `content.js` runs on demand via `scripting.executeScript`; it adds no page button and never polls.
- Downloads use `file_preview` and `filename` from the document HTML. A missing preview link is an error; a missing filename defaults to `preview.pdf`.
- The toolbar action runs the same downloader. Legacy popup files are unused.
- Permissions are `activeTab`, `contextMenus`, and `scripting`; no persistent host access.

# Verification
Run `node --check background.js` and `node --check content.js`, and parse manifest JSON. Reload the unpacked extension and open a fresh document tab for manual verification. Verify context-menu/toolbar triggering and missing-link errors. Network download success requires a live accessible preview.
