#!/bin/bash

# ============================================================================
# TEBAK GAMBAR - DATABASE SETUP SCRIPT
# ============================================================================
# This script helps you set up the database for your Tebak Gambar Next.js app
# Run this script after setting up your Supabase project
# ============================================================================

echo "🎮 TEBAK GAMBAR - Database Setup"
echo "================================="
echo ""

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: Supabase environment variables not found!"
    echo ""
    echo "Please set the following environment variables:"
    echo "  NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url"
    echo "  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    echo ""
    echo "You can find these in your Supabase dashboard > Settings > API"
    exit 1
fi

echo "✅ Environment variables found"
echo ""

# Extract project reference from URL
PROJECT_REF=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's|https://||' | sed 's|\.supabase\.co||')
echo "📍 Project Reference: $PROJECT_REF"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "🔗 Linking to Supabase project..."
supabase link --project-ref $PROJECT_REF

if [ $? -ne 0 ]; then
    echo "❌ Failed to link to Supabase project"
    echo ""
    echo "Make sure:"
    echo "1. Your Supabase project exists"
    echo "2. The service role key is correct"
    echo "3. You have the correct permissions"
    exit 1
fi

echo "✅ Successfully linked to Supabase project"
echo ""

echo "🗄️  Running database migrations..."
echo ""

# Run migrations in order
echo "1. Creating database schema..."
supabase db push --include-all

if [ $? -ne 0 ]; then
    echo "❌ Failed to run migrations"
    exit 1
fi

echo ""
echo "✅ Database setup complete!"
echo ""
echo "🎉 Your Tebak Gambar database is ready!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Visit http://localhost:3000 to see your app"
echo "3. Register an admin account first"
echo "4. Start playing the game!"
echo ""
echo "Happy gaming! 🎮🇮🇩"