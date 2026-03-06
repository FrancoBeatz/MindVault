import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ CRITICAL: DATABASE_URL is missing. PostgreSQL will default to localhost and likely fail.');
}

const sql = postgres(connectionString || 'postgresql://localhost:5432/postgres', {
  ssl: connectionString?.includes('supabase.co') ? 'require' : false,
  connect_timeout: 10,
});

export default sql;
