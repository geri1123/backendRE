// validators/users/updatePhoneSchema.ts
import { z } from "zod";

export const updatePhoneSchema = z.object({
  phone: z
    .string()
    .min(6, { message: "Phone number must be at least 6 digits." })
    .max(15, { message: "Phone number must be at most 15 digits." })
    .regex(/^\+?[0-9\s\-()]*$/, {
      message: "Phone number contains invalid characters.",
    }),
});

export type PhoneSchema = z.infer<typeof updatePhoneSchema>;
