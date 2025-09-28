import type { Config } from "drizzle-kit";

const config: Config = {
  schema: "./src/database/schema/*",
  out: "./src/database/migrations",
  dialect: "postgresql",
  strict: true,
  dbCredentials: {
    url: process.env.DB_URL as string,
    ssl: process.env.DB_SSL === "true",
  },
};

export default config;
