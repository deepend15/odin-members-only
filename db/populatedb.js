import { Client } from "pg";

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR ( 255 ),
  last_name VARCHAR ( 255 ),
  username VARCHAR ( 255 ),
  password VARCHAR ( 255 ),
  member BOOLEAN DEFAULT FALSE,
  admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  title VARCHAR ( 50 ),
  message TEXT,
  time TIMESTAMP 
)
`;

async function main() {
  console.log("Seeding...");
  let connectionStringValue;
  if (process.argv.length > 2) connectionStringValue = process.argv[2];
  else connectionStringValue = process.argv[1];
  const client = new Client({
    connectionString: connectionStringValue,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done!");
}

main();
