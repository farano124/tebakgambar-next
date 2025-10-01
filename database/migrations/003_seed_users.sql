-- Seed users data (Note: Passwords are stored as plain text in original MySQL, but we'll need to hash them)
-- In production, you should hash passwords properly. For now, keeping original format for migration.

-- Note: Since we're migrating to Supabase Auth, user authentication will be handled by Supabase Auth
-- The users table here will store additional profile information
-- For now, we'll create placeholders - actual user creation should happen through Supabase Auth

-- Admin user (will need to be created through Supabase Auth first)
-- INSERT INTO users (id, email, username, nama, level, akses, salah) VALUES
-- ('admin-uuid-placeholder', 'admin@tebakgambar.com', 'admintg', 'Super User', 100, 0, 15);

-- Regular users (will need to be created through Supabase Auth first)
-- ('user1-uuid-placeholder', 'adam01@example.com', 'adam01', 'Adam', 13, 1, 20),
-- ('user2-uuid-placeholder', 'fulan01@example.com', 'fulan01', 'fulan', 5, 1, 3),
-- ('user3-uuid-placeholder', 'alif01@example.com', 'alif01', 'alif', 4, 1, 4),
-- ('user4-uuid-placeholder', 'ihsan01@example.com', 'ihsan01', 'Ihsan', 2, 1, 0),
-- ('user5-uuid-placeholder', 'andi01@example.com', 'andi01', 'Andi', 2, 1, 0),
-- ('user6-uuid-placeholder', 'ridha@example.com', 'Ridhahasnululya', 'DR.Ridha Hasnul Ulya', 70, 1, 43);

-- Instructions for user migration:
-- 1. Create users through Supabase Auth dashboard or API
-- 2. Get the UUIDs from Supabase Auth
-- 3. Update the users table with the correct UUIDs and profile information
-- 4. For password migration, users will need to reset passwords since we're moving to Supabase Auth

-- This is a safer approach than trying to migrate plain text passwords
-- Users can be invited to reset their passwords through Supabase Auth