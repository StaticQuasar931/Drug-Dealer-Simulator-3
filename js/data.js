'use strict';
/* ══════════════════════════════════════════════════════
   GAME DATA  —  Drug Dealer Simulator 3
   All SVGs, products, workers, upgrades, fronts, events
══════════════════════════════════════════════════════ */

/* ── Drug SVG Icons (48×48 viewBox) ── */
const ICONS = {

vape_disp:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="17" y="8" width="14" height="30" rx="4" fill="#4F46E5"/>
  <rect x="19" y="12" width="10" height="6" rx="1.5" fill="#818CF8" opacity="0.9"/>
  <rect x="20" y="21" width="8" height="2" rx="1" fill="#312E81" opacity="0.5"/>
  <rect x="20" y="25" width="8" height="2" rx="1" fill="#312E81" opacity="0.5"/>
  <circle cx="24" cy="32" r="2.5" fill="#6EE7B7"/>
  <rect x="19" y="4" width="10" height="6" rx="3" fill="#312E81"/>
  <path d="M21 4 Q19 1 21 0" stroke="#C7D2FE" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M27 4 Q29 1 27 0" stroke="#C7D2FE" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M24 4 Q24 1 24 0" stroke="#A5B4FC" stroke-width="1.2" fill="none" stroke-linecap="round"/>
</svg>`,

nicpod:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="14" width="11" height="22" rx="3" fill="#2563EB"/>
  <rect x="10" y="17" width="7" height="8" rx="1" fill="#60A5FA" opacity="0.8"/>
  <circle cx="13.5" cy="31" r="1.8" fill="#BFDBFE"/>
  <rect x="29" y="14" width="11" height="22" rx="3" fill="#1D4ED8"/>
  <rect x="31" y="17" width="7" height="8" rx="1" fill="#93C5FD" opacity="0.8"/>
  <circle cx="34.5" cy="31" r="1.8" fill="#BFDBFE"/>
  <path d="M13.5 14 Q12 10 13.5 8" stroke="#93C5FD" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M34.5 14 Q36 10 34.5 8" stroke="#93C5FD" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>`,

thc_cart:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="19" y="6" width="10" height="33" rx="2.5" fill="#334155" stroke="#64748B" stroke-width="0.5"/>
  <rect x="20" y="14" width="8" height="19" rx="1" fill="#16A34A" opacity="0.85"/>
  <circle cx="24" cy="20" r="2.5" fill="#86EFAC" opacity="0.5"/>
  <rect x="21" y="3" width="6" height="5" rx="1" fill="#64748B"/>
  <rect x="20" y="37" width="8" height="4" rx="1" fill="#94A3B8"/>
  <rect x="19.5" y="17" width="9" height="10" rx="1" fill="#065F46" opacity="0.5"/>
  <text x="24" y="25" text-anchor="middle" font-size="5" fill="#86EFAC" font-family="monospace" font-weight="bold">THC</text>
  <rect x="20" y="14" width="3" height="19" rx="1.5" fill="white" opacity="0.1"/>
</svg>`,

reggie:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <g fill="#4ADE80" transform="translate(24,22)">
    <ellipse rx="2.5" ry="10.5"/>
    <ellipse rx="2.5" ry="9.5" transform="rotate(-36)"/>
    <ellipse rx="2" ry="8.5" transform="rotate(-66)"/>
    <ellipse rx="2.5" ry="9.5" transform="rotate(36)"/>
    <ellipse rx="2" ry="8.5" transform="rotate(66)"/>
  </g>
  <line x1="24" y1="33" x2="23" y2="43" stroke="#166534" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="23" y1="38" x2="19" y2="42" stroke="#166534" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

mid:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <g fill="#22C55E" transform="translate(24,22)">
    <ellipse rx="3" ry="11.5"/>
    <ellipse rx="3" ry="10.5" transform="rotate(-36)"/>
    <ellipse rx="2.5" ry="9.5" transform="rotate(-68)"/>
    <ellipse rx="3" ry="10.5" transform="rotate(36)"/>
    <ellipse rx="2.5" ry="9.5" transform="rotate(68)"/>
  </g>
  <line x1="24" y1="34" x2="23" y2="44" stroke="#15803D" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="20" cy="18" r="1.2" fill="white" opacity="0.65"/>
  <circle cx="28" cy="16" r="1" fill="white" opacity="0.55"/>
  <circle cx="24" cy="13" r="1" fill="white" opacity="0.55"/>
</svg>`,

dank:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <g fill="#16A34A" transform="translate(24,22)">
    <ellipse rx="3.5" ry="12.5"/>
    <ellipse rx="3.5" ry="11.5" transform="rotate(-36)"/>
    <ellipse rx="3" ry="10.5" transform="rotate(-68)"/>
    <ellipse rx="3.5" ry="11.5" transform="rotate(36)"/>
    <ellipse rx="3" ry="10.5" transform="rotate(68)"/>
  </g>
  <line x1="24" y1="35" x2="23" y2="45" stroke="#14532D" stroke-width="3" stroke-linecap="round"/>
  <circle cx="18" cy="18" r="1.4" fill="white" opacity="0.75"/>
  <circle cx="30" cy="16" r="1.2" fill="white" opacity="0.7"/>
  <circle cx="24" cy="11" r="1.4" fill="white" opacity="0.75"/>
  <circle cx="21" cy="15" r="0.9" fill="#FEF08A" opacity="0.9"/>
  <path d="M33 13 L34 11 L35 13 L34 15Z" fill="#FEF08A" opacity="0.85"/>
</svg>`,

og_kush:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <g fill="#15803D" transform="translate(24,21)">
    <ellipse rx="4" ry="13.5"/>
    <ellipse rx="4" ry="12.5" transform="rotate(-36)"/>
    <ellipse rx="3.5" ry="11.5" transform="rotate(-68)"/>
    <ellipse rx="4" ry="12.5" transform="rotate(36)"/>
    <ellipse rx="3.5" ry="11.5" transform="rotate(68)"/>
  </g>
  <line x1="24" y1="35" x2="23" y2="46" stroke="#052e16" stroke-width="3" stroke-linecap="round"/>
  <circle cx="15" cy="20" r="1.8" fill="white" opacity="0.85"/>
  <circle cx="19" cy="14" r="1.4" fill="white" opacity="0.85"/>
  <circle cx="24" cy="9" r="1.8" fill="white" opacity="0.85"/>
  <circle cx="29" cy="13" r="1.4" fill="white" opacity="0.85"/>
  <circle cx="33" cy="19" r="1.8" fill="white" opacity="0.85"/>
  <circle cx="22" cy="17" r="0.9" fill="#FCD34D" opacity="0.95"/>
  <circle cx="26" cy="18" r="0.9" fill="#FCD34D" opacity="0.95"/>
  <path d="M36 10 L37 8 L38 10 L37 12Z" fill="#FCD34D"/>
  <path d="M11 15 L12 13 L13 15 L12 17Z" fill="#FCD34D"/>
</svg>`,

exotic:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ex" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A855F7"/>
      <stop offset="50%" stop-color="#22C55E"/>
      <stop offset="100%" stop-color="#EAB308"/>
    </linearGradient>
  </defs>
  <g fill="url(#ex)" transform="translate(24,21)">
    <ellipse rx="4" ry="13"/>
    <ellipse rx="4" ry="12" transform="rotate(-36)"/>
    <ellipse rx="3.5" ry="11" transform="rotate(-68)"/>
    <ellipse rx="4" ry="12" transform="rotate(36)"/>
    <ellipse rx="3.5" ry="11" transform="rotate(68)"/>
  </g>
  <line x1="24" y1="35" x2="23" y2="46" stroke="#2e1065" stroke-width="3" stroke-linecap="round"/>
  <path d="M39 9 L41 7 L39 5 L37 7Z" fill="#A855F7" opacity="0.9"/>
  <path d="M9 11 L11 9 L9 7 L7 9Z" fill="#22C55E" opacity="0.9"/>
  <path d="M39 31 L41 29 L39 27 L37 29Z" fill="#EAB308" opacity="0.9"/>
  <circle cx="24" cy="3" r="2.5" fill="white" opacity="0.9"/>
</svg>`,

hash:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="7" y="13" width="34" height="22" rx="3" fill="#92400E"/>
  <line x1="7" y1="20" x2="41" y2="20" stroke="#78350F" stroke-width="1.2" opacity="0.6"/>
  <line x1="7" y1="27" x2="41" y2="27" stroke="#78350F" stroke-width="1.2" opacity="0.6"/>
  <line x1="7" y1="33" x2="41" y2="33" stroke="#78350F" stroke-width="1" opacity="0.5"/>
  <line x1="15" y1="13" x2="15" y2="35" stroke="#78350F" stroke-width="1" opacity="0.4"/>
  <line x1="25" y1="13" x2="25" y2="35" stroke="#78350F" stroke-width="1" opacity="0.4"/>
  <line x1="35" y1="13" x2="35" y2="35" stroke="#78350F" stroke-width="1" opacity="0.4"/>
  <rect x="9" y="15" width="9" height="4" rx="1" fill="#B45309" opacity="0.5"/>
  <text x="24" y="26" text-anchor="middle" font-size="7" fill="#FEF3C7" font-family="monospace" font-weight="bold">HASH</text>
</svg>`,

edibles:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="26" r="17" fill="#D97706"/>
  <circle cx="24" cy="26" r="14.5" fill="#B45309" opacity="0.45"/>
  <ellipse cx="18" cy="21" rx="3.5" ry="2.5" fill="#451A03" transform="rotate(-15 18 21)"/>
  <ellipse cx="29" cy="19" rx="3" ry="2" fill="#451A03" transform="rotate(10 29 19)"/>
  <ellipse cx="22" cy="30" rx="3" ry="2.5" fill="#451A03" transform="rotate(-5 22 30)"/>
  <ellipse cx="31" cy="30" rx="2.5" ry="2" fill="#451A03"/>
  <ellipse cx="16" cy="29" rx="2" ry="1.5" fill="#451A03" transform="rotate(20 16 29)"/>
  <g transform="translate(20,17)">
    <ellipse rx="1.8" ry="1.2" fill="#16A34A" transform="rotate(-30)" opacity="0.85"/>
    <ellipse rx="1.8" ry="1.2" fill="#16A34A" transform="rotate(30)" opacity="0.85"/>
  </g>
  <ellipse cx="18" cy="20" rx="4" ry="2.5" fill="white" opacity="0.14" transform="rotate(-20 18 20)"/>
</svg>`,

wax:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="9" y="20" width="30" height="22" rx="4" fill="#374151"/>
  <rect x="7" y="15" width="34" height="7" rx="2.5" fill="#4B5563"/>
  <rect x="10" y="21" width="28" height="20" rx="3" fill="#D97706" opacity="0.92"/>
  <path d="M12 30 Q24 24 36 30 Q24 36 12 30Z" fill="#F59E0B" opacity="0.75"/>
  <path d="M12 34 Q24 29 36 34" stroke="#FCD34D" stroke-width="1.5" fill="none" opacity="0.55"/>
  <rect x="9" y="16" width="13" height="2.5" rx="1" fill="white" opacity="0.2"/>
  <text x="24" y="40" text-anchor="middle" font-size="5.5" fill="#FEF3C7" font-family="monospace" font-weight="bold">WAX</text>
</svg>`,

shrooms:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 27 Q5 9 24 9 Q43 9 43 27Z" fill="#92400E"/>
  <circle cx="14" cy="21" r="3.5" fill="#FEF3C7" opacity="0.88"/>
  <circle cx="26" cy="14" r="4" fill="#FEF3C7" opacity="0.88"/>
  <circle cx="36" cy="20" r="3" fill="#FEF3C7" opacity="0.88"/>
  <circle cx="21" cy="24" r="2.5" fill="#FEF3C7" opacity="0.7"/>
  <rect x="18" y="27" width="12" height="15" rx="5" fill="#D4A574"/>
  <path d="M18 27 Q24 30 30 27" stroke="#B8926A" stroke-width="1.5" fill="none" opacity="0.5"/>
  <circle cx="6" cy="32" r="1.2" fill="#FCD34D" opacity="0.8"/>
  <circle cx="42" cy="34" r="1.2" fill="#FCD34D" opacity="0.8"/>
</svg>`,

lsd:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="bl" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="none" stroke="#94A3B8" stroke-width="0.4"/>
    </pattern>
  </defs>
  <rect x="7" y="7" width="34" height="34" rx="2" fill="#F8FAFC"/>
  <rect x="7" y="7" width="34" height="34" rx="2" fill="url(#bl)"/>
  <rect x="9" y="9" width="13" height="13" rx="1" fill="#EDE9FE"/>
  <circle cx="15.5" cy="15.5" r="4.5" fill="#8B5CF6" opacity="0.7"/>
  <circle cx="15.5" cy="15.5" r="2.5" fill="#DDD6FE"/>
  <circle cx="15.5" cy="15.5" r="1.2" fill="#8B5CF6"/>
  <rect x="26" y="9" width="13" height="13" rx="1" fill="#ECFDF5"/>
  <ellipse cx="32.5" cy="15.5" rx="5.5" ry="3.5" fill="#059669"/>
  <circle cx="32.5" cy="15.5" r="2.5" fill="#065F46"/>
  <circle cx="33.5" cy="14.5" r="1" fill="white" opacity="0.8"/>
  <rect x="9" y="26" width="13" height="13" rx="1" fill="#FFF7ED"/>
  <path d="M15 30 Q10 36 15 40 Q20 36 15 30" fill="#F97316" opacity="0.8"/>
  <rect x="26" y="26" width="13" height="13" rx="1" fill="#F0F9FF"/>
  <path d="M29 34 L32 29 L35 34 L32 38Z" fill="#0EA5E9" opacity="0.8"/>
  <line x1="7" y1="22" x2="41" y2="22" stroke="#CBD5E1" stroke-width="0.8" stroke-dasharray="2,2"/>
  <line x1="22" y1="7" x2="22" y2="41" stroke="#CBD5E1" stroke-width="0.8" stroke-dasharray="2,2"/>
  <line x1="7" y1="35" x2="41" y2="35" stroke="#CBD5E1" stroke-width="0.8" stroke-dasharray="2,2"/>
  <line x1="35" y1="7" x2="35" y2="41" stroke="#CBD5E1" stroke-width="0.8" stroke-dasharray="2,2"/>
</svg>`,

dmt:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="dmtg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F0ABFC"/>
      <stop offset="40%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#1E1B4B"/>
    </radialGradient>
  </defs>
  <circle cx="24" cy="24" r="21" fill="url(#dmtg)"/>
  <path d="M24 3 Q42 13 42 24 Q42 38 24 45 Q6 35 6 24 Q6 11 24 3" fill="none" stroke="#DDD6FE" stroke-width="1.5" opacity="0.55"/>
  <path d="M24 7 Q38 16 38 24 Q38 32 24 41 Q10 32 10 24 Q10 16 24 7" fill="none" stroke="#C4B5FD" stroke-width="1" opacity="0.5"/>
  <path d="M24 11 Q34 18 34 24 Q34 31 24 37 Q14 31 14 24 Q14 18 24 11" fill="none" stroke="#A78BFA" stroke-width="1" opacity="0.5"/>
  <circle cx="24" cy="24" r="6" fill="#7C3AED"/>
  <circle cx="24" cy="24" r="3.5" fill="#C4B5FD"/>
  <circle cx="25.5" cy="22.5" r="1.2" fill="white"/>
  <circle cx="11" cy="11" r="1.8" fill="white" opacity="0.8"/>
  <circle cx="37" cy="9" r="1.2" fill="#F0ABFC" opacity="0.8"/>
  <circle cx="39" cy="35" r="1.8" fill="white" opacity="0.8"/>
  <circle cx="9" cy="37" r="1.2" fill="#F0ABFC" opacity="0.8"/>
</svg>`,

xanax:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="17" width="42" height="14" rx="6" fill="#2563EB"/>
  <line x1="13.5" y1="17" x2="13.5" y2="31" stroke="white" stroke-width="1.8" opacity="0.55"/>
  <line x1="24" y1="17" x2="24" y2="31" stroke="white" stroke-width="1.8" opacity="0.55"/>
  <line x1="34.5" y1="17" x2="34.5" y2="31" stroke="white" stroke-width="1.8" opacity="0.55"/>
  <text x="24" y="27" text-anchor="middle" font-size="6.5" fill="white" font-family="monospace" font-weight="bold" letter-spacing="1">XANAX</text>
  <rect x="3" y="17" width="42" height="5" rx="6" fill="white" opacity="0.15"/>
</svg>`,

adderall:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="24" cy="24" rx="19" ry="12" fill="#F97316"/>
  <line x1="5" y1="24" x2="43" y2="24" stroke="white" stroke-width="1.8" opacity="0.55"/>
  <text x="16" y="21" text-anchor="middle" font-size="5.5" fill="white" font-family="monospace" font-weight="bold">AD</text>
  <text x="32" y="21" text-anchor="middle" font-size="5.5" fill="white" font-family="monospace" font-weight="bold">30</text>
  <text x="24" y="32" text-anchor="middle" font-size="4.5" fill="white" font-family="monospace" opacity="0.7">XR</text>
  <ellipse cx="24" cy="18" rx="14" ry="5" fill="white" opacity="0.18"/>
</svg>`,

mdma:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#EC4899"/>
      <stop offset="50%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <polygon points="24,4 38,16 36,34 24,44 12,34 10,16" fill="url(#mg)" opacity="0.92"/>
  <polygon points="24,4 38,16 24,20" fill="white" opacity="0.2"/>
  <polygon points="24,20 38,16 36,34" fill="white" opacity="0.09"/>
  <polygon points="24,4 10,16 24,20" fill="white" opacity="0.12"/>
  <line x1="24" y1="4" x2="24" y2="44" stroke="white" stroke-width="0.5" opacity="0.25"/>
  <line x1="10" y1="16" x2="36" y2="34" stroke="white" stroke-width="0.5" opacity="0.25"/>
  <line x1="38" y1="16" x2="12" y2="34" stroke="white" stroke-width="0.5" opacity="0.25"/>
  <path d="M24 2 L25.2 4 L24 6 L22.8 4Z" fill="white" opacity="0.9"/>
</svg>`,

ketamine:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="18" y="12" width="12" height="28" rx="4" fill="#E2E8F0"/>
  <rect x="18" y="24" width="12" height="16" rx="4" fill="#38BDF8" opacity="0.82"/>
  <path d="M18 24 Q24 21 30 24" fill="#7DD3FC" opacity="0.6"/>
  <rect x="19.5" y="8" width="9" height="6" rx="2.5" fill="#64748B"/>
  <rect x="20" y="26" width="8" height="12" rx="1" fill="white" opacity="0.35"/>
  <text x="24" y="32" text-anchor="middle" font-size="4.5" fill="#0C4A6E" font-family="monospace" font-weight="bold">KET</text>
  <rect x="18.5" y="12" width="4.5" height="24" rx="2" fill="white" opacity="0.2"/>
</svg>`,

cocaine:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="10" width="40" height="28" rx="4" fill="#1E293B"/>
  <rect x="8"  y="17" width="32" height="3.5" rx="2" fill="white" opacity="0.95"/>
  <rect x="10" y="23" width="28" height="3.5" rx="2" fill="white" opacity="0.95"/>
  <rect x="8"  y="29" width="32" height="3.5" rx="2" fill="white" opacity="0.95"/>
  <rect x="30" y="12" width="2.5" height="18" rx="0.5" fill="#94A3B8" transform="rotate(18 31 21)"/>
  <rect x="4" y="10" width="40" height="5" rx="4" fill="white" opacity="0.05"/>
  <circle cx="12" cy="24" r="1" fill="#475569" opacity="0.5"/>
</svg>`,

crack:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <polygon points="14,9 33,7 41,19 39,37 25,43 9,37 5,22 9,9" fill="#D4C5A9"/>
  <polygon points="14,9 33,7 29,16 20,15" fill="white" opacity="0.28"/>
  <polygon points="37,14 41,19 35,22 31,16" fill="white" opacity="0.22"/>
  <path d="M18 13 L22 20 L17 29 L24 35" stroke="#9E8A72" stroke-width="2" fill="none"/>
  <path d="M27 11 L25 22 L31 31" stroke="#9E8A72" stroke-width="1.2" fill="none"/>
  <path d="M13 21 L20 23 L15 32" stroke="#B8A896" stroke-width="1" fill="none"/>
  <circle cx="19" cy="16" r="2.5" fill="white" opacity="0.4"/>
</svg>`,

meth:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <polygon points="24,5 37,15 35,33 21,39 9,29 11,13" fill="#BAE6FD" opacity="0.95"/>
  <polygon points="24,5 37,15 24,19" fill="white" opacity="0.42"/>
  <polygon points="9,13 24,19 11,29" fill="#7DD3FC" opacity="0.62"/>
  <polygon points="35,15 24,19 35,33" fill="#38BDF8" opacity="0.52"/>
  <polygon points="21,39 24,19 9,29" fill="#0EA5E9" opacity="0.52"/>
  <polygon points="37,7 43,13 39,18 34,12" fill="#E0F2FE" opacity="0.82"/>
  <polygon points="5,31 11,37 7,41 3,35" fill="#E0F2FE" opacity="0.72"/>
  <polygon points="14,11 20,7 22,16" fill="white" opacity="0.52"/>
</svg>`,

counterfeit:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="16" width="38" height="22" rx="2" fill="#166534" transform="rotate(-3 24 27)"/>
  <rect x="5" y="15" width="38" height="22" rx="2" fill="#15803D" transform="rotate(-1 24 26)"/>
  <rect x="5" y="14" width="38" height="22" rx="2" fill="#16A34A"/>
  <circle cx="24" cy="25" r="6.5" fill="#15803D" opacity="0.85" stroke="#166534" stroke-width="0.5"/>
  <text x="24" y="28.5" text-anchor="middle" font-size="9" fill="#86EFAC" font-family="serif" font-weight="bold">$</text>
  <rect x="9" y="29" width="13" height="2" rx="1" fill="#4ADE80" opacity="0.4"/>
  <rect x="26" y="29" width="13" height="2" rx="1" fill="#4ADE80" opacity="0.4"/>
  <text x="24" y="21" text-anchor="middle" font-size="3.5" fill="#FEF08A" font-family="monospace" opacity="0.65">COUNTERFEIT</text>
</svg>`,

firearms:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="20" width="26" height="5" rx="2" fill="#374151"/>
  <rect x="18" y="16" width="18" height="15" rx="2" fill="#1F2937"/>
  <rect x="22" y="29" width="9" height="15" rx="2" fill="#374151"/>
  <path d="M27 30 Q29 35 27 37" stroke="#6B7280" stroke-width="2.5" fill="none"/>
  <rect x="5" y="18" width="2.5" height="4" rx="1" fill="#6B7280"/>
  <rect x="24" y="18" width="7" height="4" rx="0.5" fill="#111827"/>
  <rect x="18" y="16" width="18" height="4.5" rx="2" fill="white" opacity="0.1"/>
  <rect x="32" y="18" width="4" height="10" rx="1" fill="#4B5563"/>
</svg>`,

stolen_goods:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="18" width="38" height="26" rx="2" fill="#92400E"/>
  <path d="M5 18 L5 12 L24 12 L24 18" fill="#B45309"/>
  <path d="M43 18 L43 12 L24 12 L24 18" fill="#D97706"/>
  <rect x="5" y="22" width="38" height="4.5" rx="1" fill="#FBBF24" opacity="0.72"/>
  <rect x="20.5" y="18" width="7" height="26" rx="1" fill="#FBBF24" opacity="0.72"/>
  <rect x="11" y="30" width="26" height="10" rx="2" fill="#DC2626" opacity="0.92"/>
  <text x="24" y="38" text-anchor="middle" font-size="6" fill="white" font-family="monospace" font-weight="bold">🔥 HOT</text>
</svg>`,

};

/* ══════════════════════════════════════════════════════
   PRODUCTS
══════════════════════════════════════════════════════ */
const PRODUCTS = [

  // ── TIER 1: VAPES ──────────────────────────────────
  {
    id:'vape_disp', name:'Disposable Vape', cat:'vapes', tier:1,
    emoji:'💨', color:'#7C3AED',
    produceTime:2.5, batchSize:1, basePrice:8, heatPerSale:0.15,
    unlockCost:0,
    desc:'Entry-level. Low heat, steady turnover.',
    flavor:'Everyone starts here.'
  },
  {
    id:'nicpod', name:'Nicotine Pods (2pk)', cat:'vapes', tier:1,
    emoji:'📦', color:'#2563EB',
    produceTime:3.5, batchSize:2, basePrice:14, heatPerSale:0.18,
    unlockCost:80,
    desc:'Pod packs move fast. Double the batch.',
    flavor:'Every vape shop wishes they could compete.'
  },
  {
    id:'thc_cart', name:'THC Cartridge', cat:'vapes', tier:1,
    emoji:'🌿', color:'#059669',
    produceTime:5, batchSize:1, basePrice:45, heatPerSale:0.35,
    unlockCost:400,
    desc:'The good stuff. Way more margin.',
    flavor:'Street price 5× what the dispensary charges.'
  },

  // ── TIER 2: MARIJUANA ───────────────────────────────
  {
    id:'reggie', name:'Reggie (1g)', cat:'weed', tier:2,
    emoji:'🌿', color:'#4ADE80',
    produceTime:4, batchSize:1, basePrice:15, heatPerSale:0.22,
    unlockCost:300,
    desc:'Bottom shelf. Bulk sales.',
    flavor:'Barely worth the bag, but it moves.'
  },
  {
    id:'mid', name:'Mid Grade (1g)', cat:'weed', tier:2,
    emoji:'🍃', color:'#22C55E',
    produceTime:6, batchSize:1, basePrice:45, heatPerSale:0.28,
    unlockCost:1200,
    desc:'Step up. Better clients.',
    flavor:'The reliable workhorse.'
  },
  {
    id:'dank', name:'Dank (1g)', cat:'weed', tier:2,
    emoji:'💚', color:'#16A34A',
    produceTime:9, batchSize:1, basePrice:110, heatPerSale:0.38,
    unlockCost:5000,
    desc:'Premium herb. Trichome-heavy.',
    flavor:'They'll drive across the city for this.'
  },
  {
    id:'hash', name:'Hash (2g)', cat:'weed', tier:2,
    emoji:'🟫', color:'#92400E',
    produceTime:8, batchSize:2, basePrice:70, heatPerSale:0.30,
    unlockCost:3000,
    desc:'Pressed concentrate. Classic.',
    flavor:'Old school always comes back.'
  },
  {
    id:'edibles', name:'Edibles Pack (10x)', cat:'weed', tier:2,
    emoji:'🍪', color:'#D97706',
    produceTime:11, batchSize:3, basePrice:100, heatPerSale:0.25,
    unlockCost:6000,
    desc:'Gummies, cookies. Discreet buyers.',
    flavor:'Nobody suspects the cookie.'
  },
  {
    id:'wax', name:'Wax Concentrate (1g)', cat:'weed', tier:2,
    emoji:'🫙', color:'#D97706',
    produceTime:14, batchSize:1, basePrice:185, heatPerSale:0.44,
    unlockCost:18000,
    desc:'Glass jar of gold. Premium market.',
    flavor:'Dab heads pay top dollar.'
  },
  {
    id:'og_kush', name:'OG Kush (1g)', cat:'weed', tier:2,
    emoji:'🌲', color:'#15803D',
    produceTime:13, batchSize:1, basePrice:260, heatPerSale:0.50,
    unlockCost:22000,
    desc:'Classic strain. High roller clientele.',
    flavor:'The name alone adds $50.'
  },
  {
    id:'exotic', name:'Exotic Strain (1g)', cat:'weed', tier:2,
    emoji:'✨', color:'#A855F7',
    produceTime:20, batchSize:1, basePrice:650, heatPerSale:0.62,
    unlockCost:100000,
    desc:'Rare import. Serious collectors.',
    flavor:'Flew in from Amsterdam. Customs had no idea.'
  },

  // ── TIER 3: PSYCHEDELICS ────────────────────────────
  {
    id:'shrooms', name:'Shrooms (3.5g)', cat:'psychedelics', tier:3,
    emoji:'🍄', color:'#92400E',
    produceTime:22, batchSize:1, basePrice:130, heatPerSale:0.70,
    unlockCost:14000,
    desc:'Festival circuit staple.',
    flavor:'Naturally grown. Naturally illegal.'
  },
  {
    id:'lsd', name:'LSD Tabs (5-pack)', cat:'psychedelics', tier:3,
    emoji:'🔮', color:'#8B5CF6',
    produceTime:20, batchSize:1, basePrice:320, heatPerSale:0.82,
    unlockCost:60000,
    desc:'Blotter tabs. Underground demand.',
    flavor:'Each tab is art. Illegal art.'
  },
  {
    id:'dmt', name:'DMT (0.2g)', cat:'psychedelics', tier:3,
    emoji:'🌀', color:'#7C3AED',
    produceTime:38, batchSize:1, basePrice:750, heatPerSale:1.05,
    unlockCost:250000,
    desc:'Extremely niche. Premium buyers only.',
    flavor:'In and out in 15 minutes. The price reflects that.'
  },

  // ── TIER 4: PILLS ───────────────────────────────────
  {
    id:'adderall', name:'Adderall 30mg (20ct)', cat:'pills', tier:4,
    emoji:'💊', color:'#F97316',
    produceTime:11, batchSize:2, basePrice:110, heatPerSale:0.72,
    unlockCost:10000,
    desc:'Study drug. Campus market.',
    flavor:'Finals week triples the price.'
  },
  {
    id:'xanax', name:'Xanax Bars (10ct)', cat:'pills', tier:4,
    emoji:'💊', color:'#2563EB',
    produceTime:13, batchSize:1, basePrice:190, heatPerSale:0.90,
    unlockCost:28000,
    desc:'Bars. High demand, high scrutiny.',
    flavor:'Distinctive. Hard to copy. Hard to stop selling.'
  },
  {
    id:'mdma', name:'Molly (0.5g)', cat:'pills', tier:4,
    emoji:'💎', color:'#EC4899',
    produceTime:28, batchSize:1, basePrice:520, heatPerSale:1.12,
    unlockCost:120000,
    desc:'Club scene gold. Festival money.',
    flavor:'Weekends make or break the operation.'
  },
  {
    id:'ketamine', name:'Ketamine (1g)', cat:'pills', tier:4,
    emoji:'🧪', color:'#38BDF8',
    produceTime:32, batchSize:1, basePrice:720, heatPerSale:1.22,
    unlockCost:300000,
    desc:'Special K. Medical-grade market.',
    flavor:'Vet supply chain keeps it interesting.'
  },

  // ── TIER 5: HARD ────────────────────────────────────
  {
    id:'cocaine', name:'Cocaine (1g)', cat:'hard', tier:5,
    emoji:'❄️', color:'#E2E8F0',
    produceTime:42, batchSize:1, basePrice:1600, heatPerSale:1.85,
    unlockCost:500000,
    desc:'White gold. The big leagues.',
    flavor:'You have arrived. Now don\'t get comfortable.'
  },
  {
    id:'crack', name:'Crack Rock', cat:'hard', tier:5,
    emoji:'🪨', color:'#D4C5A9',
    produceTime:28, batchSize:2, basePrice:850, heatPerSale:2.05,
    unlockCost:200000,
    desc:'Fast cash. Fastest heat.',
    flavor:'High volume, high exposure.'
  },
  {
    id:'meth', name:'Ice (1g)', cat:'hard', tier:5,
    emoji:'💠', color:'#BAE6FD',
    produceTime:48, batchSize:1, basePrice:1300, heatPerSale:1.95,
    unlockCost:400000,
    desc:'Crystal. Lab operation required.',
    flavor:'Blue or clear — both get you busted.'
  },

  // ── TIER 6: BLACK MARKET ────────────────────────────
  {
    id:'stolen_goods', name:'Stolen Goods (lot)', cat:'black_market', tier:6,
    emoji:'📦', color:'#92400E',
    produceTime:40, batchSize:2, basePrice:1900, heatPerSale:1.62,
    unlockCost:800000,
    desc:'Hot electronics, watches, jewelry.',
    flavor:'Fell off the back of a truck. Happens a lot.'
  },
  {
    id:'counterfeit', name:'Counterfeit Cash ($1K)', cat:'black_market', tier:6,
    emoji:'💵', color:'#16A34A',
    produceTime:62, batchSize:1, basePrice:3200, heatPerSale:2.25,
    unlockCost:1500000,
    desc:'Fake bills. Pass carefully.',
    flavor:'Worth 30 cents to make, worth $3200 to sell.'
  },
  {
    id:'firearms', name:'Unregistered Firearm', cat:'black_market', tier:6,
    emoji:'🔫', color:'#374151',
    produceTime:95, batchSize:1, basePrice:5200, heatPerSale:2.85,
    unlockCost:3000000,
    desc:'Hardware. Extremely serious business.',
    flavor:'The gravity of this one is different.'
  },

];

/* ══════════════════════════════════════════════════════
   WORKERS
══════════════════════════════════════════════════════ */
const WORKERS = [
  {
    id:'bagboy',    name:'Bag Boy',       emoji:'🎒', cat:'production',
    produceRate:0.08, sellRate:0,   heatReduce:0,   launderRate:0,
    cost:75,   mult:1.12, desc:'Helps package product. +0.08 auto-produce/s'
  },
  {
    id:'runner',    name:'Runner',        emoji:'🏃', cat:'sales',
    produceRate:0,    sellRate:0.15, heatReduce:0,   launderRate:0,
    cost:50,   mult:1.12, desc:'Moves product on foot. +0.15 auto-sell/s'
  },
  {
    id:'grower',    name:'Grower',        emoji:'🌱', cat:'production',
    produceRate:0.30, sellRate:0,   heatReduce:0,   launderRate:0,
    cost:400,  mult:1.15, desc:'Knows the craft. +0.3 auto-produce/s'
  },
  {
    id:'dealer',    name:'Street Dealer', emoji:'🧢', cat:'sales',
    produceRate:0,    sellRate:0.50, heatReduce:0,   launderRate:0,
    cost:300,  mult:1.15, desc:'Works a corner. +0.5 auto-sell/s'
  },
  {
    id:'chemist',   name:'Chemist',       emoji:'🧪', cat:'production',
    produceRate:0.80, sellRate:0,   heatReduce:0,   launderRate:0,
    cost:2000, mult:1.18, desc:'Lab-grade production. +0.8 auto-produce/s'
  },
  {
    id:'lookout',   name:'Lookout',       emoji:'👁️', cat:'security',
    produceRate:0,    sellRate:0,   heatReduce:0.5, launderRate:0,
    cost:800,  mult:1.18, desc:'Watches for cops. -0.5 heat/s each'
  },
  {
    id:'smuggler',  name:'Smuggler',      emoji:'🚚', cat:'sales',
    produceRate:0,    sellRate:2.00, heatReduce:0,   launderRate:0,
    cost:12000,mult:1.20, desc:'Bulk operations. +2 auto-sell/s'
  },
  {
    id:'muscle',    name:'Muscle',        emoji:'💪', cat:'security',
    produceRate:0,    sellRate:0,   heatReduce:1.2, launderRate:0,
    cost:3500, mult:1.22, desc:'Deters attention. -1.2 heat/s each'
  },
  {
    id:'accountant',name:'Accountant',    emoji:'📊', cat:'finance',
    produceRate:0,    sellRate:0,   heatReduce:0,   launderRate:60,
    cost:6000, mult:1.25, desc:'Cleans the books. +$60 laundered/s each'
  },
  {
    id:'hacker',    name:'Hacker',        emoji:'💻', cat:'security',
    produceRate:0,    sellRate:0,   heatReduce:2.5, launderRate:0,
    cost:18000,mult:1.30, desc:'Scrubs records. -2.5 heat/s each'
  },
  {
    id:'lawyer',    name:'Lawyer',        emoji:'⚖️', cat:'finance',
    produceRate:0,    sellRate:0,   heatReduce:1.8, launderRate:120,
    cost:60000,mult:1.35, desc:'-1.8 heat/s + $120 laundered/s each'
  },
  {
    id:'fixer',     name:'Fixer',         emoji:'🔧', cat:'elite',
    produceRate:1.50, sellRate:1.50,heatReduce:4.0, launderRate:0,
    cost:120000,mult:1.40,desc:'Does it all. +1.5 produce, +1.5 sell, -4 heat/s'
  },
  {
    id:'cartel',    name:'Cartel Contact',emoji:'🌐', cat:'elite',
    produceRate:4.00, sellRate:4.00,heatReduce:6.0, launderRate:600,
    cost:1200000,mult:1.50,desc:'International operation. Massive all-around boost'
  },
];

/* ══════════════════════════════════════════════════════
   UPGRADES  (effect shown inline for direct clarity)
══════════════════════════════════════════════════════ */
const UPGRADES = [
  // Production speed
  { id:'upg_prod1',   name:'Better Equipment',    emoji:'⚙️',  cost:800,    req:{totalEarned:400},    effect:{produceSpeed:1.30}, desc:'Production speed +30%' },
  { id:'upg_prod2',   name:'Pro Lab Setup',        emoji:'🔬', cost:8000,   req:{totalEarned:4000},   effect:{produceSpeed:1.60}, desc:'Production speed +60%' },
  { id:'upg_prod3',   name:'Automated Assembly',   emoji:'🤖', cost:80000,  req:{totalEarned:40000},  effect:{produceSpeed:2.00}, desc:'Production speed ×2' },
  { id:'upg_prod4',   name:'Industrial Scale',     emoji:'🏭', cost:800000, req:{totalEarned:400000}, effect:{produceSpeed:3.00}, desc:'Production speed ×3' },

  // Sell price
  { id:'upg_price1',  name:'Quality Control',      emoji:'⭐', cost:2000,   req:{totalEarned:1000},   effect:{sellPrice:1.25},    desc:'Sell price +25%' },
  { id:'upg_price2',  name:'Premium Clients',      emoji:'💎', cost:20000,  req:{totalEarned:10000},  effect:{sellPrice:1.50},    desc:'Sell price +50%' },
  { id:'upg_price3',  name:'Black Market Rate',    emoji:'🔑', cost:200000, req:{totalEarned:100000}, effect:{sellPrice:2.00},    desc:'Sell price ×2' },
  { id:'upg_price4',  name:'Monopoly Position',    emoji:'👑', cost:2000000,req:{totalEarned:1000000},effect:{sellPrice:3.00},    desc:'Sell price ×3' },

  // Auto-sell rate
  { id:'upg_sell1',   name:'Street Network',       emoji:'📡', cost:1500,   req:{workers:{runner:3}}, effect:{sellRate:1.25},     desc:'Auto-sell rate +25%' },
  { id:'upg_sell2',   name:'Encrypted Phones',     emoji:'📱', cost:15000,  req:{workers:{dealer:5}}, effect:{sellRate:1.50},     desc:'Auto-sell rate +50%' },
  { id:'upg_sell3',   name:'Distribution Ring',    emoji:'🚀', cost:150000, req:{workers:{smuggler:2}},effect:{sellRate:2.00},    desc:'Auto-sell rate ×2' },

  // Auto-produce rate
  { id:'upg_make1',   name:'Bulk Sourcing',         emoji:'📦', cost:1200,   req:{workers:{bagboy:3}},  effect:{produceRate:1.30},  desc:'Auto-produce rate +30%' },
  { id:'upg_make2',   name:'Chemistry Kit',         emoji:'⚗️', cost:12000,  req:{workers:{chemist:2}}, effect:{produceRate:1.60},  desc:'Auto-produce rate +60%' },
  { id:'upg_make3',   name:'Cartel Supply Chain',   emoji:'🌍', cost:120000, req:{workers:{grower:5}},  effect:{produceRate:2.00},  desc:'Auto-produce rate ×2' },

  // Heat reduction
  { id:'upg_heat1',   name:'Burner Phones',         emoji:'📵', cost:3000,   req:{totalEarned:1500},   effect:{heatMult:0.80},     desc:'Heat generation -20%' },
  { id:'upg_heat2',   name:'Police Scanner',        emoji:'📻', cost:30000,  req:{totalEarned:15000},  effect:{heatMult:0.65},     desc:'Heat generation -35%' },
  { id:'upg_heat3',   name:'Cops on Payroll',       emoji:'👮', cost:300000, req:{totalEarned:150000}, effect:{heatMult:0.50},     desc:'Heat generation -50%' },
  { id:'upg_heat4',   name:'Government Contacts',   emoji:'🏛️', cost:3000000,req:{totalEarned:1500000},effect:{heatMult:0.25},    desc:'Heat generation -75%' },

  // Laundering
  { id:'upg_laund1',  name:'Offshore Account',      emoji:'🏦', cost:50000,  req:{totalEarned:25000},  effect:{launderEff:0.90},   desc:'Launder efficiency 80% → 90%' },
  { id:'upg_laund2',  name:'Shell Companies',       emoji:'🏢', cost:500000, req:{totalEarned:250000}, effect:{launderEff:0.95},   desc:'Launder efficiency → 95%' },
  { id:'upg_laund3',  name:'Crypto Network',        emoji:'🪙', cost:2000000,req:{totalEarned:1000000},effect:{launderEff:0.99},   desc:'Launder efficiency → 99%' },

  // Batch size (produce more per cycle)
  { id:'upg_batch1',  name:'Bulk Batch (×2)',       emoji:'2️⃣', cost:10000,  req:{totalEarned:5000},   effect:{batchMult:2},        desc:'Each production cycle yields ×2 units' },
  { id:'upg_batch2',  name:'Mega Batch (×4)',       emoji:'4️⃣', cost:200000, req:{totalEarned:100000}, effect:{batchMult:4},        desc:'Each production cycle yields ×4 units' },
];

/* ══════════════════════════════════════════════════════
   TERRITORIES
══════════════════════════════════════════════════════ */
const TERRITORIES = [
  { id:'school',      name:'School Grounds',    emoji:'🏫', color:'#4ADE80',
    unlockCost:0,       bonus:{produceSpeed:1,sellPrice:1,heatMult:1},
    desc:'Your turf. Starting point.',               owned:true },
  { id:'downtown',    name:'Downtown',          emoji:'🏙️', color:'#60A5FA',
    unlockCost:5000,    bonus:{sellPrice:1.30},
    desc:'+30% sell price. More buyers, better prices.' },
  { id:'industrial',  name:'Industrial District',emoji:'🏭', color:'#94A3B8',
    unlockCost:30000,   bonus:{produceSpeed:1.50},
    desc:'+50% production speed. Labs fit right in.' },
  { id:'harbor',      name:'Harbor',            emoji:'⚓', color:'#22D3EE',
    unlockCost:120000,  bonus:{sellRate:2.00},
    desc:'×2 auto-sell rate. International routes.' },
  { id:'richward',    name:'Rich Ward',         emoji:'💎', color:'#FBBF24',
    unlockCost:400000,  bonus:{sellPrice:2.00},
    desc:'×2 sell price. Wealthy clientele pays double.' },
  { id:'airport',     name:'Airport',           emoji:'✈️', color:'#A78BFA',
    unlockCost:800000,  bonus:{produceSpeed:2.00, sellPrice:2.00},
    desc:'×2 everything. Global supply chain.' },
  { id:'underground', name:'Underground Market',emoji:'🕳️', color:'#F87171',
    unlockCost:2500000, bonus:{heatMult:0.40},
    desc:'-60% heat. Off the grid completely.' },
];

/* ══════════════════════════════════════════════════════
   LAUNDERING FRONTS
══════════════════════════════════════════════════════ */
const FRONTS = [
  { id:'carwash',    name:'Car Wash',       emoji:'🚗', color:'#38BDF8', cost:2000,    rate:8,     desc:'Cash-heavy. No questions asked.' },
  { id:'arcade',     name:'Arcade',         emoji:'🎮', color:'#A78BFA', cost:15000,   rate:50,    desc:'Token machines eat cash all day.' },
  { id:'laundromat', name:'Laundromat',     emoji:'👕', color:'#34D399', cost:60000,   rate:180,   desc:'Literally launders money.' },
  { id:'foodtruck',  name:'Food Truck',     emoji:'🚐', color:'#FB923C', cost:250000,  rate:700,   desc:'Mobile. Hard to track.' },
  { id:'bar',        name:'Bar & Grill',    emoji:'🍺', color:'#FBBF24', cost:900000,  rate:2500,  desc:'Nightly cash. No receipts.' },
  { id:'dealership', name:'Car Dealership', emoji:'🏎️', color:'#F87171', cost:3500000, rate:12000, desc:'Big tickets, big absorption.' },
  { id:'casino',     name:'Casino',         emoji:'🎰', color:'#FFD700', cost:18000000,rate:80000, desc:'The ultimate front. Welcome to the top.' },
];

/* ══════════════════════════════════════════════════════
   RANDOM EVENTS
══════════════════════════════════════════════════════ */
const EVENTS = [
  { id:'boom',       name:'Market Boom',       type:'good',   icon:'📈', w:10, duration:60,  effect:{priceMult:2.0},   desc:'Demand surged! Double sell price for 60s.' },
  { id:'shortage',   name:'Supply Shortage',   type:'bad',    icon:'📉', w:8,  duration:45,  effect:{produceMult:0.5}, desc:'Materials scarce. Production halved for 45s.' },
  { id:'informant',  name:'Informant Spotted', type:'bad',    icon:'🕵️', w:12, duration:0,   effect:{heat:+18},        desc:'Someone talked. +18 heat.' },
  { id:'cop_offer',  name:'Dirty Cop Offer',   type:'choice', icon:'👮', w:6,  duration:0,   effect:{bribe:1200},      desc:'A cop wants a cut. Pay $1,200 or +30 heat.' },
  { id:'crash',      name:'Market Crash',      type:'bad',    icon:'💸', w:5,  duration:35,  effect:{priceMult:0.3},   desc:'Flooded market. 30% price for 35s.' },
  { id:'newclient',  name:'Big Spender',       type:'good',   icon:'🤝', w:9,  duration:0,   effect:{cashBonus:8},     desc:'VIP client dropped serious cash.' },
  { id:'busted',     name:'Worker Arrested',   type:'bad',    icon:'🔓', w:4,  duration:0,   effect:{loseWorker:1},    desc:'One of your crew got picked up.' },
  { id:'rival',      name:'Rival Crew',        type:'bad',    icon:'😤', w:7,  duration:25,  effect:{priceMult:0.75},  desc:'Rivals undercutting you. -25% price for 25s.' },
  { id:'labbreak',   name:'Lab Breakthrough',  type:'good',   icon:'🔬', w:4,  duration:120, effect:{produceMult:2.0}, desc:'Chemist breakthrough! ×2 production for 2 min.' },
  { id:'inspection', name:'Business Inspection',type:'bad',   icon:'🚨', w:6,  duration:0,   effect:{heat:+32},        desc:'Inspectors showed up. +32 heat.' },
  { id:'pricespike', name:'Price Spike',       type:'good',   icon:'💹', w:9,  duration:90,  effect:{priceMult:1.6},   desc:'Street price spiked. +60% for 90s.' },
  { id:'drought',    name:'Supply Drought',    type:'bad',    icon:'🏜️', w:5,  duration:50,  effect:{produceMult:0.2}, desc:'Nothing coming in. Production at 20% for 50s.' },
];

/* ══════════════════════════════════════════════════════
   ACHIEVEMENTS
══════════════════════════════════════════════════════ */
const ACHIEVEMENTS = [
  { id:'first_sale',   name:'First Sale',      icon:'🤝', desc:'Make your first sale.',              req:{sales:1},               reward:{cash:20} },
  { id:'hustle100',    name:'Hustler',         icon:'💪', desc:'Make 100 sales.',                    req:{sales:100},             reward:{cash:500} },
  { id:'grind1k',      name:'Grinder',         icon:'⚡', desc:'Make 1,000 sales.',                  req:{sales:1000},            reward:{cash:5000} },
  { id:'legend10k',    name:'Legend',          icon:'👑', desc:'Make 10,000 sales.',                 req:{sales:10000},           reward:{sellPrice:2} },
  { id:'earn1k',       name:'First Grand',     icon:'💵', desc:'Earn $1,000 total.',                 req:{totalEarned:1000},      reward:{cash:100} },
  { id:'earn10k',      name:'Ten Stacks',      icon:'💰', desc:'Earn $10,000 total.',                req:{totalEarned:10000},     reward:{cash:1000} },
  { id:'earn100k',     name:'Six Figures',     icon:'🏦', desc:'Earn $100,000 total.',               req:{totalEarned:100000},    reward:{cash:10000} },
  { id:'earn1m',       name:'Millionaire',     icon:'🎰', desc:'Earn $1,000,000 total.',             req:{totalEarned:1000000},   reward:{sellPrice:2, cash:50000} },
  { id:'earn10m',      name:'Empire Builder',  icon:'🏰', desc:'Earn $10,000,000 total.',            req:{totalEarned:10000000},  reward:{produceSpeed:2} },
  { id:'crew1',        name:'First Hire',      icon:'👷', desc:'Hire your first worker.',            req:{totalWorkers:1},        reward:{cash:50} },
  { id:'crew10',       name:'Crew Up',         icon:'👥', desc:'Have 10 workers total.',             req:{totalWorkers:10},       reward:{cash:2000} },
  { id:'crew50',       name:'Organization',    icon:'🏢', desc:'Have 50 workers total.',             req:{totalWorkers:50},       reward:{sellPrice:1.5} },
  { id:'crew100',      name:'Cartel Boss',     icon:'🌐', desc:'Have 100 workers total.',            req:{totalWorkers:100},      reward:{produceSpeed:1.5} },
  { id:'laund1',       name:'Clean Hands',     icon:'💧', desc:'Launder your first dollar.',         req:{laundered:1},           reward:{cash:100} },
  { id:'laund10k',     name:'Laundry Day',     icon:'🧺', desc:'Launder $10,000.',                  req:{laundered:10000},       reward:{cash:5000} },
  { id:'laund1m',      name:'Clean Empire',    icon:'🏛️', desc:'Launder $1,000,000.',               req:{laundered:1000000},     reward:{launderRate:2} },
  { id:'raid1',        name:'Survived',        icon:'🚔', desc:'Survive your first raid.',           req:{raidsSurvived:1},       reward:{cash:2000} },
  { id:'raid10',       name:'Untouchable',     icon:'🛡️', desc:'Survive 10 raids.',                 req:{raidsSurvived:10},      reward:{heatMult:0.80} },
  { id:'heat90',       name:'Red Hot',         icon:'🔥', desc:'Reach 90 heat.',                    req:{maxHeat:90},            reward:{cash:1000} },
  { id:'territory2',   name:'Expanding',       icon:'🗺️', desc:'Unlock 2 territories.',             req:{territories:2},         reward:{cash:500} },
  { id:'territory_all',name:'City Wide',       icon:'🏙️', desc:'Unlock all territories.',           req:{territories:7},         reward:{sellPrice:1.5, produceSpeed:1.5} },
  { id:'front1',       name:'Going Legit',     icon:'🏪', desc:'Open your first front.',            req:{fronts:1},              reward:{cash:500} },
  { id:'front5',       name:'Mogul',           icon:'🏗️', desc:'Own 5 front businesses.',           req:{fronts:5},              reward:{launderRate:1.5} },
  { id:'vape_unlock',  name:'Smoke & Mirrors', icon:'💨', desc:'Unlock THC Cartridge.',             req:{product:'thc_cart'},    reward:{cash:500} },
  { id:'weed_unlock',  name:'Going Green',     icon:'🌿', desc:'Unlock OG Kush.',                   req:{product:'og_kush'},     reward:{cash:5000} },
  { id:'pill_unlock',  name:'Pill Pusher',     icon:'💊', desc:'Unlock Molly.',                     req:{product:'mdma'},        reward:{cash:30000} },
  { id:'hard_unlock',  name:'Big Leagues',     icon:'❄️', desc:'Unlock Cocaine.',                   req:{product:'cocaine'},     reward:{cash:200000, sellPrice:2} },
  { id:'speed_1k',     name:'Speed Run',       icon:'⏱️', desc:'Earn $1,000 in under 5 minutes.',  req:{speedRun:{cash:1000,time:300}},  reward:{produceSpeed:1.5} },
  { id:'playtime1h',   name:'Night Owl',       icon:'🦉', desc:'Play for 1 hour total.',            req:{playTime:3600},         reward:{produceSpeed:1.2} },
];

/* ── Category metadata ── */
const CATEGORIES = {
  vapes:       { name:'Vapes',        color:'#7C3AED', emoji:'💨' },
  weed:        { name:'Marijuana',    color:'#16A34A', emoji:'🌿' },
  psychedelics:{ name:'Psychedelics', color:'#8B5CF6', emoji:'🍄' },
  pills:       { name:'Pills',        color:'#F97316', emoji:'💊' },
  hard:        { name:'Hard',         color:'#60A5FA', emoji:'❄️' },
  black_market:{ name:'Black Market', color:'#374151', emoji:'📦' },
};
