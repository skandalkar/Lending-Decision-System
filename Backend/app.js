import cors from "cors";
import express from "express";
import decisionRoutes from "./routes/decision.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { requestIdMiddleware } from "./middleware/request-id.middleware.js";

const app = express();
app.use(
    cors({
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "X-Request-ID"]
    })
);
app.use(express.json());

app.use(express.json({ limit: "1mb" }));
app.use(requestIdMiddleware);

app.get("/health", (req, res) => {
    res.json({
        success: true,
        data: {
            status: "UP"
        },
        error: null
    });
});

app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1", decisionRoutes);

app.use(errorMiddleware);

export default app; 