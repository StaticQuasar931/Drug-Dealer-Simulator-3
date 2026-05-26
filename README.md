# Drug Dealer Simulator 3

> A fictional idle tycoon game inspired by underground trading stories in movies and television.  
> Nothing in this game is intended to harm people or act as real-world guidance.

---

## What Is This Game?

Drug Dealer Simulator 3 is a **browser-based idle tycoon game** in the vein of Cookie Clicker and similar incremental games. You start as a small-time contraband dealer and build a fictional underground empire — hiring workers, laundering money, expanding territories, managing heat, and unlocking increasingly valuable product tiers.

All substances, organizations, and systems depicted are **entirely fictional**. The game is a work of entertainment, not instruction.

---

## Project Structure

```
/
├── index.html              # Entry point — open this to play
├── README.md
│
├── assets/
│   ├── favicon.svg         # Browser tab icon
│   ├── banner.svg          # Wide promo banner (1200×300)
│   └── thumb.svg           # Square thumbnail (512×512)
│
├── css/
│   ├── main.css            # Layout, variables, reset, buttons, modals
│   ├── ui.css              # Game component styles (cards, heat bar, deal button)
│   ├── animations.css      # All @keyframes and animation classes
│   └── responsive.css      # Device-specific breakpoints
│
├── js/
│   ├── data.js             # All game constants (items, workers, upgrades, etc.)
│   ├── saveSystem.js       # localStorage save/load with multiple slots
│   ├── antiCheat.js        # Clock manipulation detection & tick validation
│   ├── settings.js         # Graphics quality and preference application
│   ├── economy.js          # Income, heat, launder, district & price calculations
│   ├── workers.js          # Hiring logic and worker utilities
│   ├── production.js       # Click handling, item unlocking, upgrade purchasing
│   ├── map.js              # Territory/district unlock logic
│   ├── laundering.js       # Front business purchases and dirty→clean conversion
│   ├── events.js           # Random event system with choice events
│   ├── achievements.js     # Achievement checking and reward application
│   ├── ui.js               # All DOM rendering, panels, notifications, modals
│   └── game.js             # Core state, main loop, action dispatch, boot
│
└── data/
    ├── items.json          # Reference: all product definitions
    ├── upgrades.json       # Reference: all upgrade definitions
    ├── workers.json        # Reference: all worker definitions
    ├── districts.json      # Reference: all territory definitions
    ├── events.json         # Reference: all random event definitions
    └── achievements.json   # Reference: all achievement definitions
```

> **Note:** The `/data/*.json` files are reference documents. The live game loads all data from `js/data.js` (inline JS objects) to avoid CORS restrictions when opening the file locally.

---

## How to Run Locally

No build tools, no npm, no server required.

1. **Download or clone** this repository
2. **Open `index.html`** in any modern browser (Chrome, Firefox, Edge, Safari)

That's it. The game runs entirely from the filesystem.

```bash
git clone https://github.com/YOUR_USERNAME/Drug-Dealer-Simulator-3.git
cd Drug-Dealer-Simulator-3
# Then open index.html in your browser
```

Optionally, use a lightweight local server to avoid any browser file-policy quirks:

```bash
# Python 3
python -m http.server 8080
# Then visit http://localhost:8080
```

---

## How to Deploy to GitHub Pages

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose branch: `main`, folder: `/ (root)`
5. Click **Save**

GitHub Pages will serve `index.html` automatically. Your game will be live at:

```
https://YOUR_USERNAME.github.io/Drug-Dealer-Simulator-3/
```

No build step needed — GitHub Pages serves the files directly.

---

## How to Embed in Google Sites

1. Deploy to GitHub Pages first (see above)
2. In Google Sites, add an **Embed** block
3. Choose **Embed URL**
4. Paste your GitHub Pages URL
5. Resize the embed block to fill the page

For best results, set the embed to full-page width and at least 700px tall. The game is responsive and will adapt to the available space.

---

## Gameplay Overview

| System | Description |
|--------|-------------|
| **Dealing** | Click the central button to earn dirty cash based on your active product |
| **Products** | 14 product tiers from Reggie to Cocaine — unlock with earned cash |
| **Workers** | 11 worker types that generate passive income, reduce heat, or launder money |
| **Upgrades** | 14 upgrades that multiply click value, worker income, or reduce heat |
| **Heat** | Rises with each deal. At 90+ you risk raids that cost cash and workers |
| **Laundering** | 7 front businesses convert dirty cash to clean cash automatically |
| **Districts** | 7 territories to unlock, each giving permanent income or heat bonuses |
| **Events** | Random events fire every ~60 seconds — booms, crashes, cop encounters |
| **Achievements** | 29 achievements with permanent rewards (cash, multipliers) |
| **Offline Progress** | Workers keep earning while you're away (capped at 12 hours) |

### Heat Stages

| Range | Status | Effect |
|-------|--------|--------|
| 0–24 | Safe | Full income |
| 25–49 | Suspicious | −10% income |
| 50–74 | Investigated | −25% income |
| 75–89 | Surveillance | −50% income |
| 90–100 | **Raid Risk** | −75% income, chance of raid each second |

### Managing Heat

- **Lay Low** — spend $500, remove 20 heat (2-minute cooldown)
- **Bribe** — spend $2,000, remove 35 heat (5-minute cooldown)
- **Lookout** workers — passive −0.3 heat/s each
- **Muscle** workers — passive −0.8 heat/s each
- **Hacker** workers — passive −2 heat/s each
- **Underground Market** district — all heat generation halved

---

## Save System

- **Autosave** every 30 seconds to `localStorage`
- **Manual save** via the 💾 button in the header or Settings
- Save data is base64-encoded for light obfuscation
- Settings → Reset Game wipes all progress

---

## Settings

| Setting | Options | Effect |
|---------|---------|--------|
| Graphics Quality | Low / Balanced / High | Adjusts animation complexity and update rate |
| Animation Intensity | None / Low / Medium / High | Controls particle effects and transitions |
| Floating Cash Numbers | On / Off | Toggles the +$ pop on each click |
| Notifications | On / Off | Toggles the event log entries |

---

## Technical Notes

- **No frameworks** — pure HTML, CSS, and JavaScript
- **No build tools** — works directly from the filesystem or any static host
- **No external dependencies** — fully self-contained
- Uses `requestAnimationFrame` + `setTimeout` throttling for the game loop
- Offline progress uses `AntiCheat.validateTimeDelta()` to cap and validate elapsed time
- All multipliers are recomputed from purchased upgrades on load (`Production.recomputeMultipliers`)

---

## Content Disclaimer

This game is a work of fiction for entertainment purposes only. It does not simulate, instruct, or encourage real-world illegal activity. All depicted substances, organizations, and events are fabricated for gameplay purposes.

If you or someone you know needs help with substance-related issues, please contact a healthcare professional or call your local crisis line.
