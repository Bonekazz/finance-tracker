import { TransactionsList } from "@/components/transactions-list";

export default async function Page() {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <p>Transactions</p>
      <TransactionsList />
    </div>
  )
}
