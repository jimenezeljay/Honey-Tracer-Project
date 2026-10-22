// Reusable UI pieces, written once and used on any page.
// Load this before a page's own script:
//   <script src="js/components.js"></script>
//   <script src="js/marketplace.js"></script>
// See components.html for every component and how to use it.

// Escape text before putting it into HTML, so data from the backend
// (farm names, bios) can't inject tags into the page.
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const BADGES = {
  'certified':          { label: 'Certified',          icon: 'bi-patch-check-fill' },
  'raw':                { label: 'Raw',                icon: '' },
  'pure':               { label: 'Pure',               icon: '' },
  'creamed':            { label: 'Creamed',            icon: '' },
  'single-hive':        { label: 'Single-hive',        icon: 'bi-hexagon' },
  'volunteer-verified': { label: 'Volunteer-Verified', icon: 'bi-person-check-fill' }
};

// badge('certified') -> <span class="badge badge-certified">...</span>
function badge(key) {
  const b = BADGES[key];
  if (!b) return '';
  const icon = b.icon ? `<i class="bi ${b.icon}" aria-hidden="true"></i> ` : '';
  return `<span class="badge badge-${key}">${icon}${b.label}</span>`;
}

// productCard({ id, title, farmName, price, photo, badges: ['certified', 'raw'] })
function productCard(listing) {
  const photo = listing.photo
    ? `<img class="product-card__img" src="${escapeHtml(listing.photo)}" alt="">`
    : `<div class="product-card__img" aria-hidden="true"><i class="bi bi-image"></i></div>`;
  const price = Number(listing.price).toFixed(2);

  return `
    <article class="product-card">
      ${photo}
      <div class="product-card__body">
        <h3 class="product-card__title">
          <a class="stretched-link" href="product.html?id=${encodeURIComponent(listing.id)}">${escapeHtml(listing.title)}</a>
        </h3>
        <p class="product-card__meta">${escapeHtml(listing.farmName)} &middot; $${price}</p>
        <div class="product-card__badges">${(listing.badges || []).map(badge).join('')}</div>
        <a class="product-card__map" href="map.html?farm=${encodeURIComponent(listing.farmId ?? '')}">View on map</a>
      </div>
    </article>`;
}

// siteNav('map') -> the top bar, with "Map" marked as the current page
function siteNav(active) {
  const link = (page, label) =>
    `<li class="nav-item"><a class="nav-link${active === page ? ' active' : ''}" href="${page}.html"${active === page ? ' aria-current="page"' : ''}>${label}</a></li>`;

  return `
    <nav class="navbar navbar-expand-lg site-nav">
      <div class="container">
        <a class="navbar-brand" href="index.html"><span class="brand-mark"><img src="images/honey-tracker-logo.png" alt="" class="brand-logo"></span> Honey Tracker</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Open menu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto">
            ${link('map', 'Map')}
            ${link('marketplace', 'Marketplace')}
            ${link('learn', 'Learn')}
          </ul>
          <div class="d-flex gap-2">
            <a class="btn btn-outline-secondary" href="signin.html">Sign in</a>
            <a class="btn btn-primary" href="get-started.html">Get started</a>
          </div>
        </div>
      </div>
    </nav>`;
}

function siteFooter() {
  return `
    <footer class="site-footer mt-5">
      <div class="container py-4 d-flex flex-wrap gap-3 justify-content-between">
        <span>&copy; ${new Date().getFullYear()} Honey Tracker</span>
        <nav class="d-flex flex-wrap gap-3" aria-label="Footer">
          <a href="#">About</a>
          <a href="learn.html">Learn</a>
          <a href="get-started.html">Become a keeper</a>
          <a href="volunteer.html">Volunteer</a>
          <a href="#">Contact</a>
        </nav>
      </div>
    </footer>`;
}

// Quantity selector: makes the − / + buttons inside any .qty-stepper work.
// Listens on the whole document, so it also works for cart lines added later by JS.
// Respects the input's min / max, and fires "change" so cart.js can react:
//   input.addEventListener('change', () => updateCart(...))
document.addEventListener('click', event => {
  const button = event.target.closest('.qty-stepper [data-qty]');
  if (!button) return;

  const input = button.closest('.qty-stepper').querySelector('input');
  const before = input.value;
  button.dataset.qty === 'up' ? input.stepUp() : input.stepDown();
  if (input.value !== before) {
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
});

// Fill placeholders on the page:
//   <div data-component="site-nav" data-active="map"></div>
//   <div data-component="site-footer"></div>
document.querySelectorAll('[data-component="site-nav"]').forEach(el => {
  el.outerHTML = siteNav(el.dataset.active);
});
document.querySelectorAll('[data-component="site-footer"]').forEach(el => {
  el.outerHTML = siteFooter();
});
