import { env } from "../config/env.js";
import { processNextJob } from "../services/processing.service.js";

let running = false;

export function startDecisionWorker() {
    console.log("Decision worker started.");

    setInterval(async () => {
        if (running) {
            return;
        }

        running = true;

        try {
            await processNextJob();
        } catch (error) {
            console.error("Decision worker error:", error);
        } finally {
            running = false;
        }
    }, env.workerIntervalMs);
}