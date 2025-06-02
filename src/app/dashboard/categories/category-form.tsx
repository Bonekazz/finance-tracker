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
import { categoryFormSchema } from "@/lib/FinCategory/schema";
import { useState } from "react";


interface Props {
  category?: FinCategory;
  onSuccess?: (newCategory: FinCategory) => void,
  onEditSuccess?: (updatedCategory: FinCategory) => void,
}

export function CategoryForm({ category, onSuccess, onEditSuccess }: Props) {
  
  const [ isLoading, setIsloading ] = useState(false);

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      title: category?.title || "",
    }
  });

  async function handlePOST(data: z.infer<typeof categoryFormSchema>) {

    try {
      if (!onSuccess) return console.error("(!) Error: Missing 'onSuccess' on create operation.");

      // API call here
      const req = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }); 
      if (!req.ok) throw new Error();

      const res = await req.json();
      console.log(res);

      onSuccess({id: data.title, title: data.title}); // use the returned data from api request

    } catch (error) {

    } finally { setIsloading(false) }

  }

  async function handlePUT(data: z.infer<typeof categoryFormSchema>, category: FinCategory) {
    
    try {
      if (!onEditSuccess) return console.error("(!) Error: Missing 'onEditSuccess' on edit operation.");

      const req = await fetch("/api/categories", {
        method: "PUT",
        body: JSON.stringify({ id: category.id, ...data }),
      }); 
      if (!req.ok) throw new Error();

      const res = await req.json();
      console.log(res);

      onEditSuccess({id: category.id, ...data}); // use the returned data from api request

    } catch (error) {} finally { setIsloading(false) }

  }

  async function onSubmit(data: z.infer<typeof categoryFormSchema>) {

    setIsloading(true);

    if (category) {
      await handlePUT(data, category);
      return;
    }

    await handlePOST(data); 
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          disabled={isLoading}
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
        <Button type="submit" className="cursor-pointer w-full">
        { isLoading ? <LoadingSpinner/> : "Salvar" }
        </Button>
      </form>
    </Form>  
  )
}
