import { Router } from "express";
import { createApplication } from "../contollers/application.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { applicationSchema } from "../validators/application.validator.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.post("/", validate(applicationSchema), asyncHandler(createApplication));

export default router;