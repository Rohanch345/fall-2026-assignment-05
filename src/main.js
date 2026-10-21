import products from './data/products.json';

const PRODUCTS_PER_PAGE = 5;

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// ---------- Shared: header nav + footer year (every page) ----------

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
  });
}

function initFooterYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

// ---------- Store page: product cards + client-side pagination ----------

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function createElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function createProductCard(product) {
  const card = createElement('li', 'product-card');

  const img = createElement('img', 'product-image');
  img.src = product.imageUrl;
  img.alt = product.name;
  img.width = 400;
  img.height = 400;
  img.loading = 'lazy';

  const body = createElement('div', 'product-body');
  const badge = createElement(
    'span',
    `badge badge-${slugify(product.category)}`,
    product.category
  );
  const title = createElement('h3', 'product-title', product.name);
  const description = createElement(
    'p',
    'product-description',
    product.description
  );
  const price = createElement(
    'p',
    'product-price',
    priceFormatter.format(product.price)
  );

  body.append(badge, title, description, price);
  card.append(img, body);
  return card;
}

function initStorePagination() {
  const grid = document.getElementById('product-grid');
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');
  const indicator = document.getElementById('page-indicator');
  if (!grid || !prevButton || !nextButton || !indicator) return;

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  let currentPage = 1;

  function renderPage() {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const pageItems = products.slice(start, start + PRODUCTS_PER_PAGE);

    grid.replaceChildren(...pageItems.map(createProductCard));

    indicator.textContent = `Page ${currentPage} of ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  }

  function goToPage(page) {
    currentPage = Math.min(Math.max(page, 1), totalPages);
    renderPage();
    // Bring the top of the new page into view without reloading.
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  prevButton.addEventListener('click', () => goToPage(currentPage - 1));
  nextButton.addEventListener('click', () => goToPage(currentPage + 1));

  renderPage();
}

initNavToggle();
initFooterYear();
initStorePagination();
