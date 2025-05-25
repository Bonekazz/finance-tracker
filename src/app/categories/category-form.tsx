"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/loading-spinner";
import { FinCategory } from "@/lib/FinCategory/type";
import { categorySchema } from "@/lib/FinCategory/schema";


interface Props {
  onSuccess: (newCategory: FinCategory) => void,
}
export function CategoryForm({ onSuccess }: Props) {

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
    }
  });

  async function onSubmit(data: z.infer<typeof categorySchema>) {

    // API call here
    
    onSuccess({id: data.title, title: data.title});
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="título da categoria" {...field} />
              </FormControl>
              <FormDescription>
                Este será o título atrbuído à categoria
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="cursor-pointer">Salvar</Button>
      </form>
    </Form>  
  )
}
