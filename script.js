const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navlinks');
const headerNav = document.querySelector('header nav');
const brand = headerNav?.querySelector('.brand');

const homeLink = navigation?.querySelector('a[href="https://aoussgabash.com"], a[href="https://aoussgabash.com/"]');
if (homeLink && headerNav && brand) {
  homeLink.className = 'ag-home-button ag-shared-home-link';
  homeLink.setAttribute('aria-label', 'AG Home | الموقع الأم');
  homeLink.title = 'AG Home | الموقع الأم';
  homeLink.innerHTML = '<span aria-hidden="true">⌂</span>';
  headerNav.insertBefore(homeLink, brand);
}

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

if (!document.querySelector('script[data-ag-loader]')) {
  const loader = document.createElement('script');
  loader.src = 'https://aoussgabash.com/assets/shared/ag-loader.js?v=20260824-3';
  loader.defer = true;
  loader.dataset.agLoader = 'true';
  document.body.appendChild(loader);
}
