import { Router } from "express";
import { getApplicationDecision } from "../contollers/decision.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/applications/:applicationId/decision", asyncHandler(getApplicationDecision));

export default router;