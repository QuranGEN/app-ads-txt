(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;

  function initCursor() {
    if (reduceMotion || isTouch) return;
    var cursor = document.createElement('div');
    cursor.className = 'mg-cursor';
    var ring = document.createElement('div');
    ring.className = 'mg-cursor-ring';
    cursor.appendChild(ring);
    document.body.appendChild(cursor);
    var cx = 0, cy = 0, rx = 0, ry = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });
    function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      rx += (tx - rx) * 0.08;
      ry += (ty - ry) * 0.08;
      cursor.style.transform = 'translate(' + (cx - 4) + 'px,' + (cy - 4) + 'px)';
      ring.style.transform = 'translate(' + (rx - 20) + 'px,' + (ry - 20) + 'px)';
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll('a, button, .card, .store-badge').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('hover'); });
    });
  }

  function initCardTilt() {
    if (reduceMotion || isTouch) return;
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--ry', (x * 10) + 'deg');
        card.style.setProperty('--rx', (-y * 10) + 'deg');
      });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  function initMagnetic() {
    if (reduceMotion || isTouch) return;
    document.querySelectorAll('.cta, .store-badge').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.12) + 'px,' + (y * 0.12) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  function initProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var max = document.documentElement.scrollHeight - window.innerHeight;
          var pct = max > 0 ? window.scrollY / max : 0;
          bar.style.transform = 'scaleX(' + pct + ')';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function initParallax() {
    if (reduceMotion || isTouch) return;
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var content = hero.querySelector('.wrap');
    if (!content) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrolled = window.scrollY;
          if (scrolled < window.innerHeight) {
            content.style.transform = 'translateY(' + (scrolled * 0.25) + 'px)';
            content.style.opacity = String(1 - scrolled / (window.innerHeight * 0.7));
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  function initWebGL() {
    if (!window.MotionGraphics || !window.WebGLCore || !window.Shaders) return;
    var canvases = document.querySelectorAll('.motion-canvas');
    canvases.forEach(function (canvas) {
      var theme = canvas.getAttribute('data-theme') || 'studio';
      new window.MotionGraphics(canvas, theme);
    });
  }

  function init() {
    initWebGL();
    initCursor();
    initCardTilt();
    initMagnetic();
    initReveal();
    initProgress();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
