/*
 * peanut-mascots.js — verbatim port of the extension's persona SVG builder.
 *
 * Source of truth: chrome-extension/extension/sidepanel.js
 *   - PEANUT_MOUTHS / BODY_PATHS (lines ~199–224)
 *   - buildPeanutSVG (lines ~226–333)
 *   - personaMascotHTML (lines ~335–542)
 *
 * Ported verbatim so the marketing site renders the real extension mascots,
 * not stylized stand-ins. Keep in sync when the extension's mascot code
 * changes.
 *
 * Usage on the site:
 *   <div class="peanut-mascot" data-persona="producer" data-pack="howard"></div>
 * This script populates every matching element on DOMContentLoaded; also
 * exposes window.PGMascots.render(personaId, packId) for programmatic use.
 */
(function () {
  "use strict";

  const PEANUT_MOUTHS = {
    smile: `<path d="M28.5 24c1.5 1.6 5.5 1.6 7 0" fill="none" stroke="#1E1208" stroke-width="1.3" stroke-linecap="round"/>`,
    smirk: `<path d="M28 24q3 2 7 -.6" fill="none" stroke="#1E1208" stroke-width="1.4" stroke-linecap="round"/>`,
    grin: `<path d="M27.5 23.2q4.5 3.8 9 0 -4.5 2 -9 0Z" fill="#1E1208" stroke="#1E1208" stroke-width="1" stroke-linejoin="round"/>`,
    flat: `<path d="M29 24.2h6" fill="none" stroke="#1E1208" stroke-width="1.3" stroke-linecap="round"/>`,
    open: `<ellipse cx="32" cy="24.2" rx="2.2" ry="1.6" fill="#1E1208"/>`,
  };

  const BODY_PATHS = {
    peanut:
      "M32 4C22 4 18 10 18 19c0 5 3 8 6 10-4 2-10 6-10 16 0 9 8 15 18 15s18-6 18-15c0-10-6-14-10-16 3-2 6-5 6-10 0-9-4-15-14-15Z",
    egg:
      "M32 8C21 8 15 20 15 33c0 14 7 23 17 23s17-9 17-23C49 20 43 8 32 8Z",
    potato:
      "M30 7C23 7 19 10 18 15 13 17 13 24 17 26 12 30 13 38 17 40 13 45 16 54 24 55 32 58 41 57 46 52 52 50 51 42 47 39 53 36 51 28 47 26 52 22 48 15 43 14 41 8 36 7 33 6 31 6 30 7Z",
  };

  function buildPeanutSVG(opts) {
    const ns = opts.ns;
    const face = opts.face || "smile";
    const prop = opts.prop || "";
    const extraDefs = opts.extraDefs || "";
    const bodyStops =
      opts.bodyStops ||
      `
      <stop offset="0%"   stop-color="#FFF4D6"/>
      <stop offset="28%"  stop-color="#F5CB78"/>
      <stop offset="56%"  stop-color="#DFAE70"/>
      <stop offset="80%"  stop-color="#C0874A"/>
      <stop offset="93%"  stop-color="#CA9460"/>
      <stop offset="100%" stop-color="#7898B8"/>`;
    const bodyStroke = opts.bodyStroke || "#8B5E2F";
    const bodyShape = opts.bodyShape || "peanut";
    const eyesLight = !!opts.eyesLight;
    const showShellGrooves = opts.showShellGrooves !== false;

    const eyes = eyesLight
      ? `<circle cx="27" cy="19" r="2.8" fill="#fff"/>
         <circle cx="37" cy="19" r="2.8" fill="#fff"/>
         <ellipse cx="27" cy="19.4" rx="1.3" ry="1.8" fill="#1E1208"/>
         <ellipse cx="37" cy="19.4" rx="1.3" ry="1.8" fill="#1E1208"/>
         <circle cx="27.5" cy="18.6" r=".55" fill="#fff"/>
         <circle cx="37.5" cy="18.6" r=".55" fill="#fff"/>`
      : `<ellipse cx="27" cy="19" rx="2.1" ry="2.6" fill="#1E1208"/>
         <ellipse cx="37" cy="19" rx="2.1" ry="2.6" fill="#1E1208"/>
         <circle cx="27.6" cy="18.2" r=".8" fill="#fff"/>
         <circle cx="37.6" cy="18.2" r=".8" fill="#fff"/>`;

    const depthFilter = `
      <filter id="peanutDepth-${ns}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.8" result="bump"/>
        <feSpecularLighting in="bump" surfaceScale="7" specularConstant="0.9" specularExponent="24" result="specRaw" lighting-color="#FFFAF0">
          <feDistantLight azimuth="135" elevation="48">
            <animate attributeName="azimuth" values="120;150;120" dur="3.5s" repeatCount="indefinite" begin="indefinite"/>
          </feDistantLight>
        </feSpecularLighting>
        <feComposite in="specRaw" in2="SourceAlpha" operator="in" result="spec"/>
        <feDiffuseLighting in="bump" surfaceScale="7" diffuseConstant="0.4" result="diffRaw" lighting-color="#FFE4A8">
          <feDistantLight azimuth="135" elevation="48"/>
        </feDiffuseLighting>
        <feComposite in="diffRaw" in2="SourceAlpha" operator="in" result="diffMasked"/>
        <feComponentTransfer in="diffMasked" result="diff">
          <feFuncR type="linear" slope="0.5" intercept="0.5"/>
          <feFuncG type="linear" slope="0.5" intercept="0.5"/>
          <feFuncB type="linear" slope="0.5" intercept="0.5"/>
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="spec" mode="screen" result="withSpec"/>
        <feBlend in="withSpec" in2="diff" mode="multiply" result="lit"/>
        <feMorphology in="SourceAlpha" operator="erode" radius="3" result="eroded"/>
        <feGaussianBlur in="eroded" stdDeviation="3" result="aoBlur"/>
        <feComposite in="SourceAlpha" in2="aoBlur" operator="out" result="aoMask"/>
        <feFlood flood-color="#6B2F00" flood-opacity="0.25" result="aoFill"/>
        <feComposite in="aoFill" in2="aoMask" operator="in" result="ao"/>
        <feMerge><feMergeNode in="lit"/><feMergeNode in="ao"/></feMerge>
      </filter>`;

    return `<svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="mbody-${ns}" cx="38%" cy="30%" r="72%">${bodyStops}</radialGradient>${depthFilter}${extraDefs}
      </defs>
      <g transform="translate(32 32) scale(1.10) translate(-32 -32)">
        <path d="${BODY_PATHS[bodyShape] || BODY_PATHS.peanut}" fill="url(#mbody-${ns})" stroke="${bodyStroke}" stroke-width="1.4" stroke-linejoin="round" filter="url(#peanutDepth-${ns})"/>
        ${showShellGrooves ? `<path d="M21 14c3 1 6 1 8 0M35 14c3 1 5 1 8 0" fill="none" stroke="${bodyStroke}" stroke-width=".8" stroke-linecap="round" opacity=".5"/>` : ""}
        <ellipse cx="25" cy="11" rx="5.5" ry="3" fill="#FFF5DF" opacity=".55"/>
        ${eyes}
        ${PEANUT_MOUTHS[face] || PEANUT_MOUTHS.smile}
        ${prop}
      </g>
    </svg>`;
  }

  function personaMascotHTML(personaId, packId) {
    const pack = packId || "howard";
    const ns = `${pack}-${personaId}`;

    // ── Howard pack ──
    if (pack === "howard" && personaId === "producer") {
      return buildPeanutSVG({
        ns,
        face: "smile",
        extraDefs: `<linearGradient id="mclip-${ns}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#A47E4D"/><stop offset="100%" stop-color="#69482A"/></linearGradient>`,
        prop: `
          <path d="M19 39c-3 2-3 5-1 7M45 39c3 2 3 5 1 7" fill="none" stroke="#8B5E2F" stroke-width="2.6" stroke-linecap="round"/>
          <rect x="19" y="36" width="26" height="19" rx="1.8" fill="url(#mclip-${ns})" stroke="#3E2A14" stroke-width="1"/>
          <rect x="28" y="33.8" width="8" height="3.4" rx=".8" fill="#3E2A14"/>
          <circle cx="32" cy="35.5" r=".8" fill="#A8A6A0"/>
          <rect x="21" y="39" width="22" height="14" rx=".5" fill="#F6F0E2"/>
          <path d="M25 48l4 4 9-9" fill="none" stroke="#3b82f6" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
      });
    }
    if (pack === "howard" && personaId === "troll") {
      return buildPeanutSVG({
        ns,
        face: "smirk",
        eyesLight: true,
        bodyStroke: "#2A1408",
        bodyStops: `
          <stop offset="0%" stop-color="#8B5530"/>
          <stop offset="55%" stop-color="#5A3018"/>
          <stop offset="100%" stop-color="#2F1608"/>`,
        prop: `
          <ellipse cx="40" cy="14" rx="2" ry="4" fill="#FFF" opacity=".22" transform="rotate(25 40 14)"/>
          <ellipse cx="43" cy="40" rx="2.5" ry="5" fill="#FFF" opacity=".18" transform="rotate(-18 43 40)"/>
          <ellipse cx="16" cy="30" rx="1.1" ry="1.5" fill="#B8CED9" opacity=".85"/>
          <ellipse cx="47" cy="38" rx="1.2" ry="1.6" fill="#B8CED9" opacity=".85"/>
          <ellipse cx="22" cy="52" rx=".9" ry="1.3" fill="#B8CED9" opacity=".8"/>
          <ellipse cx="44" cy="54" rx="1" ry="1.4" fill="#B8CED9" opacity=".8"/>
          <ellipse cx="45" cy="20" rx=".9" ry="1.3" fill="#B8CED9" opacity=".8"/>`,
      });
    }
    if (pack === "howard" && personaId === "soundfx") {
      return buildPeanutSVG({
        ns,
        face: "flat",
        prop: `
          <path d="M14 18Q32 2 50 18" fill="none" stroke="#3E2A14" stroke-width="2.2" stroke-linecap="round"/>
          <ellipse cx="15" cy="22" rx="4.5" ry="5.5" fill="#a855f7" stroke="#3E2A14" stroke-width="1.2"/>
          <ellipse cx="49" cy="22" rx="4.5" ry="5.5" fill="#a855f7" stroke="#3E2A14" stroke-width="1.2"/>
          <ellipse cx="15" cy="22" rx="2" ry="3" fill="#6B0F87"/>
          <ellipse cx="49" cy="22" rx="2" ry="3" fill="#6B0F87"/>
          <ellipse cx="14" cy="20" rx=".9" ry="1.4" fill="#fff" opacity=".4"/>
          <ellipse cx="48" cy="20" rx=".9" ry="1.4" fill="#fff" opacity=".4"/>`,
      });
    }
    if (pack === "howard" && personaId === "joker") {
      return buildPeanutSVG({
        ns,
        face: "grin",
        prop: `
          <path d="M22 42q-2 4 6 4M42 42q2 4 -6 4" fill="none" stroke="#8B5E2F" stroke-width="2.6" stroke-linecap="round"/>
          <rect x="30.5" y="42" width="3" height="14" rx="1" fill="#2A2A2A"/>
          <rect x="26" y="55.5" width="12" height="2" rx=".5" fill="#2A2A2A"/>
          <ellipse cx="32" cy="38" rx="6" ry="7" fill="#2A2A2A" stroke="#f59e0b" stroke-width="1.2"/>
          <path d="M28 35h8M28 38h8M28 41h8" stroke="#555" stroke-width=".6"/>
          <ellipse cx="30" cy="34.5" rx="1.2" ry="1.8" fill="#fff" opacity=".3"/>`,
      });
    }

    // ── TWiST pack ──
    if (pack === "twist" && personaId === "producer") {
      return buildPeanutSVG({
        ns,
        face: "smile",
        prop: `
          <path d="M17 13Q14 22 15 34Q17 40 20 36Q19 24 19 13Z" fill="#B88746" stroke="#7A4A1C" stroke-width=".4" stroke-linejoin="round"/>
          <path d="M47 13Q50 22 49 34Q47 40 44 36Q45 24 45 13Z" fill="#B88746" stroke="#7A4A1C" stroke-width=".4" stroke-linejoin="round"/>
          <path d="M18 14Q20 6 28 5Q32 4 36 5Q44 6 46 14Q43 11 38 10.5Q34 10 32 12Q30 10 26 10.5Q21 11 18 14Z" fill="#D9A860" stroke="#7A4A1C" stroke-width=".5" stroke-linejoin="round"/>
          <path d="M32 5.5L32 11.5" stroke="#8B5A22" stroke-width=".35" opacity=".55"/>
          <path d="M22 9Q20 22 19 34" stroke="#F2CF8A" stroke-width=".5" fill="none" opacity=".8"/>
          <path d="M42 9Q44 22 45 34" stroke="#F2CF8A" stroke-width=".5" fill="none" opacity=".8"/>
          <path d="M19 15Q21 13 25 12" stroke="#F2CF8A" stroke-width=".4" fill="none" opacity=".7"/>
          <path d="M45 15Q43 13 39 12" stroke="#F2CF8A" stroke-width=".4" fill="none" opacity=".7"/>
          <path d="M19 39q-2 3 1 7M45 39q2 3 -1 7" fill="none" stroke="#8B5E2F" stroke-width="2.6" stroke-linecap="round"/>
          <rect x="20" y="38" width="24" height="18" rx="1" fill="#F0EADA" stroke="#3E2A14" stroke-width="1"/>
          <path d="M23 37v2M27 37v2M31 37v2M35 37v2M39 37v2M43 37v2" stroke="#3E2A14" stroke-width="1" stroke-linecap="round"/>
          <line x1="23" y1="44" x2="40" y2="44" stroke="#3b82f6" stroke-width="1" stroke-linecap="round"/>
          <line x1="23" y1="47" x2="36" y2="47" stroke="#9CA3AF" stroke-width=".7" stroke-linecap="round"/>
          <line x1="23" y1="50" x2="39" y2="50" stroke="#3b82f6" stroke-width="1" stroke-linecap="round"/>
          <line x1="23" y1="53" x2="34" y2="53" stroke="#9CA3AF" stroke-width=".7" stroke-linecap="round"/>`,
      });
    }
    if (pack === "twist" && personaId === "troll") {
      return buildPeanutSVG({
        ns,
        face: "open",
        extraDefs: `<linearGradient id="mmega-${ns}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#8B1010"/><stop offset="60%" stop-color="#ef4444"/><stop offset="100%" stop-color="#C11A00"/></linearGradient>`,
        prop: `
          <path d="M18 15Q17 8 25 7Q32 5.5 39 7Q46 8 47 15Q44 11 39 10.5Q34 10 31 11.5Q27 10.5 24 11Q20 12 18 15Z" fill="#C88A4A" stroke="#7A4A1C" stroke-width=".5" stroke-linejoin="round"/>
          <path d="M25 7.5Q26 10 29 12" stroke="#7A4A1C" stroke-width=".5" fill="none" opacity=".75"/>
          <path d="M29 9Q35 8.3 43 10" stroke="#EAB884" stroke-width=".7" fill="none" opacity=".85"/>
          <path d="M30 11Q36 10.5 44 12" stroke="#D9A366" stroke-width=".45" fill="none" opacity=".7"/>
          <path d="M22 44q-3 4 2 8M42 44q4 4 -2 8" fill="none" stroke="#8B5E2F" stroke-width="2.6" stroke-linecap="round"/>
          <path d="M22 40L50 32L52 54L26 54Z" fill="url(#mmega-${ns})" stroke="#7A0000" stroke-width="1.2" stroke-linejoin="round"/>
          <ellipse cx="51" cy="43" rx="2.2" ry="10" fill="#7A0000" opacity=".85"/>
          <path d="M24 41L25 48" stroke="#FFF" stroke-width="1.2" opacity=".4" stroke-linecap="round"/>
          <path d="M55 30q4 1 5 4M56 42q4 0 6 -1M55 55q4 1 5 4" fill="none" stroke="#ef4444" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>`,
      });
    }
    if (pack === "twist" && personaId === "soundfx") {
      return buildPeanutSVG({
        ns,
        face: "flat",
        bodyShape: "egg",
        bodyStroke: "#D8C89A",
        showShellGrooves: false,
        bodyStops: `
          <stop offset="0%"   stop-color="#FFFFFF"/>
          <stop offset="92%"  stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#F2EEE2"/>`,
        prop: `
          <path d="M19 42q-2 3 1 6M45 42q2 3 -1 6" fill="none" stroke="#8B5E2F" stroke-width="2.6" stroke-linecap="round"/>
          <rect x="19" y="42" width="26" height="14" rx=".8" fill="#2A2A2A" stroke="#000" stroke-width="1"/>
          <rect x="21" y="44" width="22" height="10" fill="#4A3E28"/>
          <line x1="21" y1="48" x2="43" y2="48" stroke="#2A2A2A" stroke-width=".5"/>
          <line x1="21" y1="51" x2="43" y2="51" stroke="#2A2A2A" stroke-width=".5"/>
          <rect x="23" y="45" width="6" height="2" rx=".3" fill="#a855f7"/>
          <rect x="19" y="37" width="26" height="5" fill="#2A2A2A"/>
          <polygon points="19,37 22,37 25,42 22,42" fill="#fff"/>
          <polygon points="25,37 28,37 31,42 28,42" fill="#fff"/>
          <polygon points="31,37 34,37 37,42 34,42" fill="#fff"/>
          <polygon points="37,37 40,37 43,42 40,42" fill="#fff"/>
          <polygon points="43,37 45,37 45,40 44,40" fill="#fff"/>`,
      });
    }
    if (pack === "twist" && personaId === "joker") {
      return buildPeanutSVG({
        ns,
        face: "smirk",
        bodyShape: "potato",
        bodyStroke: "#8A6638",
        showShellGrooves: false,
        bodyStops: `
          <stop offset="0%"   stop-color="#FBE8BE"/>
          <stop offset="35%"  stop-color="#E8C487"/>
          <stop offset="70%"  stop-color="#C89A5E"/>
          <stop offset="93%"  stop-color="#A8824A"/>
          <stop offset="100%" stop-color="#8A6638"/>`,
        prop: `
          <path d="M24 11Q21 8 20 5" stroke="#3F7A2E" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M20 5Q13 4 13.5 8.5Q18 9.5 20 5Z" fill="#5AA840" stroke="#2E5F22" stroke-width=".5" stroke-linejoin="round"/>
          <path d="M20 5Q26 3.5 27 7Q22.5 8 20 5Z" fill="#7ACB52" stroke="#2E5F22" stroke-width=".5" stroke-linejoin="round"/>
          <path d="M15 7.5Q17 7 19 6" stroke="#2E5F22" stroke-width=".35" fill="none" opacity=".6"/>
          <ellipse cx="22" cy="24" rx="1.4" ry="1.6" fill="#F3D39A" opacity=".7"/>
          <ellipse cx="22" cy="24" rx=".9" ry="1.1" fill="#3E2A14" opacity=".85"/>
          <ellipse cx="44" cy="17" rx="1.2" ry="1.4" fill="#F3D39A" opacity=".6"/>
          <ellipse cx="44" cy="17" rx=".7" ry="1.0" fill="#3E2A14" opacity=".8"/>
          <ellipse cx="48" cy="30" rx="1.6" ry="1.8" fill="#F3D39A" opacity=".65"/>
          <ellipse cx="48" cy="30" rx="1.1" ry="1.3" fill="#3E2A14" opacity=".8"/>
          <ellipse cx="17" cy="36" rx="1.3" ry="1.5" fill="#F3D39A" opacity=".65"/>
          <ellipse cx="17" cy="36" rx=".8" ry="1.0" fill="#3E2A14" opacity=".85"/>
          <path d="M19 39q-2 3 1 7M45 39q2 3 -1 7" fill="none" stroke="#5A3A18" stroke-width="2.6" stroke-linecap="round"/>
          <circle cx="32" cy="45" r="10" fill="#F6F0E2" stroke="#3E2A14" stroke-width="1.2"/>
          <path d="M32 45L32 35A10 10 0 0 1 40.7 50Z" fill="#f59e0b"/>
          <path d="M32 45L40.7 50A10 10 0 0 1 24 49Z" fill="#ef4444"/>
          <path d="M32 45L24 49A10 10 0 0 1 32 35Z" fill="#3b82f6"/>
          <circle cx="32" cy="45" r="1.2" fill="#3E2A14"/>`,
      });
    }

    return null;
  }

  function renderAll() {
    const nodes = document.querySelectorAll("[data-mascot-persona]");
    nodes.forEach((el) => {
      const persona = el.getAttribute("data-mascot-persona");
      const pack = el.getAttribute("data-mascot-pack") || "howard";
      const svg = personaMascotHTML(persona, pack);
      if (svg) el.innerHTML = svg;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderAll);
  } else {
    renderAll();
  }

  // Exposed for ad-hoc rendering (e.g., pack swap demos).
  window.PGMascots = { render: personaMascotHTML, renderAll: renderAll };
})();
