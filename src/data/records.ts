import { FinRecord } from "@/lib/FinRecord/type";
import { categoriesData } from "./categories";

export const recordsData: FinRecord[] = [
  {
    id: "1",
    title: "Salary",
    amount: 5000,
    type: "income",
    date: new Date("2025-05-01"),
    categories: [
      categoriesData[0],
      categoriesData[3],
      categoriesData[7],
    ]
  },
  {
    id: "2",
    title: "Groceries",
    amount: 150.75,
    type: "expense",
    date: new Date("2025-05-02"),
    categories: [
      categoriesData[0],
      categoriesData[3],
    ]
  },
  {
    id: "3",
    title: "Freelance Project",
    amount: 1200,
    type: "income",
    date: new Date("2025-05-05"),
    categories: [
      categoriesData[3],
      categoriesData[7],
    ]
  },
  {
    id: "4",
    title: "Rent",
    amount: 1800,
    type: "expense",
    date: new Date("2025-05-03"),
    categories: [
      categoriesData[4],
    ]
  },
  {
    id: "5",
    title: "Coffee",
    amount: 4.50,
    type: "expense",
    date: new Date("2025-05-06"),
    categories: [
      categoriesData[6],
    ]
  },
  {
    id: "6",
    title: "Stock Dividend",
    amount: 300,
    type: "income",
    date: new Date("2025-05-07"),
    categories: [
      categoriesData[3],
      categoriesData[4],
    ]
  },
  {
    id: "7",
    title: "Utilities",
    amount: 220,
    type: "expense",
    date: new Date("2025-05-08"),
    categories: [
      categoriesData[4],
      categoriesData[6],
    ]
  },
  {
    id: "8",
    title: "Gift",
    amount: 100,
    type: "income",
    date: new Date("2025-05-09"),
    categories: [
      categoriesData[3],
      categoriesData[4],
    ]
  },
  {
    id: "9",
    title: "Dining Out",
    amount: 65,
    type: "expense",
    date: new Date("2025-05-10"),
    categories: [
      categoriesData[2],
      categoriesData[3],
    ]
  },
  {
    id: "10",
    title: "Bonus",
    amount: 750,
    type: "income",
    date: new Date("2025-05-11"),
    categories: [
      categoriesData[4],
      categoriesData[6],
    ]
  }
];
