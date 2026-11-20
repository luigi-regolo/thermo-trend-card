/*!
 * Thermo Trend Card
 * Home temperatures for Home Assistant: room trend, comfort range and comparison with the previous period.
 * Copyright (C) 2026 luigi-regolo
 * SPDX-License-Identifier: GPL-3.0-only
 * https://github.com/luigi-regolo/thermo-trend-card
 */
(function () {
  'use strict';
  const VERSION = '1.0';
  const TAG = 'thermo-trend-card';
  const EDITOR_TAG = 'thermo-trend-card-editor';
  const LANGS = [['it', 'Italiano'], ['en', 'English'], ['de', 'Deutsch'], ['fr', 'Français']];

  /* ---------------------------------------------------------- translations */
  const TR = {
  it:{ban_hot:'{d}° sopra il massimo di {m}°',ban_cold:'{d}° sotto il minimo di {m}°',ban_ok:'Tra {a}° e {b}°',title:'Temperature',tab_home:'Casa',tab_mods:'Moduli',tab_look:'Aspetto',avg:'Media casa',period:'Periodo',p1:'Oggi',p7:'7 giorni',p30:'30 giorni',
   s1:'da mezzanotte',s7:'in 7 giorni',s30:'in 30 giorni',today:'oggi',now:'ora',yest:'ieri',prev7:'7 giorni prima',prev30:'30 giorni prima',warmer:'{d}° più calda',colder:'{d}° più fredda',
   night:'notte',morning:'mattina',afternoon:'pomeriggio',evening:'sera',
   capb:'La fascia verde è il comfort ({a}°–{b}°) · scorri sul grafico',details:'Dettagli e stato',close:'Chiudi',rooms:'Stanze',legend_a:'Legenda',
   lg_t:'Come leggere la card',lg1:'Fascia verde: comfort da {a}° a {b}°. Barra grigia: minima e massima del periodo. Punto: temperatura attuale.',lg2:'Anello del tondo: verde nel comfort, azzurro sotto, ambra sopra.',lg3:'Badge: variazione nel periodo.',lg4:'Linea grigia tratteggiata: il periodo precedente.',
   temp:'Temperatura',hum:'Umidità',clima:'Climatizzatore',var_:'Variazione {p}',minmax:'Min {a}° · max {b}°',above:'{d}° sopra il comfort (massimo {m}°)',below:'{d}° sotto il comfort (minimo {m}°)',sensed:'Temperatura rilevata',
   hot:'Sopra comfort',cold:'Sotto comfort',ok:'Nel comfort',none:'Nessuna temperatura fuori dal comfort ({a}°–{b}°).',att:'Attenzione',all:'Tutti',
   e_home:'Casa',e_home_d:'Scegli come si presenta il riepilogo. Le temperature arrivano dalle entità dei moduli e l’unità di misura è quella di ogni sensore.',
   e_hero:'Riepilogo casa',e_hero_d:'Media della casa con la variazione. Spento: la card mostra solo stanze e moduli.',e_chart:'Grafico dell’andamento',e_chart_d:'Mostra come cambia la temperatura media della casa nel periodo scelto.',
   e_cmp:'Confronto con il periodo precedente',e_cmp_d:'Linea grigia tratteggiata con ieri, 7 o 30 giorni prima. Usa le statistiche a lungo termine dei sensori: se mancano, la card nasconde il confronto da sola.',
   e_leg:'Legenda al tocco',e_leg_d:'Il tasto info accanto a «Stanze» spiega colori, anelli e variazione.',e_comf:'Comfort',e_cmin:'Comfort minimo',e_cmax:'Comfort massimo',e_comf_d:'Minimo e massimo, nell’unità dei sensori. Fuori da questa fascia una stanza compare in «Attenzione».',
   e_mods:'Moduli',e_mods_d:'Scegli le entità di ogni modulo dai selettori. Un modulo senza entità non compare. Ogni modulo funziona anche da solo. L’ordine dei moduli è quello delle righe nel popup.',
   m_temps:'Temperature',m_temps_d:'Sensori di temperatura (sensor), di qualsiasi marca.',m_hum:'Umidità',m_hum_d:'Sensori di umidità (sensor), abbinati alla stanza di ogni termometro.',m_clima:'Climatizzatore',m_clima_d:'Sensore con la temperatura del climatizzatore: accetta qualsiasi sensor.',
   up:'Sposta su',down:'Sposta giù',m_on:'Modulo attivo',m_add:'+ Scegli entità',m_room:'Aggiungi da stanza',m_room_ph:'Scegli una stanza…',m_room_d:'Aggiunge i dispositivi compatibili di quella stanza. Puoi sempre toglierne qualcuno dal selettore.',
   e_look:'Aspetto',e_eye:'Intestazione superiore',e_ttl:'Titolo',e_ttl_d:'Il punto verde finale lo aggiunge la card.',e_se:'Mostra intestazione superiore',e_st:'Mostra titolo',e_full:'Tutta la larghezza disponibile su tablet e desktop',e_full_d:'Se è disattivato la card resta stretta (460 px) al centro.',e_theme:'Tema',
   e_lang:'Lingua',e_lang_auto:'Automatica (Home Assistant)',e_lang_d:'Automatica segue la lingua dell’utente in Home Assistant. Se la lingua non è disponibile si usa l’inglese.'},
  en:{ban_hot:'{d}° above the maximum of {m}°',ban_cold:'{d}° below the minimum of {m}°',ban_ok:'Between {a}° and {b}°',title:'Temperatures',tab_home:'Home',tab_mods:'Modules',tab_look:'Appearance',avg:'Home average',period:'Period',p1:'Today',p7:'7 days',p30:'30 days',
   s1:'since midnight',s7:'over 7 days',s30:'over 30 days',today:'today',now:'now',yest:'yesterday',prev7:'7 days earlier',prev30:'30 days earlier',warmer:'{d}° warmer',colder:'{d}° colder',
   night:'night',morning:'morning',afternoon:'afternoon',evening:'evening',
   capb:'The green band is the comfort range ({a}°–{b}°) · slide over the chart',details:'Details and status',close:'Close',rooms:'Rooms',legend_a:'Legend',
   lg_t:'How to read the card',lg1:'Green band: comfort from {a}° to {b}°. Grey bar: minimum and maximum of the period. Dot: current temperature.',lg2:'Ring of the circle: green in comfort, blue below, amber above.',lg3:'Badge: change over the period.',lg4:'Dashed grey line: the previous period.',
   temp:'Temperature',hum:'Humidity',clima:'Air conditioner',var_:'Change {p}',minmax:'Min {a}° · max {b}°',above:'{d}° above comfort (maximum {m}°)',below:'{d}° below comfort (minimum {m}°)',sensed:'Measured temperature',
   hot:'Above comfort',cold:'Below comfort',ok:'In comfort',none:'No temperature outside the comfort range ({a}°–{b}°).',att:'Attention',all:'All',
   e_home:'Home',e_home_d:'Choose how the summary looks. Temperatures come from the entities of the modules and the unit is the one of each sensor.',
   e_hero:'Home summary',e_hero_d:'Home average with its change. Off: the card shows only rooms and modules.',e_chart:'Trend chart',e_chart_d:'Shows how the average home temperature changes over the chosen period.',
   e_cmp:'Compare with the previous period',e_cmp_d:'Dashed grey line with yesterday, 7 or 30 days earlier. It uses the long-term statistics of the sensors: if they are missing, the card hides the comparison by itself.',
   e_leg:'Legend on tap',e_leg_d:'The info button next to “Rooms” explains colours, rings and change.',e_comf:'Comfort',e_cmin:'Minimum comfort',e_cmax:'Maximum comfort',e_comf_d:'Minimum and maximum, in the unit of the sensors. Outside this range a room appears in “Attention”.',
   e_mods:'Modules',e_mods_d:'Choose the entities of each module from the selectors. A module without entities is not shown. Every module also works on its own. The order of the modules is the order of the rows in the popup.',
   m_temps:'Temperatures',m_temps_d:'Temperature sensors (sensor), of any brand.',m_hum:'Humidity',m_hum_d:'Humidity sensors (sensor), matched to the room of each thermometer.',m_clima:'Air conditioner',m_clima_d:'Sensor with the air conditioner temperature: any sensor is accepted.',
   up:'Move up',down:'Move down',m_on:'Module on',m_add:'+ Choose entities',m_room:'Add from room',m_room_ph:'Choose a room…',m_room_d:'Adds the compatible devices of that room. You can always remove some from the selector.',
   e_look:'Appearance',e_eye:'Top label',e_ttl:'Title',e_ttl_d:'The green final dot is added by the card.',e_se:'Show top label',e_st:'Show title',e_full:'Full available width on tablet and desktop',e_full_d:'When off, the card stays narrow (460 px) in the centre.',e_theme:'Theme',
   e_lang:'Language',e_lang_auto:'Automatic (Home Assistant)',e_lang_d:'Automatic follows the user’s language in Home Assistant. If the language is not available, English is used.'},
  de:{ban_hot:'{d}° über dem Maximum von {m}°',ban_cold:'{d}° unter dem Minimum von {m}°',ban_ok:'Zwischen {a}° und {b}°',title:'Temperaturen',tab_home:'Haus',tab_mods:'Module',tab_look:'Darstellung',avg:'Hausdurchschnitt',period:'Zeitraum',p1:'Heute',p7:'7 Tage',p30:'30 Tage',
   s1:'seit Mitternacht',s7:'in 7 Tagen',s30:'in 30 Tagen',today:'heute',now:'jetzt',yest:'gestern',prev7:'vor 7 Tagen',prev30:'vor 30 Tagen',warmer:'{d}° wärmer',colder:'{d}° kälter',
   night:'Nacht',morning:'Morgen',afternoon:'Nachmittag',evening:'Abend',
   capb:'Das grüne Band ist der Komfortbereich ({a}°–{b}°) · über das Diagramm wischen',details:'Details und Status',close:'Schließen',rooms:'Räume',legend_a:'Legende',
   lg_t:'So liest man die Karte',lg1:'Grünes Band: Komfort von {a}° bis {b}°. Graue Leiste: Minimum und Maximum des Zeitraums. Punkt: aktuelle Temperatur.',lg2:'Ring des Kreises: grün im Komfortbereich, blau darunter, bernsteinfarben darüber.',lg3:'Badge: Veränderung im Zeitraum.',lg4:'Gestrichelte graue Linie: der vorherige Zeitraum.',
   temp:'Temperatur',hum:'Luftfeuchtigkeit',clima:'Klimaanlage',var_:'Veränderung {p}',minmax:'Min {a}° · max {b}°',above:'{d}° über dem Komfortbereich (Maximum {m}°)',below:'{d}° unter dem Komfortbereich (Minimum {m}°)',sensed:'Gemessene Temperatur',
   hot:'Über Komfort',cold:'Unter Komfort',ok:'Im Komfortbereich',none:'Keine Temperatur außerhalb des Komfortbereichs ({a}°–{b}°).',att:'Achtung',all:'Alle',
   e_home:'Haus',e_home_d:'Wähle, wie die Übersicht aussieht. Die Temperaturen kommen von den Entitäten der Module, die Einheit ist die jedes Sensors.',
   e_hero:'Hausübersicht',e_hero_d:'Durchschnitt des Hauses mit Veränderung. Aus: Die Karte zeigt nur Räume und Module.',e_chart:'Verlaufsdiagramm',e_chart_d:'Zeigt, wie sich die Durchschnittstemperatur des Hauses im gewählten Zeitraum ändert.',
   e_cmp:'Vergleich mit dem vorherigen Zeitraum',e_cmp_d:'Gestrichelte graue Linie mit gestern, vor 7 oder 30 Tagen. Nutzt die Langzeitstatistiken der Sensoren: Fehlen sie, blendet die Karte den Vergleich selbst aus.',
   e_leg:'Legende per Tipp',e_leg_d:'Die Info-Taste neben „Räume“ erklärt Farben, Ringe und Veränderung.',e_comf:'Komfort',e_cmin:'Minimaler Komfort',e_cmax:'Maximaler Komfort',e_comf_d:'Minimum und Maximum, in der Einheit der Sensoren. Außerhalb dieses Bereichs erscheint ein Raum unter „Achtung“.',
   e_mods:'Module',e_mods_d:'Wähle die Entitäten jedes Moduls in den Auswahlfeldern. Ein Modul ohne Entitäten wird nicht angezeigt. Jedes Modul funktioniert auch allein. Die Reihenfolge der Module ist die der Zeilen im Popup.',
   m_temps:'Temperaturen',m_temps_d:'Temperatursensoren (sensor), jeder Marke.',m_hum:'Luftfeuchtigkeit',m_hum_d:'Feuchtesensoren (sensor), dem Raum jedes Thermometers zugeordnet.',m_clima:'Klimaanlage',m_clima_d:'Sensor mit der Temperatur der Klimaanlage: jeder sensor wird akzeptiert.',
   up:'Nach oben',down:'Nach unten',m_on:'Modul aktiv',m_add:'+ Entitäten wählen',m_room:'Aus Raum hinzufügen',m_room_ph:'Raum wählen…',m_room_d:'Fügt die kompatiblen Geräte dieses Raums hinzu. Du kannst im Auswahlfeld jederzeit welche entfernen.',
   e_look:'Darstellung',e_eye:'Obere Beschriftung',e_ttl:'Titel',e_ttl_d:'Den grünen Punkt am Ende fügt die Karte hinzu.',e_se:'Obere Beschriftung anzeigen',e_st:'Titel anzeigen',e_full:'Volle verfügbare Breite auf Tablet und Desktop',e_full_d:'Wenn aus, bleibt die Karte schmal (460 px) in der Mitte.',e_theme:'Design',
   e_lang:'Sprache',e_lang_auto:'Automatisch (Home Assistant)',e_lang_d:'Automatisch folgt der Sprache des Benutzers in Home Assistant. Ist die Sprache nicht verfügbar, wird Englisch verwendet.'},
  fr:{ban_hot:'{d}° au-dessus du maximum de {m}°',ban_cold:'{d}° sous le minimum de {m}°',ban_ok:'Entre {a}° et {b}°',title:'Températures',tab_home:'Maison',tab_mods:'Modules',tab_look:'Apparence',avg:'Moyenne maison',period:'Période',p1:'Aujourd’hui',p7:'7 jours',p30:'30 jours',
   s1:'depuis minuit',s7:'sur 7 jours',s30:'sur 30 jours',today:'auj.',now:'maintenant',yest:'hier',prev7:'il y a 7 jours',prev30:'il y a 30 jours',warmer:'{d}° plus chaud',colder:'{d}° plus froid',
   night:'nuit',morning:'matin',afternoon:'après-midi',evening:'soir',
   capb:'La bande verte est la zone de confort ({a}°–{b}°) · glissez sur le graphique',details:'Détails et état',close:'Fermer',rooms:'Pièces',legend_a:'Légende',
   lg_t:'Comment lire la carte',lg1:'Bande verte : confort de {a}° à {b}°. Barre grise : minimum et maximum de la période. Point : température actuelle.',lg2:'Anneau du rond : vert dans le confort, bleu en dessous, ambre au-dessus.',lg3:'Badge : variation sur la période.',lg4:'Ligne grise en pointillés : la période précédente.',
   temp:'Température',hum:'Humidité',clima:'Climatiseur',var_:'Variation {p}',minmax:'Min {a}° · max {b}°',above:'{d}° au-dessus du confort (maximum {m}°)',below:'{d}° sous le confort (minimum {m}°)',sensed:'Température mesurée',
   hot:'Au-dessus du confort',cold:'Sous le confort',ok:'Dans le confort',none:'Aucune température hors de la zone de confort ({a}°–{b}°).',att:'Attention',all:'Toutes',
   e_home:'Maison',e_home_d:'Choisissez l’aspect du résumé. Les températures viennent des entités des modules et l’unité est celle de chaque capteur.',
   e_hero:'Résumé de la maison',e_hero_d:'Moyenne de la maison avec sa variation. Désactivé : la carte n’affiche que les pièces et les modules.',e_chart:'Graphique de l’évolution',e_chart_d:'Montre comment évolue la température moyenne de la maison sur la période choisie.',
   e_cmp:'Comparaison avec la période précédente',e_cmp_d:'Ligne grise en pointillés avec hier, il y a 7 ou 30 jours. Utilise les statistiques à long terme des capteurs : si elles manquent, la carte masque la comparaison toute seule.',
   e_leg:'Légende au toucher',e_leg_d:'Le bouton info à côté de « Pièces » explique couleurs, anneaux et variation.',e_comf:'Confort',e_cmin:'Confort minimum',e_cmax:'Confort maximum',e_comf_d:'Minimum et maximum, dans l’unité des capteurs. Hors de cette plage, une pièce apparaît dans « Attention ».',
   e_mods:'Modules',e_mods_d:'Choisissez les entités de chaque module dans les sélecteurs. Un module sans entités n’apparaît pas. Chaque module fonctionne aussi seul. L’ordre des modules est celui des lignes dans la fenêtre.',
   m_temps:'Températures',m_temps_d:'Capteurs de température (sensor), de toute marque.',m_hum:'Humidité',m_hum_d:'Capteurs d’humidité (sensor), associés à la pièce de chaque thermomètre.',m_clima:'Climatiseur',m_clima_d:'Capteur avec la température du climatiseur : tout sensor est accepté.',
   up:'Monter',down:'Descendre',m_on:'Module actif',m_add:'+ Choisir des entités',m_room:'Ajouter depuis une pièce',m_room_ph:'Choisir une pièce…',m_room_d:'Ajoute les appareils compatibles de cette pièce. Vous pouvez toujours en retirer dans le sélecteur.',
   e_look:'Apparence',e_eye:'Libellé supérieur',e_ttl:'Titre',e_ttl_d:'Le point vert final est ajouté par la carte.',e_se:'Afficher le libellé supérieur',e_st:'Afficher le titre',e_full:'Pleine largeur disponible sur tablette et ordinateur',e_full_d:'Désactivé, la carte reste étroite (460 px) au centre.',e_theme:'Thème',
   e_lang:'Langue',e_lang_auto:'Automatique (Home Assistant)',e_lang_d:'Automatique suit la langue de l’utilisateur dans Home Assistant. Si la langue n’est pas disponible, l’anglais est utilisé.'}
    };

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

  /* ------------------------------------------------------------------ CSS */
  const CARD_CSS = `
:host{display:block}
*{box-sizing:border-box}
.hc{--hc-accent:#0a7156;--hc-bg:#fafbf9;--hc-tile:#f0f2ef;--hc-circle:#ffffff;--hc-line:#e0e5df;--hc-fg:#18221c;--hc-muted:#56675c;--hc-btn-fg:#0a7156;
  --hc-warn-bg:#f9f3de;--hc-warn-bd:#d3bd63;--hc-warn-fg:#5f4a10;--hc-cold:#246a83;--hc-hot:#c2891a;--hc-cold-bg:#e3eff3;
  display:block;font-family:var(--ha-font-family-body,Roboto,Arial,sans-serif);color:var(--hc-fg);font-size:var(--ha-font-size-m,14px);line-height:1.4;text-align:left}
.hc[data-mode="dark"]{--hc-accent:#0e795d;--hc-bg:#101211;--hc-tile:#191c1a;--hc-circle:#282b29;--hc-line:#2b302c;--hc-fg:#f5f7f4;--hc-muted:#bbc5bd;--hc-btn-fg:#f5f7f4;
  --hc-warn-bg:#302b1b;--hc-warn-bd:#816e31;--hc-warn-fg:#f1d78b;--hc-cold:#5fa9c6;--hc-hot:#e0b94a;--hc-cold-bg:#1b2a30}
.hc :where(button,select,input){font:inherit;color:inherit}
.hc button{cursor:pointer;-webkit-tap-highlight-color:transparent}
*,*::before,*::after{-webkit-tap-highlight-color:transparent}
button:focus:not(:focus-visible),[tabindex]:focus:not(:focus-visible),dialog:focus{outline:none;box-shadow:none}
button:focus-visible{outline:2px solid var(--hc-accent);outline-offset:2px}
.hc ha-icon{display:flex;align-items:center;justify-content:center;line-height:0;flex:none;--mdc-icon-size:16px;width:16px;height:16px}
.cardw{container-type:inline-size;min-width:0;max-width:460px;margin:0 auto}
.hc[data-cw="full"] .cardw{max-width:none}
.shell{position:relative;background:var(--hc-bg);border:1px solid var(--hc-line);border-radius:26px;padding:18px}
.head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:2px 4px 17px}
.head>div:first-child{min-width:0}
.eye{font-size:10px;letter-spacing:1.7px;font-weight:750;color:var(--hc-muted);margin-bottom:7px;overflow-wrap:anywhere}
.title{font-size:25px;line-height:1.14;font-weight:780;letter-spacing:-.7px;overflow-wrap:anywhere}.title b{color:var(--hc-accent);font-weight:800}
.bchip{flex:none;display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 13px 0 10px;border-radius:999px;border:1px solid color-mix(in srgb,var(--hc-accent) 45%,transparent);background:color-mix(in srgb,var(--hc-accent) 12%,transparent);font-size:13.5px;line-height:1.2;font-weight:600;color:var(--hc-fg);white-space:nowrap}
.bchip i{width:9px;height:9px;border-radius:50%;background:var(--hc-accent);display:block}
.bchip.w{border-color:var(--hc-warn-bd);background:var(--hc-warn-bg);color:var(--hc-warn-fg)}.bchip.w i{background:var(--hc-hot)}
.bchip.k{border-color:color-mix(in srgb,var(--hc-cold) 50%,transparent);background:var(--hc-cold-bg);color:var(--hc-cold)}.bchip.k i{background:var(--hc-cold)}
.panel{background:linear-gradient(165deg,color-mix(in srgb,var(--hc-accent) 16%,var(--hc-tile)),var(--hc-tile) 62%);border:1px solid var(--hc-line);border-radius:24px;padding:12px 14px 10px;margin-bottom:10px;position:relative}
.lab{color:var(--hc-muted);font-size:10px;letter-spacing:1.3px;font-weight:600;text-transform:uppercase}
.hrow{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:6px 0 8px}
.big{font-size:29px;line-height:1.15;font-weight:650;letter-spacing:-.7px;font-variant-numeric:tabular-nums}
.hs{display:flex;flex-direction:column;align-items:flex-end;gap:4px;font-size:11px;color:var(--hc-muted)}
.dc{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 9px 0 3px;border-radius:999px;background:var(--hc-circle);border:1px solid var(--hc-line);font-size:11.5px;font-weight:700;color:var(--hc-fg);font-variant-numeric:tabular-nums;white-space:nowrap}
.dc i{width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:none}
.dc i ha-icon{--mdc-icon-size:11px;width:11px;height:11px}
.dc.up i{background:color-mix(in srgb,var(--hc-hot) 24%,transparent);color:var(--hc-hot)}
.dc.dn i{background:color-mix(in srgb,var(--hc-cold) 24%,transparent);color:var(--hc-cold)}
.dc.eq i{background:var(--hc-line);color:var(--hc-muted)}
.dc.lg{height:26px;font-size:13px;padding:0 11px 0 4px}.dc.lg i{width:19px;height:19px}.dc.lg i ha-icon{--mdc-icon-size:12px;width:12px;height:12px}
.ch{display:block;width:100%;height:auto;touch-action:pan-y;cursor:crosshair}
.ch text{font-family:inherit;font-size:9.5px;fill:var(--hc-muted);font-variant-numeric:tabular-nums}
.ch text.sc{font-weight:700;fill:var(--hc-fg);paint-order:stroke;stroke:var(--hc-tile);stroke-width:3px;stroke-linejoin:round}
.ax{display:flex;justify-content:space-between;font-size:9.5px;color:var(--hc-muted);margin-top:5px;font-variant-numeric:tabular-nums}
.cap{font-size:10.5px;line-height:14px;height:14px;color:var(--hc-muted);margin-top:7px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cap b{color:var(--hc-fg)}
.cap .sw{display:inline-block;width:14px;height:0;border-top:2.5px solid var(--hc-accent);vertical-align:middle;margin-right:3px;border-radius:2px}
.cap .sw.d{border-top:2px dashed var(--hc-muted);border-radius:0;width:16px}
.per{display:flex;width:100%;margin-top:9px;background:var(--hc-bg);border:1px solid var(--hc-line);border-radius:14px;padding:3px}
.per button{flex:1;border:0;background:none;border-radius:11px;padding:6px;min-height:32px;font-size:12px;font-weight:600;color:var(--hc-muted)}
.per button[aria-pressed="true"]{background:var(--hc-accent);color:#fff}
.lkrow{display:flex;align-items:center;justify-content:space-between;margin:12px 4px 7px}
.info{width:24px;height:24px;border-radius:50%;border:0;background:none;color:var(--hc-muted);display:flex;align-items:center;justify-content:center;padding:0}
.info ha-icon{--mdc-icon-size:18px;width:18px;height:18px}
.leg{position:absolute;left:14px;right:14px;top:70px;background:var(--hc-bg);border:1px solid var(--hc-line);border-radius:20px;padding:14px;box-shadow:0 10px 30px #0004;z-index:4;font-size:12px;color:var(--hc-muted)}
.leg b{display:block;color:var(--hc-fg);font-size:15px;margin-bottom:8px}.leg p{margin:0 0 6px}
.tg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.tl{position:relative;display:flex;flex-direction:column;gap:2px;text-align:left;padding:10px 12px;border-radius:18px;border:1px solid var(--hc-line);background:var(--hc-tile);min-width:0}
.tl.hot{background:var(--hc-warn-bg);border-color:var(--hc-warn-bd)}
.tl.cold{background:var(--hc-cold-bg);border-color:color-mix(in srgb,var(--hc-cold) 45%,transparent)}
.tl .tn{font-size:11.5px;font-weight:650;color:var(--hc-muted);display:flex;align-items:center;gap:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tl .tn ha-icon{--mdc-icon-size:13px;width:13px;height:13px}
.tl .tt{font-size:21px;line-height:1.15;font-weight:600;letter-spacing:0;font-variant-numeric:tabular-nums;margin-top:1px}
.tl.hot .tt{color:var(--hc-warn-fg)}.tl.cold .tt{color:var(--hc-cold)}.tl.na .tt{color:var(--hc-muted)}
.tl .td{display:flex;align-items:center;gap:4px;min-height:16px;font-size:11px;font-weight:650;color:var(--hc-muted);font-variant-numeric:tabular-nums}
.tl .td ha-icon{--mdc-icon-size:12px;width:12px;height:12px}
.bar{position:relative;height:8px;border-radius:99px;background:var(--hc-line);margin-top:6px}
.bar i{position:absolute;top:0;height:8px;display:block}
.bar .band{background:color-mix(in srgb,var(--hc-accent) 28%,transparent)}
.bar .rng{top:2px;height:4px;border-radius:99px;background:var(--hc-muted);opacity:.55}
.bar .dot{top:-3px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:var(--hc-accent);border:2.5px solid var(--hc-tile);box-sizing:border-box}
.bar .dot.cold{background:var(--hc-cold)}.bar .dot.hot{background:var(--hc-hot)}
.empty{padding:26px 10px;text-align:center;color:var(--hc-muted);font-size:13px}
@container (min-width:560px){.tg{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container (max-width:380px){.shell{padding:13px;border-radius:23px}.title{font-size:23px}.big{font-size:25px}.tl .tt{font-size:19px}.head{margin:2px 4px 12px}.panel{padding:10px 12px 9px}}
@media(max-width:420px){.shell{padding:13px;border-radius:23px}.title{font-size:23px}.big{font-size:25px}.tl .tt{font-size:19px}.head{margin:2px 4px 12px}.panel{padding:10px 12px 9px}}
@container (max-width:340px){.bchip{padding:0 10px 0 8px;font-size:11.5px}}
@container (max-width:310px){.shell{padding:10px}.title{font-size:21px}.eye{font-size:9px}}
/* popup: fixed centred dialog, same rules as the other cards */
.ov{position:fixed;inset:0;margin:0;width:100%;height:100%;max-width:none;max-height:none;border:0;z-index:9999;overscroll-behavior:contain;overflow:hidden;color:inherit;background:#0009;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left))}
.ov:not([open]){display:none}.ov[open]{display:flex}.ov::backdrop{background:transparent}
.dlg{width:min(390px,100%);max-width:100%;max-height:100%;min-width:0;align-self:center;height:min(calc(100vh - 40px),680px);height:var(--dh,min(calc(100dvh - 40px),680px));display:flex;flex-direction:column;background:var(--hc-bg);color:var(--hc-fg);border:1px solid var(--hc-line);border-radius:26px;overflow:hidden;box-shadow:0 18px 60px #0005}
:host([data-popup="wide"]) .dlg{width:min(1120px,100%);height:min(80vh,560px);height:var(--dh,min(80dvh,560px))}
.mh{flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 16px 12px 18px;background:var(--hc-bg);border-bottom:1px solid var(--hc-line)}
.mt{flex:1;min-width:0;margin:0;font-size:17px;font-weight:600;line-height:1.3}
.x{display:grid;place-items:center;line-height:0;margin:0;padding:0;width:40px;height:40px;flex:none;border:1px solid var(--hc-line);border-radius:50%;background:var(--hc-tile);color:var(--hc-fg)}
.x ha-icon{--mdc-icon-size:20px;width:20px;height:20px}
.mb{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;padding:12px 18px 18px;min-width:0}
:host([data-popup="wide"]) .mb{padding:12px 22px 22px}
.cr{display:flex;flex-wrap:wrap;gap:8px 18px;margin-bottom:4px}
.seg2{display:flex;background:var(--hc-tile);border:1px solid var(--hc-line);border-radius:14px;padding:3px;margin:6px 0}
.cr .seg2{flex:1 1 260px;max-width:420px}
.seg2 button{flex:1;border:0;background:none;border-radius:11px;padding:8px 6px;font-size:12.5px;font-weight:600;color:var(--hc-muted);min-height:36px}
.seg2 button[aria-pressed="true"]{background:var(--hc-bg);color:var(--hc-fg);box-shadow:0 1px 4px #0002}
.mrow{display:flex;flex-direction:row-reverse;gap:22px;align-items:flex-start;margin-top:2px}.mcol{flex:1 1 0;min-width:0}
.acc{border:1px solid var(--hc-line);border-radius:20px;background:var(--hc-tile);margin-top:8px;overflow:hidden}
.ah{display:flex;align-items:center;gap:10px;width:100%;border:0;background:none;padding:12px 14px;text-align:left}
.ah .an{flex:1;min-width:0;font-size:14px;line-height:1.3;font-weight:600;overflow-wrap:anywhere}
.ah .at{font-size:14px;font-weight:600;font-variant-numeric:tabular-nums}
.ah .dtp{width:10px;height:10px;border-radius:50%;background:var(--hc-accent);flex:none}.ah .dtp.hot{background:var(--hc-hot)}.ah .dtp.cold{background:var(--hc-cold)}.ah .dtp.na{background:var(--hc-muted)}
.ah ha-icon{transition:transform .15s;color:var(--hc-muted)}
.acc.open .ah ha-icon{transform:rotate(90deg)}
.ab{display:none;border-top:1px solid var(--hc-line);background:var(--hc-bg)}
.acc.open .ab{display:block}
.ban{display:flex;align-items:center;gap:10px;margin:10px 12px 4px;padding:11px 12px;border-radius:16px;border:1px solid var(--bd);background:var(--bg);color:var(--fg)}
.ban.w{--bd:var(--hc-warn-bd);--bg:var(--hc-warn-bg);--fg:var(--hc-warn-fg)}
.ban.k{--bd:color-mix(in srgb,var(--hc-cold) 45%,transparent);--bg:var(--hc-cold-bg);--fg:var(--hc-cold)}
.ban.o{--bd:color-mix(in srgb,var(--hc-accent) 40%,transparent);--bg:color-mix(in srgb,var(--hc-accent) 11%,transparent);--fg:var(--hc-accent)}
.ban.n{--bd:var(--hc-line);--bg:var(--hc-tile);--fg:var(--hc-muted)}
.hc[data-mode="dark"] .ban.o{--fg:#7fd9bd}
.ban .bi{flex:none;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--fg) 16%,transparent)}
.ban .bt{min-width:0;display:flex;flex-direction:column;gap:2px}
.ban strong{font-size:12px;font-weight:600;line-height:1.3}.ban small{font-size:11px;line-height:1.35;overflow-wrap:anywhere}
.er{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:9px 12px;border-top:1px solid var(--hc-line)}
.ban+.er,.er:first-child{border-top:0}
.ico{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--hc-circle);color:var(--hc-accent);flex:none}
.er .t{flex:1;min-width:0}.er .n{font-size:14px;line-height:1.3;font-weight:600;overflow-wrap:anywhere}.er .s{font-size:11.5px;line-height:1.4;color:var(--hc-muted);margin-top:2px;overflow-wrap:anywhere}
.er .vr{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.er .v{font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
.er .rbw{flex:0 0 100%;padding:2px 0 2px 38px}
.er.hot .ico{background:var(--hc-warn-bg);box-shadow:inset 0 0 0 1px var(--hc-warn-bd);color:var(--hc-warn-fg)}
.er.cold .ico{background:var(--hc-cold-bg);color:var(--hc-cold)}
.er.na .ico{color:var(--hc-muted)}.er.na .v{color:var(--hc-muted)}
.rb{position:relative;height:12px;border-radius:99px;background:repeating-linear-gradient(135deg,transparent 0 3px,color-mix(in srgb,var(--hc-muted) 20%,transparent) 3px 4px),var(--hc-line)}
.rb .rf{position:absolute;left:0;top:0;bottom:0;border-radius:99px}
.rb .now{position:absolute;top:50%;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:var(--hc-fg);border:3px solid var(--hc-tile);box-sizing:border-box}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;
  const EDITOR_CSS = `
:host{display:block;color:var(--primary-text-color,#19221E);font-family:var(--ha-font-family-body,Roboto,Arial,sans-serif)}
*{box-sizing:border-box}
.ed{font-size:14px}
button,input,select{font:inherit;color:inherit}
.tabs{display:flex;gap:5px;overflow-x:auto;padding-bottom:14px;border-bottom:1px solid var(--divider-color,#E1E5E1)}
.tab{border:0;background:none;color:var(--secondary-text-color,#68716C);border-radius:13px;padding:10px 13px;white-space:nowrap;cursor:pointer}
.tab[aria-pressed="true"]{color:var(--primary-text-color,#19221E);background:var(--secondary-background-color,#F1F3EF);font-weight:650}
.heading{font-size:21px;font-weight:500;margin:25px 0 9px}
.desc{color:var(--secondary-text-color,#68716C);font-size:13px;line-height:1.5;margin-bottom:20px}
.field{display:block;margin:18px 0}
.label{font-size:14px;margin-bottom:10px}
.input{display:block;width:100%;background:var(--secondary-background-color,#F1F3EF);color:var(--primary-text-color,#19221E);border:0;border-bottom:1px solid var(--divider-color,#E1E5E1);padding:14px 13px;min-height:50px;border-radius:11px 11px 0 0}
.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.row{border-bottom:1px solid var(--divider-color,#E1E5E1);padding:13px 0;display:flex;align-items:center;justify-content:space-between;gap:15px}
.row label{flex:1;min-width:0}
.row input[type=checkbox]{width:18px;height:18px;accent-color:var(--primary-color,#064E3B);flex:none}
.muted{font-size:12px;line-height:1.5;color:var(--secondary-text-color,#68716C)}
.tiny{font-size:11px;color:var(--secondary-text-color,#68716C);margin:9px 0}
.action{background:var(--secondary-background-color,#F1F3EF);border:1px solid var(--divider-color,#E1E5E1);color:var(--primary-text-color,#19221E);padding:5px 9px;min-width:34px;border-radius:10px;cursor:pointer}
.action:disabled{opacity:.45;cursor:not-allowed}
.mod{border-bottom:1px solid var(--divider-color,#E1E5E1);padding:16px 0}
.mh{display:flex;align-items:center;gap:10px}
.mh .nm{flex:1;min-width:0;font-weight:600;font-size:15px}
.ctl{display:flex;gap:6px;flex:none}
.mb{margin-top:10px}
.chk{display:flex;align-items:center;gap:10px;margin:8px 0;font-size:13px}
.chk input{width:18px;height:18px;accent-color:var(--primary-color,#064E3B)}
`;

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
      this._onResize = () => {
        this._applyLayout();
        if (!this._popup) return;
        const dlg = this._root && this._root.querySelector('dialog.ov');
        if (dlg && window.innerWidth !== this._pinW) { dlg.style.removeProperty('--dh'); this._pinH(dlg); }
      };
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
      const cfg = this._cfg, h = this._hass, per = this._per, D = m.D, sl0 = this._data[per], pend = !sl0 || sl0.busy;
      return m.rooms.map((r) => {
        const rows = [];
        cfg.order.forEach((k) => {
          if (!cfg.modules[k].on) return;
          if (k === 'temps') {
            r.temps.forEach((id) => {
              const s = stOf(h, id), v = numOf(s), e = D && D.ent[id];
              const st = v == null ? 'na' : v < cfg.comfort_min ? 'cold' : v > cfg.comfort_max ? 'hot' : 'ok';
              const l = []; let d = null, series = null, ph = false;
              if (v == null) l.push(T('na'));
              else if (e) {
                const f0 = firstOf(e.cur.b);
                if (f0 != null) { d = v - f0; l.push(T('var_', { p: T('s' + per) })); }
                if (e.cur.mn != null && e.cur.mx != null) l.push(T('minmax', { a: fmt(e.cur.mn), b: fmt(e.cur.mx) }));
                series = e.cur.b;
              } else if (D === null && pend) { ph = true; l.push('\u00a0', '\u00a0'); }
              rows.push({ id: id, icon: 'mdi:thermometer', s: st, n: r.temps.length === 1 ? T('temp') : nameOf(s, id), l: l, v: v == null ? '—' : fmt(v) + uOf(s), d: d, series: series, ph: ph });
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
        g.rows.map((x) => '<div class="er ' + (x.s !== 'ok' ? x.s : '') + '"><span class="ico">' + ic(x.icon) + '</span><div class="t"><div class="n">' + esc(x.n) + '</div>' + x.l.map((l) => '<div class="s">' + esc(l) + '</div>').join('') + '</div><div class="vr"><div class="v">' + esc(x.v) + '</div>' + (x.d != null ? chipHTML(x.d) : x.ph ? '<span style="visibility:hidden">' + chipHTML(0) + '</span>' : '') + '</div>' +
          (x.series ? '<div class="rbw">' + this._ribbon(x.series) + this._axis(m) + '</div>' : x.ph ? '<div class="rbw"><div class="rb"></div>' + this._axis(m) + '</div>' : '') + '</div>').join('') + '</div></div>';
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
        this._pinH(modal);
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
    // Fixes the sheet height at open: on iOS the browser bars change the viewport height while the popup is open, which made the sheet resize and show the card behind it.
    _pinH(modal) {
      const vh = window.innerHeight || 0;
      this._pinW = window.innerWidth;
      const h = this._root.host && this._root.host.getAttribute('data-popup') === 'wide' ? Math.min(vh * 0.8, 560) : Math.min(vh - 40, 680);
      if (h > 200) modal.style.setProperty('--dh', Math.round(h) + 'px');
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
