/* Benemeo Studio — "Qué incluye" de cada paquete: se abre en la misma tarjeta y se cierra con ✕ (2026-11-02).
   Transición suave: lo de antes se desvanece, la tarjeta cambia de alto despacio y lo nuevo sube y aparece. */
(function () {
  'use strict';
  var OUT = 220, IN = 520;
  var reduce = function () { return document.documentElement.classList.contains('rm') || window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  [].forEach.call(document.querySelectorAll('.pk'), function (card) {
    var face = card.querySelector('.pk__face'), detail = card.querySelector('.pk__detail');
    var more = card.querySelector('.pk__more'), close = card.querySelector('.pk__close');
    if (!face || !detail || !more || !close) return;
    var grid = card.parentNode, busy = false;

    // Mientras una tarjeta está abierta, las demás conservan su alto de cerradas (no se encogen de golpe)
    var syncGrid = function () {
      var anyOpen = !!grid.querySelector('.pk.is-open');
      if (anyOpen && !grid.classList.contains('has-open')) {
        [].forEach.call(grid.querySelectorAll('.pk'), function (c) { c.style.setProperty('--pk-h0', c.offsetHeight + 'px'); });
      }
      grid.classList.toggle('has-open', anyOpen);
    };

    var swap = function (open) {
      face.hidden = open; detail.hidden = !open;
      card.classList.toggle('is-open', open);
      more.setAttribute('aria-expanded', String(open));
    };

    var set = function (open) {
      if (busy) return;
      var from = open ? face : detail, to = open ? detail : face;
      if (reduce()) { swap(open); syncGrid(); (open ? close : more).focus({ preventScroll: true }); return; }
      busy = true;
      var h0 = card.offsetHeight;
      if (open) { card.classList.add('is-open'); syncGrid(); }
      card.style.height = h0 + 'px';
      from.classList.add('pk-out');
      setTimeout(function () {
        from.classList.remove('pk-out');
        to.classList.add('pk-pre');
        swap(open); syncGrid();
        card.style.height = 'auto';
        var h1 = card.offsetHeight;
        card.style.height = h0 + 'px';
        void card.offsetHeight;
        card.classList.add('pk-grow');
        card.style.height = h1 + 'px';
        setTimeout(function () { to.classList.remove('pk-pre'); }, 20);
        (open ? close : more).focus({ preventScroll: true });
        setTimeout(function () {
          card.classList.remove('pk-grow'); card.style.height = '';
          if (!grid.classList.contains('has-open')) [].forEach.call(grid.querySelectorAll('.pk'), function (c) { c.style.removeProperty('--pk-h0'); });
          busy = false;
          // Al cerrar, que la tarjeta quede a la vista si el detalle era largo
          if (!open && card.getBoundingClientRect().top < 0) card.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }, IN);
      }, OUT);
    };

    more.addEventListener('click', function () { set(true); });
    close.addEventListener('click', function () { set(false); });
    card.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !detail.hidden) set(false); });
  });
})();

/* Mantenimiento en la portada: "Ver planes +" abre los dos planes ahí mismo (la animación la hace el CSS) */
(function () {
  'use strict';
  var mt = document.querySelector('.mt'), btn = mt && mt.querySelector('.mt__btn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var open = !mt.classList.contains('is-open');
    mt.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.firstChild.nodeValue = open ? 'Cerrar ' : 'Ver planes ';
  });
})();
/* "Qué incluye": cada letra en su propia cajita para el salto en ola (el efecto lo hace el CSS) */
(function () {
  'use strict';
  [].forEach.call(document.querySelectorAll('.pk__more'), function (btn) {
    var txt = btn.firstChild;
    if (!txt || txt.nodeType !== 3) return;
    var label = txt.nodeValue.replace(/\s+$/, ''), frag = document.createDocumentFragment(), wrap = document.createElement('span');
    wrap.className = 'pk-word';
    label.split('').forEach(function (ch, i) { var s = document.createElement('span'); s.className = 'pk-l'; s.style.setProperty('--i', i); s.textContent = ch; wrap.appendChild(s); });
    btn.setAttribute('aria-label', label);
    frag.appendChild(wrap); frag.appendChild(document.createTextNode(' '));
    btn.replaceChild(frag, txt);
  });
})();