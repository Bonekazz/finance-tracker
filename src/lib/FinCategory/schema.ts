import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Título deve conter no mínimo 2 caracteres").max(30),
})

export const categoryFormSchema = categorySchema.omit({id: true});
