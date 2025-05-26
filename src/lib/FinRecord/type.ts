import { FinCategory } from "../FinCategory/type";

export type RecordType = "expense" | "income";

export interface FinRecord {
  id: string,
  title: string,
  amount: number,
  type: RecordType,
  date: Date,
  categories: FinCategory[],
}
