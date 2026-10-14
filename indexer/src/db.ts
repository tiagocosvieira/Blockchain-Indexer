import dotenv from 'dotenv'
import {Pool} from 'pg'

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL,
});

async function verifyConnection(): Promise<void> {
    try{
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL database');

    client.release(); 
    } catch (error) {
    console.error('❌ Error connecting to the database:', error);
  }
}

verifyConnection();

export default pool;