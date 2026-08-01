import crypto from "node:crypto";

export function requestIdMiddleware(req, res, next) {
    
    const requestId = req.header("X-Request-ID") || crypto.randomUUID();
    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);

    next();
}