import * as auth from "../controllers/token";
import { Router } from "express";
import authorize from "../middlewares/authorize";

const router = Router()

router.get('/', authorize, auth.getTokens)
router.post("/", auth.createAccessToken)
router.delete("/:uid", authorize, auth.deleteToken)
router.get("/:tokenId", auth.getToken)

export default router