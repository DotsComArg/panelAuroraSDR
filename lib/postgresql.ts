import { Pool, PoolClient } from 'pg';

let pool: Pool | null = null;

export function getPostgresPool(): Pool {
  if (pool) {
    return pool;
  }

  // Credenciales hardcodeadas para desarrollo
  const connectionString = process.env.DATABASE_PUBLIC_URL 
    || process.env.DATABASE_URL 
    || 'postgresql://postgres:zUrQI9Q1_QAT~KA8YMiZ5tl~_HYSm~Kn@yamabiko.proxy.rlwy.net:41643/railway';

  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  return pool;
}

export async function queryPostgres<T = any>(
  query: string,
  params?: any[]
): Promise<T[]> {
  const pool = getPostgresPool();
  const result = await pool.query(query, params);
  return result.rows;
}

export async function getPostgresClient(): Promise<PoolClient> {
  const pool = getPostgresPool();
  return pool.connect();
}

// Función para cerrar el pool (útil para testing o shutdown)
export async function closePostgresPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

