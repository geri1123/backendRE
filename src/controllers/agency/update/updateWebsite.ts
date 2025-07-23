import { NextFunction , Request  , Response } from "express";
import { UnauthorizedError } from "../../../errors/BaseError";
export async function updateAgencyInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
  

  const userId = req.userId;
  

  if (!userId) throw new UnauthorizedError("User not authenticated");

 
  res.status(200).json({ message: '' });
}