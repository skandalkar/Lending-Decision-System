import "dotenv/config";

function required(name) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 5000),

    postgres: {
        host: required("POSTGRES_HOST"),
        port: Number(process.env.POSTGRES_PORT || 5432),
        database: required("POSTGRES_DB"),
        user: required("POSTGRES_USER"),
        password: required("POSTGRES_PASSWORD")
    },

    mongodb: {
        uri: required("MONGODB_URI"),
        database: required("MONGODB_DATABASE")
    },

    workerIntervalMs: Number(
        process.env.DECISION_WORKER_INTERVAL_MS || 1000
    )
};