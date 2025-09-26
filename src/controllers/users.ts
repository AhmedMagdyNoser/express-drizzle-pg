import { Request, Response } from "express";

export function getUsers(req: Request, res: Response) {
  res.json({ message: "All Users Retrieved." });
}

export function getUser(req: Request<{ id: string }>, res: Response) {
  const id = req.params.id;
  res.json({ message: `User ${id} Retrieved` });
}
