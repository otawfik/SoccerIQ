# ⚽ SoccerIQ

A premium dark-themed React Native + Expo app for football intelligence — live fixtures, standings, player stats, squad/transfer intel, and form-based predictions across all top 5 leagues.

**Stack:** React Native · Expo (SDK 51) · Expo Router · Flask · football-data.org

---

## Design Language

| Token | Value |
|-------|-------|
| Background | `#0D0D0D` |
| Card | `#161616` |
| Accent Green | `#00FF87` |
| Accent Blue | `#00C2FF` |
| Accent Purple | `#7B61FF` |

Inspired by **Kalshi** and **Marvel Snap** — near-black base, electric accent glows, card-based layout with sharp typography and linear gradients.

---

## Project Structure

```
SoccerIQ/
├── app/
│   ├── _layout.tsx          # Root layout (StatusBar, Stack)
│   ├── index.tsx            # Redirect → (tabs)
│   └── (tabs)/
│       ├── _layout.tsx      # Bottom tab navigator
│       ├── index.tsx        # Home — live fixtures + standings
│       ├── players.tsx      # Top scorers per league
│       ├── transfers.tsx    # Squad/transfer intel
│       └── predictions.tsx  # Form-based predictions
├── components/
│   ├── Card.tsx             # Base card with optional gradient
│   ├── LeagueSelector.tsx   # Horizontal pill league switcher
│   ├── ScreenHeader.tsx     # Page title + subtitle
│   ├── StatusBadge.tsx      # LIVE / FT / Hot / Cold badge
│   ├── EmptyState.tsx       # Placeholder with icon
│   └── LoadingSpinner.tsx   # Centered spinner
├── constants/
│   ├── theme.ts             # Colors, Typography, Spacing, Radius
│   └── leagues.ts           # Top 5 league definitions
├── hooks/
│   └── useApi.ts            # Generic data-fetching hook
├── services/
│   └── api.ts               # All fetch calls → Flask backend
├── server/
│   ├── app.py               # Flask proxy server
│   ├── requirements.txt
│   ├── setup.sh
│   └── .env                 # FOOTBALL_API_KEY (never committed)
└── .env                     # EXPO_PUBLIC_API_URL
```

---

## Quick Start

### 1. Get a free API key

Register at [football-data.org](https://www.football-data.org/client/register) — the free tier covers all top 5 leagues.

### 2. Start the Flask backend

```bash
cd server
./setup.sh          # creates venv + installs deps

# Edit .env
echo "FOOTBALL_API_KEY=YOUR_KEY_HERE" > .env

source venv/bin/activate
python app.py       # runs on http://localhost:5000
```

Verify it's working:
```bash
curl http://localhost:5000/health
# → {"status":"ok","service":"SoccerIQ API"}
```

### 3. Start the Expo app

```bash
# From project root
npm install
npx expo start
```

Open in Expo Go on your device or press `i`/`a` for simulator.

---

## Covered Leagues

| League | ID | Country |
|--------|----|---------|
| Premier League | 2021 | 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England |
| La Liga | 2014 | 🇪🇸 Spain |
| Bundesliga | 2002 | 🇩🇪 Germany |
| Serie A | 2019 | 🇮🇹 Italy |
| Ligue 1 | 2015 | 🇫🇷 France |

---

## Flask API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /api/standings/:leagueId` | League table |
| `GET /api/matches/live` | All in-play matches |
| `GET /api/matches/today` | Today's fixtures |
| `GET /api/matches/:leagueId` | League fixtures |
| `GET /api/scorers/:leagueId` | Top scorers |
| `GET /api/teams/:leagueId` | All teams + squads |
| `GET /api/predictions/:leagueId` | Form-based predictions |

---

## Environment Variables

**`server/.env`** (never commit)
```
FOOTBALL_API_KEY=your_key_here
FLASK_ENV=development
FLASK_DEBUG=1
```

**`.env`** (root — safe to commit)
```
EXPO_PUBLIC_API_URL=http://localhost:5000
```

For a deployed backend, update `EXPO_PUBLIC_API_URL` to your server URL.

---

## Notes

- The **Transfers** tab shows squad rosters as intel since football-data.org's free tier has no dedicated transfers endpoint. Upgrade to a paid tier and swap `fetchLeagueTeams` for a transfers call.
- The **Predictions** engine runs server-side in Flask — it aggregates form strings from standings and returns scored entries ranked by recent form.
- Pull-to-refresh works on all screens.
