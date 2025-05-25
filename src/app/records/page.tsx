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
import { recordsData } from "@/data/records";
import { FinCategory } from "@/lib/FinCategory/type";
import { FinRecord } from "@/lib/FinRecord/types";
import { useState } from "react";

export default function Page() {

  const [ records, setRecords ] = useState<FinRecord[]>(recordsData)
  return (
    <div className="w-full h-full flex flex-col items-center pt-13">
      <div className="w-[80vw] flex flex-col p-3 border-1 rounded-3xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titulo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Categorias</TableHead>
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
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
