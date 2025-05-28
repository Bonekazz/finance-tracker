"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { format } from "date-fns";

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
import { FinRecord } from "@/lib/FinRecord/type";
import { recordFormSchema } from "@/lib/FinRecord/schema";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { categoriesData } from "@/data/categories";
import { FinCategory } from "@/lib/FinCategory/type";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface Props {
  record?: FinRecord;
  onSuccess?: (newRecord: FinRecord) => void,
  onEditSuccess?: (updatedRecord: FinRecord) => void,
}
export function RecordForm({record, onEditSuccess, onSuccess }: Props) {

  const [isLoading, setIsloading] = useState(false);

  const categories = categoriesData;

  const form = useForm<z.infer<typeof recordFormSchema>>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      title: record?.title || "",
      amount: record?.amount || 2,
      type: record?.type || "expense",
      date: record?.date || new Date(),
      categories: record?.categories.map((x: FinCategory) => x.id) || []
    }
  });

  async function onSubmit(data: z.infer<typeof recordFormSchema>) {
    setIsloading(true);

    if (record) {
      if (!onEditSuccess) return console.error("(!) Error: missing 'onSuccess' function on Create operation.");

      try {
        const req = await fetch("/api/records", {
          method: "PUT",
          body: JSON.stringify({ ...data, id: record.id }),
        }); 
        if (!req.ok) throw new Error();

        const res = await req.json();
        console.log(res);
        
      } catch (error) {} finally { setIsloading(false) }

      const selectedCategories = categoriesData.filter(x => data.categories.find(y => y === x.id));
      onEditSuccess({...data, id: record.id, categories: selectedCategories}); // Use api response data;
      return;
    }
    
    if (!onSuccess) return console.error("(!) Error: missing 'onSuccess' function on Create operation.");
    try {
      const req = await fetch("/api/records", {
        method: "POST",
        body: JSON.stringify(data),
      }); 
      if (!req.ok) throw new Error();

      const res = await req.json();
      console.log(res);

      
      const selectedCategories = categoriesData.filter(x => data.categories.find(y => y === x.id));
      onSuccess({id: data.title + data.amount, ...data, categories: selectedCategories}); // Use api response data;

    } catch (error) {

    } finally { setIsloading(false) }
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        { /** TITLE **/ }
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
                Este será o título atrbuído à categoria.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          { /** AMOUNT **/ }
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <span>R$</span>
                    <Input 
                      type="number" placeholder="título da categoria" min={0} {...field} 
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Adicione a quantia do registro.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          { /** TYPE **/ }
          <FormField
            disabled={isLoading}
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="expense">saída</SelectItem>
                        <SelectItem value="income">entrada</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select> 
                </FormControl>
                <FormDescription>
                  Selecione o tipo do registro. 
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> 
        </div>

        { /** DATE **/ }
        <FormField
          disabled={isLoading}
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-0" align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Selecione a data do registro
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        { /** CATEGORIES **/ }
        <Card>
          <CardContent>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <FormLabel>Categorias</FormLabel>
                  <FormDescription>
                    Selecione pelo menos uma categoria.
                  </FormDescription>
                    <div className="grid grid-cols-2 gap-2 mt-2 overflow-y-auto">
                    {categories.map((category: FinCategory) => (
                      <FormField
                        key={category.id}
                        control={form.control}
                        name="categories"
                        render={({ field }) => {
                          const isChecked = field.value?.includes(category.id);
                          return (
                            <FormItem
                              key={category.id}
                              className="flex flex-row items-center space-x-3 space-y-0 w-fit"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    const id = category.id;

                                    if (checked) return field.onChange([...field.value, id]);

                                    field.onChange(field.value.filter((v: string) => v !== id));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{category.title}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    </div>
                  <FormMessage />
                </FormItem>
              )} 
            />
          </CardContent>
        </Card>

        <Button type="submit" className="cursor-pointer">
        {isLoading ? <LoadingSpinner/> : "Salvar"}
        </Button>
      </form>
    </Form>  
  )
}
