/* ================================================================
   FAZAL PORTFOLIO — JAVASCRIPT
   ================================================================ */

// ================================================================
// LOADER
// ================================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 600);
    }
    triggerHeroAnimations();
  }, 1900);
});

function triggerHeroAnimations() {
  const heroEls = document.querySelectorAll('.hero .reveal-up, .hero .reveal-right');
  heroEls.forEach(el => el.classList.add('in'));
}

// ================================================================
// NAVBAR
// ================================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  toggleBackTop();
  updateActiveNav();
  updateProgressBar();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navH = navbar.offsetHeight;
  let current = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - navH - 80) {
      current = sec.id;
    }
  });

  allNavLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}

// ================================================================
// SMOOTH SCROLL
// ================================================================
document.querySelectorAll('[data-scroll]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = navbar.offsetHeight + 10;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ================================================================
// SCROLL REVEAL (Intersection Observer)
// ================================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
      // Animate skill bars when skill items appear
      const fill = entry.target.querySelector('.skill-fill');
      if (fill && !fill.classList.contains('animated')) {
        fill.classList.add('animated');
        const w = fill.getAttribute('data-w');
        setTimeout(() => { fill.style.width = w + '%'; }, 100);
      }
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

function observeRevealElements() {
  document.querySelectorAll('.reveal-up:not(.hero .reveal-up), .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });
}

// ================================================================
// ANIMATED COUNTERS
// ================================================================
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current += step;
    if (current >= target) {
      el.textContent = target;
    } else {
      el.textContent = Math.floor(current);
      requestAnimationFrame(update);
    }
  };
  requestAnimationFrame(update);
}

// ================================================================
// SKILLS TABS
// ================================================================
const stabs = document.querySelectorAll('.stab');
const panels = document.querySelectorAll('.skills-panel');

stabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const t = tab.getAttribute('data-tab');

    stabs.forEach(s => s.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const panel = document.getElementById('tab-' + t);
    if (panel) {
      panel.classList.add('active');
      // Re-trigger skill bars
      panel.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.width = '0';
        fill.classList.remove('animated');
        setTimeout(() => {
          fill.style.width = fill.getAttribute('data-w') + '%';
          fill.classList.add('animated');
        }, 80);
      });
      // Re-observe new items
      panel.querySelectorAll('.reveal-up').forEach(el => {
        el.classList.remove('in');
        revealObserver.observe(el);
      });
    }
  });
});

// Init first tab skill bars
function initFirstTabSkillBars() {
  document.querySelectorAll('.skills-panel.active .skill-fill').forEach(fill => {
    fill.style.width = '0';
  });
}

// ================================================================
// PROJECT FILTER
// ================================================================
const pfBtns = document.querySelectorAll('.pfbtn');
const projCards = document.querySelectorAll('.proj-card');

pfBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    pfBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    projCards.forEach(card => {
      const cat = card.getAttribute('data-cat');
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.3s ease';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ================================================================
// CONTACT FORM
// ================================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = contactForm.querySelector('[name="name"]').value.trim();
    const email   = contactForm.querySelector('[name="email"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      showNotif('Please fill in all required fields.', 'error');
      return;
    }

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
      showNotif('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate submission
    const btn = contactForm.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    setTimeout(() => {
      showNotif('✅ Message sent! I\'ll get back to you soon.', 'success');
      contactForm.reset();
      btn.innerHTML = origText;
      btn.disabled = false;
    }, 1500);
  });
}

function showNotif(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `notif notif-${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'notifOut 0.3s ease forwards';
    setTimeout(() => el.remove(), 320);
  }, 4000);
}

// ================================================================
// BACK TO TOP
// ================================================================
const backTop = document.getElementById('backToTop');

function toggleBackTop() {
  backTop.classList.toggle('visible', window.scrollY > 600);
}

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ================================================================
// SCROLL PROGRESS BAR
// ================================================================
const progressBar = document.getElementById('progressBar');

function updateProgressBar() {
  if (!progressBar) return;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
  progressBar.style.width = pct + '%';
}

// ================================================================
// SPOTLIGHT CURSOR GLOW ON CARDS
// ================================================================
function initSpotlightCards() {
  const spotlightSelector = '.svc-card, .why-card, .skill-item, .testi-card, .tl-card, .about-card, .contact-form';
  document.querySelectorAll(spotlightSelector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });
}

// ================================================================
// RESIZE HANDLER
// ================================================================
function debounce(fn, wait) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

window.addEventListener('resize', debounce(() => {
  if (window.innerWidth > 768) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
}, 250));

// ================================================================
// INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Observe all reveal elements outside hero
  observeRevealElements();

  // Observe counters
  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // Init skill bars to 0
  initFirstTabSkillBars();

  // Spotlight cursor glow + initial progress bar state
  initSpotlightCards();
  updateProgressBar();

  console.log('%c◆ Fazal Portfolio Loaded ', 'font-size:14px;color:#00d4aa;font-weight:700;background:#080d14;padding:4px 8px;border-radius:4px;');
});
