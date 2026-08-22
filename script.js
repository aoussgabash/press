const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navlinks');
const yearElement = document.querySelector('#year');

if (yearElement) yearElement.textContent = String(new Date().getFullYear());

const pressNav = document.querySelector('header nav');
const pressBrand = pressNav?.querySelector('.brand');
if (pressNav && pressBrand && !pressNav.querySelector('.ag-home-button')) {
  const headerLeft = document.createElement('div');
  headerLeft.className = 'ag-header-left';

  const homeButton = document.createElement('a');
  homeButton.className = 'ag-home-button';
  homeButton.href = 'https://aoussgabash.com';
  homeButton.setAttribute('aria-label', 'AG Home | الموقع الأم');
  homeButton.title = 'AG Home | الموقع الأم';
  homeButton.innerHTML = '<span aria-hidden="true">⌂</span>';

  pressBrand.before(headerLeft);
  headerLeft.append(homeButton, pressBrand);
}

const homeMenuLink = navigation?.querySelector('a[href="https://aoussgabash.com"]');
if (homeMenuLink) {
  homeMenuLink.classList.add('ag-home-menu-link');
  homeMenuLink.innerHTML = '⌂ AG Home | الموقع الأم';
}

const pressInquiryHref = 'mailto:aoussgabash@ieee.org?subject=Gabash%20Academic%20Press%20Inquiry';
const pressContactMenuLink = navigation?.querySelector('a[href="#contact"]');
if (pressContactMenuLink) {
  pressContactMenuLink.classList.add('ag-contact-menu-link');
  pressContactMenuLink.innerHTML = '✉ Contact | التواصل';
}

const pressContactButton = document.querySelector('#contact a[href^="mailto:"]');
if (pressContactButton) pressContactButton.href = pressInquiryHref;

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  menuButton.textContent = '☰';
};

if (menuButton && navigation) {
  menuButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menuButton.textContent = isOpen ? '×' : '☰';
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus();
    }
  });
}

async function loadPublications() {
  const grid = document.querySelector('#bookGrid');
  const error = document.querySelector('#bookError');
  if (!grid) return;

  try {
    const response = await fetch('data/books.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const books = await response.json();

    grid.innerHTML = books.map((book) => `
      <article class="course-card">
        <div class="code">${book.id}</div>
        <h3>${book.title}</h3>
        <div class="arabic" lang="ar" dir="rtl">${book.title_ar}</div>
        <p>${book.summary}</p>
        <p><strong>${book.status}</strong> | <span lang="ar" dir="rtl">${book.status_ar}</span></p>
        <span class="open">ISBN: ${book.isbn}</span>
      </article>
    `).join('');
  } catch (loadError) {
    console.error('Could not load publication registry:', loadError);
    if (error) error.style.display = 'block';
  }
}

loadPublications();
