import { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import database from "@/database";
import books from "@/database/schema/books";
import ApiError from "@/utils/classes/ApiError";
import { extractErrorMessage } from "@/utils/helpers";

export async function createBook(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, author } = req.body;
    if (!title) return next(new ApiError(400, "Title is required."));
    if (!author) return next(new ApiError(400, "Author is required."));
    const [result] = await database.insert(books).values({ title, author }).returning();
    res.status(201).json(result);
  } catch (error: unknown) {
    return next(new ApiError(500, extractErrorMessage(error)));
  }
}

export async function getBooks(req: Request, res: Response, next: NextFunction) {
  try {
    const results = await database.select().from(books);
    res.json({ length: results.length, data: results });
  } catch (error: unknown) {
    return next(new ApiError(500, extractErrorMessage(error)));
  }
}

export async function getBook(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const [book] = await database.select().from(books).where(eq(books.id, id));
    if (book) res.json(book);
    else next(new ApiError(404, `Book with id ${id} not found.`));
  } catch (error: unknown) {
    return next(new ApiError(500, extractErrorMessage(error)));
  }
}

export async function updateBook(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { title, author } = req.body;
    if (!title) return next(new ApiError(400, "Title is required."));
    if (!author) return next(new ApiError(400, "Author is required."));
    const [updatedBook] = await database.update(books).set({ title, author }).where(eq(books.id, id)).returning();
    if (!updatedBook) return next(new ApiError(404, `Book with id ${id} not found.`));
    res.json(updatedBook);
  } catch (error: unknown) {
    return next(new ApiError(500, extractErrorMessage(error)));
  }
}

export async function deleteBook(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const [deletedBook] = await database.delete(books).where(eq(books.id, id)).returning();
    if (!deletedBook) return next(new ApiError(404, `Book with id ${id} not found.`));
    res.status(204).send();
  } catch (error: unknown) {
    return next(new ApiError(500, extractErrorMessage(error)));
  }
}
