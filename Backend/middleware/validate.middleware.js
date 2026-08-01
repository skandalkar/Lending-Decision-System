import { ApiError } from "../utils/api-error.js";

export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const details = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }));

            return next(
                new ApiError(
                    400,
                    "VALIDATION_ERROR",
                    "Request validation failed.",
                    details
                )
            );
        }

        req.validatedBody = result.data;
        next();
    };
}