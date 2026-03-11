document.addEventListener('DOMContentLoaded', () => {
	const aiOverviewToggle = document.getElementById('ai-overview-toggle');
	const modeRadios = document.getElementsByName('ai-mode');

	chrome.storage.sync.get({
		aiOverviewDisabled: true,
		mode: 'hide'
	}, (items) => {
		aiOverviewToggle.checked = items.aiOverviewDisabled;
		const selectedRadio = Array.from(modeRadios).find(r => r.value === items.mode);
		if (selectedRadio) selectedRadio.checked = true;
	});

	aiOverviewToggle.addEventListener('change', () => {
		chrome.storage.sync.set({
			aiOverviewDisabled: aiOverviewToggle.checked
		});
	});

	modeRadios.forEach(radio => {
		radio.addEventListener('change', (e) => {
			chrome.storage.sync.set({
				mode: e.target.value
			});
		});
	});

	const menuButton = document.getElementById('menu-button');
	const dropdownMenu = document.getElementById('dropdown-menu');

	menuButton.addEventListener('click', (e) => {
		e.stopPropagation();
		dropdownMenu.classList.toggle('show');
	});

	document.addEventListener('click', () => {
		if (dropdownMenu.classList.contains('show')) {
			dropdownMenu.classList.remove('show');
		}
	});
});
