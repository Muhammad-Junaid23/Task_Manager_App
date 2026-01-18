import * as z from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userUpdateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  email: z.email("Invalid email format").optional(),
});
