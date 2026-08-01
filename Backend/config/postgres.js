import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const postgresPool = new Pool({
    host: env.postgres.host,
    port: env.postgres.port,
    database: env.postgres.database,
    user: env.postgres.user,
    password: env.postgres.password,
    max: 10,
    idleTimeoutMillis: 30000
});

export async function testPostgresConnection() {
    const client = await postgresPool.connect();

    try {
        await client.query("SELECT 1");
    } finally {
        client.release();
    }
}

export async function initializePostgresSchema() {
    const migrationPath = path.resolve(
        __dirname,
        "../migrations/001_initial_schema.sql"
    );

    const migrationSql = fs.readFileSync(
        migrationPath,
        "utf8"
    );

    await postgresPool.query(migrationSql);
}