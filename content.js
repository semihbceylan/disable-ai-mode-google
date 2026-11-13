/**
 * Optimized removal or relocation of the "AI Mode" tab, AI Overview box and other AI buttons.
 * Running at document_start with storage-awareness and zero-flicker classes.
 */

(function () {
	const TARGET_TEXT = "AI Mode";
	const HIDE_OVERVIEW_CLASS = 'ext-hide-ai-overview';
	const HIDE_TAB_CLASS = 'ext-hide-ai-tab';
	const HIDE_BUTTONS_CLASS = 'ext-hide-ai-buttons';
	const HIDE_PAA_CLASS = 'ext-hide-paa';
	const AI_MODE_PAGE_CLASS = 'ext-ai-mode-page';

	const AI_OVERVIEW_SELECTORS = [
		'div[jsname="GZ6pId"]',
		'div[jsname="ZLxsqf"]',
		'div[data-query-type="SGE"]',
		'div[id^="arc-sge"]'
	].join(', ');

	const DEFAULT_SETTINGS = {
		aiOverviewDisabled: true,
		mode: 'hide',
		aiButtonsHidden: true,
		peopleAlsoAskHidden: false
	};

	let settings = { ...DEFAULT_SETTINGS };
	let tabPositionMarker = null;
	let scheduled = false;

	// The AI Mode page itself (udm=50) is left alone so it keeps working if the user opens it
	function isAiModePage() {
		return new URLSearchParams(location.search).get('udm') === '50';
	}

	// Rapid class application to documentElement (available at document_start)
	function applyClasses() {
		const html = document.documentElement;
		html.classList.toggle(HIDE_OVERVIEW_CLASS, settings.aiOverviewDisabled);
		html.classList.toggle(HIDE_TAB_CLASS, settings.mode === 'hide');
		html.classList.toggle(HIDE_BUTTONS_CLASS, settings.aiButtonsHidden);
		html.classList.toggle(HIDE_PAA_CLASS, settings.peopleAlsoAskHidden);
		html.classList.toggle(AI_MODE_PAGE_CLASS, isAiModePage());
	}

	function refreshSettings(callback) {
		chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
			settings = items;
			applyClasses();
			if (callback) callback();
		});
	}

	// Coalesce bursts of DOM mutations into a single pass per frame
	function scheduleProcess() {
		if (scheduled) return;
		scheduled = true;
		requestAnimationFrame(() => {
			scheduled = false;
			processGooglePage();
		});
	}

	// Google sets its own inline display on some wrappers (e.g. display:contents on the
	// results grid wrapper), so remember it and put it back instead of just removing ours
	const savedDisplay = new WeakMap();

	// Never hide anything that holds the actual search results
	function containsResults(el) {
		return !!el.querySelector('#search, #rso, #botstuff');
	}

	function hideElement(el, key) {
		if (containsResults(el)) {
			restoreElement(el, key);
			return;
		}
		if (!el.dataset[key]) {
			savedDisplay.set(el, [el.style.getPropertyValue('display'), el.style.getPropertyPriority('display')]);
		}
		el.style.setProperty('display', 'none', 'important');
		el.dataset[key] = 'true';
	}

	function restoreElement(el, key) {
		if (el.dataset[key]) {
			const [value, priority] = savedDisplay.get(el) || ['', ''];
			if (value) {
				el.style.setProperty('display', value, priority);
			} else {
				el.style.removeProperty('display');
			}
			savedDisplay.delete(el);
			delete el.dataset[key];
		}
	}

	// Restore ONLY elements that were explicitly hidden by our script
	function restoreAll(key) {
		const attr = 'data-' + key.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
		document.querySelectorAll(`[${attr}="true"]`).forEach(el => restoreElement(el, key));
	}

	refreshSettings(scheduleProcess);

	chrome.storage.onChanged.addListener(() => {
		refreshSettings(scheduleProcess);
	});

	function findAiTab() {
		// The AI Mode tab links to udm=50, which works in every language
		const link = document.querySelector('[role="navigation"] a[href*="udm=50"], .hdtb-mitem a[href*="udm=50"]');
		if (link) {
			return link.closest('div[role="listitem"]') || link.closest('.hdtb-mitem') || link;
		}
		const items = document.querySelectorAll('[role="navigation"] div[role="listitem"], .hdtb-mitem');
		for (const item of items) {
			if (item.textContent.trim() === TARGET_TEXT) return item;
		}
		return null;
	}

	function processAiTab() {
		const aiTab = findAiTab();
		if (!aiTab) return;

		if (settings.mode === 'hide') {
			hideElement(aiTab, 'extHiddenTab');
		} else if (settings.mode === 'relocate') {
			restoreElement(aiTab, 'extHiddenTab');
			const parent = aiTab.parentNode;
			if (parent && parent.lastChild !== aiTab) {
				// Remember the original position so "Show Normally" can restore it
				if (!tabPositionMarker || !tabPositionMarker.isConnected) {
					tabPositionMarker = document.createComment('ext-ai-tab-position');
					parent.insertBefore(tabPositionMarker, aiTab);
				}
				parent.appendChild(aiTab);
			}
		} else {
			restoreElement(aiTab, 'extHiddenTab');
			if (tabPositionMarker && tabPositionMarker.isConnected) {
				tabPositionMarker.parentNode.insertBefore(aiTab, tabPositionMarker);
				tabPositionMarker.remove();
				tabPositionMarker = null;
			}
		}
	}

	function processAiOverview() {
		if (!settings.aiOverviewDisabled || isAiModePage()) {
			restoreAll('extHidden');
			return;
		}

		document.querySelectorAll(AI_OVERVIEW_SELECTORS).forEach(el => {
			// .MjjYud is usually a safe result block container.
			const parent = el.closest('.MjjYud');
			if (parent && !containsResults(parent)) {
				hideElement(parent, 'extHidden');
			} else {
				hideElement(el, 'extHidden');
			}
		});

		// Hide the AI Overview's wrapper so no gap is left behind, but keep the
		// "Showing results for" spelling suggestion visible when it shares the wrapper
		const firstDiv = document.querySelector('#rcnt > div');
		if (firstDiv && firstDiv.querySelector(AI_OVERVIEW_SELECTORS) && !firstDiv.querySelector('#search')) {
			if (!firstDiv.querySelector('#fprs')) {
				hideElement(firstDiv, 'extHidden');
			} else {
				restoreElement(firstDiv, 'extHidden');
				for (const child of firstDiv.children) {
					if (child.matches('div') && child.querySelector(AI_OVERVIEW_SELECTORS) &&
						!child.querySelector('#search, #fprs')) {
						hideElement(child, 'extHidden');
					}
				}
			}
		} else if (firstDiv && firstDiv.querySelector('#search')) {
			// Google streams the AI Overview before the results: if an earlier pass hid
			// the wrapper before #search arrived, show it again now that the results are in
			restoreElement(firstDiv, 'extHidden');
		}
	}

	function processAiButtons() {
		if (!settings.aiButtonsHidden || isAiModePage()) {
			restoreAll('extHiddenButton');
			return;
		}

		// "Ask Gemini" tab ("Gemini" is not translated, so this works in every language)
		document.querySelectorAll('[role="navigation"] div[role="listitem"]').forEach(item => {
			const text = item.textContent.trim();
			if (text.length < 40 && /\bGemini\b/.test(text)) {
				hideElement(item, 'extHiddenButton');
			}
		});

		// Fallback for the search bar's AI Mode button if its markup changes
		document.querySelectorAll('form[role="search"] button, form[role="search"] [role="button"]').forEach(btn => {
			if (btn.textContent.trim() === TARGET_TEXT) {
				hideElement(btn, 'extHiddenButton');
			}
		});
	}

	function processGooglePage() {
		document.documentElement.classList.toggle(AI_MODE_PAGE_CLASS, isAiModePage());
		processAiTab();
		processAiOverview();
		processAiButtons();
	}

	const observer = new MutationObserver(scheduleProcess);

	observer.observe(document.documentElement, {
		childList: true,
		subtree: true
	});

	document.addEventListener('DOMContentLoaded', scheduleProcess);
	window.addEventListener('load', scheduleProcess);
})();
