/* Digital Gloss — shared interactions */
(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Services: "Build. Grow. Be remembered." pins while you scroll through it (tablets and desktops) ---------- */
  (function () {
    var story = document.querySelector('.svc-story');
    if (!story) return;
    var stage = story.querySelector('.svc-story__stage');
    var chapters = [].slice.call(story.querySelectorAll('.svc-story__ch'));
    var stops = [].slice.call(story.querySelectorAll('[data-go]'));
    var fill = story.querySelector('.svc-story__fill');
    var wide = window.matchMedia('(min-width: 768px)');
    var active = -1, ticking = false;

    var pinned = function () { return story.classList.contains('is-pinned'); };
    var measure = function () {
      var r = story.getBoundingClientRect();
      var top = parseFloat(getComputedStyle(stage).top) || 0;
      var travel = r.height - stage.offsetHeight;
      return { start: r.top + window.scrollY - top, travel: travel, p: travel > 0 ? Math.min(1, Math.max(0, (top - r.top) / travel)) : 0 };
    };
    var show = function (i) {
      if (i === active) return;
      active = i;
      chapters.forEach(function (c, k) { c.classList.toggle('is-active', k === i); c.classList.toggle('is-past', k < i); });
      stops.forEach(function (b, k) { if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    };
    var update = function () {
      ticking = false;
      if (!pinned()) return;
      var m = measure();
      fill.style.transform = 'scaleY(' + m.p.toFixed(3) + ')';
      show(Math.min(chapters.length - 1, Math.floor(m.p * chapters.length)));
    };
    var go = function (k, smooth) {
      var m = measure();
      window.scrollTo({ top: m.start + (k + 0.5) / chapters.length * m.travel, behavior: smooth ? 'smooth' : 'auto' });
    };
    var setup = function () {
      var on = wide.matches && !reduceMotion;
      story.classList.toggle('is-pinned', on);
      if (on) { story.style.setProperty('--stage-h', stage.offsetHeight + 'px'); active = -1; update(); }
      else { story.style.removeProperty('--stage-h'); fill.style.transform = ''; }
    };

    stops.forEach(function (b, k) { b.addEventListener('click', function () { go(k, true); }); });
    chapters.forEach(function (c, k) {
      c.addEventListener('focusin', function () { if (pinned() && k !== active) go(k, false); }); /* a keyboard user tabbing to a hidden chapter brings it into view */
    });
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', setup);
    if (wide.addEventListener) wide.addEventListener('change', setup);
    setup();
  })();

  /* ---------- Services: a slim bar under the header appears once the opening is behind you and follows where you are ---------- */
  (function () {
    var nav = document.querySelector('.svc-subnav');
    if (!nav) return;
    var story = document.querySelector('.svc-story');
    var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var ticking = false;
    var update = function () {
      ticking = false;
      var behind = story ? story.getBoundingClientRect().bottom < (header ? header.offsetHeight : 70) + 20 : window.scrollY > 400;
      nav.classList.toggle('is-visible', behind);
      var line = window.innerHeight * 0.4, cur = -1;
      targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= line) cur = i; });
      links.forEach(function (a, i) { if (i === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------- Contact: the current time in Abu Dhabi ---------- */
  (function () {
    var t = document.querySelector('[data-local-time]');
    if (!t || !window.Intl) return;
    var place = document.querySelector('[data-local-place]');
    var fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit' });
    var tick = function () { var now = new Date(); t.textContent = fmt.format(now); t.setAttribute('datetime', now.toISOString()); };
    tick();
    t.hidden = false;
    if (place) place.textContent = ' in Abu Dhabi'; /* without the script the card simply reads "Abu Dhabi" */
    setInterval(tick, 30000);
  })();

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
          el.style.transitionDelay = el.dataset.revealDelay ? el.dataset.revealDelay + 'ms' : el.matches('.reveal--fade') ? '0ms' : Math.min(siblings, 4) * (el.matches('.reveal--left, .reveal--up') ? 180 : 80) + 'ms'; // data-reveal-delay overrides the sibling stagger (the industry mosaic staggers by column instead)
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

  /* ---------- Questions and answers: one question open at a time ---------- */
  document.querySelectorAll('.faq').forEach(function (faq) {
    function openOnly(item) {
      faq.querySelectorAll('.faq__item.is-open').forEach(function (o) {
        o.classList.remove('is-open'); o.querySelector('.faq__q button').setAttribute('aria-expanded', 'false');
      });
      if (item) { item.classList.add('is-open'); item.querySelector('.faq__q button').setAttribute('aria-expanded', 'true'); }
    }
    faq.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq__q button');
      if (!btn) return;
      var item = btn.closest('.faq__item'), opening = !item.classList.contains('is-open');
      openOnly(opening ? item : null);
    });
  });

  /* ---------- Who we work with tabs ---------- */
  document.querySelectorAll('.who').forEach(function (who) {
    var tabs = [].slice.call(who.querySelectorAll('.who__tab'));
    var panels = [].slice.call(who.querySelectorAll('.who__panel'));
    var select = function (i, focus) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[n].hidden = !on;
        panels[n].classList.remove('is-in');
        if (on) { void panels[n].offsetWidth; panels[n].classList.add('is-in'); } // restart the line-by-line reveal
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, next = null;
        if (k === 'ArrowDown' || k === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (k === 'ArrowUp' || k === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') next = 0;
        else if (k === 'End') next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });
    select(0);
  });

  /* ---------- Industries: expanding strip (desktop) ---------- */
  var industryGrid = document.querySelector('.industry-grid');
  if (industryGrid) {
    var industries = [].slice.call(industryGrid.querySelectorAll('.industry'));
    var wide = window.matchMedia('(min-width: 961px)');
    var open = function (el) { industries.forEach(function (i) { i.classList.toggle('is-active', i === el); }); };
    var setup = function () {
      if (wide.matches) {
        industryGrid.removeAttribute('tabindex');
        industries.forEach(function (i) { i.tabIndex = 0; });
        if (!industryGrid.querySelector('.is-active')) open(industries[0]);
      } else {
        industryGrid.tabIndex = 0;
        industries.forEach(function (i) { i.removeAttribute('tabindex'); i.classList.remove('is-active'); });
      }
    };
    industries.forEach(function (i) {
      i.addEventListener('mouseenter', function () { if (wide.matches) open(i); });
      i.addEventListener('focus', function () { if (wide.matches) open(i); });
      i.addEventListener('click', function () { if (wide.matches) open(i); });
    });
    if (wide.addEventListener) wide.addEventListener('change', setup); else wide.addListener(setup);
    setup();
  }

  /* ---------- Who we work with: the row you point at (or tab to) becomes the active one; the first is active to begin with ---------- */
  document.querySelectorAll('.story-list').forEach(function (list) {
    var stories = [].slice.call(list.querySelectorAll('.story'));
    var activate = function (s) { stories.forEach(function (o) { o.classList.toggle('is-active', o === s); }); };
    stories.forEach(function (s) {
      s.addEventListener('mouseenter', function () { activate(s); });
      s.addEventListener('focusin', function () { activate(s); });
    });
    if (stories.length) activate(stories[0]);
  });

  /* ---------- Premium cards: the metallic edge brightens near the cursor (mouse only) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var fadeEdge = function (el, to) { // eases the light in or out over half a second
      cancelAnimationFrame(el._edgeFade);
      var from = parseFloat(el.style.getPropertyValue('--edge-o')) || 0, start = performance.now();
      var step = function (now) {
        var k = Math.min(1, (now - start) / 500); k = 1 - Math.pow(1 - k, 3);
        el.style.setProperty('--edge-o', (from + (to - from) * k).toFixed(3));
        if (k < 1) el._edgeFade = requestAnimationFrame(step);
      };
      el._edgeFade = requestAnimationFrame(step);
    };
    document.querySelectorAll('.who__panel, .card-lux, .svc-panel').forEach(function (el) {
      var raf = 0, x = 0, y = 0;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(); x = e.clientX - r.left; y = e.clientY - r.top;
        if (!raf) raf = requestAnimationFrame(function () { raf = 0; el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px'); });
      });
      el.addEventListener('pointerenter', function () { fadeEdge(el, 1); });
      el.addEventListener('pointerleave', function () { fadeEdge(el, 0); });
    });
  }

  /* ---------- Services: the photos drift slightly slower than the page as you scroll (gentle parallax) ---------- */
  var parallaxImgs = [].slice.call(document.querySelectorAll('.svc-photo img'));
  if (parallaxImgs.length && !reduceMotion) {
    var parallaxQueued = false;
    var parallaxUpdate = function () {
      parallaxQueued = false;
      var vh = window.innerHeight;
      parallaxImgs.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return; // only photos on or near the screen
        var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // 1 = just below the screen, -1 = just above
        img.style.setProperty('--py', (-p * 14).toFixed(1) + 'px');
      });
    };
    var parallaxQueue = function () { if (!parallaxQueued) { parallaxQueued = true; requestAnimationFrame(parallaxUpdate); } };
    window.addEventListener('scroll', parallaxQueue, { passive: true });
    window.addEventListener('resize', parallaxQueue);
    parallaxUpdate();
  }

  /* ---------- Home hero video: stays still for visitors who prefer reduced motion or are saving data ---------- */
  (function () {
    var video = document.querySelector('.x-hero__video');
    if (!video) return;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduceMotion || saveData) { video.removeAttribute('autoplay'); video.pause(); video.preload = 'none'; return; }
    var start = function () { var p = video.play(); if (p && p.catch) p.catch(function () {}); };
    start();
    // if the browser's settings block autoplay (Safari can), start on the visitor's first tap, click or key press instead
    var onGesture = function () { if (video.paused) start(); ['pointerdown', 'touchstart', 'keydown'].forEach(function (t) { window.removeEventListener(t, onGesture); }); };
    ['pointerdown', 'touchstart', 'keydown'].forEach(function (t) { window.addEventListener(t, onGesture, { passive: true }); });
    // Safari can pause a muted video when the tab comes back into view: resume it
    document.addEventListener('visibilitychange', function () { if (!document.hidden && video.paused) start(); });
  })();

  /* ---------- Home statement: each word lights up as the sentence scrolls up through the screen ---------- */
  (function () {
    var text = document.querySelector('[data-words]');
    if (!text) return;
    if (reduceMotion) { text.closest('.x-statement').classList.add('is-static'); return; }
    // wrap every word in a span, keeping any inner markup (the accent phrase)
    var wrap = function (node) {
      [].slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) { wrap(child); }
      });
    };
    wrap(text);
    var words = [].slice.call(text.querySelectorAll('.w'));
    var queued = false;
    var update = function () {
      queued = false;
      var r = text.getBoundingClientRect(), vh = window.innerHeight;
      // 0 when the sentence's top reaches 85% down the screen, 1 when its bottom reaches 45%
      var p = (vh * 0.85 - r.top) / (vh * 0.85 - vh * 0.45 + r.height);
      var lit = Math.round(Math.max(0, Math.min(1, p)) * words.length);
      words.forEach(function (w, i) { w.classList.toggle('is-lit', i < lit); });
    };
    var queue = function () { if (!queued) { queued = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
  })();

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

})();
