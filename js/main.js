/* Digital Gloss — shared interactions */
(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: transparent at top, canvas tint once scrolled ---------- */
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.classList.toggle('is-open', open);
    header.classList.toggle('is-menu-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) {
      var first = mobileMenu.querySelector('a, button');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
    }
  }
  if (menuToggle && mobileMenu) {
    mobileMenu.setAttribute('inert', '');
    menuToggle.addEventListener('click', function () {
      var open = menuToggle.getAttribute('aria-expanded') !== 'true';
      setMenu(open);
      if (open) mobileMenu.removeAttribute('inert'); else mobileMenu.setAttribute('inert', '');
    });
    mobileMenu.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (link) { setMenu(false); mobileMenu.setAttribute('inert', ''); }
    });
    // close if resized up to desktop nav
    window.matchMedia('(min-width: 768px)').addEventListener('change', function (mq) {
      if (mq.matches) { setMenu(false); mobileMenu.setAttribute('inert', ''); }
    });
  }

  // Mobile services sub-menu
  document.querySelectorAll('.mobile-sub-toggle').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
    });
  });

  /* ---------- Desktop services dropdown ---------- */
  document.querySelectorAll('.has-dropdown').forEach(function (item) {
    var btn = item.querySelector('.dropdown-toggle');
    function set(open) {
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    }
    // "Services" is a link to the services page: clicking it navigates; the menu opens on hover and keyboard focus
    if (btn.tagName === 'BUTTON') {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        set(!item.classList.contains('is-open'));
      });
    } else {
      item.addEventListener('focusin', function () { set(true); });
    }
    item.addEventListener('mouseenter', function () { btn.setAttribute('aria-expanded', 'true'); });
    item.addEventListener('mouseleave', function () { set(false); });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) set(false);
    });
    item.querySelectorAll('.dropdown a').forEach(function (a) {
      a.addEventListener('click', function () { set(false); btn.blur(); });
    });
    document.addEventListener('click', function (e) { if (!item.contains(e.target)) set(false); });
  });

  // Escape closes any open menu
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (menuToggle && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false); mobileMenu.setAttribute('inert', ''); menuToggle.focus();
    }
    document.querySelectorAll('.has-dropdown.is-open').forEach(function (item) {
      item.classList.remove('is-open');
      var b = item.querySelector('.dropdown-toggle');
      b.setAttribute('aria-expanded', 'false'); b.focus();
    });
  });

  /* ---------- Scroll-spy for the main nav (home page) ---------- */
  var spyLinks = document.querySelectorAll('[data-spy]');
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    spyLinks.forEach(function (l) { map[l.dataset.spy] = l; });
    // watch every section, not just the ones with a nav link, so the highlight clears when the page moves past the last linked one
    var sections = Array.prototype.slice.call(document.querySelectorAll('main > section'));
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          spyLinks.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
          var link = map[en.target.id];
          if (link) { link.classList.add('is-active'); if (link.tagName === 'A') link.setAttribute('aria-current', 'true'); }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
          el.style.transitionDelay = el.matches('.reveal--fade') ? '0ms' : Math.min(siblings, 4) * (el.matches('.reveal--left, .reveal--up') ? 180 : 80) + 'ms';
          el.classList.add('is-visible');
          // drop the stagger once revealed so hover effects respond instantly
          el.addEventListener('transitionend', function clear(e) {
            if (e.target === el && e.propertyName === 'opacity') { el.style.transitionDelay = ''; el.removeEventListener('transitionend', clear); }
          });
          // side fly-ins keep watching so they can replay; everything else reveals once
          if (!el.matches('.reveal--left, .reveal--right, .reveal--up, .reveal--fade')) io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });

    // Once a side fly-in is fully out of view below the screen (the user scrolled back up),
    // reset it so it flies in again on the next scroll down. Leaving through the top keeps it in place.
    var replay = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting || en.boundingClientRect.top <= 0) return;
        var t = en.target;
        t.classList.add('reveal--reset');
        t.classList.remove('is-visible');
        void t.offsetWidth;
        t.classList.remove('reveal--reset');
      });
    }, { threshold: 0 });
    document.querySelectorAll('.reveal--left, .reveal--right, .reveal--up, .reveal--fade').forEach(function (el) { replay.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Plain-language translator ---------- */
  var translator = document.querySelector('.translator');
  if (translator) {
    var buttons = translator.querySelectorAll('.switch button');
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var mode = b.dataset.mode;
        if (translator.dataset.mode === mode) return;
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        if (reduceMotion) { translator.dataset.mode = mode; return; }
        translator.classList.add('is-swapping');
        setTimeout(function () {
          translator.dataset.mode = mode;
          requestAnimationFrame(function () { translator.classList.remove('is-swapping'); });
        }, 220);
      });
    });
  }

  /* ---------- Legal pages: highlight the current section in the index ---------- */
  var legalLinks = document.querySelectorAll('.legal-index a');
  if (legalLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    legalLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var legalSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        legalLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        var a = byId[en.target.id];
        if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'location'); }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    document.querySelectorAll('.legal__section').forEach(function (sec) { legalSpy.observe(sec); });
  }

  /* ---------- Questions and answers: topic tabs, and one question open at a time ---------- */
  document.querySelectorAll('.faq').forEach(function (faq) {
    function openOnly(item) {
      faq.querySelectorAll('.faq__item.is-open').forEach(function (o) {
        o.classList.remove('is-open'); o.querySelector('.faq__q button').setAttribute('aria-expanded', 'false');
      });
      if (item) { item.classList.add('is-open'); item.querySelector('.faq__q button').setAttribute('aria-expanded', 'true'); }
    }
    faq.addEventListener('click', function (e) {
      var tab = e.target.closest('.faq__tab');
      if (tab) {
        var topic = tab.dataset.topic;
        faq.querySelectorAll('.faq__tab').forEach(function (t) {
          var on = t === tab; t.classList.toggle('is-active', on); t.setAttribute('aria-pressed', String(on));
        });
        var first = null;
        faq.querySelectorAll('.faq__item').forEach(function (it) {
          var show = topic === 'all' || it.dataset.topic === topic; it.hidden = !show; if (show && !first) first = it;
        });
        openOnly(first); // the first question showing opens, as a hint that they open
        return;
      }
      var btn = e.target.closest('.faq__q button');
      if (!btn) return;
      var item = btn.closest('.faq__item'), opening = !item.classList.contains('is-open');
      openOnly(opening ? item : null);
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

})();
