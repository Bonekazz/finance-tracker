export interface Transaction {
  id: string,
  title: string, 
  amount: number, // float

  type: TransactionType,

  date: Date,
  categories: {id: string, title: string}[],

  createdAt: Date,
  updatedAt: Date,
}

type TransactionType = "expense" | "income";

export const categories = [
  { id: "323424r2", title: "conta" },
  { id: "1243asd", title: "lazer" },
  { id: "98as34", title: "alimentação" },
  { id: "76sd12", title: "transporte" },
  { id: "88aa22", title: "educação" },
  { id: "88aa224", title: "venda" },
]

export const data: Transaction[] = [
  {
    id: "tx001",
    title: "Conta de Luz",
    amount: 120.75,
    type: "expense",
    date: new Date("2025-05-10T12:00:00Z"),
    categories: [{ id: "323424r2", title: "conta" }],
    createdAt: new Date("2025-05-01T08:30:00Z"),
    updatedAt: new Date("2025-05-10T12:05:00Z")
  },
  {
    id: "tx002",
    title: "Cinema com amigos",
    amount: 45.00,
    type: "expense",
    date: new Date("2025-05-20T20:00:00Z"),
    categories: [{ id: "1243asd", title: "lazer" }],
    createdAt: new Date("2025-05-05T14:00:00Z"),
    updatedAt: new Date("2025-05-05T14:00:00Z")
  },
  {
    id: "tx003",
    title: "Supermercado",
    amount: 235.90,
    type: "expense",
    date: new Date("2025-05-15T09:30:00Z"),
    categories: [{ id: "98as34", title: "alimentação" }],
    createdAt: new Date("2025-05-14T17:25:00Z"),
    updatedAt: new Date("2025-05-15T09:30:00Z")
  },
  {
    id: "tx004",
    title: "Passagem de ônibus",
    type: "expense",
    amount: 6.40,
    date: new Date("2025-05-18T07:00:00Z"),
    categories: [{ id: "76sd12", title: "transporte" }],
    createdAt: new Date("2025-05-16T10:45:00Z"),
    updatedAt: new Date("2025-05-16T10:45:00Z")
  },
  {
    id: "tx005",
    title: "Curso de inglês",
    type: "expense",
    amount: 320.00,
    date: new Date("2025-05-01T15:00:00Z"),
    categories: [{ id: "88aa22", title: "educação" }],
    createdAt: new Date("2025-04-25T11:20:00Z"),
    updatedAt: new Date("2025-05-01T15:00:00Z")
  },
  {
    id: "tx006",
    title: "Coca-cola",
    type: "income",
    amount: 320.00,
    date: new Date("2025-05-01T15:00:00Z"),
    categories: [{ id: "88aa224", title: "venda" },],
    createdAt: new Date("2025-04-25T11:20:00Z"),
    updatedAt: new Date("2025-05-01T15:00:00Z")
  }
]

