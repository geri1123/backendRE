import { z } from "zod";

export const updateNameSchema = z.object({
  firstName: z.string().min(1, { message: "First name must not be empty" }),
  lastName: z.string().min(1, { message: "Last name must not be empty" }),
});

export type UpdateFnameLname = z.infer<typeof updateNameSchema>;