import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/infrastructure/db/migrations",
  schema: "./src/infrastructure/persistence/schema/**",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
  casing: "snake_case",
});
