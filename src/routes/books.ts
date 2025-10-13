import { Router } from "express";
import { createBook, getBooks, getBook, updateBook, deleteBook } from "@/controllers/books";

const router = Router();

router.post("/", createBook);
router.get("/", getBooks);
router.get("/:id", getBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
