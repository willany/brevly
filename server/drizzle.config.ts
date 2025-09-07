
import { config } from "dotenv";
import type { Config } from 'drizzle-kit';

config();

const DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

export default {
  dbCredentials: {
    url: DATABASE_URL,
  },
  dialect: 'postgresql',
  schema: './src/infra/db/schemas/*',
  out: './src/infra/db/migrations',
} satisfies Config;
