
  /* ------------------------------------------------------------- the card */
  const chipHTML = (d, lg) => {
    const k = arrow(d);
    return '<span class="dc ' + k + (lg ? ' lg' : '') + '"><i>' + ic(ARROW_ICON[k]) + '</i>' + fmt(Math.abs(d)) + '°</span>';
  };
  const hx = (c) => [1, 3, 5].map((i) => parseInt(c.substr(i, 2), 16));
  const mix = (a, b, t) => { const A = hx(a), B = hx(b); return 'rgb(' + A.map((x, i) => Math.round(x + (B[i] - x) * t)).join(',') + ')'; };

  class ThermoTrendCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = '<style>' + CARD_CSS + '</style><div id="r"></div>';
      this._root = this.shadowRoot.getElementById('r');
      this._cfg = null; this._hass = null; this._sig = null;
      this._per = '1'; this._data = {}; this._dver = 0;
      this._popup = false; this._flt = 'att'; this._openR = {}; this._leg = false; this._focus = ''; this._ret = '';
      this._onKey = (e) => this._key(e);
      this._onResize = () => { this._applyLayout(); if (this._popup) this._render(); };
      this._timer = null;
      this.shadowRoot.addEventListener('click', (e) => this._click(e));
    }

    static getStubConfig(hass) {
      const ids = hass && hass.states ? Object.keys(hass.states).filter((i) => i.indexOf('sensor.') === 0 && hass.states[i].attributes && hass.states[i].attributes.device_class === 'temperature').slice(0, 4) : [];
      return { modules: { temps: { on: true, entities: ids } } };
    }
    static getConfigElement() { return document.createElement(EDITOR_TAG); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 12, min_columns: 6 }; }

    setConfig(config) {
      this._cfg = normalizeConfig(config);
      this._sig = null; this._data = {};
      this._render();
      this._maybeData();
    }
    set hass(h) {
      this._hass = h;
      if (!this._cfg) return;
      this._maybeData();
      const sig = this._signature();
      if (sig === this._sig) return;
      this._sig = sig;
      this._render();
    }
    get hass() { return this._hass; }

    connectedCallback() {
      window.addEventListener('resize', this._onResize);
      this._applyLayout();
      this._timer = window.setInterval(() => {
        if (this._cfg && this._hass && !this._popup) { this._maybeData(); this._render(); }
      }, 60000);
    }
    disconnectedCallback() {
      window.removeEventListener('resize', this._onResize);
      document.removeEventListener('keydown', this._onKey, true);
      if (this._timer) window.clearInterval(this._timer);
    }

    _applyLayout() {
      const wide = !IS_PHONE && window.matchMedia('(min-width:640px) and (min-height:600px)').matches;
      this.setAttribute('data-popup', wide ? 'wide' : 'phone');
    }
    _sl() { CUR = pickLang(this._cfg && this._cfg.language, this._hass); return CUR; }
    _wide() { return this.getAttribute('data-popup') === 'wide'; }
    _colCount() {
      if (!this._wide()) return 1;
      const w = Math.min(1120, window.innerWidth - 32) - 44;
      return Math.max(1, Math.min(4, Math.floor((w + 22) / 282)));
    }
    _mode() {
      const m = this._cfg.theme_mode;
      if (m === 'light' || m === 'dark') return m;
      return this._hass && this._hass.themes && this._hass.themes.darkMode ? 'dark' : 'light';
    }
    _allIds() {
      const o = [];
      MOD_ORDER.forEach((k) => { const m = this._cfg.modules[k]; if (m.on) m.entities.forEach((id) => { if (o.indexOf(id) < 0) o.push(id); }); });
      return o;
    }
    _tempIds() { const m = this._cfg.modules.temps; return m.on ? m.entities.slice() : []; }
    _signature() {
      const h = this._hass, c = this._cfg;
      const parts = [this._mode(), pickLang(c.language, h), this._per, this._dver];
      this._allIds().forEach((id) => { const s = stOf(h, id); parts.push(id + ':' + (s ? s.state : '-')); });
      MOD_ORDER.forEach((k) => c.modules[k].entities.forEach((id) => { const a = areaOf(h, id); parts.push(a ? a.id : ''); }));
      return parts.join('|');
    }

    /* ---------------------------------------------------- history loading */
    _maybeData() {
      const h = this._hass, c = this._cfg;
      if (!h || !c || typeof h.callWS !== 'function') return;
      const ids = this._tempIds();
      if (!ids.length) return;
      const per = this._per, key = ids.join(','), d = this._data[per];
      if (d && d.key === key && (d.busy || Date.now() - d.at < 300000)) return;
      this._fetch(per, ids, key);
    }
    _fetch(per, ids, key) {
      const h = this._hass, now = Date.now(), w = windowOf(per, now);
      const slot = { key: key, busy: true, at: now, ok: false, ent: {} };
      this._data[per] = slot;
      const done = (ent, ok) => {
        if (this._data[per] !== slot) return;
        slot.busy = false; slot.ent = ent; slot.ok = ok; this._dver++;
        this._sig = null; this._render();
      };
      const iso = (t) => new Date(t).toISOString();
      let p;
      try {
        if (per === '1') {
          p = Promise.resolve(h.callWS({ type: 'history/history_during_period', start_time: iso(w.prev[0]), end_time: iso(now), entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false })).then((res) => {
            const ent = {};
            ids.forEach((id) => {
              const pts = parseHist(res && res[id]);
              if (pts.length) ent[id] = { cur: bucketHist(pts, w.cur, w.step, w.n), prev: bucketHist(pts, w.prev, w.step, w.n) };
            });
            return ent;
          });
        } else {
          p = Promise.resolve(h.callWS({ type: 'recorder/statistics_during_period', start_time: iso(w.prev[0]), end_time: iso(now), statistic_ids: ids, period: 'hour', types: ['mean', 'min', 'max'] })).then((res) => {
            const ent = {};
            ids.forEach((id) => {
              const rows = res && res[id];
              if (rows && rows.length) ent[id] = { cur: bucketStats(rows, w.cur, w.step, w.n), prev: bucketStats(rows, w.prev, w.step, w.n) };
            });
            return ent;
          });
        }
      } catch (err) { done({}, false); return; }
      p.then((ent) => done(ent, Object.keys(ent).length > 0), () => done({}, false));
    }

    /* ------------------------------------------------------------- model */
    _model() {
      const h = this._hass, cfg = this._cfg, per = this._per, now = Date.now();
      const rooms = buildRooms(h, cfg), w = windowOf(per, now);
      const slot = this._data[per];
      const D = slot && slot.ok && slot.key === this._tempIds().join(',') ? slot : null;
      rooms.forEach((r) => {
        r.d = null; r.mn = null; r.mx = null; r.series = null; r.prevSeries = null;
        if (!D || !r.temps.length) return;
        const es = r.temps.map((id) => D.ent[id]).filter(Boolean);
        if (!es.length) return;
        r.series = meanSeries(es.map((e) => e.cur.b), w.n);
        r.prevSeries = meanSeries(es.map((e) => e.prev.b), w.n);
        const mns = es.map((e) => e.cur.mn).filter((v) => v != null), mxs = es.map((e) => e.cur.mx).filter((v) => v != null);
        r.mn = mns.length ? Math.min.apply(null, mns) : null; r.mx = mxs.length ? Math.max.apply(null, mxs) : null;
        const f0 = firstOf(r.series);
        if (f0 != null && r.cur != null) r.d = r.cur - f0;
      });
      const tr = rooms.filter((r) => r.temps.length && r.cur !== null);
      const house = { unit: tr.length ? tr[0].unit : '°', cur: mean(tr.map((r) => r.cur)), d: mean(tr.map((r) => r.d).filter((v) => v != null)), avg: null, prev: null };
      if (D && tr.length) {
        const ser = tr.map((r) => r.series).filter(Boolean);
        if (ser.length) {
          house.avg = meanSeries(ser, w.n);
          house.prev = meanSeries(tr.map((r) => r.prevSeries).filter(Boolean), w.n);
          const tgt = per === '1' ? Math.min(23, Math.floor((now - w.cur[0]) / HOUR)) : w.n - 1;
          for (let i = tgt + 1; i < w.n; i++) house.avg[i] = null;
          house.avg[tgt] = house.cur;
        }
      }
      return { rooms: rooms, house: house, D: D, w: w, now: now, attn: rooms.filter((r) => r.s === 'hot' || r.s === 'cold' || r.s === 'na') };
    }

    /* -------------------------------------------------------------- chart */
    _axis(m) {
      const per = this._per, w = m.w;
      let a;
      if (per === '1') a = ['00', '06', '12', '18', '24'];
      else if (per === '7') { const d = new Date(w.cur[0]); a = [dfmt(d, { weekday: 'short' }).replace('.', '') + ' ' + d.getDate(), T('today')]; }
      else a = [dfmt(new Date(w.cur[0]), { day: 'numeric', month: 'short' }), T('today')];
      return '<div class="ax">' + a.map((x) => '<span>' + esc(x) + '</span>').join('') + '</div>';
    }
    _chart(m) {
      const cfg = this._cfg, per = this._per, hs = m.house;
      const hold = (msg) => '<svg class="ch" viewBox="0 0 ' + CW + ' ' + CH + '" aria-hidden="true"></svg>' + this._axis(m) + '<div class="cap">' + esc(msg) + '</div>';
      if (!m.D) {
        const slot = this._data[per];
        return hold(T(slot && !slot.busy ? 'nodata' : 'loading'));
      }
      if (!hs.avg || lastIdx(hs.avg) < 1 || hs.avg.filter((v) => v != null).length < 2) return hold(T('nodata'));
      const n = hs.avg.length, li = lastIdx(hs.avg);
      const cmp = cfg.compare && hs.prev && hs.prev.filter((v) => v != null).length >= 2;
      const all = hs.avg.filter((v) => v != null).concat(cmp ? hs.prev.filter((v) => v != null) : []);
      const d0 = Math.min(cfg.comfort_min, Math.min.apply(null, all)) - 0.8, d1 = Math.max(cfg.comfort_max, Math.max.apply(null, all)) + 0.8;
      const x = (i) => PL_ + (per === '1' ? i / 23 : i / (n - 1)) * (CW - PL_ - PR_);
      const y = (v) => PT_ + (1 - (v - d0) / (d1 - d0)) * (CH - PT_ - PB_);
      const path = (vals) => { let s = '', pen = false; vals.forEach((v, i) => { if (v == null) { pen = false; return; } s += (pen ? ' L' : ' M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); pen = true; }); return s.trim(); };
      let s = '<rect x="' + PL_ + '" y="' + y(cfg.comfort_max).toFixed(1) + '" width="' + (CW - PL_ - PR_) + '" height="' + (y(cfg.comfort_min) - y(cfg.comfort_max)).toFixed(1) + '" rx="6" fill="var(--hc-accent)" fill-opacity=".13"/>';
      if (cmp) s += '<path d="' + path(hs.prev) + '" fill="none" stroke="var(--hc-muted)" stroke-width="1.8" stroke-dasharray="4 4" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".8"/>';
      s += '<path d="' + path(hs.avg) + '" fill="none" stroke="var(--hc-accent)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
      if (cmp && hs.prev[li] != null) s += '<circle cx="' + x(li).toFixed(1) + '" cy="' + y(hs.prev[li]).toFixed(1) + '" r="3.2" fill="var(--hc-tile)" stroke="var(--hc-muted)" stroke-width="1.8"/>';
      s += '<circle cx="' + x(li).toFixed(1) + '" cy="' + y(hs.avg[li]).toFixed(1) + '" r="5" fill="var(--hc-fg)" stroke="var(--hc-tile)" stroke-width="2.5"/>';
      const svg = '<svg class="ch" viewBox="0 0 ' + CW + ' ' + CH + '" data-per="' + per + '" data-n="' + n + '" data-d0="' + d0 + '" data-d1="' + d1 + '" data-t0="' + m.w.cur[0] + '" data-step="' + m.w.step + '" data-v="' + hs.avg.map((v) => (v == null ? '' : v.toFixed(2))).join(',') + '" aria-hidden="true">' + s +
        '<g class="scr" style="display:none"><line y1="' + PT_ + '" y2="' + (CH - PB_) + '" stroke="var(--hc-fg)" stroke-opacity=".45" stroke-width="1"/><circle r="4.5" fill="var(--hc-accent)" stroke="var(--hc-tile)" stroke-width="2.5"/><text class="sc" y="9" text-anchor="middle"></text></g></svg>';
      let cap;
      if (!cmp) cap = T('capb', { a: cfg.comfort_min, b: cfg.comfort_max });
      else {
        const lab = { '1': T('yest'), '7': T('prev7'), '30': T('prev30') }[per];
        let extra = '';
        if (hs.prev[li] != null) { const dd = hs.avg[li] - hs.prev[li]; extra = ' · <b>' + esc(dd >= 0 ? T('warmer', { d: fmt(dd) }) : T('colder', { d: fmt(-dd) })) + '</b>'; }
        cap = '<span class="sw"></span>' + esc(T('now')) + ' · <span class="sw d"></span>' + esc(lab) + extra;
      }
      return svg + this._axis(m) + '<div class="cap">' + (cmp ? cap : esc(cap)) + '</div>';
    }
    _bindScr() {
      this._root.querySelectorAll('svg.ch[data-v]').forEach((sv) => {
        const per = sv.dataset.per, n = +sv.dataset.n, d0 = +sv.dataset.d0, d1 = +sv.dataset.d1, t0 = +sv.dataset.t0, step = +sv.dataset.step;
        const v = sv.dataset.v.split(',').map((s) => (s === '' ? null : Number(s))), g = sv.querySelector('.scr');
        const label = (i) => {
          if (per === '1') return pad2(i) + ':00';
          const d = new Date(t0 + i * step);
          if (per === '7') { const part = ['night', 'morning', 'afternoon', 'evening'][Math.floor(new Date(t0 + i * step + step / 2).getHours() / 6)]; return dfmt(d, { weekday: 'short' }).replace('.', '') + ' ' + d.getDate() + ' · ' + T(part); }
          return dfmt(d, { day: 'numeric', month: 'short' });
        };
        const mv = (e) => {
          const r = sv.getBoundingClientRect(), X = (e.clientX - r.left) / r.width * CW, w = CW - PL_ - PR_, k = (X - PL_) / w;
          let i = Math.round(per === '1' ? k * 23 : k * (n - 1));
          i = Math.max(0, Math.min(n - 1, i));
          if (v[i] == null) { g.style.display = 'none'; return; }
          const px = PL_ + (per === '1' ? i / 23 : i / (n - 1)) * w, py = PT_ + (1 - (v[i] - d0) / (d1 - d0)) * (CH - PT_ - PB_);
          g.style.display = '';
          const ln = g.querySelector('line'); ln.setAttribute('x1', px); ln.setAttribute('x2', px);
          const c = g.querySelector('circle'); c.setAttribute('cx', px); c.setAttribute('cy', py);
          const t = g.querySelector('text'); t.textContent = fmt(v[i]) + '° · ' + label(i); t.setAttribute('x', Math.max(60, Math.min(CW - 60, px)));
        };
        sv.addEventListener('pointermove', mv); sv.addEventListener('pointerdown', mv);
        sv.addEventListener('pointerleave', () => { g.style.display = 'none'; });
      });
    }

    /* --------------------------------------------------------------- card */
    _chip(m) {
      if (!m.rooms.length) return '';
      const n = m.attn.length;
      if (!n) return '<button type="button" class="bchip" data-act="open" data-focus="chip"><i></i>' + esc(T('ok')) + '</button>';
      const k = m.attn.every((r) => r.s === 'cold');
      return '<button type="button" class="bchip ' + (k ? 'k' : 'w') + '" data-act="open" data-focus="chip"><i></i>' + esc(T('att')) + ' · ' + n + '</button>';
    }
    _cardHTML(m) {
      const cfg = this._cfg, per = this._per, hs = m.house, mt = cfg.modules.temps;
      let h = '<div class="head"><div>' + (cfg.show_eyebrow && cfg.eyebrow ? '<div class="eye">' + esc(cfg.eyebrow) + '</div>' : '') +
        (cfg.show_title ? '<div class="title">' + esc(cfg.title == null ? T('title') : cfg.title) + '<b>.</b></div>' : '') + '</div>' + this._chip(m) + '</div>';
      const tiles = m.rooms.filter((r) => r.temps.length);
      if (!tiles.length) return h + '<div class="empty">' + esc(T('empty_mods')) + '</div>';
      if (this._leg) h += '<div class="leg" data-act="leg"><b>' + esc(T('lg_t')) + '</b><p>' + esc(T('lg1', { a: cfg.comfort_min, b: cfg.comfort_max })) + '</p><p>' + esc(T('lg3')) + '</p>' + (cfg.compare ? '<p>' + esc(T('lg4')) + '</p>' : '') + '</div>';
      if (mt.on && cfg.hero && hs.cur != null) {
        h += '<div class="panel"><div class="lab">' + esc(T('avg')) + '</div><div class="hrow"><div class="big">' + fmt(hs.cur) + esc(hs.unit) + '</div><div class="hs">' + (hs.d != null ? chipHTML(hs.d, true) : '') + '</div></div>' + (cfg.chart ? this._chart(m) : '') +
          '<div class="per" role="group" aria-label="' + esc(T('period')) + '">' + ['1', '7', '30'].map((k) => '<button type="button" data-act="per" data-per="' + k + '" aria-pressed="' + (per === k) + '">' + esc(T('p' + k)) + '</button>').join('') + '</div></div>';
      }
      const vv = [cfg.comfort_min, cfg.comfort_max];
      tiles.forEach((r) => { if (r.cur != null) vv.push(r.cur); if (r.mn != null) vv.push(r.mn); if (r.mx != null) vv.push(r.mx); });
      const sc = [Math.floor(Math.min.apply(null, vv)) - 1, Math.ceil(Math.max.apply(null, vv)) + 1];
      const pos = (v) => Math.max(0, Math.min(100, (v - sc[0]) / (sc[1] - sc[0]) * 100));
      h += '<div class="lkrow"><div class="lab">' + esc(T('rooms')) + '</div>' + (cfg.legend ? '<button type="button" class="info" data-act="leg" aria-label="' + esc(T('legend_a')) + '">' + ic('mdi:information-outline') + '</button>' : '') + '</div><div class="tg">';
      tiles.forEach((r, i) => {
        const k = r.d == null ? null : arrow(r.d);
        const bar = r.cur == null ? '' : '<span class="bar"><i class="band" style="left:' + pos(cfg.comfort_min).toFixed(1) + '%;width:' + (pos(cfg.comfort_max) - pos(cfg.comfort_min)).toFixed(1) + '%"></i>' +
          (r.mn != null && r.mx != null ? '<i class="rng" style="left:' + pos(r.mn).toFixed(1) + '%;width:' + Math.max(1, pos(r.mx) - pos(r.mn)).toFixed(1) + '%"></i>' : '') + '<i class="dot ' + r.s + '" style="left:' + pos(r.cur).toFixed(1) + '%"></i></span>';
        h += '<button type="button" class="tl ' + r.s + '" data-act="open" data-focus="room-' + i + '"><span class="tn">' + esc(r.name) + (r.clima.length && cfg.modules.clima.on ? ic('mdi:air-conditioner') : '') + '</span><span class="tt">' + (r.cur != null ? fmt(r.cur) + esc(r.unit) : '—') + '</span><span class="td">' +
          (k ? ic(ARROW_ICON[k]) + fmt(Math.abs(r.d)) + '°' : r.s === 'na' ? esc(T('na')) : '') + '</span>' + bar + '</button>';
      });
      return h + '</div>';
    }

    /* -------------------------------------------------------------- popup */
    _groups(m) {
      const cfg = this._cfg, h = this._hass, per = this._per, D = m.D;
      return m.rooms.map((r) => {
        const rows = [];
        cfg.order.forEach((k) => {
          if (!cfg.modules[k].on) return;
          if (k === 'temps') {
            r.temps.forEach((id) => {
              const s = stOf(h, id), v = numOf(s), e = D && D.ent[id];
              const st = v == null ? 'na' : v < cfg.comfort_min ? 'cold' : v > cfg.comfort_max ? 'hot' : 'ok';
              const l = []; let d = null, series = null;
              if (v == null) l.push(T('na'));
              else if (e) {
                const f0 = firstOf(e.cur.b);
                if (f0 != null) { d = v - f0; l.push(T('var_', { p: T('s' + per) })); }
                if (e.cur.mn != null && e.cur.mx != null) l.push(T('minmax', { a: fmt(e.cur.mn), b: fmt(e.cur.mx) }));
                series = e.cur.b;
              }
              rows.push({ id: id, icon: 'mdi:thermometer', s: st, n: r.temps.length === 1 ? T('temp') : nameOf(s, id), l: l, v: v == null ? '—' : fmt(v) + uOf(s), d: d, series: series });
            });
          } else if (k === 'hum') {
            r.hum.forEach((id) => {
              const s = stOf(h, id), v = numOf(s), u = (s && s.attributes && s.attributes.unit_of_measurement) || '%';
              rows.push({ id: id, icon: 'mdi:water-percent', s: v == null ? 'na' : 'ok', n: T('hum'), l: [v == null ? T('na') : nameOf(s, id)], v: v == null ? '—' : fmt(v, Math.abs(v - Math.round(v)) < 0.05 ? 0 : 1) + u });
            });
          } else if (k === 'clima') {
            r.clima.forEach((id) => {
              const s = stOf(h, id), v = numOf(s);
              rows.push({ id: id, icon: 'mdi:air-conditioner', s: v == null ? 'na' : 'ok', n: nameOf(s, id), l: [v == null ? T('na') : T('sensed')], v: v == null ? '—' : fmt(v) + uOf(s) });
            });
          }
        });
        return { r: r, rows: rows };
      }).filter((g) => g.rows.length);
    }
    _isOpen(g) { const o = this._openR[g.r.key]; return o == null ? (g.r.s === 'hot' || g.r.s === 'cold' || g.r.s === 'na') : o; }
    _ribbon(vals) {
      const cfg = this._cfg, per = this._per, v = vals.filter((x) => x != null);
      if (v.length < 2) return '';
      const col = (t) => {
        if (t < cfg.comfort_min) return mix('#8cc3d8', '#2a6f8c', Math.min(1, (cfg.comfort_min - t) / 4));
        if (t > cfg.comfort_max) return mix('#ecc660', '#d9822b', Math.min(1, (t - cfg.comfort_max) / 4));
        const u = (t - cfg.comfort_min) / (cfg.comfort_max - cfg.comfort_min);
        return mix('#4fb58f', '#0a7a5c', 1 - Math.abs(2 * u - 1));
      };
      const n = v.length;
      const g = per === '1' ? 'linear-gradient(90deg,' + v.map((t, i) => col(t) + ' ' + (i / (n - 1) * 100).toFixed(1) + '%').join(',') + ')'
        : 'linear-gradient(90deg,' + v.map((t, i) => col(t) + ' ' + (i / n * 100).toFixed(2) + '%,' + col(t) + ' ' + ((i + 1) / n * 100).toFixed(2) + '%').join(',') + ')';
      const now = Date.now(), w = per === '1' ? Math.max(4, Math.min(100, (now - windowOf('1', now).cur[0]) / DAY * 100)) : 100;
      return '<div class="rb"><div class="rf" style="width:' + w.toFixed(2) + '%;background:' + g + '"></div><i class="now" style="left:' + w.toFixed(2) + '%"></i></div>';
    }
    _banner(g) {
      const cfg = this._cfg, r = g.r;
      if (r.s === 'none') return '';
      let k, ico, a, b;
      if (r.s === 'hot') { k = 'w'; ico = 'mdi:thermometer'; a = T('hot'); b = T('ban_hot', { d: fmt(r.cur - cfg.comfort_max), m: cfg.comfort_max }); }
      else if (r.s === 'cold') { k = 'k'; ico = 'mdi:thermometer'; a = T('cold'); b = T('ban_cold', { d: fmt(cfg.comfort_min - r.cur), m: cfg.comfort_min }); }
      else if (r.s === 'na') { k = 'n'; ico = 'mdi:help-circle-outline'; a = T('na'); b = T('na_sub'); }
      else { k = 'o'; ico = 'mdi:check'; a = T('ok'); b = T('ban_ok', { a: cfg.comfort_min, b: cfg.comfort_max }); }
      return '<div class="ban ' + k + '"><span class="bi">' + ic(ico) + '</span><span class="bt"><strong>' + esc(a) + '</strong><small>' + esc(b) + '</small></span></div>';
    }
    _accHTML(g, m) {
      const open = this._isOpen(g), r = g.r;
      const hv = r.cur != null ? fmt(r.cur) + r.unit : g.rows[0].v;
      return '<div class="acc' + (open ? ' open' : '') + '"><button type="button" class="ah" data-act="room" data-room="' + esc(r.key) + '" aria-expanded="' + open + '"><i class="dtp ' + r.s + '"></i><span class="an">' + esc(r.name) + '</span><span class="at">' + esc(hv) + '</span>' + ic('mdi:chevron-right') + '</button><div class="ab">' + this._banner(g) +
        g.rows.map((x) => '<div class="er ' + (x.s !== 'ok' ? x.s : '') + '"><span class="ico">' + ic(x.icon) + '</span><div class="t"><div class="n">' + esc(x.n) + '</div>' + x.l.map((l) => '<div class="s">' + esc(l) + '</div>').join('') + '</div><div class="vr"><div class="v">' + esc(x.v) + '</div>' + (x.d != null ? chipHTML(x.d) : '') + '</div>' +
          (x.series ? '<div class="rbw">' + this._ribbon(x.series) + this._axis(m) + '</div>' : '') + '</div>').join('') + '</div></div>';
    }
    _popupHTML(m) {
      const cfg = this._cfg, per = this._per, wide = this._wide();
      let gs = this._groups(m);
      if (this._flt === 'att') gs = gs.filter((g) => g.r.s === 'hot' || g.r.s === 'cold' || g.r.s === 'na');
      const cols = this._colCount();
      let body;
      if (!gs.length) body = '<div class="empty">' + esc(T('none', { a: cfg.comfort_min, b: cfg.comfort_max })) + '</div>';
      else {
        const cs = []; for (let i = 0; i < cols; i++) cs.push({ h: 0, a: [] });
        gs.forEach((g) => { let best = cs[cols - 1]; for (let i = cols - 1; i >= 0; i--) if (cs[i].h < best.h) best = cs[i]; best.a.push(g); best.h += this._isOpen(g) ? g.rows.length * 2 + 2 : 1; });
        body = '<div class="mrow">' + cs.filter((c) => c.a.length).map((c) => '<div class="mcol">' + c.a.map((g) => this._accHTML(g, m)).join('') + '</div>').join('') + '</div>';
      }
      const x = '<button type="button" class="x" data-act="close" data-focus="close" aria-label="' + esc(T('close')) + '">' + ic('mdi:close') + '</button>';
      return '<div class="dlg"><div class="mh"><h2 class="mt">' + esc(T('details')) + '</h2>' + x + '</div><div class="mb"><div class="cr"><div class="seg2" role="group"><button type="button" data-act="flt" data-f="att" aria-pressed="' + (this._flt === 'att') + '">' + esc(T('att')) + '</button><button type="button" data-act="flt" data-f="all" aria-pressed="' + (this._flt === 'all') + '">' + esc(T('all')) + '</button></div>' +
        '<div class="seg2" role="group" aria-label="' + esc(T('period')) + '">' + ['1', '7', '30'].map((k) => '<button type="button" data-act="per" data-per="' + k + '" aria-pressed="' + (per === k) + '">' + esc(T('p' + k)) + '</button>').join('') + '</div></div>' + body + '</div></div>';
    }

    /* ------------------------------------------------------------- render */
    _frame() {
      const root = this._root;
      if (!this._shell || !root.contains(this._shell)) {
        root.innerHTML = '<div class="hc"><div class="cardw"><div class="shell"></div></div><div class="pp"></div></div>';
        this._shell = root.querySelector('.shell'); this._pp = root.querySelector('.pp'); this._hcEl = root.querySelector('.hc');
      }
      this._hcEl.setAttribute('data-mode', this._mode()); this._hcEl.setAttribute('data-cw', this._cfg.width);
    }
    _render() {
      const cfg = this._cfg;
      if (!this._root || !cfg || !this._hass) return;
      this._sl(); this._frame();
      const m = this._model();
      this._shell.innerHTML = this._cardHTML(m);
      this._bindScr();
      this._renderPopup(m);
    }
    // The popup lives in its own container: opening, closing or updating it never rebuilds the card behind it.
    _renderPopup(m) {
      if (!this._cfg || !this._hass) return;
      this._sl(); this._frame();
      const pp = this._pp;
      if (!this._popup) { if (pp.firstChild) pp.innerHTML = ''; return; }
      m = m || this._model();
      let modal = pp.querySelector('dialog.ov');
      const fresh = !modal;
      if (fresh) {
        pp.innerHTML = '<dialog class="ov" data-act="ovclose" aria-label="' + esc(T('details')) + '"></dialog>';
        modal = pp.querySelector('dialog.ov');
        modal.addEventListener('cancel', (ev) => ev.preventDefault());
      }
      const body0 = modal.querySelector('.mb'), keep = body0 ? body0.scrollTop : 0;
      modal.setAttribute('aria-label', T('details'));
      modal.innerHTML = this._popupHTML(m);
      if (fresh) {
        try { if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', ''); } catch (err) { modal.setAttribute('open', ''); }
        this._lockScroll();
      }
      const nb = modal.querySelector('.mb');
      if (nb) nb.scrollTop = keep;
      if (this._focus) {
        const el = this._root.querySelector('[data-focus="' + this._focus + '"]');
        if (el) { try { el.focus({ preventScroll: true }); } catch (err) { /* ignore */ } }
        this._focus = '';
      }
    }
    _lockScroll() {
      const overlay = this._root.querySelector('.ov');
      if (!overlay) return;
      const body = () => overlay.querySelector('.mb');
      const atEdge = (dy) => { const b = body(); return !b || (dy < 0 && b.scrollTop <= 0) || (dy > 0 && b.scrollTop + b.clientHeight >= b.scrollHeight - 1); };
      overlay.addEventListener('wheel', (e) => { const b = body(); if (!b || !b.contains(e.target) || atEdge(e.deltaY)) e.preventDefault(); }, { passive: false });
      let y = 0;
      overlay.addEventListener('touchstart', (e) => { const t = e.touches[0]; y = t ? t.clientY : 0; }, { passive: true });
      overlay.addEventListener('touchmove', (e) => { const b = body(), t = e.touches[0], dy = y - (t ? t.clientY : y); if (!b || !b.contains(e.target) || atEdge(dy)) e.preventDefault(); }, { passive: false });
    }

    _open(focus) {
      const m = this._model();
      this._flt = m.attn.length ? 'att' : 'all'; this._openR = {};
      this._ret = focus || 'chip'; this._popup = true; this._focus = 'close';
      document.addEventListener('keydown', this._onKey, true);
      this._renderPopup();
    }
    _close() {
      if (!this._popup) return;
      this._popup = false; this._focus = this._ret;
      document.removeEventListener('keydown', this._onKey, true);
      this._renderPopup();
      const el = this._root.querySelector('[data-focus="' + this._focus + '"]');
      if (el) { try { el.focus({ preventScroll: true }); } catch (err) { /* ignore */ } }
      this._focus = '';
    }
    _click(e) {
      const t = e.target.closest ? e.target.closest('[data-act]') : null;
      if (!t) return;
      this._sl();
      const a = t.dataset.act;
      if (a === 'ovclose') { if (e.target === t) this._close(); return; }
      if (a === 'open') { this._open(t.dataset.focus); return; }
      if (a === 'close') { this._close(); return; }
      if (a === 'flt') { this._flt = t.dataset.f; this._renderPopup(); return; }
      if (a === 'per') { this._per = t.dataset.per; this._maybeData(); this._render(); return; }
      if (a === 'leg') { this._leg = !this._leg; this._render(); return; }
      if (a === 'room') {
        const k = t.dataset.room, g = this._groups(this._model()).filter((x) => x.r.key === k)[0];
        if (g) { this._openR[k] = !this._isOpen(g); this._renderPopup(); }
      }
    }
    _key(e) {
      if (!this._popup) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); this._close(); return; }
      if (e.key === 'Tab') {
        const dlg = this._root.querySelector('.dlg'); if (!dlg) return;
        const f = [].slice.call(dlg.querySelectorAll('button:not([disabled]),input,select')); if (!f.length) return;
        const first = f[0], last = f[f.length - 1], act = this.shadowRoot.activeElement;
        if (e.shiftKey && act === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && act === last) { e.preventDefault(); first.focus(); }
        else if (!dlg.contains(act)) { e.preventDefault(); first.focus(); }
      }
    }
  }
