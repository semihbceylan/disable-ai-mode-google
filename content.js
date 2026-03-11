/**
 * Optimized removal or relocation of the "AI Mode" tab and AI Overview box.
 * Running at document_start with storage-awareness and zero-flicker classes.
 */

(function () {
	const TARGET_TEXT = "AI Mode";
	const HIDE_OVERVIEW_CLASS = 'ext-hide-ai-overview';
	const HIDE_TAB_CLASS = 'ext-hide-ai-tab';

	let aiOverviewDisabled = true;
	let currentMode = 'hide';

	// Rapid class application to documentElement (available at document_start)
	function applyClasses() {
		const html = document.documentElement;
		if (aiOverviewDisabled) {
			html.classList.add(HIDE_OVERVIEW_CLASS);
		} else {
			html.classList.remove(HIDE_OVERVIEW_CLASS);
		}

		if (currentMode === 'hide') {
			html.classList.add(HIDE_TAB_CLASS);
		} else {
			html.classList.remove(HIDE_TAB_CLASS);
		}
	}

	function refreshSettings(callback) {
		chrome.storage.sync.get({
			aiOverviewDisabled: true,
			mode: 'hide'
		}, (items) => {
			aiOverviewDisabled = items.aiOverviewDisabled;
			currentMode = items.mode;
			applyClasses();
			if (callback) callback();
		});
	}

	refreshSettings(() => {
		processGooglePage();
	});

	chrome.storage.onChanged.addListener((changes) => {
		refreshSettings(() => {
			processGooglePage();
		});
	});

	function processGooglePage() {
		// 1. Target AI Mode
		const navItems = document.querySelectorAll('div[role="listitem"], .hdtb-mitem, .XVMlrc, a.C6AK7c, a.XVMlrc');

		let aiTab = null;
		navItems.forEach(el => {
			if (el.textContent.includes(TARGET_TEXT) || (el.href && el.href.includes('udm=50'))) {
				aiTab = el.closest('div[role="listitem"]') ||
					el.closest('div[jsname]') ||
					el.closest('a') ||
					el;
			}
		});

		if (aiTab) {
			if (currentMode === 'hide') {
				aiTab.style.setProperty('display', 'none', 'important');
				aiTab.dataset.extHiddenTab = 'true';
			} else if (currentMode === 'relocate') {
				const parent = aiTab.parentNode;
				if (parent && parent.lastChild !== aiTab) {
					if (aiTab.dataset.extHiddenTab) {
						aiTab.style.removeProperty('display');
						delete aiTab.dataset.extHiddenTab;
					}
					parent.appendChild(aiTab);
				}
			} else {
				if (aiTab.dataset.extHiddenTab) {
					aiTab.style.removeProperty('display');
					delete aiTab.dataset.extHiddenTab;
				}
			}
		}

		// 2. Hide or Show Generative AI Overview box
		if (aiOverviewDisabled) {
			const aiSelectors = [
				'div[jsname="GZ6pId"]',
				'div[jsname="ZLxsqf"]',
				'.V35p5c',
				'div[data-query-type="SGE"]',
				'div[id^="arc-sge"]'
			];

			aiSelectors.forEach(sel => {
				const els = document.querySelectorAll(sel);
				els.forEach(el => {
					// .MjjYud is usually a safe result block container.
					const parent = el.closest('.MjjYud');
					if (parent && !parent.textContent.includes("Search Results")) {
						parent.style.setProperty('display', 'none', 'important');
						parent.dataset.extHidden = 'true';
					} else {
						el.style.setProperty('display', 'none', 'important');
						el.dataset.extHidden = 'true';
					}
				});
			});

			const rcnt = document.getElementById('rcnt');
			if (rcnt) {
				const firstDiv = rcnt.querySelector(':scope > div');
				if (firstDiv && (firstDiv.querySelector('[jsname="GZ6pId"]') || firstDiv.querySelector('[jsname="ZLxsqf"]'))) {
					// ONLY hide if it doesn't contain the main results list
					if (!firstDiv.querySelector('#search')) {
						firstDiv.style.setProperty('display', 'none', 'important');
						firstDiv.dataset.extHidden = 'true';
					}
				}
			}
		} else {
			// Restore ONLY elements that were explicitly hidden by our script
			const hiddenEls = document.querySelectorAll('[data-ext-hidden="true"]');
			hiddenEls.forEach(el => {
				el.style.removeProperty('display');
				delete el.dataset.extHidden;
			});
		}
	}

	const observer = new MutationObserver((mutations) => {
		processGooglePage();
	});

	observer.observe(document.documentElement, {
		childList: true,
		subtree: true
	});

	document.addEventListener('DOMContentLoaded', processGooglePage);
	window.addEventListener('load', processGooglePage);
})();
