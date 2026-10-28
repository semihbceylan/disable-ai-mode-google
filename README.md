# Disable AI Mode & AI Overview
![Extension Logo](icons/icon128.png)


This repository contains a simple Chrome extension that removes or relocates the "AI Mode" tab,
hides generative AI Overview boxes and removes other AI buttons from Google Search. It aims to
improve the search experience by removing disruptive AI features from the search UI.

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue?logo=google-chrome&style=for-the-badge)](https://chromewebstore.google.com/detail/disable-ai-mode-ai-overvi/ebefbfhaicjahbdopihcjonaokjjmchp)

> Click the badge above to open the extension page on the Chrome Web Store.


The extension is built using plain JavaScript and CSS; it runs at `document_start` and uses
`MutationObserver` hooks to cope with dynamic content.

---

## Features

- **Hide or relocate the AI Mode tab** – choose whether the "AI Mode" navigation item is removed
  completely or moved to the end of the navigation bar.
- **Disable AI Overview cards** – generative AI answer summaries and their "Ask anything" follow-up
  box are hidden without leaving a gap.
- **Hide AI buttons** – removes the "AI Mode" button in the search bar, the AI shortcuts on the
  Google homepage ("Create images", "Ask about files", ...) and the "Ask Gemini" tab.
- **Hide "People also ask"** – optional, off by default.
- **Works on every Google Search domain** and in every language.
- **No network requests** – everything runs locally; the extension loads nothing from the internet.
- **Persistent settings** – preferences are stored with `chrome.storage.sync` and sync across
  your devices.
- **Zero-flicker bootstrapping** – CSS classes are applied early to prevent UI flashes.
- **Robust selectors** – the script matches language-independent attributes (such as the AI Mode
  link) with text fallbacks to withstand UI changes.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/semihbceylan/disable-ai-mode-google.git
   cd disable-ai-mode-google
   ```

2. Load the extension into Chrome/Edge/Opera/Brave:
   - Open `chrome://extensions` (or `edge://extensions`, `opera://extensions`).
   - Enable *Developer mode*.
   - Click **Load unpacked** and select this project folder.

3. The extension runs automatically on all Google Search domains (`google.com`, `google.de`,
   `google.co.jp`, ...).

---

## Usage

After installation, click the extension icon in the toolbar to open the settings popup.
You can change the following options:

- **AI Mode Tab**
  - *Hide Completely*: removes the AI Mode tab.
  - *Move to End*: moves the tab to the end of the navigation list.
  - *Show Normally*: leaves the tab alone (useful for temporarily disabling the extension).

- **Disable AI Overview**
  - When checked, blocks generative AI answer boxes from appearing in search results.

- **Hide AI Buttons** (on by default)
  - Hides the "AI Mode" button in the search bar, the AI shortcuts on the homepage and the
    "Ask Gemini" tab.

- **Hide "People also ask"** (off by default)
  - Hides the "People also ask" question box in search results.

Changes apply instantly to open Google tabs. If you open AI Mode yourself, it keeps working.

---

## FAQ

**How do I use it?**
Install it and search on Google – AI Mode and AI Overview are hidden automatically. Click the
extension icon in the toolbar (pin it from the puzzle-piece menu) to change what is hidden.

**I use Opera / Opera GX and nothing happens.**
Opera blocks extensions on search result pages by default. Open `opera://extensions`, find this
extension and enable **Allow access to search page results**.

**Can it remove AI features from Chrome itself?**
No. Extensions can only change web pages, not the browser's own interface. AI prompts in Chrome's
address bar, new tab page or side panel come from Chrome. You can turn many of them off in
Chrome's settings (`chrome://settings/ai`).

**Something is still visible or a non-AI section disappeared.**
Google changes its page markup often. Please [open an issue](https://github.com/semihbceylan/disable-ai-mode-google/issues)
with your Google domain, language and a screenshot.

---

## Development

- `content.js` contains the core logic and runs on supported Google pages.
- `popup.html`, `popup.js`, and `popup.css` implement the options UI.
- The manifest declares the `storage` permission and matches all Google Search domains
  (from Google's [supported domains](https://www.google.com/supported_domains) list).

To test changes, reload the extension via the Extensions page and refresh any open Google tabs.

### Structure

```
content.js        # main content script
content.css       # early CSS hiding rules
popup.html/js/css # options UI
manifest.json     # extension manifest
icons/            # extension icons
images/           # popup images
```

Feel free to modify selectors or add additional hiding rules as Google updates their markup.

---

## Contributing

Contributions are welcome! Please open an issue or pull request with improvements, bug fixes,
or to update selectors when Google changes their UI.

---

## License

This project is released under the [MIT License](LICENSE.md).

Popup icons are from Google's [Material Icons](https://github.com/google/material-design-icons),
licensed under the Apache License 2.0.

---

