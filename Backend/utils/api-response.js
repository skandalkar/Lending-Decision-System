export function successResponse(res, data, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        data,
        error: null
    });
}

export function errorResponse(res, error) {
    return res.status(error.statusCode || 500).json({
        success: false,
        data: null,
        error: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            message: error.message || "An unexpected error occurred.",
            details: error.details || null
        }
    });
}