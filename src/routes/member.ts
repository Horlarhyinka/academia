import { Router } from "express";
import * as members from "../controllers/member";
import authorize from "../middlewares/authorize";

const router = Router()

router.post("/", authorize, members.createMember)
router.get("/", authorize ,members.getMembers)
router.get("/:memberId",authorize , members.getMember)
router.put("/:memberId",authorize , members.updateMember)
router.patch("/:memberId",authorize , members.updateMemberRole)
router.delete("/:memberId",authorize ,members.deleteMember)

export default router;