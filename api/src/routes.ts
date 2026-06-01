import { Router } from "express";

import criarUserRouter from "./modules/criarUser/criarUser.ts";
import authRouter from "./modules/login/auth.ts";
import tabsRouter from "./modules/fetchTabs/tabs.ts";
import timerRouter from "./modules/fetchTimer/timer.ts";

const router = Router();

router.use("/", criarUserRouter);
router.use("/", authRouter);
router.use("/", tabsRouter);
router.use("/", timerRouter);

export default router;