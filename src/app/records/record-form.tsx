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
import { recordSchema } from "@/lib/FinRecord/schema";

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

interface Props {
  onSuccess: (newRecord: FinRecord) => void,
}
export function RecordForm({ onSuccess }: Props) {

  const form = useForm<z.infer<typeof recordSchema>>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      title: "",
      amount: 2,
      type: "expense",
      date: new Date(),
      categories: []
    }
  });

  async function onSubmit(data: z.infer<typeof recordSchema>) {

    // API call here
    
    // onSuccess({id: data.title, title: data.title});
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        { /** TITLE **/ }
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
                  onInteractOutside={(e) => e.preventDefault()}
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
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

        <Button type="submit" className="cursor-pointer">Salvar</Button>
      </form>
    </Form>  
  )
}
