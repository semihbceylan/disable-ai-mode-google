document.addEventListener('DOMContentLoaded', () => {
	const modeRadios = document.getElementsByName('ai-mode');
	const toggles = {
		aiOverviewDisabled: document.getElementById('ai-overview-toggle'),
		aiButtonsHidden: document.getElementById('ai-buttons-toggle'),
		peopleAlsoAskHidden: document.getElementById('paa-toggle')
	};

	chrome.storage.sync.get({
		aiOverviewDisabled: true,
		mode: 'hide',
		aiButtonsHidden: true,
		peopleAlsoAskHidden: false
	}, (items) => {
		for (const [key, toggle] of Object.entries(toggles)) {
			toggle.checked = items[key];
		}
		const selectedRadio = Array.from(modeRadios).find(r => r.value === items.mode);
		if (selectedRadio) selectedRadio.checked = true;
	});

	for (const [key, toggle] of Object.entries(toggles)) {
		toggle.addEventListener('change', () => {
			chrome.storage.sync.set({ [key]: toggle.checked });
		});
	}

	modeRadios.forEach(radio => {
		radio.addEventListener('change', (e) => {
			chrome.storage.sync.set({
				mode: e.target.value
			});
		});
	});

	const menuButton = document.getElementById('menu-button');
	const dropdownMenu = document.getElementById('dropdown-menu');

	function setMenuOpen(open) {
		dropdownMenu.classList.toggle('show', open);
		menuButton.setAttribute('aria-expanded', String(open));
	}

	menuButton.addEventListener('click', (e) => {
		e.stopPropagation();
		setMenuOpen(!dropdownMenu.classList.contains('show'));
	});

	document.addEventListener('click', () => setMenuOpen(false));

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') setMenuOpen(false);
	});
});
