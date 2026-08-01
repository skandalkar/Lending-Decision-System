import { claimNextJob, markJobCompleted, markJobFailed } from "../repositories/job.repository.js";
import { processDecision } from "./decision.service.js";

export async function processNextJob() {
    const job = await claimNextJob();

    if (!job) {
        return false;
    }

    try {
        await processDecision(job.application_id, `worker-${job.id}`);
        await markJobCompleted(job.id);
        return true;

    } catch (error) {
        console.error(`Decision job ${job.id} failed:`, error);
        await markJobFailed(job.id, error.message);
        return false;
    }
}