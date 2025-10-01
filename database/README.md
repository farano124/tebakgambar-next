# Database Migrations

This folder contains PostgreSQL migration scripts for setting up the Tebak Gambar database in Supabase.

## Migration Files

1. **001_initial_schema.sql** - Creates the basic database schema with tables, indexes, and triggers
2. **002_seed_data.sql** - Inserts all 100 levels data from the original MySQL database
3. **003_seed_users.sql** - Instructions for user migration (requires Supabase Auth setup first)

## How to Run Migrations

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of each migration file in order:
   - First: `001_initial_schema.sql`
   - Second: `002_seed_data.sql`
4. Execute each script

### Option 2: Using Supabase CLI (if installed)

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option 3: Using psql or any PostgreSQL client

Connect to your Supabase database and run the SQL files in order.

## Database Schema

### Tables Created:

- **users** - User profiles (authentication handled by Supabase Auth)
- **levels** - Game levels with answers and explanations
- **user_progress** - Tracks user progress through levels

### Key Differences from MySQL:

1. **UUID Primary Keys** - Using PostgreSQL UUIDs instead of auto-increment integers
2. **Timestamps with Timezone** - Using `timestamptz` for better timezone handling
3. **Authentication** - User authentication moved to Supabase Auth
4. **Automatic Triggers** - Auto-updating `updated_at` timestamps
5. **Proper Indexing** - Optimized indexes for common queries

## User Migration Notes

⚠️ **Important**: Users cannot be directly migrated from the old MySQL database because:

1. The original passwords are stored in plain text (security risk)
2. Supabase Auth uses different hashing algorithms
3. User authentication is now handled by Supabase

### Recommended Approach:

1. **Create users manually** through Supabase Auth dashboard or API
2. **Invite users** to reset their passwords via email
3. **Migrate user profiles** (names, levels, progress) after authentication setup
4. **Preserve game progress** by linking old user IDs to new Supabase user IDs

### Example User Creation:

```sql
-- After creating user in Supabase Auth, get the UUID
INSERT INTO users (id, email, username, nama, level, akses, salah)
VALUES ('supabase-auth-uuid', 'user@example.com', 'username', 'Nama Lengkap', 5, 1, 2);
```

## Data Verification

After running migrations, verify the data:

```sql
-- Check levels count
SELECT COUNT(*) FROM levels;

-- Check if all 100 levels were inserted
-- Should return 100

-- Check table structures
\d users
\d levels
\d user_progress
```

## Troubleshooting

**Common Issues:**

1. **Permission Denied**: Ensure you're using the service role key or have proper permissions
2. **Extension Not Found**: Make sure the `uuid-ossp` extension is available
3. **Duplicate Key Errors**: Check if tables already exist before running migrations

**Cleanup if needed:**

```sql
-- Drop all tables (CAUTION: This deletes all data)
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS levels;
DROP TABLE IF EXISTS users;