const burgerBtn = document.querySelector('.navigation__burger-btn');
const primaryNav = document.querySelector('#primary-nav');

const handleBurgerBtn = () => {
	burgerBtn.setAttribute('aria-expanded', String(!primaryNav.classList.contains('visible')));

	primaryNav.classList.toggle('visible');
};

// event handlers
burgerBtn.addEventListener('click', handleBurgerBtn);
