-- Add get_user_rank function
CREATE OR REPLACE FUNCTION get_user_rank(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  user_rank INTEGER := 1;
BEGIN
  -- Count users with higher ranking (higher level or same level with fewer salah or same salah with earlier creation)
  SELECT COUNT(*) + 1 INTO user_rank
  FROM users u
  WHERE u.akses = 1
    AND (
      u.level > (SELECT level FROM users WHERE id = user_id)
      OR (u.level = (SELECT level FROM users WHERE id = user_id)
          AND u.salah < (SELECT salah FROM users WHERE id = user_id))
      OR (u.level = (SELECT level FROM users WHERE id = user_id)
          AND u.salah = (SELECT salah FROM users WHERE id = user_id)
          AND u.created_at < (SELECT created_at FROM users WHERE id = user_id))
    );

  RETURN user_rank;
END;
$$ LANGUAGE plpgsql;