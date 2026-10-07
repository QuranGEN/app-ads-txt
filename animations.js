(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;
  var isMobile = window.innerWidth < 768;

  /* ——— Canvas particle system ——— */
  function createCanvas(container, config) {
    if (reduceMotion || !container) return null;
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var w, h, particles = [], raf;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = container.clientWidth;
      h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      particles = [];
      var count = isMobile ? (config.mobileCount || 30) : (config.count || 60);
      for (var i = 0; i < count; i++) {
        particles.push(makeParticle());
      }
    }

    function makeParticle() {
      var p = {
        x: Math.random() * w,
        y: Math.random() * h,
        r: config.radius[0] + Math.random() * (config.radius[1] - config.radius[0]),
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        opacity: config.opacity[0] + Math.random() * (config.opacity[1] - config.opacity[0]),
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02
      };
      if (config.type === 'ink') {
        p.vy = -(0.1 + Math.random() * 0.3);
        p.vx = (Math.random() - 0.5) * 0.15;
      }
      if (config.type === 'star') {
        p.depth = 0.3 + Math.random() * 0.7;
        p.r = p.depth * 2;
        p.vx = (Math.random() - 0.5) * 0.02 * p.depth;
        p.vy = (Math.random() - 0.5) * 0.02 * p.depth;
      }
      return p;
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (config.type === 'ink') {
          if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
          grad.addColorStop(0, 'rgba(42,36,25,' + (p.opacity * 0.6) + ')');
          grad.addColorStop(1, 'rgba(42,36,25,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(42,36,25,' + p.opacity + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (config.type === 'star') {
          var twinkle = 0.5 + 0.5 * Math.sin(p.pulse);
          ctx.fillStyle = 'rgba(255,255,255,' + (p.opacity * twinkle * p.depth) + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          if (p.y > h + 5) { p.y = -5; p.x = Math.random() * w; }
          if (p.x > w + 5) p.x = -5;
          if (p.x < -5) p.x = w + 5;
        } else if (config.type === 'gold') {
          var glow = 0.5 + 0.5 * Math.sin(p.pulse);
          var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          g.addColorStop(0, 'rgba(255,215,94,' + (p.opacity * glow * 0.4) + ')');
          g.addColorStop(1, 'rgba(255,215,94,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,215,94,' + (p.opacity * glow) + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();

    window.addEventListener('resize', function () {
      resize();
      initParticles();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        draw();
      }
    });

    return { canvas: canvas, ctx: ctx };
  }

  /* ——— Shooting star ——— */
  function spawnShootingStar(container) {
    if (reduceMotion || !container) return;
    var star = document.createElement('div');
    star.className = 'shooting-star';
    var startX = Math.random() * 60 + 20;
    var startY = Math.random() * 30 + 5;
    star.style.left = startX + '%';
    star.style.top = startY + '%';
    star.style.transform = 'rotate(' + (Math.random() * 30 - 15) + 'deg)';
    container.appendChild(star);
    star.addEventListener('animationend', function () {
      star.remove();
    });
  }

  function initShootingStars(container) {
    if (!container) return;
    setInterval(function () {
      if (!document.hidden) spawnShootingStar(container);
    }, 4000 + Math.random() * 3000);
  }

  /* ——— Scroll reveal ——— */
  function initReveal() {
    if (reduceMotion) return;
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

  /* ——— Card tilt ——— */
  function initTilt() {
    if (reduceMotion || isTouch) return;
    var cards = document.querySelectorAll('.card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--ry', (x * 8) + 'deg');
        card.style.setProperty('--rx', (-y * 8) + 'deg');
      });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ——— Button magnetic ——— */
  function initMagnetic() {
    if (reduceMotion || isTouch) return;
    var btns = document.querySelectorAll('.cta, .store-badge');
    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px,' + (y * 0.15) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ——— Scroll progress bar ——— */
  function initProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrolled = window.scrollY;
          var max = document.documentElement.scrollHeight - window.innerHeight;
          var pct = max > 0 ? scrolled / max : 0;
          bar.style.transform = 'scaleX(' + pct + ')';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ——— Parallax on hero content ——— */
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
            content.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            content.style.opacity = String(1 - scrolled / (window.innerHeight * 0.8));
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ——— Custom cursor ——— */
  function initCursor() {
    if (reduceMotion || isTouch) return;
    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    var cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
    });
    function loop() {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      cursor.style.transform = 'translate(' + (cx - 4) + 'px,' + (cy - 4) + 'px)';
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll('a, button, .card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('hover'); });
    });
  }

  /* ——— Init ——— */
  function init() {
    var hero = document.querySelector('.hero');
    var theme = document.body.getAttribute('data-theme') || 'studio';

    if (hero) {
      if (theme === 'ink') {
        createCanvas(hero, { type: 'ink', count: 50, mobileCount: 25, radius: [1, 3], speed: 0.2, opacity: [0.15, 0.4] });
      } else if (theme === 'space') {
        createCanvas(hero, { type: 'star', count: 80, mobileCount: 40, radius: [0.5, 2], speed: 0.05, opacity: [0.3, 0.9] });
        initShootingStars(hero);
      } else {
        createCanvas(hero, { type: 'gold', count: 40, mobileCount: 20, radius: [1, 2.5], speed: 0.15, opacity: [0.2, 0.6] });
      }
    }

    initReveal();
    initTilt();
    initMagnetic();
    initProgress();
    initParallax();
    initCursor();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
