import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RecordType = "expense" | "income";

interface Record {
  id: string,
  title: string,
  amount: number,
  type: RecordType,
  date: Date,
  categories: Category[],
}

interface Category {
  id: string,
  title: string
}

const data: Record[] = [
  {
    id: "1",
    title: "Salary",
    amount: 5000,
    type: "income",
    date: new Date("2025-05-01"),
    categories: [
      { id: "c1", title: "Job" }
    ]
  },
  {
    id: "2",
    title: "Groceries",
    amount: 150.75,
    type: "expense",
    date: new Date("2025-05-02"),
    categories: [
      { id: "c2", title: "Food" },
      { id: "c3", title: "Essentials" }
    ]
  },
  {
    id: "3",
    title: "Freelance Project",
    amount: 1200,
    type: "income",
    date: new Date("2025-05-05"),
    categories: [
      { id: "c4", title: "Freelance" }
    ]
  },
  {
    id: "4",
    title: "Rent",
    amount: 1800,
    type: "expense",
    date: new Date("2025-05-03"),
    categories: [
      { id: "c5", title: "Housing" }
    ]
  },
  {
    id: "5",
    title: "Coffee",
    amount: 4.50,
    type: "expense",
    date: new Date("2025-05-06"),
    categories: [
      { id: "c2", title: "Food" }
    ]
  },
  {
    id: "6",
    title: "Stock Dividend",
    amount: 300,
    type: "income",
    date: new Date("2025-05-07"),
    categories: [
      { id: "c6", title: "Investments" }
    ]
  },
  {
    id: "7",
    title: "Utilities",
    amount: 220,
    type: "expense",
    date: new Date("2025-05-08"),
    categories: [
      { id: "c7", title: "Bills" }
    ]
  },
  {
    id: "8",
    title: "Gift",
    amount: 100,
    type: "income",
    date: new Date("2025-05-09"),
    categories: [
      { id: "c8", title: "Personal" }
    ]
  },
  {
    id: "9",
    title: "Dining Out",
    amount: 65,
    type: "expense",
    date: new Date("2025-05-10"),
    categories: [
      { id: "c2", title: "Food" }
    ]
  },
  {
    id: "10",
    title: "Bonus",
    amount: 750,
    type: "income",
    date: new Date("2025-05-11"),
    categories: [
      { id: "c1", title: "Job" }
    ]
  }
];

export default function Page() {
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
            </TableRow>
          </TableHeader>
          <TableBody>
          { data && data.map((record: Record) => (
            <TableRow className="cursor-pointer py-2">
              <TableCell>{record.title}</TableCell>
              <TableCell>R$ {record.amount}</TableCell>
              <TableCell>{record.type}</TableCell>
              <TableCell>{record.date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
