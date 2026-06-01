import express from "express";

import LoginController from "./controllers/login.ts";

const router = express.Router();

router.get("/", LoginController.store);

export default router;