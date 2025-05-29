import { FinCategory } from "../FinCategory/type";

export type RecordType = "expense" | "income";

export interface FinRecord {
  id: string,
  title: string,
  amount: number,
  type: RecordType | string,
  date: Date,

  categories: FinCategory[],

  createdAt: Date,
  updatedAt: Date,
}
