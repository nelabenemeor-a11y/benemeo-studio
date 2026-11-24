/* Benemeo Studio — comportamiento. Sin dependencias. */
(function () {
  'use strict';
  var root = document.documentElement;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = mqReduce.matches;
  if (reduce) root.classList.add('rm');
  mqReduce.addEventListener && mqReduce.addEventListener('change', function (e) {
    reduce = e.matches; root.classList.toggle('rm', reduce);
  });
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Menú móvil ---------- */
  var btn = $('.menu-btn'), nav = $('#nav');
  if (btn && nav) {
    var setMenu = function (open) { btn.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); };
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Menú activo ---------- */
  var sections = [], links = $$('.nav a[data-spy]');
  links.forEach(function (a) {
    var id = a.getAttribute('data-spy');
    var el = id === 'top' ? document.body : document.getElementById(id);
    sections.push({ id: id, el: el, a: a });
  });
  var frameQ = false;
  function frame() {
    frameQ = false;
    var cur = 'top', line = window.innerHeight * 0.35;
    sections.forEach(function (s) { if (s.id !== 'top' && s.el && s.el.getBoundingClientRect().top <= line) cur = s.id; });
    sections.forEach(function (s) { s.a.classList.toggle('active', s.id === cur); });
  }
  function queueFrame() { if (!frameQ) { frameQ = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', queueFrame, { passive: true });
  window.addEventListener('resize', queueFrame);
  queueFrame();

  /* ---------- Demostración: ventana de navegador (pasos 1-2) que se convierte en teléfono (paso 3) ---------- */
  var demo = $('#demostracion'), stage = $('#demo-stage'), screens = $('#demo-screens'), stepsEl = $('#demo-steps'), addr = $('#demo-addr');
  var N = 3, current = -1, demoVisible = false, dTick = false;
  var addrText = ['google.com', 'benemeo.com'];
  function setStep(i) {
    if (i === current) return;
    current = i;
    stage.setAttribute('data-device', i < 2 ? 'browser' : 'phone');
    screens.setAttribute('data-step', String(Math.min(i, 1)));
    [].forEach.call(screens.children, function (s, k) { s.classList.toggle('is-on', k === Math.min(i, 1)); });
    if (addr) addr.textContent = addrText[Math.min(i, 1)];
    [].forEach.call(stepsEl.children, function (li, k) {
      li.classList.toggle('is-on', k === i);
      var b = li.querySelector('button'); if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
  }
  function progress() {
    var r = demo.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  }
  function isSticky() { return getComputedStyle(demo.firstElementChild).position === 'sticky'; }
  function demoFrame() {
    dTick = false;
    if (reduce || !demoVisible || !isSticky()) return;
    var p = progress();
    setStep(Math.min(N - 1, Math.floor(p * N)));
    stage.style.setProperty('--ry', (16 - p * 32).toFixed(2) + 'deg');
    stage.style.setProperty('--rx', (7 - Math.sin(p * Math.PI) * 5).toFixed(2) + 'deg');
  }
  function queueDemo() { if (!dTick) { dTick = true; requestAnimationFrame(demoFrame); } }
  if (demo && stage && screens && stepsEl) {
    setStep(0);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { demoVisible = e[0].isIntersecting; if (demoVisible) queueDemo(); }, { threshold: 0 }).observe(demo);
    } else { demoVisible = true; }
    window.addEventListener('scroll', queueDemo, { passive: true });
    window.addEventListener('resize', queueDemo);
    var goStep = function (e) {
      var b = e.target.closest && e.target.closest('button[data-go]'); if (!b) return;
      setStep(parseInt(b.getAttribute('data-go'), 10));
    };
    stepsEl.addEventListener('mouseover', goStep);
    stepsEl.addEventListener('focusin', goStep);
    stepsEl.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-go]'); if (!b) return;
      var i = parseInt(b.getAttribute('data-go'), 10);
      if (reduce || !isSticky()) { setStep(i); return; }
      var top = demo.getBoundingClientRect().top + window.scrollY;
      var total = demo.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + total * ((i + 0.5) / N), behavior: 'smooth' });
    });
    queueDemo();
  }

  /* Buscador de la demostración: seleccionar el texto al entrar para escribir encima */
  $$('.s-bar input').forEach(function (gq) {
    gq.addEventListener('focus', function () { gq.select(); });
    gq.addEventListener('input', function () {
      if (gq.value === '') { gq.value = gq.defaultValue; gq.select(); }
    });
  });

  /* ---------- Elegir paquete desde las tarjetas ---------- */
  $$('[data-plan]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = document.getElementById('f-paquete');
      if (sel) sel.value = a.getAttribute('data-plan');
    });
  });

  /* ---------- Formulario: validación clara y éxito solo con respuesta real ---------- */
  var form = $('form.form');
  if (form) {
    var status = $('.form__status', form);
    var WA = 'https://wa.me/50662929038?text=Hola%20Marianela%2C%20quiero%20mi%20propuesta%20gratis';
    var msgs = { nombre: 'Escribe tu nombre.', pais: 'Elige tu país.', proyecto: 'Cuéntame de tu proyecto.', material: 'Elige una opción.', accion: 'Elige una opción.', paquete: 'Elige una opción.', contacto: 'Escribe tu WhatsApp o correo.', acepto: 'Necesito tu aceptación para poder responderte.' };
    var clearErr = function (f) { f.classList.remove('has-error'); var e = $('.field__err', f); if (e) e.remove(); var c = $('[aria-invalid]', f); if (c) { c.removeAttribute('aria-invalid'); c.removeAttribute('aria-describedby'); } };
    var setErr = function (input) {
      var f = input.closest('.field'); clearErr(f);
      var p = document.createElement('p'); p.className = 'field__err'; p.id = 'err-' + input.name; p.textContent = msgs[input.name] || 'Revisa este campo.';
      f.appendChild(p); f.classList.add('has-error'); input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', p.id);
    };
    form.addEventListener('input', function (e) { var f = e.target.closest('.field'); if (f && f.classList.contains('has-error')) clearErr(f); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      $$('[required]', form).forEach(function (inp) {
        var bad = inp.type === 'checkbox' ? !inp.checked : !inp.value.trim();
        if (bad) { setErr(inp); firstBad = firstBad || inp; } else { clearErr(inp.closest('.field')); }
      });
      status.className = 'form__status';
      if (firstBad) { status.textContent = 'Revisa los campos marcados.'; status.classList.add('err'); firstBad.focus(); return; }
      var submit = $('[type=submit]', form); submit.disabled = true; status.textContent = 'Enviando…';
      var body = new URLSearchParams(new FormData(form)).toString();
      /* La web está en GitHub Pages; los envíos siguen llegando a Netlify Forms (proyecto zingy-paprenjak-99df51),
         con su aviso por correo. Netlify no devuelve permisos CORS, por eso se envía en modo no-cors:
         solo un fallo de red cuenta como error. */
      fetch('https://zingy-paprenjak-99df51.netlify.app/', { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function () {
          form.reset(); status.classList.add('ok');
          if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'propuesta-enviada', title: 'Formulario de propuesta enviado', event: true });
          status.textContent = '¡Listo! Recibí tus datos. Te respondo pronto con tu propuesta.'; status.focus();
        })
        .catch(function () {
          status.classList.add('err');
          status.innerHTML = 'No se pudo enviar el formulario. Puedes escribirme directo por <a href="' + WA + '" rel="noopener">WhatsApp</a>.';
          status.focus();
        })
        .finally(function () { submit.disabled = false; });
    });
  }
})();
