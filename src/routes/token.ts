import * as auth from "../controllers/token";
import { Router } from "express";
import authorize from "../middlewares/authorize";
import authenticate  from "../middlewares/authenticate";

const router = Router()

router.get('/', authenticate, auth.getTokens)
router.post("/", authenticate, auth.createAccessToken)
router.delete("/:uid", authenticate, auth.deleteToken)
router.get("/:tokenId", authenticate, auth.getToken)

export default router