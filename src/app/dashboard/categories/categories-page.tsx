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
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
import { Pencil, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Props { categoriesData: FinCategory[] }
export function CategoriesPage({ categoriesData }: Props) {
  
  const [ categories, setCategories ] = useState<FinCategory[]>(categoriesData);

  const [ isDialogOpen, setIsDialogOpen ] = useState<boolean>(false);
  const [ isEditDialogOpen, setIsEditDialogOpen ] = useState<boolean>(false);
  const [ isDeleteDialogOpen, setIsDeleteDialogOpen ] = useState<boolean>(false);

  const [ categoryToEdit, setCategoryToEdit ] = useState<FinCategory | null>(null);
  const [ categoryToDelete, setCategoryToDelete ] = useState<FinCategory | null>(null);

  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  function handleClickEdit(category: FinCategory) {
    console.log("@ Editing: ", category);

    setIsEditDialogOpen(true);
    setCategoryToEdit(category);
  }

  function handleClickDelete(category: FinCategory) {
    console.log("@ deleting: ", category);

    setIsDeleteDialogOpen(true);
    setCategoryToDelete(category);
  }

  async function handleDelete(cat: FinCategory) {
    if (!cat) return console.error("(!) Error: no category provided.");

    setIsLoading(true);
    try {
      const req = await fetch("/api/categories", { 
        method: "DELETE",
        body: JSON.stringify({ id: cat.id })
      });
      if (!req.ok) { return console.log(await req.json()) }
      const res = await req.json();
      console.log(res);
      setCategories(categories.filter(x => x.id !== cat.id));
    } catch (error) {
      console.error("(!) Error: ", error);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false)
    }
  }
  
  return (
    <div className="w-full h-full flex flex-col items-center pt-13">

      <div className="w-full flex flex-col items-end gap-6">

        <div className="w-full flex justify-between px-3">
          <h1 className="text-3xl font-bold">Categorias</h1>

          { /** CREATE DIALOG **/ }
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild className="ml-2">
              <Button className="cursor-pointer">Adicionar Categoria</Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
              <DialogTitle hidden={true}>title</DialogTitle>
              <CategoryForm onSuccess={
                (newCategory: FinCategory) => {
                  setCategories([newCategory,...categories])
                  setIsDialogOpen(false)
                }
              }/>
            </DialogContent>
          </Dialog> 
        </div>

        { /** EDIT DIALOG **/ }
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle hidden={true}>title</DialogTitle>
            {categoryToEdit && (
              <CategoryForm 
                category={categoryToEdit} 
                onEditSuccess={ (category: FinCategory) => {
                  const categoryToUpdate = categories.find(x => x.id === category.id);
                  if (!categoryToUpdate) return console.error("(!) Error: category id not found");
                  categoryToUpdate.title = category.title;

                  setCategories(categories);
                  setIsEditDialogOpen(false);
                }}/>
            )}
          </DialogContent>
        </Dialog>

        { /** DELETE ALERT DIALOG **/ }
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza que deseja deletar a categoria <span className="font-bold">"{categoryToDelete?.title}"</span></AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não poderá ser desfeita. Isto irá deletar permanentemente esta categoria.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button disabled={isLoading} onClick={ () => { setIsDeleteDialogOpen(false) } } variant="outline">Cancelar</Button>
              <Button disabled={isLoading} onClick={ () => { handleDelete(categoryToDelete!) } } className="bg-red-200 border border-red-800/40 text-red-900 hover:bg-red-300">{ isLoading ? <LoadingSpinner/> : "Deletar" }</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> 

        <div className="w-full flex flex-col px-5 py-5 h-[70vh] border-1 rounded-3xl bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Titulo</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            { categories && categories.map((cat: FinCategory, index: number) => (
              <TableRow key={cat.id} className="cursor-pointer py-2">
                <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                <TableCell>{cat.title}</TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <Button variant="outline" className="cursor-pointer" onClick={() => {handleClickEdit(cat)}}>
                    <Pencil/>
                  </Button>
                  <Button variant="outline" className="cursor-pointer" onClick={() => { handleClickDelete(cat) }}>
                    <Trash2 color="red"/>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
