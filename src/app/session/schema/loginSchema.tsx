import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid Email."),
  password: z.string().min(8, "Password must be 8 characters long."),
});