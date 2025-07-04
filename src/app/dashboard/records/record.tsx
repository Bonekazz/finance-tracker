import { formatDateToBR, formatToBRL } from "@/lib/utils";

interface RecordComponentProps {
  title: string,
  amount: number,
  categories: string[],
  date: Date,
}
export function Record({ title, amount, categories, date }: RecordComponentProps) {
  if (categories.length > 3) {
    categories = categories.slice(0, 3);
    categories.push("...");
  }

  return (
    <div className="flex flex-col gap-3 py-[39px]">
      <div className="flex justify-between">
        <h1 className="text-[16px] max-w-[144px] line-clamp-2 text-ellipsis overflow-hidden font-semibold leading-tight">{title}</h1>
        <p className="text-[16px] font-semibold">{ formatToBRL(amount) }</p>
      </div>

      { /** CATEGORIES **/ }
      <div className="flex gap-2 flex-wrap">
      { categories.map((cat: any, i: number) => (
        <p key={i} className="w-fit py-[5px] px-[9px] font-medium text-[12px] text-[#767676] bg-[#EBEBEB] rounded-full">{ cat }</p>
      ))}
      </div>

      <p className="text-[#BFBDBD] text-[15px] font-medium">{ formatDateToBR(date) }</p>
    </div>
  )
}
