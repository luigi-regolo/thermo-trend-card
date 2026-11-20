
  Object.assign(TR.it, { nodata: 'Dati dello storico non disponibili', loading: 'Carico lo storico…', na: 'Non disponibile', na_sub: 'Nessun valore valido dai sensori di questa stanza', empty_mods: 'Scegli almeno un sensore di temperatura nella scheda Moduli.', th_auto: 'Automatico (Home Assistant)', secs: 'Sezioni', no_room: 'Senza stanza' });
  Object.assign(TR.en, { nodata: 'History data not available', loading: 'Loading history…', na: 'Unavailable', na_sub: 'No valid value from the sensors of this room', empty_mods: 'Choose at least one temperature sensor in the Modules tab.', th_auto: 'Automatic (Home Assistant)', secs: 'Sections', no_room: 'No room' });
  Object.assign(TR.de, { nodata: 'Verlaufsdaten nicht verfügbar', loading: 'Verlauf wird geladen…', na: 'Nicht verfügbar', na_sub: 'Kein gültiger Wert von den Sensoren dieses Raums', empty_mods: 'Wähle im Reiter Module mindestens einen Temperatursensor.', th_auto: 'Automatisch (Home Assistant)', secs: 'Bereiche', no_room: 'Ohne Raum' });
  Object.assign(TR.fr, { nodata: 'Données d’historique indisponibles', loading: 'Chargement de l’historique…', na: 'Indisponible', na_sub: 'Aucune valeur valide des capteurs de cette pièce', empty_mods: 'Choisissez au moins un capteur de température dans l’onglet Modules.', th_auto: 'Automatique (Home Assistant)', secs: 'Sections', no_room: 'Sans pièce' });

  let CUR = 'en';
  const T = (k, v) => {
    let t = TR[CUR] && TR[CUR][k];
    if (t == null) t = TR.en[k];
    if (t == null) return k;
    return v ? t.replace(/\{(\w+)\}/g, (m, x) => (v[x] != null ? v[x] : m)) : t;
  };
  const baseLang = (h) => {
    const l = h && ((h.locale && h.locale.language) || h.language);
    return typeof l === 'string' ? l.toLowerCase().split(/[-_]/)[0] : 'en';
  };
  const pickLang = (cfgLang, h) => {
    const l = cfgLang && cfgLang !== 'auto' ? cfgLang : baseLang(h);
    return TR[l] ? l : 'en';
  };
  const LOCALES = { it: 'it-IT', en: 'en-GB', de: 'de-DE', fr: 'fr-FR' };

  /* ------------------------------------------------------------------ data */
  const MODS = {
    temps: { icon: 'mdi:thermometer', sel: { filter: [{ domain: 'sensor', device_class: 'temperature' }] } },
    hum: { icon: 'mdi:water-percent', sel: { filter: [{ domain: 'sensor', device_class: 'humidity' }] } },
    clima: { icon: 'mdi:air-conditioner', sel: { filter: [{ domain: 'sensor' }] } }
  };
  const MOD_ORDER = ['temps', 'hum', 'clima'];
  const ROOM_MODS = ['temps', 'hum'];
  const DEFAULTS = {
    eyebrow: 'THERMO TREND CARD', title: null, show_eyebrow: true, show_title: true,
    hero: true, chart: true, compare: true, legend: true, comfort_min: 19, comfort_max: 26,
    width: 'center', theme_mode: 'auto', language: 'auto'
  };
  const IS_PHONE = Math.min(window.screen ? window.screen.width : 9999, window.screen ? window.screen.height : 9999) < 600;
  const HOUR = 3600000, DAY = 86400000;
  const CW = 320, CH = 84, PL_ = 6, PR_ = 8, PT_ = 12, PB_ = 8;

  /* --------------------------------------------------------------- helpers */
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const ic = (name) => '<ha-icon icon="' + esc(name) + '"></ha-icon>';
  const stOf = (h, id) => (h && h.states ? h.states[id] : undefined);
  const nameOf = (s, id) => (s && s.attributes && s.attributes.friendly_name) || id;
  const numOf = (s) => {
    if (!s || s.state === 'unavailable' || s.state === 'unknown' || s.state === '' || s.state == null) return null;
    const v = Number(s.state);
    return isFinite(v) ? v : null;
  };
  const uOf = (s) => { const u = s && s.attributes && s.attributes.unit_of_measurement; return typeof u === 'string' && u.trim() ? u.trim() : '°'; };
  const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  const fmt = (v, d) => { const t = v.toFixed(d == null ? 1 : d); return CUR === 'en' ? t : t.replace('.', ','); };
  const arrow = (d) => (d > 0.049 ? 'up' : d < -0.049 ? 'dn' : 'eq');
  const ARROW_ICON = { up: 'mdi:arrow-up', dn: 'mdi:arrow-down', eq: 'mdi:minus' };
  const pad2 = (n) => (n < 10 ? '0' : '') + n;
  const dfmt = (d, o) => new Intl.DateTimeFormat(LOCALES[CUR] || 'en-GB', o).format(d);

  // Room of an entity: its own area, otherwise the area of its device (Home Assistant registries).
  function areaOf(h, id) {
    if (!h || !h.entities) return null;
    const e = h.entities[id];
    if (!e) return null;
    let aid = e.area_id;
    if (!aid && e.device_id && h.devices && h.devices[e.device_id]) aid = h.devices[e.device_id].area_id;
    if (!aid) return null;
    const a = h.areas && h.areas[aid];
    return { id: aid, name: (a && a.name) || aid };
  }

  function normalizeConfig(raw) {
    raw = raw && typeof raw === 'object' ? raw : {};
    const b = (x, d) => (typeof x === 'boolean' ? x : d);
    const c = {};
    c.eyebrow = typeof raw.eyebrow === 'string' ? raw.eyebrow.slice(0, 60) : DEFAULTS.eyebrow;
    c.title = typeof raw.title === 'string' ? raw.title.slice(0, 60) : null;
    ['show_eyebrow', 'show_title', 'hero', 'chart', 'compare', 'legend'].forEach((k) => { c[k] = b(raw[k], DEFAULTS[k]); });
    let lo = Number(raw.comfort_min), hi = Number(raw.comfort_max);
    if (raw.comfort_min == null || raw.comfort_min === '' || !isFinite(lo)) lo = DEFAULTS.comfort_min;
    if (raw.comfort_max == null || raw.comfort_max === '' || !isFinite(hi)) hi = DEFAULTS.comfort_max;
    if (lo >= hi) { lo = DEFAULTS.comfort_min; hi = DEFAULTS.comfort_max; }
    c.comfort_min = lo; c.comfort_max = hi;
    c.width = raw.width === 'full' ? 'full' : 'center';
    c.theme_mode = raw.theme_mode === 'light' || raw.theme_mode === 'dark' ? raw.theme_mode : 'auto';
    c.language = LANGS.some((l) => l[0] === raw.language) ? raw.language : 'auto';
    const ord = Array.isArray(raw.order) ? raw.order.filter((k, i, a) => MOD_ORDER.indexOf(k) >= 0 && a.indexOf(k) === i) : [];
    c.order = ord.concat(MOD_ORDER.filter((k) => ord.indexOf(k) < 0));
    c.modules = {};
    MOD_ORDER.forEach((k) => {
      const m = raw.modules && typeof raw.modules[k] === 'object' && raw.modules[k] ? raw.modules[k] : {};
      const ents = Array.isArray(m.entities) ? m.entities.filter((e, i, a) => typeof e === 'string' && e.indexOf('.') > 0 && a.indexOf(e) === i).slice(0, 60) : [];
      c.modules[k] = { on: b(m.on, true), entities: ents };
    });
    return c;
  }

  /* Rooms are Home Assistant areas. A sensor without area becomes a room of its own. */
  function buildRooms(h, cfg) {
    const map = {}, list = [];
    MOD_ORDER.forEach((k) => {
      const m = cfg.modules[k];
      if (!m.on) return;
      m.entities.forEach((id) => {
        const a = areaOf(h, id);
        const key = a ? 'a:' + a.id : 'e:' + id, name = a ? a.name : nameOf(stOf(h, id), id);
        if (!map[key]) { map[key] = { key: key, name: name, temps: [], hum: [], clima: [] }; list.push(map[key]); }
        map[key][k].push(id);
      });
    });
    list.forEach((r) => {
      const vals = r.temps.map((id) => numOf(stOf(h, id))).filter((v) => v !== null);
      r.cur = mean(vals);
      const us = r.temps.map((id) => stOf(h, id)).filter((s) => numOf(s) !== null)[0];
      r.unit = uOf(us);
      r.s = !r.temps.length ? 'none' : r.cur === null ? 'na' : r.cur < cfg.comfort_min ? 'cold' : r.cur > cfg.comfort_max ? 'hot' : 'ok';
    });
    return list;
  }

  /* Time windows: today / 7 days / 30 days and the same length just before. */
  function windowOf(per, now) {
    if (per === '1') {
      const s = new Date(now); s.setHours(0, 0, 0, 0);
      const st = s.getTime();
      return { cur: [st, now], prev: [st - DAY, st], step: HOUR, n: 24 };
    }
    if (per === '7') return { cur: [now - 7 * DAY, now], prev: [now - 14 * DAY, now - 7 * DAY], step: 6 * HOUR, n: 28 };
    return { cur: [now - 30 * DAY, now], prev: [now - 60 * DAY, now - 30 * DAY], step: DAY, n: 30 };
  }
  function parseHist(arr) {
    const o = [];
    (arr || []).forEach((x) => {
      const s = x.s != null ? x.s : x.state;
      const t = x.lu != null ? x.lu * 1000 : Date.parse(x.last_updated || x.last_changed);
      const v = Number(s);
      if (s != null && s !== '' && isFinite(v) && isFinite(t)) o.push({ t: t, v: v });
    });
    o.sort((a, b) => a.t - b.t);
    return o;
  }
  // Time-weighted mean of the state history inside each bucket of the window.
  function bucketHist(pts, w, step, n) {
    const b = new Array(n).fill(null);
    let mn = null, mx = null, j = 0, last = null;
    while (j < pts.length && pts[j].t <= w[0]) { last = pts[j].v; j++; }
    for (let i = 0; i < n; i++) {
      const a = w[0] + i * step, e = Math.min(a + step, w[1]);
      if (e <= a) break;
      let cur = a, val = last, acc = 0, dur = 0, lo = null, hi = null;
      const add = (until) => {
        if (val != null && until > cur) {
          acc += val * (until - cur); dur += until - cur;
          lo = lo == null ? val : Math.min(lo, val); hi = hi == null ? val : Math.max(hi, val);
        }
      };
      while (j < pts.length && pts[j].t < e) { add(pts[j].t); cur = Math.max(cur, pts[j].t); val = pts[j].v; j++; }
      add(e);
      if (dur > 0) {
        b[i] = acc / dur;
        mn = mn == null ? lo : Math.min(mn, lo); mx = mx == null ? hi : Math.max(mx, hi);
      }
      last = val;
    }
    return { b: b, mn: mn, mx: mx };
  }
  // Long-term statistics (hourly) grouped in the same buckets.
  function bucketStats(rows, w, step, n) {
    const sum = new Array(n).fill(0), cnt = new Array(n).fill(0), b = new Array(n).fill(null);
    let mn = null, mx = null;
    (rows || []).forEach((r) => {
      const t = typeof r.start === 'number' ? r.start : Date.parse(r.start);
      if (!(t >= w[0] && t < w[1]) || r.mean == null || !isFinite(r.mean)) return;
      const i = Math.floor((t - w[0]) / step);
      if (i < 0 || i >= n) return;
      sum[i] += r.mean; cnt[i]++;
      const lo = r.min != null && isFinite(r.min) ? r.min : r.mean, hi = r.max != null && isFinite(r.max) ? r.max : r.mean;
      mn = mn == null ? lo : Math.min(mn, lo); mx = mx == null ? hi : Math.max(mx, hi);
    });
    for (let i = 0; i < n; i++) if (cnt[i]) b[i] = sum[i] / cnt[i];
    return { b: b, mn: mn, mx: mx };
  }
  const firstOf = (a) => { for (let i = 0; i < a.length; i++) if (a[i] != null) return a[i]; return null; };
  const lastIdx = (a) => { for (let i = a.length - 1; i >= 0; i--) if (a[i] != null) return i; return -1; };
  const meanSeries = (list, n) => {
    const o = [];
    for (let i = 0; i < n; i++) o.push(mean(list.map((s) => s[i]).filter((v) => v != null)));
    return o;
  };
