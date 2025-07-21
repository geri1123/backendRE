import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ValidationError } from "../../errors/BaseError";

interface UpdateFnameLname {
  firstName: string;
  lastName: string;
}

export async function updateFnameLname(
  req: Request<any, any, UpdateFnameLname>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.userId; // ensure userId is being set via middleware

  if (!userId) throw new UnauthorizedError("User not authenticated");

  const { firstName, lastName } = req.body;

 if (!firstName || firstName.trim() === "") {
  throw new ValidationError({ firstName: "First name must not be empty" });
}

if (!lastName || lastName.trim() === "") {
  throw new ValidationError({ lastName: "Last name must not be empty" });
}

  try {
    // await someService.updateNames(userId, firstName, lastName);
    res.status(200).json({ message: "Name updated successfully" });
  } catch (err) {
    next(err);
  }
}