/* ─────────────────────────────────────────────────────
   Beaches Local Toronto  —  script.js
───────────────────────────────────────────────────── */

// ── Scroll progress bar ─────────────────────────────
const scrollBar = document.getElementById('scrollBar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  scrollBar.style.width = pct + '%';
}, { passive: true });

// ── Navbar scroll state ─────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile menu ─────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navDrawer  = document.getElementById('navDrawer');

hamburger.addEventListener('click', () => {
  const open = navDrawer.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  navDrawer.setAttribute('aria-hidden', !open);
});

function closeMenu() {
  navDrawer.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  navDrawer.setAttribute('aria-hidden', 'true');
}

// ── Scroll helpers ──────────────────────────────────
function scrollToContact() {
  closeMenu();
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Hero button — cycles CTA text with fade ─────────
const heroCtas = [
  'Start Your Project',
  'Request a Free Quote',
  'Talk to an Expert',
  'See Our Work',
  'Get in Touch Today',
];
let heroIdx = 0;
const heroBtnLabel = document.getElementById('heroBtnLabel');

function cycleHeroText() {
  heroBtnLabel.style.transition = 'opacity .18s ease, transform .18s ease';
  heroBtnLabel.style.opacity    = '0';
  heroBtnLabel.style.transform  = 'translateY(6px)';

  setTimeout(() => {
    heroIdx = (heroIdx + 1) % heroCtas.length;
    heroBtnLabel.textContent = heroCtas[heroIdx];
    heroBtnLabel.style.opacity   = '1';
    heroBtnLabel.style.transform = 'translateY(0)';
  }, 185);

  if (heroIdx === 0) {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
  }
}

// ── Toronto Weather (Open-Meteo, no key required) ───
const WMO = {
  0:  { e: '☀️',  d: 'Clear sky' },
  1:  { e: '🌤️', d: 'Mainly clear' },
  2:  { e: '⛅',  d: 'Partly cloudy' },
  3:  { e: '☁️',  d: 'Overcast' },
  45: { e: '🌫️', d: 'Foggy' },
  48: { e: '🌫️', d: 'Icy fog' },
  51: { e: '🌦️', d: 'Light drizzle' },
  53: { e: '🌦️', d: 'Drizzle' },
  55: { e: '🌧️', d: 'Heavy drizzle' },
  61: { e: '🌧️', d: 'Light rain' },
  63: { e: '🌧️', d: 'Rain' },
  65: { e: '🌧️', d: 'Heavy rain' },
  71: { e: '🌨️', d: 'Light snow' },
  73: { e: '🌨️', d: 'Snow' },
  75: { e: '❄️',  d: 'Heavy snow' },
  77: { e: '🌨️', d: 'Snow grains' },
  80: { e: '🌦️', d: 'Light showers' },
  81: { e: '🌧️', d: 'Showers' },
  82: { e: '⛈️',  d: 'Heavy showers' },
  85: { e: '🌨️', d: 'Snow showers' },
  86: { e: '❄️',  d: 'Heavy snow showers' },
  95: { e: '⛈️',  d: 'Thunderstorm' },
  96: { e: '⛈️',  d: 'Thunderstorm + hail' },
  99: { e: '⛈️',  d: 'Severe thunderstorm' },
};

function getWeather(code) {
  return WMO[code] || { e: '🌡️', d: 'Variable' };
}

async function fetchWeather() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=43.6532&longitude=-79.3832'
      + '&current_weather=true'
      + '&timezone=America%2FToronto';

    const res  = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const cw   = data.current_weather;

    const temp  = Math.round(cw.temperature);
    const wind  = Math.round(cw.windspeed);
    const info  = getWeather(cw.weathercode);

    // Hero weather pill
    document.getElementById('wpEmoji').textContent = info.e;
    document.getElementById('wpTemp').textContent  = temp + '°C';
    document.getElementById('wpDesc').textContent  = info.d;
    document.getElementById('wpWind').textContent  = wind;
    document.getElementById('wpLoading').hidden = true;
    document.getElementById('wpData').hidden    = false;

    // Navbar weather
    document.getElementById('navWeatherIcon').textContent = info.e;
    document.getElementById('navWeatherTemp').textContent = temp + '°C';

    // Footer weather
    document.getElementById('fwIcon').textContent = info.e;
    document.getElementById('fwTemp').textContent = temp + '°C';
    document.getElementById('fwDesc').textContent = info.d + ' ·';

  } catch (err) {
    console.warn('Weather fetch failed:', err);
    const pill = document.getElementById('weatherPill');
    if (pill) {
      document.getElementById('wpLoading').innerHTML = '<span style="color:rgba(255,255,255,.45)">Weather unavailable</span>';
    }
    document.getElementById('navWeatherIcon').textContent = '🌡️';
    document.getElementById('navWeatherTemp').textContent = 'Toronto';
  }
}

fetchWeather();

// ── Contact form ─────────────────────────────────────
function submitForm(e) {
  e.preventDefault();
  const btn   = document.getElementById('submitBtn');
  const label = document.getElementById('submitLabel');
  const ok    = document.getElementById('formOk');

  label.textContent = 'Sending…';
  btn.disabled      = true;
  btn.style.opacity = '.7';

  setTimeout(() => {
    document.getElementById('contactForm').reset();
    btn.style.display = 'none';
    ok.hidden = false;

    setTimeout(() => {
      btn.style.display = '';
      btn.style.opacity = '1';
      btn.disabled      = false;
      label.textContent = 'Send Message';
      ok.hidden = true;
    }, 5000);
  }, 1100);
}

// ── Scroll-triggered reveal ──────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => el.classList.add('visible'), delay);
    revealObs.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

// ── Animated stat counters ───────────────────────────
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObs.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

// ── Card 3-D tilt on mouse ───────────────────────────
document.querySelectorAll('.scard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r    = card.getBoundingClientRect();
    const x    = (e.clientX - r.left) / r.width  - 0.5;
    const y    = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Smooth anchor links (close menu on click) ────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => closeMenu());
});
