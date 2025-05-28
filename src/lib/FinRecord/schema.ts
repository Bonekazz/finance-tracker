import { z } from "zod";
import { categorySchema } from "../FinCategory/schema";


export const recordSchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Título deve conter no mínimo 2 caracteres").max(30),
  amount: z.number().min(0),
  type: z.enum(["expense", "income"]),
  date: z.coerce.date(),
  categories: z.array(categorySchema),
})
export const recordFormSchema = recordSchema.omit({id: true}).extend({
  categories: z.array(z.string()).min(1, "Registro deve conter no mínimo 1 categoria"),
})


