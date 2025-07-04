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
import { FinRecord } from "@/lib/FinRecord/type";
import { recordFormSchema } from "@/lib/FinRecord/schema";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { FinCategory } from "@/lib/FinCategory/type";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

// Function to format currency input for Brazilian format
function formatCurrencyInput(value: number): string {
  if (value === 0) return "";
  
  // Convert to cents and pad with zeros
  const cents = Math.round(value * 100);
  const centsStr = cents.toString().padStart(3, '0');
  
  // Split into reais and centavos
  const reais = centsStr.slice(0, -2) || "0";
  const centavos = centsStr.slice(-2);
  
  // Format reais with thousands separator
  const formattedReais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formattedReais},${centavos}`;
}

interface Props {
  record?: FinRecord;
  onSuccess?: (newRecord: FinRecord) => void,
  onEditSuccess?: (updatedRecord: FinRecord) => void,
}
export function RecordForm({record, onEditSuccess, onSuccess }: Props) {

  const [isLoading, setIsloading] = useState(false);
  const [isLoadingCategories, setIsloadingCategories] = useState(false);
  const [categories, setCategories] = useState<FinCategory[] | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setIsloadingCategories(true);
      const req = await fetch("/api/categories");
      const res = await req.json();
      setCategories(res.categories);
      setIsloadingCategories(false);

    } catch (error) {
      console.error("(!) Error: error fetching categories.");
    }
  }

  const form = useForm<z.infer<typeof recordFormSchema>>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      title: record?.title || "",
      amount: record?.amount || 2,
      type: record?.type || "expense",
      date: record?.date || new Date(),
      categories: (record?.categories && record?.categories.map((x: FinCategory) => x.id)) || []
    }
  });

  async function onSubmit(data: z.infer<typeof recordFormSchema>) {
    setIsloading(true);
    if (!categories) return console.error("(!) Error: no categories available.");

    if (record) {
      if (!onEditSuccess) return console.error("(!) Error: missing 'onSuccess' function on Create operation.");

      try {
        const req = await fetch("/api/records", {
          method: "PUT",
          body: JSON.stringify({ ...data, id: record.id }),
        }); 
        if (!req.ok) throw new Error();

        const res = await req.json();
        onEditSuccess({ ...res.record, date: new Date(res.record.date) });
        
      } catch (error) {} finally { setIsloading(false) }

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
      
      onSuccess({ ...res.record, date: new Date(res.record.date) });

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

        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
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
                      type="text" 
                      placeholder="0,00" 
                      {...field} 
                      value={field.value ? formatCurrencyInput(field.value) : ""}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^\d]/g, '');
                        const numericValue = rawValue === "" ? 0 : parseInt(rawValue, 10) / 100;
                        field.onChange(numericValue);
                      }}
                      onBlur={(e) => {
                        if (field.value === 0) {
                          field.onChange("");
                        }
                      }}
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
                  <select
                    className="flex h-10 w-full md:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="" disabled={true}>Selecione o tipo</option>
                    <option value="expense">saída</option>
                    <option value="income">entrada</option>
                  </select>
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
                        "w-full md:w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        field.value.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' })
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
                    locale={ptBR}
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
                  <FormLabel>Categorias (opcional)</FormLabel>
                  <FormDescription>
                  { (isLoadingCategories || ( categories && categories.length > 0 ) ? "Selecione pelo menos uma categoria." : (
                    <span>
                      <span>Você ainda não criou nenhuma categoria. <a href="/dashboard/categories" className="underline">Criar categoria.</a></span>
                    </span>
                  )) }
                  </FormDescription>
                    <div className="grid grid-cols-2 gap-2 mt-2 overflow-y-auto">
                    { !categories && isLoadingCategories && Array.from({ length: 5 }).map( (_, i) => (
                      <Skeleton key={i} className="w-18 h-5 rounded-md"/>
                    ))}
                    { categories && categories.length > 0 && categories.map((category: FinCategory) => (
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

        <Button type="submit" className="cursor-pointer w-full">
        {isLoading ? <LoadingSpinner/> : "Salvar"}
        </Button>
      </form>
    </Form>  
  )
}
