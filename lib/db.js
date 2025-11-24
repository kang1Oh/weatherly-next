import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // optionally add ssl config for production
});

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}
