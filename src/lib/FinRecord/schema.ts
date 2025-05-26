import { z } from "zod";
import { categorySchema } from "../FinCategory/schema";

export const recordSchema = z.object({
  title: z.string().min(2, "Título deve conter no mínimo 2 caracteres").max(30),
  amount: z.number().min(0),
  type: z.enum(["expense", "income"]),
  date: z.date(),
  categories: z.array(categorySchema).min(1),
});
