import { NextFunction , Request  , Response } from "express";
import { UnauthorizedError } from "../../../errors/BaseError";
export async function updateWebsite(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('✅ updateWebsite controller hit');

  const userId = req.userId;
  const { website } = req.body;

  if (!userId) throw new UnauthorizedError("User not authenticated");

  console.log(`Website to update: ${website}`);
  res.status(200).json({ message: 'Website updated (dummy response)' });
}