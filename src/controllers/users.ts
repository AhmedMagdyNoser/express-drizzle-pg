import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import database from "@/database";
import users from "@/database/schema/users";

export async function getUsers(req: Request, res: Response) {
  const results = await database.select().from(users);
  res.json(results);
}

export async function getUser(req: Request<{ id: string }>, res: Response) {
  const id = req.params.id;
  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.id, Number(id)));

  res.json(user);
}
