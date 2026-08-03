/* ══════════════════════════════════════════
   DOTT. Remo Accorona — script.js
   Nav scroll · Counter · Hamburger · Reveal
   Floating button · Active nav link
══════════════════════════════════════════ */

/* ── COOKIE ── */
function toggleCookiePanel() {
  document.getElementById('cookie-panel')?.classList.toggle('open');
}
function acceptCookies() {
  const panel = document.getElementById('cookie-panel');
  localStorage.setItem('cookie_consent', 'accepted');
  const msg = document.getElementById('cookie-ok-msg');
  if (msg) msg.style.display = 'block';
  setTimeout(() => {
    panel?.classList.remove('open');
    if (msg) msg.style.display = 'none';
  }, 1200);
}
function initCookieUI() {
  const panel = document.getElementById('cookie-panel');
  const tab   = document.getElementById('cookie-tab');
  tab?.addEventListener('click', toggleCookiePanel);
  document.querySelector('.btn-cookie-accept')?.addEventListener('click', acceptCookies);
  document.querySelector('.btn-cookie-close')?.addEventListener('click', toggleCookiePanel);
  document.querySelectorAll('#cookie-panel a').forEach(l => l.addEventListener('click', () => panel?.classList.remove('open')));
  if (localStorage.getItem('cookie_consent') === 'accepted') panel?.classList.remove('open');
}

/* ── NAV: COMPATTA ALLO SCROLL + ACTIVE LINK ── */
function initNav() {
  const nav      = document.querySelector('nav');
  const sections = document.querySelectorAll('section[id], div[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    // Compatta
    nav?.classList.toggle('scrolled', window.scrollY > 60);

    // Active link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      a.classList.toggle('nav-link-active', a.getAttribute('href') === '#' + current);
    });

    // Floating button
    const fp = document.getElementById('floating-prenota');
    if (fp) fp.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
  }, { passive: true });
}

/* ── HAMBURGER MOBILE ── */
function initHamburger() {
  const btn  = document.querySelector('.nav-hamburger');
  const nav  = document.querySelector('nav');
  const links = document.querySelector('.nav-links');
  if (!btn || !links || !nav) return;

  function openMenu() {
    links.classList.add('open');
    btn.classList.add('open');
    nav.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }
  function closeMenu() {
    links.classList.remove('open');
    btn.classList.remove('open');
    nav.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  btn.addEventListener('click', () => {
    links.classList.contains('open') ? closeMenu() : openMenu();
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/* ── COUNTER ANIMATO NELLE STATS ── */
function animateCounter(el, target, suffix, duration) {
  const isNum = /^\d/.test(target);
  if (!isNum) return; // es. "Niguarda"
  const end = parseInt(target.replace(/\D/g, ''), 10);
  if (isNaN(end)) return;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = Math.floor(ease * end);
    el.textContent = value.toLocaleString('it-IT') + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el   = entry.target;
      const raw  = el.textContent.trim();         // es. "20+" "8.000+" "3.500+"
      const suffix = raw.includes('+') ? '+' : '';
      animateCounter(el, raw, suffix, 1800);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
}

/* ── REVEAL CON STAGGER SU GRIGLIA ── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // Aggiunge classe reveal alle card singole nelle griglie
  const gridSelectors = [
    '.spec-card', '.pat-card', '.visita-card',
    '.intervento-card', '.curriculum-extra-card'
  ];
  gridSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      observer.observe(el);
    });
  });

  // Elementi già marcati reveal
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── SMOOTH SCROLL MIGLIORATO ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // altezza nav
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });
}

/* ── THEME TOGGLE ── */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  if (theme === 'high-contrast') {
    btn.innerHTML = '&#9680;';
    btn.setAttribute('aria-label', 'Disattiva alto contrasto');
    btn.setAttribute('title', 'Disattiva alto contrasto');
    btn.classList.add('active');
  } else {
    btn.innerHTML = '&#9680;';
    btn.setAttribute('aria-label', 'Attiva alto contrasto');
    btn.setAttribute('title', 'Attiva alto contrasto');
    btn.classList.remove('active');
  }
}

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const saved = localStorage.getItem('theme') || 'default';
  applyTheme(saved);
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'default';
    const next = current === 'high-contrast' ? 'default' : 'high-contrast';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

/* ── BACK TO TOP ── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── FORM RECENSIONE ── */
function initReviewForm() {
  const form    = document.getElementById('review-form');
  const success = document.getElementById('rev-success');
  const errBox  = document.getElementById('rev-error');
  const grid    = document.querySelector('.test-grid');
  if (!form) return;

  // ── Render una card recensione nel grid ──
  function renderCard(rev) {
    if (!grid) return;
    const starsHtml = '&#9733;'.repeat(rev.stars) + '<span style="opacity:.3">' + '&#9733;'.repeat(5 - rev.stars) + '</span>';
    const card = document.createElement('div');
    card.className = 'test-card test-card--user';
    card.innerHTML = `
      <div class="test-stars">${starsHtml}</div>
      <p class="test-quote">&#8220;${rev.text}&#8221;</p>
      <div class="test-author">
        <div class="test-name">${rev.name}</div>
        <div class="test-type">${rev.type || 'Visita ORL'}${rev.date ? ' &mdash; ' + rev.date : ''}</div>
      </div>`;
    // Inserisci come prima card nella griglia
    grid.insertBefore(card, grid.firstChild);
  }

  // ── Carica recensioni salvate da localStorage al load ──
  const saved = JSON.parse(localStorage.getItem('reviews') || '[]');
  // Mostra in ordine inverso (le più vecchie prima) così la più recente è in cima
  [...saved].reverse().forEach(renderCard);

  // ── Star rating ──
  const stars  = form.querySelectorAll('.star');
  const hidden = document.getElementById('rev-stars');
  let rating = 0;

  function setRating(v) {
    rating = v;
    hidden.value = v;
    stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.v) <= v));
  }

  stars.forEach(s => {
    s.addEventListener('click', () => setRating(parseInt(s.dataset.v)));
    s.addEventListener('mouseenter', () => {
      stars.forEach(x => x.classList.toggle('active', parseInt(x.dataset.v) <= parseInt(s.dataset.v)));
    });
  });
  form.querySelector('.star-rating').addEventListener('mouseleave', () => setRating(rating));

  // ── Char counter ──
  const textarea = document.getElementById('rev-text');
  const counter  = document.getElementById('rev-count');
  textarea?.addEventListener('input', () => { if (counter) counter.textContent = textarea.value.length; });

  // ── Submit ──
  form.addEventListener('submit', e => {
    e.preventDefault();
    errBox.hidden = true;

    const name = document.getElementById('rev-name').value.trim();
    const text = textarea.value.trim();

    if (!name) { showErr('Inserisci il tuo nome.'); return; }
    if (rating === 0) { showErr('Seleziona una valutazione (stelle).'); return; }
    if (text.length < 20) { showErr('La recensione deve avere almeno 20 caratteri.'); return; }

    const rev = {
      name,
      type: document.getElementById('rev-type').value.trim(),
      stars: rating,
      text,
      date: new Date().toLocaleDateString('it-IT')
    };

    // Salva
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.unshift(rev);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // Mostra subito nella griglia
    renderCard(rev);

    // Nascondi form, mostra successo
    form.hidden = true;
    success.hidden = false;

    // Scrolla alla nuova card
    grid?.firstChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  function showErr(msg) {
    errBox.textContent = msg;
    errBox.hidden = false;
    errBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ── CARD FLIP — SPEC & PAT ── */
function initCardFlip() {
  // Spec cards
  document.querySelectorAll('.spec-card[role="button"]').forEach(card => {
    card.addEventListener('click', () => {
      const isFlipped = card.classList.contains('flipped');
      // Close all other spec cards
      document.querySelectorAll('.spec-card.flipped').forEach(c => c.classList.remove('flipped'));
      if (!isFlipped) card.classList.add('flipped');
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Pat cards
  document.querySelectorAll('.pat-card[role="button"]').forEach(card => {
    card.addEventListener('click', () => {
      const isFlipped = card.classList.contains('flipped');
      document.querySelectorAll('.pat-card.flipped').forEach(c => c.classList.remove('flipped'));
      if (!isFlipped) card.classList.add('flipped');
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initCookieUI();
  initNav();
  initHamburger();
  initCounters();
  initReveal();
  initSmoothScroll();
  initThemeToggle();
  initBackToTop();
  initCardFlip();
  initReviewForm();
});


/* ══════════════════════════════════════════════
   GOOGLE REVIEWS WIDGET
   ── Sostituire i due valori sotto con quelli reali
   ══════════════════════════════════════════════ */
const GOOGLE_PLACE_ID = 'YOUR_PLACE_ID';   // ← Place ID da Google Business
const GOOGLE_API_KEY  = 'YOUR_API_KEY';    // ← API Key da Google Cloud Console

function initGoogleReviews() {
  if (GOOGLE_PLACE_ID === 'YOUR_PLACE_ID' || GOOGLE_API_KEY === 'YOUR_API_KEY') return;

  const dummy = document.createElement('div');
  const service = new google.maps.places.PlacesService(dummy);

  service.getDetails({
    placeId: GOOGLE_PLACE_ID,
    fields: ['rating', 'user_ratings_total', 'reviews', 'url']
  }, (place, status) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return;
    _renderGoogleReviews(place);
  });
}

function _renderGoogleReviews(place) {
  // ── Rating bar
  const bar = document.getElementById('g-rating-bar');
  if (!bar) return;

  document.getElementById('g-score').textContent = place.rating.toFixed(1);
  document.getElementById('g-stars').innerHTML = _starsHtml(place.rating);
  document.getElementById('g-count').textContent =
    place.user_ratings_total + ' recensioni su Google';

  const writeUrl = 'https://search.google.com/local/writereview?placeid=' + GOOGLE_PLACE_ID;
  document.getElementById('g-write-btn').href = writeUrl;
  document.getElementById('g-read-btn').href = place.url || writeUrl;
  bar.removeAttribute('hidden');

  // ── Recensioni individuali (max 5, solo ≥ 4 stelle)
  const grid = document.getElementById('g-reviews-grid');
  if (!grid || !place.reviews) return;

  const reviews = place.reviews.filter(r => r.rating >= 4);
  if (reviews.length === 0) return;

  grid.innerHTML = reviews.map(r => `
    <div class="g-review-card">
      <div class="g-review-header">
        <div class="g-reviewer-avatar">${r.author_name.charAt(0).toUpperCase()}</div>
        <div>
          <div class="g-reviewer-name">${_escHtml(r.author_name)}</div>
          <div class="g-review-star">${_starsHtml(r.rating)}</div>
        </div>
        <div class="g-review-date">${r.relative_time_description}</div>
      </div>
      <p class="g-review-text">${_escHtml(r.text)}</p>
      <div class="g-google-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Recensione verificata Google
      </div>
    </div>
  `).join('');

  // Nasconde le recensioni manuali se Google funziona
  const manualGrid = document.getElementById('test-grid-manual');
  if (manualGrid) manualGrid.style.display = 'none';
}

function _starsHtml(rating) {
  return Array.from({length: 5}, (_, i) =>
    `<span style="color:${i < Math.round(rating) ? 'var(--gold)' : '#ddd'}">★</span>`
  ).join('');
}

function _escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
