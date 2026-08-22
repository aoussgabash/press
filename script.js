const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navlinks');
const yearElement = document.querySelector('#year');

if (yearElement) yearElement.textContent = String(new Date().getFullYear());

if (menuButton && navigation) {
  menuButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    });
  });

  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
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
