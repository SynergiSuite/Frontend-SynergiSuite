import { z } from "zod";

export const verificationSchema = z.object({
  otp: z
    .string()
    .min(6, "Code must be 6 digits long.")
    .max(6, "Code must be 6 digits long."),
});
