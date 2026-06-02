/* ══════════════════════════════════════════
   DOTT. MARCO MORANDI — script.js
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
