import { postgresPool } from "../config/postgres.js";

export async function saveDecision(client, decision) {
    const result = await client.query(`
        INSERT INTO loan_decisions (
        application_id,
        decision,
        credit_score,
        signal_results,
        reason_codes
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
    `,
        [
            decision.applicationId,
            decision.decision,
            decision.creditScore,
            JSON.stringify(decision.signalResults),
            JSON.stringify(decision.reasonCodes)
        ]
    );

    return result.rows[0];
}

export async function findDecisionByApplicationId(applicationId) {
    const result = await postgresPool.query(`
        SELECT *
        FROM loan_decisions
        WHERE application_id = $1
        `,
        [applicationId]
    );

    return result.rows[0] || null;
}