"use client";

import { Badge } from "@/components/ui/badge";
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

import { FinCategory } from "@/lib/FinCategory/type";
import { FinRecord } from "@/lib/FinRecord/type";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button";

import { useState } from "react";
import { RecordForm } from "./record-form";
import { Pencil, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Props { recordsData: FinRecord[] }
export function RecordPage({ recordsData }: Props) {

  const [ records, setRecords ] = useState<FinRecord[]>(recordsData);
  const [ isDialogOpen, setIsDialogOpen ] = useState<boolean>(false);
  const [ isEditDialogOpen, setIsEditDialogOpen ] = useState<boolean>(false);
  const [ isDeleteDialogOpen, setIsDeleteDialogOpen ] = useState<boolean>(false);

  const [ recordToEdit, setRecordToEdit ] = useState<FinRecord | null>(null);
  const [ recordToDelete, setRecordToDelete ] = useState<FinRecord | null>(null);

  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  function handleClickEdit(record: FinRecord) {
    setRecordToEdit(record);
    setIsEditDialogOpen(true);
  }

  function handleClickDelete(record: FinRecord) {
    setRecordToDelete(record);
    setIsDeleteDialogOpen(true);
  }

   async function handleDelete(record: FinRecord) {
    if (!record) return console.error("(!) Error: no category provided.");

    setIsLoading(true);
    try {
      const req = await fetch("/api/records", { 
        method: "DELETE",
        body: JSON.stringify({ id: record.id })
      });
      if (!req.ok) { return console.log(await req.json()) }
      const res = await req.json();
      console.log(res);
      setRecords(records.filter(x => x.id !== record.id));
    } catch (error) {
      console.error("(!) Error: ", error);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center pt-13">

      <div className="flex flex-col items-end gap-6">
        
        { /** CREATE DIALOG **/ }
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild className="ml-2">
            <Button className="cursor-pointer">Adicionar Registro</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle hidden={true}>title</DialogTitle>
            <RecordForm onSuccess={(newRecord: FinRecord) => {
              setRecords([newRecord, ...records]);
              setIsDialogOpen(false);
            }}/>
          </DialogContent>
        </Dialog>

        { /** EDIT DIALOG **/ }
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle hidden={true}>title</DialogTitle>
            {recordToEdit && (
              <RecordForm 
                record={recordToEdit} 
                onEditSuccess={ (record: FinRecord) => {
                  const toUpdateIndex = records.findIndex(x => x.id === record.id);
                  if (toUpdateIndex < 0) return console.error("(!) Error: record id not found");

                  records[toUpdateIndex] = {...record, id: records[toUpdateIndex].id};

                  setRecords(records);
                  setIsEditDialogOpen(false);
                }}/>
            )}
          </DialogContent>
        </Dialog>

        { /** DELETE ALERT DIALOG **/ }
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza que deseja deletar o registro <span className="font-bold">"{recordToDelete?.title}"</span></AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não poderá ser desfeita. Isto irá deletar permanentemente esta categoria.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button disabled={isLoading} onClick={ () => { setIsDeleteDialogOpen(false) } } variant="outline">Cancelar</Button>
              <Button disabled={isLoading} onClick={ () => { handleDelete(recordToDelete!) } } className="bg-red-200 border border-red-800/40 text-red-900 hover:bg-red-300">{ isLoading ? <LoadingSpinner/> : "Deletar" }</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="w-[80vw] h-[70vh] py-5 px-5 flex flex-col border-1 rounded-3xl bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Titulo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Categorias</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            { records && records.map((record: FinRecord, index: number) => (
              <TableRow key={record.id} className="cursor-pointer py-2">
                <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                <TableCell>{record.title}</TableCell>
                <TableCell>R$ {record.amount}</TableCell>
                <TableCell>
                  <Badge 
                    className={`
                      rounded-full border-1
                      ${record.type === "expense" ? "bg-red-100 text-red-800 border-red-800/40" : "bg-green-100 text-green-800 border-green-800/40"}
                    `} 
                    >{record.type === "expense" ? "saída" : "entrada"}</Badge>
                </TableCell>
                <TableCell>{record.date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                <TableCell className="w-[170px] flex gap-2 flex-wrap">
                {record.categories && record.categories.map((cat: FinCategory) => (
                  <Badge key={cat.id} variant="outline">{cat.title}</Badge>
                ))}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" onClick={() => {handleClickEdit(record)}}>
                    <Pencil/>
                  </Button>
                  <Button variant="outline" onClick={() => { handleClickDelete(record) }}>
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
