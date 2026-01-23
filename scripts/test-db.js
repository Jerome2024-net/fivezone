
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:hY1yQ6nTuMYrCcGH@db.klvquwlfknonzjczrljp.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

console.log("Attempting to connect to:", client.connectionParameters.host);

client.connect()
  .then(() => {
    console.log('Connected successfully!');
    return client.end();
  })
  .catch(err => {
    console.error('Connection error:', err);
    client.end();
  });
