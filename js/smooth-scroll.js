/* Digital Gloss — smooth, eased scrolling for mouse wheels and trackpads.
   Touch devices keep their native scrolling; reduced-motion users get standard scrolling. */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  var lenis = new Lenis({
    autoRaf: true,
    lerp: 0.09,          // lower = silkier glide, higher = snappier
    wheelMultiplier: 1,
    anchors: true,       // in-page links (#services etc.) glide too, honouring scroll-margin-top
  });

  // Arriving from another page with #section in the address: start at the top, then glide down to it instead of jumping
  var target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) {
    var glide = function () {
      lenis.scrollTo(0, { immediate: true, force: true });   // reset Lenis itself, not just the window, so its position is not stale
      setTimeout(function () {
        var margin = parseFloat(getComputedStyle(target).scrollMarginTop || 0);
        var goal = function () { lenis.resize(); return target.getBoundingClientRect().top + window.scrollY - margin; };
        lenis.scrollTo(goal(), { duration: 1.6, onComplete: function () {
          // settle exactly under the header if the layout shifted while gliding
          if (Math.abs(target.getBoundingClientRect().top - margin) > 3) lenis.scrollTo(goal(), { duration: .5 });
        } });
      }, 250);
    };
    if (document.readyState === 'complete') glide(); else window.addEventListener('load', glide, { once: true });
  }

  // Hold the page still while the mobile menu is open
  new MutationObserver(function () {
    if (document.body.classList.contains('menu-open')) lenis.stop(); else lenis.start();
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
}
