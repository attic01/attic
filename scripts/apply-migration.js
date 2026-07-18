#!/usr/bin/env node
/**
 * Apply supabase/migrations/001_initial.sql using DATABASE_URL.
 *
 * Usage:
 *   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" npm run db:migrate
 *
 * Get the URI from: Supabase Dashboard → Project Settings → Database → Connection string (URI)
 */

const fs = require("fs");
const path = require("path");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error(
      "Missing DATABASE_URL.\n\n" +
        "1. Open Supabase → Project Settings → Database\n" +
        "2. Copy the Connection string (URI)\n" +
        "3. Run:\n" +
        '   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres" npm run db:migrate\n',
    );
    process.exit(1);
  }

  let pg;
  try {
    pg = require("pg");
  } catch {
    console.error('Install pg first: npm install pg --save-dev');
    process.exit(1);
  }

  const sqlPath = path.join(
    __dirname,
    "..",
    "supabase",
    "migrations",
    "001_initial.sql",
  );
  const sql = fs.readFileSync(sqlPath, "utf8");

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected. Applying 001_initial.sql…");

  try {
    await client.query(sql);
    console.log("Migration applied.");

    const { rows } = await client.query(`
      select table_name
      from information_schema.tables
      where table_schema = 'public'
        and table_type = 'BASE TABLE'
      order by table_name
    `);

    console.log("\nPublic tables:");
    for (const row of rows) {
      console.log(`  - ${row.table_name}`);
    }

    const expected = [
      "albums",
      "artists",
      "bulletin_posts",
      "playlist_tracks",
      "playlists",
      "profiles",
      "purchases",
      "tracks",
    ];
    const present = new Set(rows.map((r) => r.table_name));
    const missing = expected.filter((t) => !present.has(t));

    if (missing.length) {
      console.error("\nMissing tables:", missing.join(", "));
      process.exit(1);
    }

    console.log("\nAll Attic tables are present.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
