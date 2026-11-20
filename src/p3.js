
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
.dlg{width:min(390px,100%);max-width:100%;min-width:0;align-self:center;height:min(calc(100vh - 40px),680px);height:min(calc(100dvh - 40px),680px);display:flex;flex-direction:column;background:var(--hc-bg);color:var(--hc-fg);border:1px solid var(--hc-line);border-radius:26px;overflow:hidden;box-shadow:0 18px 60px #0005}
:host([data-popup="wide"]) .dlg{width:min(1120px,100%);height:min(80vh,560px);height:min(80dvh,560px)}
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
