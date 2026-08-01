import { postgresPool } from "../config/postgres.js";
import { createApplication } from "../repositories/application.repository.js";
import { createDecisionJob } from "../repositories/job.repository.js";
import { recordAuditEvent } from "./audit.service.js";

export async function submitApplication(application, requestId) {
    const client = await postgresPool.connect();
    let createdApplication;

    try {
        await client.query("BEGIN");
        createdApplication = await createApplication(client, application);
        await createDecisionJob(client, createdApplication.id);
        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }

    await recordAuditEvent({
        applicationId: createdApplication.id,
        eventType: "APPLICATION_SUBMITTED",
        requestId,
        data: {
            status: "PROCESSING"
        }
    });

    return createdApplication;
}