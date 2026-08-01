import app from "./app.js";
import { env } from "./config/env.js";
import { testPostgresConnection, initializePostgresSchema } from "./config/postgres.js";
import { connectMongoDB } from "./config/mongodb.js";
import { startDecisionWorker } from "./workers/decision.worker.js";

async function startServer() {
    try {
        await testPostgresConnection();
        console.log("PostgreSQL connected.");
        await initializePostgresSchema();
        await connectMongoDB();
        console.log("MongoDB connected.");

        app.listen(env.port, () => {
            console.log(`API running on http://localhost:${env.port}`);
        });

        startDecisionWorker();
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();