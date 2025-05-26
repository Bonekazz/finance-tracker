"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { FinCategory } from "@/lib/FinCategory/type";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "./category-form";
import { categoriesData } from "@/data/categories";

export default function Page() {
  
  const [ categories, setCategories ] = useState<FinCategory[]>(categoriesData);
  const [ isDialogOpen, setIsDialogOpen ] = useState<boolean>(false);
  
  return (
    <div className="w-full h-full flex flex-col items-center pt-13">

      <div className="flex flex-col items-end gap-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild className="ml-2">
            <Button className="cursor-pointer">Adicionar Categoria</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle hidden={true}>title</DialogTitle>
            <CategoryForm onSuccess={
              (newCategory: FinCategory) => {
                setCategories([newCategory,...categories])
                setIsDialogOpen(false)
              }
            }/>
          </DialogContent>
        </Dialog>


        <div className="w-[80vw] flex flex-col p-3 border-1 rounded-3xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            { categories && categories.map((cat: FinCategory) => (
              <TableRow key={cat.id} className="cursor-pointer py-2">
                <TableCell>{cat.title}</TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
