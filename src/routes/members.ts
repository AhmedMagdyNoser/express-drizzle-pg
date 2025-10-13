import { Router } from "express";
import { createMember, getMembers, getMember, updateMember, deleteMember } from "@/controllers/members";

const router = Router();

router.post("/", createMember);
router.get("/", getMembers);
router.get("/:id", getMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

export default router;
