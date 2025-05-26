import { z } from "zod";

export const recordSchema = z.object({
  title: z.string().min(2, "Título deve conter no mínimo 2 caracteres").max(30),
  amount: z.number().min(0),
  type: z.enum(["expense", "income"]),
  date: z.coerce.date(),
  categories: z.array(z.string()).min(1, "Registro deve conter no mínimo 1 categoria"),
});
