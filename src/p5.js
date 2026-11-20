
  /* ----------------------------------------------------------- the editor */
  class ThermoTrendCardEditor extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config = {}; this._hass = null; this._tab = 'casa'; this._last = ''; this._built = false;
      this.shadowRoot.addEventListener('click', (e) => this._click(e));
      this.shadowRoot.addEventListener('change', (e) => this._change(e));
      this.shadowRoot.addEventListener('input', (e) => this._input(e));
    }
    setConfig(config) {
      const j = JSON.stringify(config || {});
      if (this._built && j === this._last) return;
      this._config = clone(config || {}); this._last = j; this._render();
    }
    set hass(h) {
      const first = !this._hass; this._hass = h;
      if (first && this._built) this._render();
      else this.shadowRoot.querySelectorAll('ha-selector').forEach((s) => { s.hass = h; });
    }
    get hass() { return this._hass; }

    _emit(cfg) {
      this._config = cfg; this._last = JSON.stringify(cfg);
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg }, bubbles: true, composed: true }));
    }
    _norm() { try { return normalizeConfig(this._config); } catch (e) { return normalizeConfig({}); } }
    _set(key, value) { const c = clone(this._config); if (value === undefined || value === '') delete c[key]; else c[key] = value; this._emit(c); }
    _setMod(k, patch) {
      const n = this._norm(), c = clone(this._config);
      c.modules = c.modules || {};
      c.modules[k] = Object.assign({}, n.modules[k], patch);
      c.order = n.order;
      this._emit(c);
    }
    _field(label, inner, help) { return '<div class="field"><div class="label">' + esc(label) + '</div>' + inner + (help ? '<div class="tiny">' + esc(help) + '</div>' : '') + '</div>'; }
    _check(id, label, help, on) { return '<div class="row"><label for="' + id + '">' + esc(label) + (help ? '<div class="muted">' + esc(help) + '</div>' : '') + '</label><input type="checkbox" id="' + id + '" ' + (on ? 'checked' : '') + '></div>'; }

    _casa(n) {
      return '<div class="heading">' + esc(T('e_home')) + '</div><div class="desc">' + esc(T('e_home_d')) + '</div>' +
        this._check('hero', T('e_hero'), T('e_hero_d'), n.hero) +
        this._check('chart', T('e_chart'), T('e_chart_d'), n.chart) +
        this._check('compare', T('e_cmp'), T('e_cmp_d'), n.compare) +
        this._check('legend', T('e_leg'), T('e_leg_d'), n.legend) +
        this._field(T('e_comf'), '<div class="two"><input class="input" type="number" step="0.5" id="comfort_min" value="' + n.comfort_min + '" aria-label="' + esc(T('e_cmin')) + '"><input class="input" type="number" step="0.5" id="comfort_max" value="' + n.comfort_max + '" aria-label="' + esc(T('e_cmax')) + '"></div>', T('e_comf_d'));
    }
    _moduli(n) {
      let h = '<div class="heading">' + esc(T('e_mods')) + '</div><div class="desc">' + esc(T('e_mods_d')) + '</div>';
      n.order.forEach((k, i) => {
        const m = n.modules[k];
        h += '<div class="mod"><div class="mh"><div class="nm">' + esc(T('m_' + k)) + '</div><div class="ctl"><button type="button" class="action" data-move="' + i + ':-1" aria-label="' + esc(T('up')) + ' · ' + esc(T('m_' + k)) + '" ' + (i === 0 ? 'disabled' : '') + '>↑</button><button type="button" class="action" data-move="' + i + ':1" aria-label="' + esc(T('down')) + ' · ' + esc(T('m_' + k)) + '" ' + (i === n.order.length - 1 ? 'disabled' : '') + '>↓</button></div></div>' +
          '<div class="muted" style="margin-top:6px">' + esc(T('m_' + k + '_d')) + '</div>' +
          '<div class="mb"><div class="chk"><input type="checkbox" id="on-' + k + '" data-on="' + k + '" ' + (m.on ? 'checked' : '') + '><label for="on-' + k + '">' + esc(T('m_on')) + '</label></div>' +
          '<div data-slot="mod-' + k + '"></div>' + this._roomPick(k, m) + '</div></div>';
      });
      return h;
    }
    // Rooms (Home Assistant areas) that hold compatible sensors not yet in the module.
    _roomsFor(k, m) {
      const h = this._hass, f = MODS[k].sel && MODS[k].sel.filter;
      if (!h || !h.states || !h.areas || ROOM_MODS.indexOf(k) < 0 || !f) return [];
      const out = {};
      Object.keys(h.states).forEach((id) => {
        if (m.entities.indexOf(id) >= 0) return;
        const st = h.states[id], dc = st && st.attributes && st.attributes.device_class;
        const ok = f.some((x) => x.domain === id.split('.')[0] && (!x.device_class || [].concat(x.device_class).indexOf(dc) >= 0));
        if (!ok) return;
        const a = areaOf(h, id);
        if (a) (out[a.id] = out[a.id] || { id: a.id, name: a.name, ids: [] }).ids.push(id);
      });
      return Object.keys(out).map((x) => out[x]).sort((x, y) => x.name.localeCompare(y.name, CUR));
    }
    _roomPick(k, m) {
      const rs = this._roomsFor(k, m);
      if (!rs.length) return '';
      return '<div class="field"><div class="label">' + esc(T('m_room')) + '</div><select class="input" data-room="' + k + '"><option value="">' + esc(T('m_room_ph')) + '</option>' + rs.map((r) => '<option value="' + esc(r.id) + '">' + esc(r.name) + ' (' + r.ids.length + ')</option>').join('') + '</select><div class="tiny">' + esc(T('m_room_d')) + '</div></div>';
    }
    _aspetto(n) {
      return '<div class="heading">' + esc(T('e_look')) + '</div>' +
        this._field(T('e_eye'), '<input class="input" type="text" id="eyebrow" maxlength="60" value="' + esc(n.eyebrow) + '">') +
        this._field(T('e_ttl'), '<input class="input" type="text" id="title" maxlength="60" value="' + esc(n.title == null ? T('title') : n.title) + '">', T('e_ttl_d')) +
        this._check('show_eyebrow', T('e_se'), '', n.show_eyebrow) +
        this._check('show_title', T('e_st'), '', n.show_title) +
        this._check('cw', T('e_full'), T('e_full_d'), n.width === 'full') +
        this._field(T('e_theme'), '<select class="input" id="theme">' + [['auto', T('th_auto')], ['light', 'Light Edera'], ['dark', 'Dark Edera']].map((o) => '<option value="' + o[0] + '" ' + (n.theme_mode === o[0] ? 'selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select>') +
        this._field(T('e_lang'), '<select class="input" id="language">' + [['auto', T('e_lang_auto')]].concat(LANGS).map((o) => '<option value="' + o[0] + '" ' + (n.language === o[0] ? 'selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select>', T('e_lang_d'));
    }
    _mount(slot, selector, value, cb) {
      const el = document.createElement('ha-selector');
      el.hass = this._hass; el.selector = selector; el.value = value; el.required = false;
      el.addEventListener('value-changed', (ev) => { ev.stopPropagation(); cb(ev.detail ? ev.detail.value : undefined); });
      slot.appendChild(el);
    }
    _render() {
      const n = this._norm(), t = this._tab;
      CUR = pickLang(n.language, this._hass);
      const act = this.shadowRoot.activeElement ? this.shadowRoot.activeElement.id : '';
      this.shadowRoot.innerHTML = '<style>' + EDITOR_CSS + '</style><div class="ed"><div class="tabs" role="group" aria-label="' + esc(T('secs')) + '">' +
        [['casa', T('tab_home')], ['moduli', T('tab_mods')], ['aspetto', T('tab_look')]].map((a) => '<button type="button" class="tab" data-tab="' + a[0] + '" id="t-' + a[0] + '" aria-pressed="' + (t === a[0]) + '">' + esc(a[1]) + '</button>').join('') + '</div>' +
        (t === 'casa' ? this._casa(n) : t === 'moduli' ? this._moduli(n) : this._aspetto(n)) + '</div>';
      this._built = true;
      const sl = (name) => this.shadowRoot.querySelector('[data-slot="' + name + '"]');
      MOD_ORDER.forEach((k) => {
        const s = sl('mod-' + k);
        if (s) this._mount(s, { entity: Object.assign({ multiple: true }, MODS[k].sel) }, n.modules[k].entities, (v) => this._setMod(k, { entities: Array.isArray(v) ? v : [] }));
      });
      if (act) { const el = this.shadowRoot.getElementById(act); if (el && !el.disabled) el.focus({ preventScroll: true }); }
    }
    _click(e) {
      let t = e.target.closest('[data-tab]'); if (t) { this._tab = t.dataset.tab; this._render(); return; }
      t = e.target.closest('[data-move]');
      if (t) {
        const a = t.dataset.move.split(':').map(Number), i = a[0], j = i + a[1], n = this._norm();
        if (j < 0 || j >= n.order.length) return;
        const o = n.order.slice(), tmp = o[i]; o[i] = o[j]; o[j] = tmp;
        const c = clone(this._config); c.order = o; this._emit(c); this._render();
      }
    }
    _change(e) {
      const el = e.target, c = clone(this._config);
      if (el.dataset && el.dataset.on) { this._setMod(el.dataset.on, { on: el.checked }); return; }
      const bools = ['show_eyebrow', 'show_title', 'hero', 'chart', 'compare', 'legend'];
      if (bools.indexOf(el.id) >= 0) { c[el.id] = el.checked; this._emit(c); return; }
      if (el.id === 'comfort_min' || el.id === 'comfort_max') {
        const v = parseFloat(el.value);
        if (isFinite(v)) { c[el.id] = v; this._emit(c); }
        this._render();
        return;
      }
      if (el.id === 'cw') { c.width = el.checked ? 'full' : 'center'; this._emit(c); return; }
      if (el.id === 'theme') { c.theme_mode = el.value; this._emit(c); return; }
      if (el.id === 'language') { if (el.value === 'auto') delete c.language; else c.language = el.value; this._emit(c); this._render(); return; }
      if (el.dataset && el.dataset.room && el.value) {
        const k = el.dataset.room, n = this._norm(), r = this._roomsFor(k, n.modules[k]).filter((x) => x.id === el.value)[0];
        if (r) { this._setMod(k, { entities: n.modules[k].entities.concat(r.ids) }); this._render(); }
      }
    }
    _input(e) {
      const el = e.target;
      if (el.id === 'eyebrow') this._set('eyebrow', el.value);
      else if (el.id === 'title') this._set('title', el.value);
    }
  }

  if (!customElements.get(TAG)) customElements.define(TAG, ThermoTrendCard);
  if (!customElements.get(EDITOR_TAG)) customElements.define(EDITOR_TAG, ThermoTrendCardEditor);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === TAG)) {
    window.customCards.push({ type: TAG, name: 'Thermo Trend Card', description: 'Home temperatures: room trend, comfort range and comparison with the previous period.', preview: true });
  }
  // eslint-disable-next-line no-console
  console.info('%c THERMO-TREND-CARD %c ' + VERSION + ' ', 'color:#fff;background:#0a7156;font-weight:700', 'color:#0a7156;background:#fff');
})();
