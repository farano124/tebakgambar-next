# Tebak Gambar - Next.js Version

A modern reimplementation of the Tebak Gambar (Guess the Picture) game using Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **Authentication**: Secure login/register with Supabase Auth
- 🎮 **Game Mechanics**: Picture guessing game with multiple levels
- 📊 **Leaderboards**: User rankings and progress tracking
- 👥 **User Management**: Admin panel for managing users and levels
- 🎨 **Modern UI**: Beautiful design with Tailwind CSS
- 📱 **Responsive**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel/Netlify

## 🚀 Quick Start

### ⚡ One-Command Setup (Recommended)

If you have Supabase CLI installed:
```bash
# Clone and setup everything automatically
git clone <your-repo>
cd tebakgambar-next
npm install
./setup.sh
npm run dev
```

### 🛠️ Manual Setup

#### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account ([supabase.com](https://supabase.com))

#### Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase project:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Note your project URL and API keys from Settings > API

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your actual Supabase credentials.

4. **Set up database:**
   - Run the migrations from `database/migrations/` in Supabase SQL Editor
   - Or use the automated setup: `./setup.sh`

5. **Start development:**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Production Deployment

### Vercel (Recommended) ⭐
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/tebakgambar-next)

### Other Platforms
- **Netlify**: Follow `DEPLOYMENT.md` guide
- **Railway**: Connect repository, set environment variables
- **DigitalOcean**: Use App Platform with build settings

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Authentication pages
│   ├── dashboard/      # Main game dashboard
│   ├── game/          # Game pages
│   └── api/           # API routes
├── components/         # Reusable React components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
└── middleware.ts      # Next.js middleware
```

## Database Migration

✅ **Database migration scripts created!**

The original MySQL database has been successfully migrated to PostgreSQL for Supabase. All 100 levels with Indonesian proverbs have been converted.

### Migration Files:
- `database/migrations/001_initial_schema.sql` - Database schema with UUIDs, proper indexes, and triggers
- `database/migrations/002_seed_data.sql` - All 100 levels data migrated from MySQL
- `database/migrations/003_seed_users.sql` - User migration guide (Supabase Auth integration)

### Database Schema:

#### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT, -- Nullable for backwards compatibility
  username TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  akses INTEGER DEFAULT 1, -- 0 = admin, 1 = user
  salah INTEGER DEFAULT 0, -- Wrong answers counter
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

#### Levels Table
```sql
CREATE TABLE levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level INTEGER UNIQUE NOT NULL,
  gambar TEXT, -- Image filename (optional)
  jawaban TEXT NOT NULL, -- Answer (normalized)
  makna TEXT, -- Meaning/explanation
  peribahasa TEXT, -- Indonesian proverb
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

#### User Progress Table
```sql
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  level INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, level)
);
```

### Key Migration Improvements:
- ✅ **UUID primary keys** (modern PostgreSQL standard)
- ✅ **Proper timestamps** with timezone support
- ✅ **Auto-updating triggers** for `updated_at` fields
- ✅ **Optimized indexes** for performance
- ✅ **Supabase Auth integration** ready
- ✅ **All 100 levels migrated** with complete data

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Original PHP version created by the development team
- Built with love for Indonesian game enthusiasts 🎮🇮🇩
