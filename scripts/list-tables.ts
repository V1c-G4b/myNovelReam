import { config } from "dotenv";
import { Client } from "pg";
config({ path: ".env" });

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query(
    `SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY 1,2;`
  );
  console.table(res.rows);
  await client.end();
})();
