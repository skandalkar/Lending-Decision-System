import { postgresPool } from "../config/postgres.js";

export async function createDecisionJob(client, applicationId) {
    const result = await client.query(`
        INSERT INTO decision_jobs (application_id)
        VALUES ($1)
        RETURNING *
    `,
        [applicationId]
    );

    return result.rows[0];
}

export async function claimNextJob() {
    const client = await postgresPool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(`      
            SELECT * FROM decision_jobs
            WHERE status = 'PENDING'
            ORDER BY created_at ASC
            FOR UPDATE SKIP LOCKED
            LIMIT 1
        `);

        if (result.rows.length === 0) {
            await client.query("COMMIT");
            return null;
        }

        const job = result.rows[0];

        const updateResult = await client.query(`
            UPDATE decision_jobs
            SET
            status = 'PROCESSING',
            attempts = attempts + 1,
            locked_at = NOW()
            WHERE id = $1
            RETURNING *
        `,
            [job.id]
        );

        await client.query("COMMIT");

        return updateResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function markJobCompleted(jobId) {
    await postgresPool.query(`
        UPDATE decision_jobs
        SET
        status = 'COMPLETED',
        completed_at = NOW()
        WHERE id = $1
    `,
        [jobId]
    );
}

export async function markJobFailed(jobId, errorMessage) {
    await postgresPool.query(`
        UPDATE decision_jobs
        SET
        status = 'FAILED',
        last_error = $2
        WHERE id = $1
    `,
        [jobId, errorMessage]
    );
}