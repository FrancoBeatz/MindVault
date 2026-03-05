import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:54c8dab006ca9a140c407ba7a71b8be379ac3ff7@db.rlvkrlxywrgwzshnnuab.supabase.co:5432/postgres';

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL environment variable is missing. Using provided fallback connection.');
}

const sql = postgres(connectionString, {
  ssl: 'require',
  connect_timeout: 10,
  max: 10,
});

export default sql;
