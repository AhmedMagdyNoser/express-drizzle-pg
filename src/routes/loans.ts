import { Router } from "express";
import { createLoan, getLoans, getLoan, returnBook } from "@/controllers/loans";

const router = Router();

router.post("/", createLoan);
router.get("/", getLoans);
router.get("/:id", getLoan);
router.patch("/:id/return", returnBook);

export default router;
