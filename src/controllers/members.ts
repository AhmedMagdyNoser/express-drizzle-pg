import { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import database from "@/database";
import members from "@/database/schema/members";
import ApiError from "@/utils/classes/ApiError";
import { isValidEmail } from "@/utils/helpers";

// In PostgreSQL, error code 23505 indicates a unique violation
const UNIQUE_VIOLATION_ERROR_CODE = "23505";

export async function createMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email } = req.body;
    if (!name) return next(new ApiError(400, "Name is required."));
    if (!email) return next(new ApiError(400, "Email is required."));
    if (!isValidEmail(email)) return next(new ApiError(400, "Invalid email format."));
    const [result] = await database.insert(members).values({ name, email }).returning();
    res.status(201).json(result);
  } catch (error: any) {
    const errorCode = error.cause?.code ?? error.code;
    if (errorCode === UNIQUE_VIOLATION_ERROR_CODE)
      return next(new ApiError(409, "Email already exists. Please use a different email."));
    else return next(error);
  }
}

export async function getMembers(req: Request, res: Response, next: NextFunction) {
  try {
    const results = await database.select().from(members);
    res.json({ length: results.length, data: results });
  } catch (error: any) {
    return next(error);
  }
}

export async function getMember(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const [member] = await database.select().from(members).where(eq(members.id, id));
    if (member) res.json(member);
    else next(new ApiError(404, `Member with id ${id} not found.`));
  } catch (error: any) {
    return next(error);
  }
}

export async function updateMember(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;
    if (!name) return next(new ApiError(400, "Name is required."));
    if (!email) return next(new ApiError(400, "Email is required."));
    if (!isValidEmail(email)) return next(new ApiError(400, "Invalid email format."));
    const [updatedMember] = await database.update(members).set({ name, email }).where(eq(members.id, id)).returning();
    if (!updatedMember) return next(new ApiError(404, `Member with id ${id} not found.`));
    res.json(updatedMember);
  } catch (error: any) {
    const errorCode = error.cause?.code ?? error.code;
    if (errorCode === UNIQUE_VIOLATION_ERROR_CODE)
      return next(new ApiError(409, "Email already exists. Please use a different email."));
    else return next(error);
  }
}

export async function deleteMember(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const [deletedMember] = await database.delete(members).where(eq(members.id, id)).returning();
    if (!deletedMember) return next(new ApiError(404, `Member with id ${id} not found.`));
    res.status(204).send();
  } catch (error: any) {
    return next(error);
  }
}
