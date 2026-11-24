/* Benemeo Studio — fondo animado "Constelación B": puntos que flotan, se unen con líneas
   y cada 14 s forman la B del logo. Va fijo detrás del contenido. Sin dependencias.
   Detrás de los bloques de texto se ve más suave (75 % menos), para que se lea bien. */
(function () {
  'use strict';
  var cv = document.createElement('canvas');
  if (!cv.getContext) return;
  cv.className = 'fondo-ia';
  cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  var ctx = cv.getContext('2d');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = mqReduce.matches;
  // Colores que se ven sobre azul marino y sobre blanco
  var NAVY = '96,140,220', BLUE = '59,123,255';
  var CYCLE = 14000; // 7 s sueltos, 2,5 s juntándose, 3 s formando la B, 1,5 s soltándose
  var W = 0, H = 0, cx = 0, cy = 0, s = 0, pts = [], t0 = performance.now(), running = false;
  var hero = document.getElementById('inicio'), calm = 0;

  // Bloques de texto donde la constelación se suaviza
  var TXT = '#hero-phone, .tv .screens, .tv__hint, .tv__end, .tryit, .reco, .plan, .launch, .mant, .mt, .pk-note, main h1, main h2, .lead, .trust, .section-lead, .timeline, .free-box, .bio__text, .bio__facts, .faq, .plans__note, .contact__alt, .ex__kind';
  var blocks = [];
  function soften() {
    ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,.75)';
    blocks.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H || !r.width) return;
      // La pantalla del celular que se puede usar queda completamente limpia
      if (el.matches('.tv .screens')) {
        ctx.fillStyle = '#000'; ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(r.left, r.top, r.width, r.height, 28); else ctx.rect(r.left, r.top, r.width, r.height);
        ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.75)';
        return;
      }
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(r.left - 14, r.top - 10, r.width + 28, r.height + 20, 16); else ctx.rect(r.left - 14, r.top - 10, r.width + 28, r.height + 20);
      ctx.fill();
    });
    ctx.restore();
  }

  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var ease = function (u) { return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; };

  // Puntos del contorno de la letra B, dibujada en un lienzo aparte
  function bOutline() {
    var G = 200, off = document.createElement('canvas'), oc = off.getContext('2d');
    off.width = off.height = G;
    oc.font = '800 ' + (G * .95) + 'px Inter, "Segoe UI", Arial, sans-serif';
    oc.textAlign = 'center'; oc.textBaseline = 'middle'; oc.fillText('B', G / 2, G * .54);
    var d = oc.getImageData(0, 0, G, G).data, edge = [];
    var on = function (x, y) { return x >= 0 && y >= 0 && x < G && y < G && d[(y * G + x) * 4 + 3] > 128; };
    for (var y = 0; y < G; y += 2) for (var x = 0; x < G; x += 2) {
      if (on(x, y) && (!on(x - 2, y) || !on(x + 2, y) || !on(x, y - 2) || !on(x, y + 2))) edge.push([x - G / 2, y - G / 2]);
    }
    return { edge: edge, G: G };
  }

  function build() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Centro y tamaño: al centro en celular, un poco a la derecha en computadora
    s = Math.min(H * .78, W < 760 ? W * .9 : W * .46, 620);
    cx = W < 760 ? W / 2 : W * .52; cy = H * .52;
    var N = W < 760 ? 80 : 110, b = bOutline(), targets = [], step = Math.max(1, Math.floor(b.edge.length / N));
    for (var i = 0; i < b.edge.length && targets.length < N; i += step) targets.push(b.edge[i]);
    while (targets.length < N) targets.push(b.edge[Math.floor(Math.random() * b.edge.length)]);
    var sc = s * .8 / b.G;
    pts = targets.map(function (p) {
      return { tx: cx + p[0] * sc, ty: cy + p[1] * sc, x: cx + rnd(-s * .6, s * .6), y: cy + rnd(-s * .55, s * .55), vx: rnd(-.25, .25), vy: rnd(-.25, .25) };
    });
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    var c = t % CYCLE, m = 0;
    if (c > 7000 && c <= 9500) m = ease((c - 7000) / 2500);
    else if (c > 9500 && c <= 12500) m = 1;
    else if (c > 12500) m = 1 - ease((c - 12500) / 1500);
    // La B se forma solo en la portada (bienvenida); en el resto de la web los puntos solo flotan y, si la B ya estaba, se suelta suave
    var r = hero && hero.getBoundingClientRect(), quiet = r && r.bottom > H * .5 ? 0 : 1;
    calm = reduce ? quiet : calm + (quiet - calm) * .05;
    m *= 1 - calm;
    var P = pts.map(function (p) {
      if (!reduce) {
        p.x += p.vx; p.y += p.vy;
        if (Math.abs(p.x - cx) > s * .65) p.vx *= -1;
        if (Math.abs(p.y - cy) > s * .6) p.vy *= -1;
      }
      return { x: p.x + (p.tx - p.x) * m, y: p.y + (p.ty - p.y) * m };
    });
    var L = s * (.16 - .06 * m), i, j;
    ctx.lineWidth = 1;
    for (i = 0; i < P.length; i++) for (j = i + 1; j < P.length; j++) {
      var dd = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
      if (dd < L) {
        ctx.strokeStyle = 'rgba(' + (m > .5 ? BLUE : NAVY) + ',' + ((1 - dd / L) * (.22 + .2 * m)) + ')';
        ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y); ctx.stroke();
      }
    }
    P.forEach(function (p, k) {
      var hi = k % 7 === 0;
      ctx.fillStyle = 'rgba(' + (hi ? BLUE : NAVY) + ',' + (hi ? .7 : .4) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, hi ? 3.2 : 2.2, 0, 7); ctx.fill();
    });
    soften();
  }

  function loop(now) {
    if (reduce) { running = false; return; }
    draw(now - t0);
    requestAnimationFrame(loop);
  }
  // Con "reducir movimiento" se queda quieta, mostrando la B
  function render() {
    if (reduce) draw(10000);
    else if (!running) { running = true; requestAnimationFrame(loop); }
  }

  // En el celular la barra del navegador cambia el alto al bajar: solo rehacer si cambia el ancho o mucho el alto
  var lastW = 0, lastH = 0;
  function onResize() {
    if (window.innerWidth === lastW && Math.abs(window.innerHeight - lastH) < 150) return;
    lastW = window.innerWidth; lastH = window.innerHeight;
    blocks = [].slice.call(document.querySelectorAll(TXT));
    build(); if (reduce) draw(10000);
  }
  window.addEventListener('resize', onResize);
  mqReduce.addEventListener && mqReduce.addEventListener('change', function (e) { reduce = e.matches; render(); });
  onResize(); render();
  // Con "reducir movimiento" el dibujo está quieto: rehacerlo al bajar para que el suavizado siga al texto
  window.addEventListener('scroll', function () { if (reduce) draw(10000); }, { passive: true });
})();
