"use client";

import { useRecords } from "@/hooks/useRecords";
import { Record } from "./record";

export default function Page() {
  const { records, error, isLoading } = useRecords();

  return (
    <div className="w-full h-full overflow-y-scroll flex flex-col">
      <header className="w-full flex justify-between">
        <h1 className="text-[32px] font-semibold max-w-[207px] leading-[35px]">Registros</h1>
      </header>

      { /** RECORDS **/ }
      <div className="flex flex-col gap-3">
      { records && records.map((rec: any, i: number) => (
        <Record
          key={i}
          title={rec.title}
          amount={rec.amount}
          categories={rec.categories.map((x: any) => x.title)}
          date={new Date(rec.date)}
        />
      )) }
      </div>
    </div>
  )
}
