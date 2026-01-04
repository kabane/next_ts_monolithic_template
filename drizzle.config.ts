import { defineConfig } from "drizzle-kit";
import { env } from "./app/lib/env";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
