import { z } from "zod";

export const categorySchema = z.object({
  title: z.string().min(2, "Título deve conter no mínimo 2 caracteres").max(30),
})

