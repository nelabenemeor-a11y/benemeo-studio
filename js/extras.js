/* Benemeo Studio — mejoras "ultra plus" de la web propia (2026-10-29). Sin dependencias.
   1) "Mira tu negocio aquí"  2) videos de ejemplos  3) recomendador de paquete  4) WhatsApp flotante */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var reduce = function () { return document.documentElement.classList.contains('rm'); };
  var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- 1. Mira tu negocio aquí ---------- */
  var RUBROS = {
    estetica: { kind: 'Estética y spa', title: 'Un momento <em>para ti</em>', text: 'Masajes, faciales, cejas, pestañas y maquillaje en un mismo lugar.', badge: '10 años de experiencia', btn: 'Reservar mi cita', cards: ['Masajes', 'Faciales', 'Cejas y pestañas'], nav: ['Servicios', 'Paquetes', 'Reservar'], c: ['#f6fcfb', '#2d2450', '#6c54b4', '#e3f4f1'] },
    pasteleria: { kind: 'Pastelería', title: 'Dulces que <em>encantan</em>', text: 'Queques, tortas frías y mesas de dulces para cada ocasión.', badge: 'Pedidos con 3 días', btn: 'Arma tu queque', cards: ['Queques', 'Tortas frías', 'Galletas'], nav: ['Queques', 'Pedidos', 'Contacto'], c: ['#fff8f2', '#3b2420', '#b4436c', '#fbe4ec'] },
    dental: { kind: 'Clínica dental', title: 'Tu sonrisa, <em>en buenas manos</em>', text: 'Limpiezas, blanqueamiento y ortodoncia, con atención sin miedo.', badge: 'Valoración gratis', btn: 'Agendar cita', cards: ['Limpieza', 'Blanqueamiento', 'Ortodoncia'], nav: ['Tratamientos', 'Agendar'], c: ['#f7f3ec', '#10302d', '#0f766e', '#e3f3ef'] },
    comida: { kind: 'Restaurante', title: 'Sabores que <em>vuelven</em>', text: 'Menú del día, pedidos para llevar y reservas por WhatsApp.', badge: 'Abierto hoy', btn: 'Ver el menú', cards: ['Menú', 'Para llevar', 'Reservas'], nav: ['Menú', 'Pedidos', 'Reservar'], c: ['#fbf7f1', '#2a1d14', '#c2410c', '#fde7d6'] },
    otro: { kind: 'Tu negocio', title: 'Tus clientes <em>te encuentran</em>', text: 'Lo que vendes, tus precios y un botón directo a tu WhatsApp.', badge: 'Respuesta rápida', btn: 'Escríbeme', cards: ['Servicios', 'Precios', 'Contacto'], nav: ['Servicios', 'Contacto'], c: ['#f5f7fb', '#0B1B3A', '#2563EB', '#eef3ff'] }
  };
  var scr = $('#hero-phone .s-spa'), tryit = $('.tryit');
  if (scr && tryit) {
    var nameIn = $('#try-name', tryit), go = $('.tryit__go', tryit), goLink = $('a', go), cap = $('.hero__stage .caption');
    var capHTML = cap ? cap.innerHTML : '';
    var rubro = 'estetica';
    var paint = function (animate) {
      var r = RUBROS[rubro], name = nameIn.value.trim().slice(0, 28), custom = name !== '' || rubro !== 'estetica';
      var shown = name || (rubro === 'estetica' ? 'Esencia' : 'Tu negocio');
      ['--b-bg', '--b-ink', '--b-acc', '--b-soft'].forEach(function (v, i) { scr.style.setProperty(v, r.c[i]); });
      $('.s-brand b', scr).textContent = shown;
      var logo = $('.s-logo', scr), img = $('.s-brand img', scr);
      if (custom) { img.hidden = true; logo.hidden = false; $('span', logo).textContent = shown.charAt(0).toUpperCase(); }
      else { img.hidden = false; logo.hidden = true; }
      $('.s-spa__top > span:last-child', scr).innerHTML = r.nav.map(function (n) { return '<i>' + esc(n) + '</i>'; }).join('');
      $('small', scr).textContent = r.kind;
      // Con nombre escrito, el nombre es el título grande del celular
      var st = $('strong', scr);
      if (name) { st.textContent = name; st.classList.add('is-name'); }
      else { st.innerHTML = r.title; st.classList.remove('is-name'); }
      $('p', scr).textContent = r.text;
      // Vista de cómo aparecería en Google
      var g = $('.gres', tryit);
      if (g) {
        g.hidden = !name;
        if (name) {
          var slug = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '') || 'tunegocio';
          $('.gres__url', g).textContent = slug + '.com';
          $('.gres__ico', g).textContent = name.charAt(0).toUpperCase();
          $('.gres__t', g).textContent = name + ' · ' + r.kind;
          $('.gres__d', g).textContent = r.text + ' Escríbenos por WhatsApp.';
        }
      }
      $('.s-spa__exp', scr).textContent = r.badge;
      $('.s-spa__btn', scr).textContent = r.btn;
      $('.s-spa__cards', scr).innerHTML = r.cards.map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('');
      $('#hero-phone').setAttribute('aria-label', custom ? 'Vista de muestra: así se vería la web de ' + shown + ' (' + r.kind.toLowerCase() + ') en un celular' : 'Ilustración: la web de ejemplo Esencia Estética & Spa en un celular');
      if (cap) cap.innerHTML = custom ? 'Así se vería <b>' + esc(shown) + '</b> · vista de muestra' : capHTML;
      go.classList.toggle('is-on', custom);
      if (animate && !reduce()) { scr.classList.remove('is-swap'); void scr.offsetWidth; scr.classList.add('is-swap'); }
    };
    var t;
    nameIn.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { paint(false); }, 120); });
    $$('.chip', tryit).forEach(function (b) {
      b.addEventListener('click', function () {
        rubro = b.getAttribute('data-rubro');
        $$('.chip', tryit).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        paint(true);
      });
    });
    goLink.addEventListener('click', function () {
      var neg = $('#f-negocio'), r = RUBROS[rubro], name = nameIn.value.trim();
      if (neg && !neg.value.trim()) neg.value = (name ? name + ' · ' : '') + r.kind + (rubro === 'otro' ? '' : '.') + ' ';
    });
  }

  /* ---------- 2. Videos de los ejemplos: solo se reproducen cuando se ven ---------- */
  var vids = $$('.ex__vid video');
  if (vids.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !reduce()) { if (v.preload === 'none') { v.preload = 'auto'; } var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: .35 });
    vids.forEach(function (v) { io.observe(v); });
  }

  /* ---------- 3. Recomendador de paquete ---------- */
  var reco = $('#reco');
  if (reco) {
    var QS = [
      { q: '¿Qué necesitas que haga tu web?', o: ['Que me encuentren y me escriban', 'Mostrar bien mis servicios o productos', 'Que mis clientes elijan, prueben o reserven solos'] },
      { q: '¿Cuántos servicios o productos quieres mostrar?', o: ['Pocos, hasta 5', 'Varios, de 6 a 20', 'Muchos, con categorías'] },
      { q: '¿Qué tanto quieres destacar frente a tu competencia?', o: ['Algo claro y profesional', 'Verme mejor que mi competencia', 'Que nadie tenga una web como la mía'] }
    ];
    var PLANS = {
      'Despega': { price: '<span>USD</span> 235', why: 'Tu negocio necesita que lo encuentren y te escriban. Una web de una página, clara y directa a tu WhatsApp, es justo lo que te sirve.' },
      'Crece': { price: '<span>USD</span> 460', why: 'Tienes varias cosas que mostrar. Con textos escritos para vender, galería, preguntas frecuentes y formulario, tus clientes llegan con todo claro.' },
      'Ultra Plus': { price: '<span>desde USD</span> 770', why: 'Quieres que tus clientes te prueben antes de llegar. Con portada en video y herramientas como un recomendador, una agenda o un simulador, tu web se vuelve inolvidable.' }
    };
    var body = $('.reco__body', reco), bar = $('.reco__bar i', reco), count = $('.reco__count', reco), ans = [];
    var pick = function () {
      if (ans[0] === 2 || ans[2] === 2) return 'Ultra Plus';
      return ans[0] + ans[1] + ans[2] <= 1 ? 'Despega' : 'Crece';
    };
    var show = function (i, focus) {
      bar.style.width = (i / QS.length * 100) + '%';
      $$('.plan').forEach(function (p) { p.classList.remove('is-picked'); });
      if (i < QS.length) {
        count.textContent = 'Pregunta ' + (i + 1) + ' de ' + QS.length;
        body.innerHTML = '<div class="reco__step"><p class="reco__q" tabindex="-1">' + QS[i].q + '</p><div class="reco__opts">' +
          QS[i].o.map(function (t, k) { return '<button type="button" class="reco__opt" data-k="' + k + '">' + t + '</button>'; }).join('') + '</div></div>';
        if (focus) $('.reco__q', body).focus({ preventScroll: true });
        return;
      }
      var name = pick(), p = PLANS[name];
      // El precio sale de la tarjeta del paquete, para que siempre coincida
      var cardPrice = $$('.plan[data-price]').filter(function (c) { return $('h3', c).textContent.trim() === name; })[0];
      if (cardPrice) p = { price: cardPrice.getAttribute('data-price'), why: p.why };
      count.textContent = 'Tu recomendación';
      body.innerHTML = '<div class="reco__step reco__res"><h4 tabindex="-1">' + name + '</h4><p class="price">' + p.price + '</p><p class="reco__why">' + p.why + '</p>' +
        '<div class="reco__acts"><a class="btn btn--primary" href="#propuesta" data-reco="' + name + '">Quiero ' + name + '</a><button type="button" class="reco__again">Volver a empezar</button></div></div>';
      var card = $$('.plan').filter(function (c) { return $('h3', c).textContent.trim() === name; })[0];
      if (card) card.classList.add('is-picked');
      if (focus) $('h4', body).focus({ preventScroll: true });
    };
    body.addEventListener('click', function (e) {
      var o = e.target.closest('.reco__opt');
      if (o) { ans.push(+o.getAttribute('data-k')); show(ans.length, true); return; }
      if (e.target.closest('.reco__again')) { ans = []; show(0, true); return; }
      var a = e.target.closest('[data-reco]');
      if (a) { var sel = $('#f-paquete'); if (sel) sel.value = a.getAttribute('data-reco'); }
    });
    show(0, false);
  }

  /* ---------- 4. WhatsApp flotante: aparece al pasar la portada ---------- */
  var wa = $('.wa-float'), hero = $('#inicio');
  if (wa && hero) {
    var onScroll = function () { wa.classList.toggle('is-on', hero.getBoundingClientRect().bottom < 80); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
  /* ---------- 6. Redes del formulario: al marcar una, su campo se abre (CSS); al desmarcarla, se vacía ---------- */
  $$('.soc__chip input').forEach(function (cb) {
    var box = document.getElementById(cb.getAttribute('aria-controls')), inp = box && $('input', box);
    if (!inp) return;
    cb.setAttribute('aria-expanded', 'false');
    cb.addEventListener('change', function () {
      cb.setAttribute('aria-expanded', String(cb.checked));
      if (cb.checked) setTimeout(function () { inp.focus({ preventScroll: true }); }, 120);
      else inp.value = '';
    });
  });

  /* ---------- 7. Al regresar de un ejemplo, volver justo al lugar donde estabas ---------- */
  try {
    var KEY = 'bs-y:' + location.pathname;
    window.addEventListener('pagehide', function () { sessionStorage.setItem(KEY, String(Math.round(window.scrollY))); });
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    var saved = +sessionStorage.getItem(KEY);
    if (nav && nav.type === 'back_forward' && saved > 0) {
      var restore = function () { if (window.scrollY < 10) window.scrollTo({ top: saved, behavior: 'instant' }); };
      restore(); window.addEventListener('load', restore);
    } else if (location.hash.length > 1) {
      // Al llegar desde otra página con #seccion (ej.: "Quiero este paquete"), saltar directo, sin recorrer toda la página
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      var jump = function () { if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'instant' }); };
      if (target) { jump(); window.addEventListener('load', jump); }
    }
  } catch (e) {}

  /* ---------- 5. Paquete elegido desde la página que compara (?paquete=…) ---------- */
  try {
    var pq = new URLSearchParams(location.search).get('paquete'), sel = $('#f-paquete');
    if (pq && sel && [].some.call(sel.options, function (o) { return o.value === pq; })) sel.value = pq;
  } catch (e) {}
})();
