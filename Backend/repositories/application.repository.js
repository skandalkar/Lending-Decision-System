import { postgresPool } from "../config/postgres.js";

export async function createApplication(client, application) {
    const query = `INSERT INTO loan_applications (
      owner_name,
      business_name,
      pan,
      business_type,
      years_in_business,
      monthly_revenue,
      annual_revenue,
      existing_debt,
      requested_loan_amount,
      loan_purpose,
      loan_tenure_months,
      collateral_available
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING * `;

    const values = [
        application.ownerName,
        application.businessName,
        application.pan,
        application.businessType,
        application.yearsInBusiness,
        application.monthlyRevenue,
        application.annualRevenue,
        application.existingDebt,
        application.requestedLoanAmount,
        application.loanPurpose,
        application.loanTenure,
        application.collateral
    ];

    const result = await client.query(query, values);
    return result.rows[0];
}

export async function findApplicationById(applicationId) {
    const result = await postgresPool.query(`
        SELECT *
        FROM loan_applications
        WHERE id = $1
        `,
        [applicationId]
    );

    return result.rows[0] || null;
}

export async function markApplicationCompleted(client, applicationId) {
    await client.query(`
        UPDATE loan_applications
        SET status = 'COMPLETED',
        updated_at = NOW()
        WHERE id = $1
        `,
        [applicationId]
    );
}

export async function markApplicationFailed(client, applicationId) {
    await client.query(`
        UPDATE loan_applications
        SET status = 'FAILED',
        updated_at = NOW()
        WHERE id = $1
        `,
        [applicationId]
    );
}