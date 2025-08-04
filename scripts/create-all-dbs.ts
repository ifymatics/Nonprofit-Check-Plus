import { Client } from 'pg';

const databases = [
  process.env.DB_NAME_AUTH || 'non_profit_auth',
  process.env.DB_NAME_SEARCH_HISTORY || 'non_profit_search_history',

  process.env.DB_NAME_NOTIFICATION || 'non_profit_notification',
  process.env.DB_NAME_ADMIN || 'non_profit_admin',

  // Add more if needed
];

// const client = new Client({
//   user: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASS || 'postgres',
//   host: process.env.DB_HOST || 'postgres',
//   port: Number(process.env.DB_PORT || 5432),
//   database: 'postgres', // connect to default db
// });
const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});
async function createDatabase(dbName: string) {
  try {
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname=$1`,
      [dbName],
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Created database: "${dbName}"`);
    } else {
      console.log(`ℹ️ Database "${dbName}" already exists`);
    }
  } catch (err) {
    console.error(`❌ Error checking or creating DB "${dbName}":`, err.message);
  }
}

async function run() {
  try {
    await client.connect();
    console.log(`🔌 Connected to Postgres on ${client.host}:${client.port}`);

    for (const db of databases) {
      await createDatabase(db);
    }

    console.log('✅ Done creating all databases.\n');
  } catch (err) {
    console.error(
      '❌ Failed to connect or run database creation script:',
      err.message,
    );
  } finally {
    await client.end();
    process.exit(0);
  }
}

run();
