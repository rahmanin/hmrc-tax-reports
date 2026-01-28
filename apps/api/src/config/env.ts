import dotenv from 'dotenv';

// Load .env only for local/dev; in prod env vars come from the platform
dotenv.config();

export const rawEnv = process.env;
