import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import database from "@/database";
import members from "@/database/schema/members";

export async function getMembers(req: Request, res: Response) {
  const results = await database.select().from(members);
  res.json(results);
}

export async function getMember(req: Request<{ id: string }>, res: Response) {
  const id = req.params.id;
  const [member] = await database
    .select()
    .from(members)
    .where(eq(members.id, Number(id)));

  res.json(member);
}
