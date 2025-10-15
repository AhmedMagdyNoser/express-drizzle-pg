import { NextFunction, Request, Response } from "express";
import { and, eq, isNull } from "drizzle-orm";
import database from "@/database";
import books from "@/database/schema/books";
import members from "@/database/schema/members";
import loans from "@/database/schema/loans";
import ApiError from "@/utils/classes/ApiError";
import { extractErrorMessage } from "@/utils/helpers";

export async function createLoan(req: Request, res: Response, next: NextFunction) {
  try {
    let bookId = req.body.bookId;
    let memberId = req.body.memberId;

    // Validate required inputs
    if (!bookId) return next(new ApiError(400, "bookId is required."));
    if (!memberId) return next(new ApiError(400, "memberId is required."));

    bookId = Number(bookId);
    memberId = Number(memberId);

    // Validate input types
    if (isNaN(bookId)) return next(new ApiError(400, "bookId must be a number."));
    if (isNaN(memberId)) return next(new ApiError(400, "memberId must be a number."));

    // Validate book and member existence
    const [book] = await database.select().from(books).where(eq(books.id, bookId));
    if (!book) return next(new ApiError(404, `Book with id ${bookId} not found.`));
    const [member] = await database.select().from(members).where(eq(members.id, memberId));
    if (!member) return next(new ApiError(404, `Member with id ${memberId} not found.`));

    // Check if member already has an active loan for this book
    const [existingLoan] = await database
      .select()
      .from(loans)
      .where(and(eq(loans.bookId, bookId), eq(loans.memberId, memberId), isNull(loans.returnDate)));
    if (existingLoan) return next(new ApiError(400, `Member already has an active loan for this book.`));

    const [result] = await database.insert(loans).values({ bookId, memberId }).returning();

    res.status(201).json(result);
  } catch (error: unknown) {
    return next(new ApiError(500, extractErrorMessage(error)));
  }
}

export async function getLoans(req: Request, res: Response, next: NextFunction) {
  try {
    const results = await database.select().from(loans);
    res.json({ length: results.length, data: results });
  } catch (error: unknown) {
    return next(new ApiError(500, extractErrorMessage(error)));
  }
}

export async function getLoan(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const [loan] = await database.select().from(loans).where(eq(loans.id, id));
    if (!loan) next(new ApiError(404, `Loan with id ${id} not found.`));
    res.json(loan);
  } catch (error: unknown) {
    return next(new ApiError(500, extractErrorMessage(error)));
  }
}

export async function returnBook(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const [loan] = await database.select().from(loans).where(eq(loans.id, id));
    if (!loan) return next(new ApiError(404, `Loan with id ${id} not found.`));
    if (loan.returnDate) return next(new ApiError(400, `Book for loan id ${id} has already been returned.`));
    const [updatedLoan] = await database.update(loans).set({ returnDate: new Date() }).where(eq(loans.id, id)).returning();
    res.json(updatedLoan);
  } catch (error: unknown) {
    return next(new ApiError(500, extractErrorMessage(error)));
  }
}
