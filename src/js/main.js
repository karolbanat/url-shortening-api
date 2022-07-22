let burgerBtn;
let primaryNav;

let shortenInput;
let shortenBtn;
let shortenError;

let shortenedList;
let copyButtons;

let shortenItemTemplate;

// variables
const API_URL_BASE = 'https://api.shrtco.de/v2/';
let links = {};

// functions
const main = () => {
	prepareDOMElements();
	loadLinksFromLocalStorage();
	prepareCopyButtons(); // load copy buttons after links are added
	prepareDOMEvents();
};

const prepareDOMElements = () => {
	burgerBtn = document.querySelector('.navigation__burger-btn');
	primaryNav = document.querySelector('#primary-nav');

	shortenInput = document.querySelector('#shorten-url');
	shortenBtn = document.querySelector('#shorten-btn');
	shortenError = document.querySelector('#shorten-error');

	shortenedList = document.querySelector('#shortened-links-list');
	shortenItemTemplate = document.querySelector('#shortened-list-item-template');
};

const prepareDOMEvents = () => {
	burgerBtn.addEventListener('click', handleBurgerBtn);

	shortenBtn.addEventListener('click', (e) => {
		e.preventDefault();
		shortenUrl();
	});

	copyButtons.forEach((btn) => btn.addEventListener('click', handleCopy));
};

const prepareCopyButtons = () => {
	copyButtons = shortenedList.querySelectorAll('[data-url-to-copy');
};

const handleBurgerBtn = () => {
	burgerBtn.setAttribute('aria-expanded', String(!primaryNav.classList.contains('visible')));
	primaryNav.classList.toggle('visible');
};

const shortenUrl = () => {
	if (shortenInput.value) {
		hideError();

		const url = shortenInput.value;

		fetch(`${API_URL_BASE}/shorten?url=${url}`)
			.then((res) => res.json())
			.then((res) => {
				if (!res.ok) throw new Error('');

				// get data from response
				const result = res.result;
				const shortLink = result.short_link;
				const originalLink = result.original_link;
				// and return it further
				return { originalLink, shortLink };
			})
			.then((data) => {
				// if link already shortened, throw error and do nothing
				if (data.originalLink in links) throw new Error('Link already shortened.');

				// else, save to object in this file
				links[data.originalLink] = data.shortLink;
				return data;
			})
			.then(({ originalLink, shortLink }) => {
				// append new item to the list
				appendListItem(originalLink, shortLink);
				toggleListVisibility();
			})
			.then(() => {
				// save to local storage
				localStorage.setItem('links', JSON.stringify(links));
			})
			.catch((err) => {
				showError(err.message);
			});
	} else {
		showError('Input field cannot be empty.');
	}
};

const loadLinksFromLocalStorage = () => {
	const storageLinks = JSON.parse(localStorage.getItem('links'));
	if (storageLinks) {
		links = storageLinks;
		for (const key in storageLinks) {
			if (Object.hasOwnProperty.call(storageLinks, key)) {
				const value = storageLinks[key];
				appendListItem(key, value);
			}
		}
	}
	toggleListVisibility();
};

const appendListItem = (original_url, result_url) => {
	const listItem = shortenItemTemplate.content.cloneNode(true);
	const originalUrlElement = listItem.querySelector('[data-original-url]');
	const resultUrlElement = listItem.querySelector('[data-result-url]');
	const copyBtn = listItem.querySelector('[data-url-to-copy]');

	originalUrlElement.setAttribute('data-original-url', original_url);
	originalUrlElement.innerText = original_url;

	resultUrlElement.setAttribute('data-result-url', result_url);
	resultUrlElement.innerText = result_url;

	copyBtn.setAttribute('data-url-to-copy', result_url);
	copyBtn.addEventListener('click', handleCopy);

	shortenedList.appendChild(listItem);
};

const handleCopy = (e) => {
	const urlToCopy = e.target.dataset.urlToCopy;
	navigator.clipboard.writeText(urlToCopy).then(() => {
		e.target.classList.add('copied');
		e.target.innerText = 'Copied!';

		setTimeout(() => {
			e.target.classList.remove('copied');
			e.target.innerText = 'Copy';
		}, 2000);
	});
};

const toggleListVisibility = () => {
	shortenedList.classList.toggle('hidden', !shortenedList.children.length);
};

const showError = (msg) => {
	shortenInput.classList.add('error');
	shortenError.innerText = `${msg}`;
};

const hideError = () => {
	shortenInput.classList.remove('error');
	shortenError.innerText = '';
};

document.addEventListener('DOMContentLoaded', main);
