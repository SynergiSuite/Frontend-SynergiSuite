import { z } from "zod";

export const signupScheme = z.object({
  name: z
    .string()
    .max(20, "Name is too long.")
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),
  email: z.email("Invalid Email."),
  password_hash: z.string().min(8, "Password must be 8 characters long."),
});
