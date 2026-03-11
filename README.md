# Disable AI Mode & AI Overview
![Extension Logo](icons/icon128.png)


This repository contains a simple Chrome extension that removes or relocates the "AI Mode" tab
and hides generative AI Overview boxes on Google Search results. It aims to improve the search
experience by removing disruptive AI features from the search UI.

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue?logo=google-chrome&style=for-the-badge)](https://chromewebstore.google.com/detail/disable-ai-mode-ai-overvi/ebefbfhaicjahbdopihcjonaokjjmchp)

> Click the badge above to open the extension page on the Chrome Web Store.


The extension is built using plain JavaScript and CSS; it runs at `document_start` and uses
`MutationObserver` hooks to cope with dynamic content.

---

## Features

- **Hide or relocate the AI Mode tab** – choose whether the "AI Mode" navigation item is removed
  completely or moved to the end of the navigation bar.
- **Disable AI Overview cards** – generative AI answer summaries are hidden when enabled.
- **Persistent settings** – preferences are stored with `chrome.storage.sync` and sync across
  your devices.
- **Zero-flicker bootstrapping** – CSS classes are applied early to prevent UI flashes.
- **Robust selectors** – the script searches by text and multiple attributes to withstand UI changes.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/semihbceylan/disable-ai-mode-google.git
   cd disable-ai-mode-google
   ```

2. Load the extension into Chrome/Edge:
   - Open `chrome://extensions` (or `edge://extensions`).
   - Enable *Developer mode*.
   - Click **Load unpacked** and select this project folder.

3. The extension runs automatically on supported Google Search domains (`google.com`,
   `google.co.uk`, `google.de`, `google.fr`, `google.com.tr`).

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

Changes take effect immediately; you may need to reload any open Google tabs.

---

## Development

- `content.js` contains the core logic and runs on supported Google pages.
- `popup.html`, `popup.js`, and `popup.css` implement the options UI.
- The manifest declares the `storage` permission and matches the supported Google domains.

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

---

