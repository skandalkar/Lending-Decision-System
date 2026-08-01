CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE
    IF NOT EXISTS loan_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        owner_name VARCHAR(150) NOT NULL,
        business_name VARCHAR(200) NOT NULL,
        pan VARCHAR(10) NOT NULL,
        business_type VARCHAR(50) NOT NULL,
        years_in_business NUMERIC(5, 2) NOT NULL,
        monthly_revenue NUMERIC(15, 2) NOT NULL,
        annual_revenue NUMERIC(15, 2) NOT NULL,
        existing_debt NUMERIC(15, 2) NOT NULL,
        requested_loan_amount NUMERIC(15, 2) NOT NULL,
        loan_purpose VARCHAR(100) NOT NULL,
        loan_tenure_months INTEGER NOT NULL,
        collateral_available BOOLEAN NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'PROCESSING',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        CONSTRAINT valid_application_status CHECK (status IN ('PROCESSING', 'COMPLETED', 'FAILED'))
    );

CREATE TABLE
    IF NOT EXISTS loan_decisions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        application_id UUID NOT NULL UNIQUE REFERENCES loan_applications (id) ON DELETE CASCADE,
        decision VARCHAR(20) NOT NULL,
        credit_score INTEGER NOT NULL,
        signal_results JSONB NOT NULL,
        reason_codes JSONB NOT NULL,
        decided_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        CONSTRAINT valid_decision CHECK (decision IN ('APPROVED', 'REJECTED')),
        CONSTRAINT valid_credit_score CHECK (credit_score BETWEEN 300 AND 900)
    );

CREATE TABLE
    IF NOT EXISTS decision_jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        application_id UUID NOT NULL UNIQUE REFERENCES loan_applications (id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        attempts INTEGER NOT NULL DEFAULT 0,
        locked_at TIMESTAMPTZ,
        completed_at TIMESTAMPTZ,
        last_error TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        CONSTRAINT valid_job_status CHECK (
            status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')
        )
    );

CREATE INDEX IF NOT EXISTS idx_applications_status ON loan_applications (status);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON decision_jobs (status, created_at);