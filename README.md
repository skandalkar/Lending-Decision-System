# Lending-Decision-System

A software system that evaluates loan applications from small and medium businesses, analyzes financial and business data, assesses credit risk, and automatically recommends whether to approve, reject, or manually review the loan application.

# Lending Decision System for MSMEs

A lightweight, end-to-end lending decision system for evaluating MSME loan applications using business information, owner information, and loan requirements.

The system accepts an MSME loan application, validates the submitted information, processes the application through a credit decision engine, calculates an internal credit score between **300–900**, evaluates multiple lending criteria, and produces a binary **Approved / Rejected** decision with structured reason codes.

The system is designed around clean architecture, explicit business rules, backend validation, asynchronous processing, persistent decision records, and timestamped audit logs.

---

## 1. Project Overview

### Problem

Lending teams need a consistent way to evaluate small-business loan applications.

A basic lending workflow needs to answer:

- Is the application complete?
- Is the business information valid?
- Is the requested loan reasonable relative to the business?
- Does the business demonstrate sufficient financial strength?
- Does the owner/business present acceptable credit risk?
- Should the application be approved or rejected?
- Why was that decision made?
- Can the decision be audited later?

This project implements those requirements as a lightweight backend-driven lending decision system.

### High-Level Flow

![alt text](assets/HLD-Architecture.png)

# 2. System Architecture

The application is separated into independently understandable components.

![alt text](assets/System-Architecture.png)

---

# 3. Technology Stack

## Frontend

- React
- Vite
- JavaScript
- REST API integration
- SPA architecture

## Backend

- Node.js
- Express.js
- REST API
- Asynchronous decision processing

## Databases

### PostgreSQL

Used for transactional and relational application data:

- Applications
- Decisions
- Decision jobs

### MongoDB

Used for append-oriented audit information:

- Application submission events
- Decision processing events
- Decision completion events
- Error/failure events

## Development / Deployment

The system is designed so that the frontend and backend can be deployed independently.

---

# 4. Repository Structure

A recommended project structure is:

```text
Lending-Decision-System/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── App.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── Backend/   
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── decision-engine/
│   │   ├── workers/
│   │   ├── validatiors/
│   │   ├── migrations/
│   │   ├── models/
│   │   ├── utils/
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

# 5. Application Lifecycle

An application follows the following lifecycle:

![alt text](assets/App-Lifecycle.png)

The important distinction is that **application submission and decision processing are separate operations**.

The API does not perform the complete decision calculation inside the initial HTTP request.

Instead:

![alt text](assets/System-Flow.png)

---

# 6. Setup Guide

## Prerequisites

Install:

- Node.js
- npm
- PostgreSQL
- MongoDB
- Git

Verify Node.js:

```bash
node --version
```

Verify npm:

```bash
npm --version
```

Verify PostgreSQL:

```bash
psql --version
```

Verify MongoDB:

```bash
mongosh --version
```

---

# 7. Clone the Repository

```bash
git clone https://github.com/skandalkar/Lending-Decision-System.git
cd lending-decision-system
```

---

# 8. Backend Setup

Navigate to the backend:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file.

Example:

```env
PORT=5000

DATABASE_URL=postgresql://username:password@localhost:5432/lending_db

MONGODB_URI=mongodb://localhost:27017/lending_audit

NODE_ENV=development
```

The actual values should match the local database configuration.

---

# 9. PostgreSQL Setup

Create the database:

```sql
CREATE DATABASE lending_db;
```

Run the project's database migrations.

Example:

```bash
npm run migrate
```

The PostgreSQL database stores transactional application information.

Conceptually:

```text
applications
    │
    ├── application_id
    ├── applicant/business information
    ├── loan information
    ├── status
    ├── created_at
    └── updated_at

decisions
    │
    ├── decision_id
    ├── application_id
    ├── score
    ├── decision
    ├── reason_codes
    ├── created_at
    └── updated_at

decision_jobs
    │
    ├── job_id
    ├── application_id
    ├── status
    ├── attempts
    ├── created_at
    ├── started_at
    └── completed_at
```

---

# 10. MongoDB Setup

Start MongoDB locally.

Example connection:

```text
mongodb://localhost:27017/lending_audit
```

Audit events are stored separately from transactional application data.

Conceptual document:

```json
{
  "applicationId": "APP-12345",
  "eventType": "DECISION_COMPLETED",
  "timestamp": "2026-07-31T10:00:00.000Z",
  "metadata": {
    "decision": "APPROVED",
    "score": 782
  }
}
```

Audit events are append-oriented rather than repeatedly overwriting the same record.

---

# 11. Start Backend API

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

---

# 12. Start Decision Worker

The worker is responsible for asynchronous decision processing.

Example:

```bash
npm run worker
```

The worker continuously looks for pending decision jobs.

Architecture:

```text
PostgreSQL
    │
    │ pending jobs
    ▼
Decision Worker
    │
    ├── claim job
    ├── evaluate
    ├── save decision
    └── audit event
```

---

# 13. Frontend Setup

Navigate to the frontend:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

The Vite development server normally runs on:

```text
http://localhost:5173
```

---

# 14. Environment Variables

## Backend

```env
PORT=5000
DATABASE_URL=<postgresql-connection-string>
MONGODB_URI=<mongodb-connection-string>
NODE_ENV=development
```

## Frontend

```env
VITE_API_BASE_URL=http://localhost:5000
```

Environment variables must not contain secrets committed to Git.

Use:

```text
.env
```

and keep it out of version control.

---

# 15. REST API

Base URL:

```text
/api/v1
```

---

## 15.1 Submit Application

### Endpoint

```http
POST /api/v1/applications
```

### Purpose

Creates a new MSME loan application and schedules it for asynchronous decision processing.

### Request

```json
{
    "ownerName": "John Doe",
    "businessName": "AbcXyz Traders",
    "pan": "ABCDE1234F",
    "businessType": "PROPRIETORSHIP",
    "yearsInBusiness": 5,
    "monthlyRevenue": 500000,
    "annualRevenue": 6000000,
    "existingDebt": 1000000,
    "requestedLoanAmount": 2000000,
    "loanPurpose": "WORKING_CAPITAL",
    "loanTenure": 36,
    "collateral": true
}
```

### Successful Response

```http
202 Accepted
```

Example:

```json
{
    "success": true,
    "data": {
        "applicationId": "b3c902cb-d68c-46bb-8e0d-51d1173b4b05",
        "status": "PROCESSING",
        "message": "Application submitted and queued for decision processing."
    },
    "error": null
}
```

The response does not contain the final decision because the decision engine processes the application asynchronously.

---

# 16. Get Application Decision

### Endpoint

```http
GET /api/v1/applications/:applicationId/decision
```

### Purpose

Returns the current processing status or completed lending decision.

## Processing Response

```json
{
  "success": true,
  "data": {
    "applicationId": "APP-12345",
    "status": "PROCESSING"
  }
}
```

## Completed Response

```json
{
    "success": true,
    "data": {
        "applicationId": "b3c902cb-d68c-46bb-8e0d-51d1173b4b05",
        "status": "COMPLETED",
        "decision": {
            "status": "APPROVED",
            "creditScore": 850,
            "signalResults": [
                {
                    "name": "REVENUE_TO_EMI",
                    "value": 0.13,
                    "passed": true,
                    "threshold": 0.35
                },
                {
                    "name": "LOAN_TO_MONTHLY_REVENUE",
                    "value": 4,
                    "passed": true,
                    "threshold": 5
                },
                {
                    "name": "TENURE_RISK",
                    "value": 36,
                    "passed": true,
                    "preferredRange": {
                        "maximumMonths": 48,
                        "minimumMonths": 24
                    }
                }
            ],
            "reasonCodes": [
                "REVENUE_SUPPORTS_ESTIMATED_REPAYMENT",
                "LOAN_AMOUNT_WITHIN_REVENUE_CAPACITY",
                "TENURE_WITHIN_PREFERRED_RANGE"
            ],
            "decidedAt": "2026-08-01T13:12:40.913Z"
        }
    },
    "error": null
}
```

---

# 17. API Error Format

Errors follow a consistent structure.

Example:

```json
{
    "success": false,
    "data": null,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Request validation failed.",
        "details": [
            {
                "field": "requestedLoanAmount",
                "message": "Too small: expected number to be >0"
            }
        ]
    }
}
```

This allows the frontend to distinguish between:

- Validation errors
- Not found errors
- Processing errors
- Internal server errors

---

# 18. HTTP Status Codes

| Status | Meaning |
| --- | --- |
| `200` | Successful request |
| `202` | Application accepted for asynchronous processing |
| `400` | Invalid/Bad request |
| `404` | Application not found |
| `409` | Conflicting application state |
| `422` | Business validation failure |
| `500` | Internal server error |

---

# 19. Decision Engine

The decision engine is the core business component.

Its responsibility is to convert application data into:

![alt text](assets/Decision-Engine.png)

The engine does not directly depend on the HTTP layer.

This separation allows the decision logic to be tested independently.

---

# 20. Internal Credit Score

The system generates an internal credit score between:

```text
300 – 900
```

The score is not presented as an official bureau score.

It is an internal risk indicator generated by the application's decision rules.

Conceptually:

![alt text](assets/Internal%20Credit%20Score.png)

---

# 21. Score Labels

The score is interpreted using the following ranges:

```javascript
function getScoreLabel(score) {
    if (score >= 750) {
        return "Excellent";
    }

    if (score >= 650) {
        return "Good";
    }

    if (score >= 550) {
        return "Fair";
    }

    return "Low";
}
```

Therefore:

| Score | Label |
| ---: | --- |
| `750–900` | Excellent |
| `650–749` | Good |
| `550–649` | Fair |
| `300–549` | Low |

The score label is descriptive and does not independently determine the final decision.

---

# 22. Decision Model

The final lending decision uses a **2-out-of-3 decision model**.

Three major decision dimensions are evaluated:

![alt text](assets/Decision%20Model.png)

If at least two of the three major criteria pass:

```text
APPROVED
```

Otherwise:

```text
REJECTED
```

This model prevents one isolated metric from completely determining the decision.

---

# 23. Decision Dimensions

## 23.1 Credit Strength

Evaluates the applicant's overall credit/risk characteristics.

Possible factors include:

- Credit-related information
- Existing obligations where available
- Negative credit indicators
- Owner/business financial profile

Result:

```text
PASS / FAIL
```

---

## 23.2 Affordability

Determines whether the requested loan appears reasonable relative to the business's financial capacity.

Important relationship:

```text
Loan Amount
──────────────
Annual Revenue
```

A very large loan relative to revenue represents higher risk.

The system can therefore generate reason codes such as:

```text
LOW_LOAN_TO_REVENUE_RATIO
HIGH_LOAN_TO_REVENUE_RATIO
```

---

## 23.3 Business Stability

Evaluates business maturity and operating strength.

Potential factors:

- Years in business
- Annual revenue
- Business profile
- Financial consistency

Example reason codes:

```text
SUFFICIENT_BUSINESS_TENURE
LOW_BUSINESS_TENURE
STRONG_REVENUE
LOW_REVENUE
```

---

# 24. Reason Codes

The system returns structured reason codes instead of only returning a textual explanation.

Example:

```json
{
    "success": true,
    "data": {
        "applicationId": "fc302bd4-50cc-4141-a5a8-3224c8df19e4",
        "status": "COMPLETED",
        "decision": {
            "status": "REJECTED",
            "creditScore": 500,
            "signalResults": [
                {
                    "name": "REVENUE_TO_EMI",
                    "value": 1.33,
                    "passed": false,
                    "threshold": 0.35
                },
                {
                    "name": "LOAN_TO_MONTHLY_REVENUE",
                    "value": 40,
                    "passed": false,
                    "threshold": 5
                },
                {
                    "name": "TENURE_RISK",
                    "value": 36,
                    "passed": true,
                    "preferredRange": {
                        "maximumMonths": 48,
                        "minimumMonths": 24
                    }
                }
            ],
            "reasonCodes": [
                "INSUFFICIENT_REPAYMENT_CAPACITY",
                "LOAN_AMOUNT_DISPROPORTIONATE_TO_REVENUE",
                "TENURE_WITHIN_PREFERRED_RANGE"
            ],
            "decidedAt": "2026-08-01T14:07:40.311Z"
        }
    },
    "error": null
}
```

Reason codes provide:

- Consistency
- Explainability
- Easier frontend rendering
- Easier testing
- Easier auditing
- Machine-readable decision explanations

---

# 25. Decision Example

Suppose an application has:

```text
Credit Strength       PASS
Affordability         PASS
Business Stability    FAIL
```

Two out of three criteria pass.

Therefore:

```text
FINAL DECISION = APPROVED
```

Another application:

```text
Credit Strength       FAIL
Affordability         FAIL
Business Stability    PASS
```

Only one criterion passes.

Therefore:

```text
FINAL DECISION = REJECTED
```

---

# 26. Validation Strategy

Validation happens at multiple levels.

Frontend validation improves user experience.

Backend validation is authoritative and cannot be bypassed.

![alt text](assets/Validations.png)

---

# 27. Input Validation

The backend validates:

- Required fields
- Data types
- Numeric values
- PAN format
- Revenue
- Loan amount
- Business tenure
- Loan tenure
- Invalid combinations
- Missing nested objects
- Unsupported values

---

# 28. PAN Validation

PAN is expected to follow the standard Indian PAN structure.

Conceptually:

```text
ABCDE1234F
```

Validation checks:

```text
5 alphabetic characters + 4 numeric characters + 1 alphabetic character
```

Invalid examples:

```text
ABC123
1234567890
ABCDE12345
```

The exact validation should be treated as format validation, not verification against the government PAN database.

---

# 29. Negative Values

Financial fields cannot contain negative values.

Invalid:

```json
{
  "annualRevenue": -500000
}
```

Invalid:

```json
{
  "loan": {
    "amount": -100000
  }
}
```

The backend rejects these requests before decision processing.

---

# 30. Zero Values

Zero must also be considered carefully.

For example:

```text
Annual Revenue = 0
Loan Amount = 500000
```

This should not result in a division-by-zero calculation.

Instead, the application should be rejected or marked as failing the relevant financial criteria depending on the business rule.

The decision engine must never silently produce:

```text
Infinity
NaN
```

---

# 31. Conflicting Financial Information

The system must detect logically inconsistent values.

Example:

```text
Annual Revenue = ₹100,000
Loan Amount = ₹5,000,000
```

The values may be syntactically valid but represent a potentially unrealistic financial relationship.

Therefore:

```text
Validation ≠ Decision
```

The data can be valid input while still failing a business decision criterion.

---

# 32. Missing or Partial Input

Missing required fields should result in a structured validation error.

Example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Required fields are missing"
  }
}
```

The backend must not attempt to calculate a decision from incomplete required data.

---

# 33. Duplicate Submission

Duplicate submissions should be handled deliberately.

The system should avoid creating multiple independent decision jobs for the same application when the same request is accidentally submitted repeatedly.

Where an application identifier or idempotency mechanism is used, repeated requests can be mapped to the existing application.

---

# 34. Asynchronous Processing

The decision process uses a job-based model.

When an application is submitted:

![alt text](assets/Async-Operation1.png)

The worker then processes the job.

![alt text](assets/Async-Operation2.png)

---

# 35. Concurrent Workers

The PostgreSQL job queue is designed to support safe concurrent processing.

A worker claims jobs using row-level locking with a pattern equivalent to:

```sql
FOR UPDATE SKIP LOCKED
```

This allows multiple workers to process independent jobs without two workers accidentally processing the same job simultaneously.

Conceptually:

![alt text](assets/Workers.png)

---

# 36. Job States

A decision job can move through states such as:

![alt text](assets/Job-Status.png)

The timestamps associated with the job provide operational visibility.

---

# 37. Audit Logging

Auditability is an important requirement for a lending system.

The system records timestamped events for:

- Application submission
- Decision processing
- Decision completion
- Processing failures

Example:

```json
{
  "applicationId": "APP-12345",
  "eventType": "APPLICATION_SUBMITTED",
  "timestamp": "2026-07-31T10:00:00.000Z"
}
```

Later:

```json
{
  "_id": {
    "$oid": "6a6c98c681ab93ca0094f5b8"
  },
  "applicationId": "fc302bd4-50cc-4141-a5a8-3224c8df19e4",
  "eventType": "APPLICATION_SUBMITTED",
  "requestId": "60b16725-6e23-4f19-9c0d-640048616442",
  "data": {
    "status": "PROCESSING"
  },
  "createdAt": {
    "$date": "2026-07-31T12:44:54.557Z"
  }
}
```

This creates an event history instead of relying only on the current application state.

---

# 38. Two Databases

PostgreSQL and MongoDB have different responsibilities.

## PostgreSQL

Best suited for transactional application state:

```text
Applications
Decisions
Jobs
Relationships
Transactions
```

## MongoDB

Used for append-oriented audit events:

```text
Audit history
Event metadata
Processing events
Decision events
```

This separation keeps the core transactional model relational while allowing audit events to remain flexible and append-oriented.

---

# 39. Data Consistency

The system treats PostgreSQL as the source of truth for:

```text
Application
Decision
Job
```

MongoDB is used for:

```text
Audit trail
```

A failure while writing an audit event should not corrupt the core application or decision transaction.

Operational logging should therefore be designed so that audit failures are visible and recoverable rather than silently ignored.

---

# 40. Edge Case Strategy

The system explicitly considers the following edge cases.

### Missing data

```text
Reject request with VALIDATION_ERROR
```

### Negative revenue

```text
Reject request
```

### Negative loan amount

```text
Reject request
```

### Zero revenue

```text
Prevent division by zero
```

### Invalid PAN

```text
Reject request
```

### Extremely high loan amount

```text
Business rule failure / affordability failure
```

### Very low business tenure

```text
Business stability may fail
```

### Application not found

```text
404 NOT_FOUND
```

### Decision still processing

```text
Return PROCESSING status
```

### Worker failure

```text
Mark job as failed
Record audit event
```

### Duplicate processing

```text
Use database locking/job state to prevent concurrent processing
```

### Invalid score

The decision engine must guarantee:

```text
300 <= score <= 900
```

### NaN / Infinity

Financial calculations must be validated before persistence.

---

# 41. Security Considerations

The application should:

- Validate all backend input
- Never trust frontend validation
- Keep database credentials in environment variables
- Avoid returning sensitive database information
- Use parameterized SQL queries
- Avoid exposing internal stack traces
- Validate request payloads
- Use HTTPS in production
- Restrict database access
- Apply appropriate authentication/authorization when required

PAN and other personal information should not be unnecessarily exposed in API responses or logs.

---

# 42. API Design Principles

The API follows REST-oriented principles.

Resources are represented as:

```text
/applications
/applications/:applicationId/decision
```

Responses are structured consistently:

```json
{
  "success": true,
  "data": {}
}
```

or:

```json
{
  "success": false,
  "error": {}
}
```

This keeps frontend integration predictable.

---

# 43. Frontend Responsibilities

The frontend is intentionally kept lightweight.

It is responsible for:

1. Collecting application information
2. Providing basic input validation
3. Sending application data to the backend
4. Showing processing status
5. Fetching the final decision
6. Displaying:
   - Approved / Rejected
   - Credit score
   - Score label
   - Reason codes

The frontend does **not** own the lending decision logic.

The backend is authoritative.

---

# 44. Backend Responsibilities

The backend is responsible for:

- Request validation
- Business validation
- Application persistence
- Job creation
- Asynchronous processing
- Credit score calculation
- Decision evaluation
- Reason code generation
- Decision persistence
- Audit logging
- Error handling

---

# 45. Decision Engine Separation

The decision engine should be independent from Express.

Recommended architecture:

![alt text](assets/Decision-Enginge-Sep.png)

This allows unit tests to directly test the business rules without starting the HTTP server.

---

# 46. Example Decision Object

Internally, a decision can be represented as:

```json
{
    "success": true,
    "data": {
        "applicationId": "fc302bd4-50cc-4141-a5a8-3224c8df19e4",
        "status": "COMPLETED",
        "decision": {
            "status": "REJECTED",
            "creditScore": 500,
            "signalResults": [
                {
                    "name": "REVENUE_TO_EMI",
                    "value": 1.33,
                    "passed": false,
                    "threshold": 0.35
                },
                {
                    "name": "LOAN_TO_MONTHLY_REVENUE",
                    "value": 40,
                    "passed": false,
                    "threshold": 5
                },
                {
                    "name": "TENURE_RISK",
                    "value": 36,
                    "passed": true,
                    "preferredRange": {
                        "maximumMonths": 48,
                        "minimumMonths": 24
                    }
                }
            ],
            "reasonCodes": [
                "INSUFFICIENT_REPAYMENT_CAPACITY",
                "LOAN_AMOUNT_DISPROPORTIONATE_TO_REVENUE",
                "TENURE_WITHIN_PREFERRED_RANGE"
            ],
            "decidedAt": "2026-08-01T14:07:40.311Z"
        }
    },
    "error": null
}
```

---

# 47. Assumptions

The system intentionally makes several assumptions because this is a lightweight lending decision prototype rather than a production banking system or platform.

### 1. Internal score

The `300–900` score is an internal project-defined score.

It is not intended to replicate CIBIL, Experian, Equifax, or another bureau's proprietary scoring methodology.

### 2. No external credit bureau

The system does not directly verify credit information with an external credit bureau.

Therefore, credit-related inputs are treated as supplied application data.

### 3. No government verification

PAN format is validated structurally.

The system does not perform government database verification.

### 4. Rule-based decisioning

The decision engine is deterministic and rule-based.

The system does not yet implemeted an ML model to make the final lending decision.

### 5. Lightweight architecture

The project intentionally built at lightweight to avoid unnecessary infrastructure such as Kafka or a large distributed microservice environment, but scalable and modular to integrate.

The asynchronous worker and PostgreSQL job table are sufficient for the intended scale.

### 6. Binary final decision

The final lending decision is:

```text
APPROVED
```

or:

```text
REJECTED
```

There is no manual-review decision state in the current model.

### 7. Explainability

Every completed decision should provide structured reason codes so that the result is understandable.

### 8. Backend authority

Frontend validation is considered a user-experience feature.

Backend validation is authoritative.

---

# 48. Testing Strategy

Testing should cover three levels.

## Unit Tests

Test individual decision functions.

Examples:

```text
score calculation
PAN validation
loan-to-revenue calculation
credit criterion
affordability criterion
stability criterion
2-out-of-3 decision
score labels
```

## Integration Tests

Test:

```text
   API ──> PostgreSQL ──> Decision Job ──> Worker ──> Decision
```

## API Tests

Test:

```text
POST /applications
GET /applications/:id/decision
```

including successful and invalid requests.

---

# 49. Important Test Cases

### Valid application

Expected:

```text
202 Accepted
```

followed by:

```text
APPROVED / REJECTED
```

### Missing required field

Expected:

```text
400 VALIDATION_ERROR
```

### Invalid PAN

Expected:

```text
400 VALIDATION_ERROR
```

### Negative loan amount

Expected:

```text
400 VALIDATION_ERROR
```

### Zero revenue

Expected:

```text
No division-by-zero
```

### Non-existent application

Expected:

```text
404 NOT_FOUND
```

### Processing application

Expected:

```text
200
status = PROCESSING
```

### Two criteria passing

Expected:

```text
APPROVED
```

### One criterion passing

Expected:

```text
REJECTED
```

### Score boundaries

Test:

```text
300
549
550
649
650
749
750
900
```

---

# 50. Production-Oriented Architecture

The current architecture can evolve without fundamentally changing the business logic.

![alt text](assets/Production-Architecture.png)

The lightweight implementation can therefore serve as a foundation for future scaling.

---

# 51. Complete Request-to-Decision Flow

![alt text](assets/Complete-flow.png)
---

# 52. Design Principles

The system follows these core principles:

### Separation of concerns

API, persistence, worker, and decision logic remain separate.

### Backend authority

Business rules cannot be bypassed by modifying frontend code.

### Deterministic decisions

The same valid input produces the same decision.

### Explainability

Decisions return structured reason codes.

### Auditability

Important lifecycle events are timestamped.

### Asynchronous processing

Decision computation is separated from the initial HTTP request.

### Defensive validation

Invalid financial values and malformed input are rejected before they reach the decision engine.

### Simple architecture

Infrastructure is kept proportional to the problem rather than introducing unnecessary distributed components.

---

# 53. Summary

The Lending Decision System provides an end-to-end workflow for MSME loan evaluation.

The architecture consists of:

```text
React + Vite
      │
      ▼
Node.js + Express
      │
      ├──────────────► PostgreSQL
      │                 │
      │                 ├── Applications
      │                 ├── Decisions
      │                 └── Decision Jobs
      │
      └──────────────► MongoDB
                        │
                        └── Audit Events

PostgreSQL Jobs
      │
      ▼
Decision Worker
      │
      ▼
Decision Engine
      │
      ├── Score
      ├── Credit Strength
      ├── Affordability
      ├── Business Stability
      └── Reason Codes
      │
      ▼
2-out-of-3 Decision
      │
      ├── APPROVED
      └── REJECTED
``` 

The key design decision is to keep the **decision engine deterministic, explainable, independently testable, and separated from the API layer**, while using PostgreSQL for transactional state and MongoDB for timestamped audit events.

This provides a practical architecture for a lightweight lending decision system while leaving a clear path toward production-scale infrastructure.
