import { z } from "zod";

export const signupScheme = z.object({
  name: z
    .string()
    .max(50, "Name is too long.")
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),
  email: z.string().email("Invalid Email."),
  password: z.string().min(8, "Password must be 8 characters long."),
});
