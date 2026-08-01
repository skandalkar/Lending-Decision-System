import { errorResponse } from "../utils/api-response.js";

export function errorMiddleware(error, req, res, next) {
    console.error({
        requestId: req.requestId,
        error: error.message,
        stack: error.stack
    });

    if (res.headersSent) {
        return next(error);
    }

    return errorResponse(res, error);
}