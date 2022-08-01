import { Router } from "express";
import e2eController from "../controllers/e2eController.js";

const e2eRouter = Router();

e2eRouter.delete("/reset", e2eController.resetDatabase);

export default e2eRouter;