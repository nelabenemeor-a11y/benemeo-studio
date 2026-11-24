/* Benemeo Studio — celular de la portada que se puede usar (2026-11-02). Sin dependencias.
   Inicio → Precios → Día y hora → mensaje de WhatsApp ya armado. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var tv = $('.hero__stage.tv');
  if (!tv) return;

  var screens = $$('.screen[data-tv]', tv), cap = $('.tv__cap', tv), end = $('.tv__end', tv), msg = $('#tv-msg');
  var pick = { svc: 'una limpieza facial', day: 'jueves', hour: '10:00' };

  var show = function (n) {
    screens.forEach(function (s) {
      var on = s.getAttribute('data-tv') === String(n);
      s.classList.toggle('is-on', on);
      s.setAttribute('aria-hidden', String(!on));
      if ('inert' in s) s.inert = !on;
    });
    // De vuelta al inicio, la flechita "Toca aquí" vuelve a aparecer
    tv.classList.toggle('is-live', n !== 0);
    var done = n === 3;
    if (done) {
      msg.textContent = 'Hola, quiero ' + pick.svc + ' el ' + pick.day + ' a las ' + pick.hour + '.';
      var wa = $('.tv-wa', tv); wa.classList.remove('is-in'); void wa.offsetWidth; wa.classList.add('is-in');
    }
    cap.hidden = done; end.hidden = !done;
    var first = $('.screen.is-on button', tv);
    if (first && document.activeElement && tv.contains(document.activeElement)) first.focus({ preventScroll: true });
  };

  // Grupos de opciones: uno elegido a la vez
  var group = function (sel, key, attr) {
    var items = $$(sel, tv);
    items.forEach(function (b) {
      b.addEventListener('click', function () {
        items.forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
        pick[key] = b.getAttribute(attr);
      });
    });
  };
  group('.tv-svc', 'svc', 'data-svc');
  group('.tv-day', 'day', 'data-day');
  group('.tv-hour[data-hour]', 'hour', 'data-hour');

  $$('[data-go]', tv).forEach(function (b) {
    b.addEventListener('click', function () { show(+b.getAttribute('data-go')); });
  });

  // Las pantallas ocultas no se pueden tocar ni recorrer con el teclado
  screens.forEach(function (s, i) { if (i && 'inert' in s) s.inert = true; });
})();
