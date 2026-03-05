import sql from './postgres.js';

export async function initPostgres() {
  try {
    console.log('⏳ Initializing PostgreSQL tables...');
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create journals table
    await sql`
      CREATE TABLE IF NOT EXISTS journals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log('✅ PostgreSQL tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing PostgreSQL tables:', error);
    // Don't throw, just log. The app might still work if tables already exist but query failed for other reasons.
  }
}
