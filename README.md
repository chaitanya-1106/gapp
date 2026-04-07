# Gapp — Bridge the Commitment–Execution Gap

A modern web application that tracks commitment follow-through, assigns a personal reliability score (Gapp Score), and helps users close the Commitment–Execution Gap (CEG).

## 🚀 Features

- **Authentication** — Sign up / Sign in via Supabase Auth. New users start with a Gapp Score of 100.
- **Dashboard** — Animated score ring, tier badges (Elite / On Track / At Risk), and stat cards for total commitments, executed, ghosted, and execution rate.
- **Commitment Engine** — Add commitments with optional Implementation Intentions ("When X, I will Y"). Mark them as Done (+5 GS) or Ghosted (−10 GS).
- **Leaderboard** — All users ranked by Gapp Score with tier badges and execution rates.
- **About CEG** — Research context on the Commitment–Execution Gap, plus a breakdown of how scoring works.

## 🛠️ Tech Stack

- **Frontend**: Vite + Vanilla JavaScript + Vanilla CSS
- **Backend**: Supabase (Auth + PostgreSQL + Row Level Security)
- **Fonts**: Inter (Google Fonts)

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Gapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Open the **SQL Editor** in your Supabase dashboard
3. Copy and run the contents of `supabase_schema.sql` to create:
   - `profiles` table (auto-created on sign up)
   - `commitments` table
   - Row Level Security policies
   - Auto-profile creation trigger

4. Update the Supabase credentials in `src/supabase.js`:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

### 4. Run the Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📊 Scoring System

| Action | Score Change |
|---|---|
| Starting Score | 100 |
| Commitment Executed | +5 |
| Commitment Ghosted | −10 |

### Tier System

| Tier | Score Range | Badge |
|---|---|---|
| 🏆 Elite | ≥ 90 | Gold |
| ✅ On Track | 60–89 | Green |
| ⚠️ At Risk | < 60 | Red |

## 📁 Project Structure

```
Gapp/
├── index.html              # HTML entry point
├── src/
│   ├── main.js             # App entry, routing, toast system
│   ├── supabase.js          # Supabase client singleton
│   ├── router.js            # Hash-based SPA router
│   ├── auth.js              # Auth helpers (sign up/in/out)
│   ├── style.css            # Complete design system
│   └── pages/
│       ├── auth.js          # Login / signup page
│       ├── dashboard.js     # Score ring + stats
│       ├── commitments.js   # Commitment engine
│       ├── leaderboard.js   # Ranked profiles
│       └── about.js         # CEG research + scoring info
├── supabase_schema.sql      # Database setup SQL
└── README.md
```

## 🎨 Design

- **Color Theme**: Dark background + orange accent (inspired by the Gapp logo)
- **Typography**: Inter font family
- **Style**: Minimalist, modern, glassmorphism elements
- **Animations**: Score ring animation, slide-in cards, toast notifications
- **Responsive**: Fully responsive from mobile to desktop

## 📝 License

MIT
