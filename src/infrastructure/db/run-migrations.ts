import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "./client";

// Executa migrações programaticamente (idempotente)
export async function runMigrations() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // Caminho absoluto para a pasta de migrações (para evitar problemas de cwd)
  const migrationsFolder = path.resolve(__dirname, "../db/migrations");
  await migrate(db, { migrationsFolder });
}
