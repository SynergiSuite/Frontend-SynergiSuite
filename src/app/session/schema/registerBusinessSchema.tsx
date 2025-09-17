import { z } from "zod";

export const registerBusinessScheme = z.object({
  name: z.string().min(1, "Name is required."),
  number_of_employees: z.number().min(1, "Number of employees is required."),
  category_id: z.number().min(1, "Business category is required."),
});
