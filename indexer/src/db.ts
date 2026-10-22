import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

interface IDatabaseInterface {
  connectionString: string;
  max?: number;
  idleTimeoutMillis?: number;
}

class Database {
  private static instance: Database | null = null;
  private pool: Pool;

  private constructor(config: IDatabaseInterface) {
    this.pool = new Pool({
      connectionString: config.connectionString,
      max: config.max ?? 20,
      idleTimeoutMillis: config.idleTimeoutMillis ?? 30000,
    });

    this.pool.on('error', (err) => {
      console.error('unexpected error in Postgres idle client', err);
    });
  }

  public static getInstance(config?: IDatabaseInterface): Database {
    if (!Database.instance) {
      if (!config) {
        throw new Error('Config is required');
      }
      Database.instance = new Database(config);
    }
    return Database.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

}

export default Database;
