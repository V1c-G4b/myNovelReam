import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .refine(
      (v) => v.startsWith("postgres://") || v.startsWith("postgresql://"),
      "DATABASE_URL deve começar com postgres:// ou postgresql://"
    ),
  BETTER_AUTH_SECRET: z.string().min(16, "BETTER_AUTH_SECRET muito curto"),
  BETTER_AUTH_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
