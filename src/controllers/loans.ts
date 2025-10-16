import { NextFunction, Request, Response } from "express";
import { and, eq, gt, lt, isNull, isNotNull, SQL } from "drizzle-orm";
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
  const { bookId, memberId, loanDateFrom, loanDateTo, returnDateFrom, returnDateTo, returned } = req.query;

  const conditions: SQL[] = [];

  // Filtering by book or member
  if (bookId) conditions.push(eq(loans.bookId, Number(bookId)));
  if (memberId) conditions.push(eq(loans.memberId, Number(memberId)));

  // Loan date range filters
  if (loanDateFrom) conditions.push(gt(loans.loanDate, new Date(loanDateFrom as string)));
  if (loanDateTo) conditions.push(lt(loans.loanDate, new Date(loanDateTo as string)));

  // Return date range filters
  if (returnDateFrom) conditions.push(gt(loans.returnDate, new Date(returnDateFrom as string)));
  if (returnDateTo) conditions.push(lt(loans.returnDate, new Date(returnDateTo as string)));

  // Returned status filter
  if (returned === "false") conditions.push(isNull(loans.returnDate));
  else if (returned === "true") conditions.push(isNotNull(loans.returnDate));

  try {
    const results =
      conditions.length > 0
        ? await database
            .select()
            .from(loans)
            .where(and(...conditions))
        : await database.select().from(loans);

    res.json({ length: results.length, data: results });
  } catch (error: unknown) {
    return next(new ApiError(500, extractErrorMessage(error)));
  }
}

export async function getLoan(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const populate = req.query.populate === "true";

    const baseQuery = database.select().from(loans).where(eq(loans.id, id));

    const query = populate
      ? database
          .select({
            id: loans.id,
            book: books,
            member: members,
            // Or, if you want to limit fields
            // book: { id: books.id, title: books.title },
            // member: { id: members.id, name: members.name },
            loanDate: loans.loanDate,
            returnDate: loans.returnDate,
          })
          .from(loans)
          .leftJoin(books, eq(loans.bookId, books.id))
          .leftJoin(members, eq(loans.memberId, members.id))
          .where(eq(loans.id, id))
      : baseQuery;

    const [loan] = await query;
    if (!loan) return next(new ApiError(404, `Loan with id ${id} not found.`));
    res.json(loan);
  } catch (error) {
    next(new ApiError(500, extractErrorMessage(error)));
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
