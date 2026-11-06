/* Concept websites: header state, scroll reveals and the demo booking controls. */
document.documentElement.classList.remove('no-js');
/* ?shot hides the concept badge, for clean screenshots of the page */
if (/[?&]shot\b/.test(location.search)) document.documentElement.classList.add('is-shot');

/* the header turns solid once the page scrolls past the top */
var head = document.querySelector('.c-head');
if (head) {
  var setHead = function () { head.classList.toggle('is-solid', window.scrollY > 40); };
  setHead();
  window.addEventListener('scroll', setHead, { passive: true });
}

/* elements marked .c-rise fade up as they enter the screen */
var rises = document.querySelectorAll('.c-rise');
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  rises.forEach(function (el) { io.observe(el); });
} else {
  rises.forEach(function (el) { el.classList.add('is-in'); });
}

/* demo choice chips: one choice per group */
document.querySelectorAll('.st-chips').forEach(function (group) {
  group.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    group.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
  });
});

/* demo booking steps: clicking a step highlights it */
document.querySelectorAll('.ss-steps').forEach(function (list) {
  list.addEventListener('click', function (e) {
    var step = e.target.closest('.ss-step');
    if (!step) return;
    list.querySelectorAll('.ss-step').forEach(function (s) { s.classList.toggle('is-on', s === step); });
  });
});
