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
import { Pencil } from "lucide-react";

interface Props { recordsData: FinRecord[] }
export function RecordPage({ recordsData }: Props) {

  const [ records, setRecords ] = useState<FinRecord[]>(recordsData);
  const [ isDialogOpen, setIsDialogOpen ] = useState<boolean>(false);
  const [ isEditDialogOpen, setIsEditDialogOpen ] = useState<boolean>(false);

  const [ recordToEdit, setRecordToEdit ] = useState<FinRecord | null>(null);

  function handleClickEdit(record: FinRecord) {
    setRecordToEdit(record);
    setIsEditDialogOpen(true);
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

        <div className="w-[80vw] flex flex-col p-3 border-1 rounded-3xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Categorias</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            { records && records.map((record: FinRecord) => (
              <TableRow key={record.id} className="cursor-pointer py-2">
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
                {record.categories.map((cat: FinCategory) => (
                  <Badge key={cat.id} variant="outline">{cat.title}</Badge>
                ))}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" className="cursor-pointer" onClick={() => {handleClickEdit(record)}}>
                    <Pencil/>
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
