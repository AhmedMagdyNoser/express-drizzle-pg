import { Router } from "express";
import { getMembers, getMember } from "@/controllers/members";

const router = Router();

router.get("/", getMembers);
router.get("/:id", getMember);

export default router;
