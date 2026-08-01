import { postgresPool } from "../config/postgres.js";
import { recordAuditEvent } from "./audit.service.js";
import { evaluateApplication } from "../decision-engine/decision.engine.js";
import { saveDecision, findDecisionByApplicationId } from "../repositories/decision.repository.js";
import { findApplicationById, markApplicationCompleted, markApplicationFailed } from "../repositories/application.repository.js";

export async function processDecision(applicationId, requestId) {
    const application = await findApplicationById(applicationId);

    if (!application) {
        throw new Error(`Application ${applicationId} was not found.`);
    }

    const decision = evaluateApplication(application);
    const client = await postgresPool.connect();

    try {
        await client.query("BEGIN");

        await saveDecision(client, {
            applicationId,
            decision: decision.decision,
            creditScore: decision.creditScore,
            signalResults: decision.signalResults,
            reasonCodes: decision.reasonCodes
        });

        await markApplicationCompleted(client, applicationId);
        await client.query("COMMIT");

    } catch (error) {
        await client.query("ROLLBACK");
        await markApplicationFailed(client, applicationId);
        throw error;

    } finally {
        client.release();
    }

    await recordAuditEvent({
        applicationId,
        eventType: "DECISION_COMPLETED",
        requestId,
        data: {
            decision: decision.decision,
            creditScore: decision.creditScore,
            passedSignals: decision.passedSignals,
            reasonCodes: decision.reasonCodes
        }
    });

    return decision;
}

export async function getDecision(applicationId) {
    return findDecisionByApplicationId(applicationId);
}