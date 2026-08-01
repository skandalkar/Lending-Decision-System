import { submitApplication } from "../services/application.service.js";
import { successResponse } from "../utils/api-response.js";

export async function createApplication(req, res) {
    const application =
        await submitApplication(
            req.validatedBody,
            req.requestId
        );

    return successResponse(
        res, {
        applicationId: application.id,
        status: application.status,
        message: "Application submitted and queued for decision processing."
    }, 202);
}