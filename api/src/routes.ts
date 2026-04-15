import { Router } from "express";
import criarUserRouter from "./modules/criarUser/criarUser.ts";
import authRouter from "./modules/login/auth.ts";

const router = Router();

router.use("/", criarUserRouter);
router.use("/", authRouter);

export default router;