// routes/redirectRoutes.js
import express from "express";
import { redirectUrl } from "../controllers/urlControllers.js";

const redirectRouter = express.Router();
redirectRouter.get("/:shortCode", redirectUrl);

export default redirectRouter;