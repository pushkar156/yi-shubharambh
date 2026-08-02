# 🧩 Crack the Code — Yi MIT-WPU Stall Game

An interactive, real-time **Word Search** challenge built for the **CII Young Indians (Yi) MIT-WPU Student Chapter** at the **Shubharambh 2026 Festival**.

The application features a dual-screen experience: a **Host Laptop Display Dashboard** showing real-time statistics (using Supabase), and a **Player Mobile Screen** accessed via scanning a dynamically generated session QR code.

---

## ⚡ Key Features

1.  **Dynamic 10x10 Word Search Grid:**
    *   Dynamically places target words (**LEAD**, **CREATE**, and **IMPACT**) horizontally, vertically, or diagonally on every game start.
    *   Fills the remaining cells with randomized letters so players get a unique layout every time.
    *   Dual-selection controls: supports both sequential tapping (letter-by-letter) and fast selecting (tapping start ➔ end).
2.  **Supabase Real-Time Statistics Sync:**
    *   Tracks **Games Played** and **Total Wins** in a central database.
    *   Uses PostgreSQL replication channels to stream game occurrences **instantly** to the host laptop dashboard without page reloads.
    *   Fails silently to offline `LocalStorage` backup if database credentials are not configured.
3.  **Stall Protection & Attempt Limits:**
    *   **Device Limit:** Enforces a maximum of **2 attempts** per player phone to prevent grid-spamming at the stall.
    *   **Demo Mode Bypass:** Host/laptop devices logged in as Admin are granted **unlimited attempts** to allow team demonstrations.
4.  **Admin Login Screen:**
    *   Secures the host screen at `?mode=host` behind username/password credentials stored securely in environment variables.
5.  **Neomorphic & Neo-Brutalist UI:**
    *   Visual theme styled with high-contrast borders, bold geometry, and customized colors matching the Young Indians organization branding.

---

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), TypeScript, Tailwind CSS, Lucide icons.
*   **Database & Sync:** `@supabase/supabase-js` (PostgreSQL + Real-time Listeners).
*   **Haptic & Audio:** Sound effects for keystrokes, correct solves, failures, victory, and time-ups.

---

## 📂 Project Structure

```
├── public/
│   └── yi-logo.jpeg        # Brand logo asset (favicon and display banner)
├── src/
│   ├── components/
│   │   ├── AdminLogin.tsx       # Neo-Brutalist credential validation screen
│   │   ├── HostScreen.tsx       # Live stats counter and session QR display
│   │   ├── PlayerLanding.tsx    # Mobile game portal landing screen
│   │   ├── PlayerGame.tsx       # Puzzle container (30s timer, clue tray, layout)
│   │   ├── WordSearchGrid.tsx   # Dynamic word-search generator and click controls
│   │   ├── PlayerResult.tsx     # Victory / time's-up outcome page
│   │   └── InstagramScreen.tsx  # Follow check and sticker reward claim panel
│   ├── utils/
│   │   ├── supabaseClient.ts    # Configured Supabase database client
│   │   └── sound.ts             # Sound effects player
│   ├── App.tsx                  # Main router and state coordination
│   ├── config.ts                # General application configuration constants
│   └── main.tsx                 # Client entry point
```

---

## ⚙️ Setup & Installation

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```env
# Admin Login Credentials (for Host screen protection)
VITE_ADMIN_USERNAME="admin"
VITE_ADMIN_PASSWORD="your_admin_password"

# Supabase Credentials (for real-time statistics syncing)
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-long-anon-key-string"
```

### 3. Run Locally
```bash
# Starts development server (default: http://localhost:3000)
npm run dev

# Tests production build compilation
npm run build
```

---

## 🗄️ Database Setup (Supabase)

To enable real-time counting:
1.  Create a project on [Supabase](https://supabase.com) (Free Tier).
2.  Go to the **SQL Editor** in your Supabase dashboard and run this script to create the table, set up security policies, and configure real-time streaming:

```sql
-- 1. Create the games table
create table public.games (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  status text not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.games enable row level security;

-- 3. Create security policies for public access (so player phones can write statistics)
create policy "Allow public inserts" on public.games
  for insert with check (true);

create policy "Allow public reads" on public.games
  for select using (true);

create policy "Allow public deletes" on public.games
  for delete using (true);

-- 4. Enable real-time replication for this table
alter publication supabase_realtime add table public.games;
```

---

## 🚀 Deployed Workflows

1.  **Host Launch:** Set up the host laptop at the stall, navigate to `/?mode=host`, log in as admin, and toggle fullscreen.
2.  **Gameplay Loop:** Attendees scan the QR code ➔ Play the game (30s timer, 10x10 letters, maximum 2 attempts) ➔ Win ➔ Redirect to follow Instagram (`@youngindians_mitwpu`) ➔ Show follow screen to host ➔ Claim sticker!
