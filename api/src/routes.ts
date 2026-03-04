import { Router } from "express";
import login from "./modules/login/index.ts"

const router = Router();

router.use('/', login);

export default router;