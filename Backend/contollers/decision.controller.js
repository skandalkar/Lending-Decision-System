import { getDecision } from "../services/decision.service.js";
import { findApplicationById } from "../repositories/application.repository.js";
import { ApiError } from "../utils/api-error.js";
import { successResponse } from "../utils/api-response.js";

export async function getApplicationDecision(req, res) {
    const { applicationId } = req.params;

    const application =
        await findApplicationById(applicationId);

    if (!application) {
        throw new ApiError(
            404,
            "APPLICATION_NOT_FOUND",
            "Loan application was not found."
        );
    }

    const decision = await getDecision(applicationId);

    if (!decision) {
        return successResponse(res, {
            applicationId,
            status: application.status,
            decision: null
        });
    }

    return successResponse(res, {
        applicationId,
        status: application.status,
        decision: {
            status: decision.decision,
            creditScore: decision.credit_score,
            signalResults: decision.signal_results,
            reasonCodes: decision.reason_codes,
            decidedAt: decision.decided_at
        }
    });
}