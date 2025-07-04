import { auth } from "@clerk/nextjs/server"
import { CircleDollarSign, FileChartLine, House, LibraryBig } from "lucide-react";
import { redirect } from "next/navigation";

const nav = [
  {
    title: "Inicio", href: "/",
    headerTitle: "Resumo Deste Mês",
    icon: House
  },
  {
    title: "Regist.", href: "/records",
    headerTitle: "Registros",
    icon: CircleDollarSign 
  },
  {
    title: "Categ.", href: "/categories",
    headerTitle: "Resumo Deste Mês",
    icon: LibraryBig
  },
  {
    title: "Análise", href: "/analytics",
    headerTitle: "Resumo Deste Mês",
    icon: FileChartLine
  },
]

export default async function Layout({ children }: { children: React.ReactNode }) {
  
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  return (
    <div className="w-full h-[100vh] bg-white">
      <div className="w-full h-full px-[23px] pt-[41px] flex flex-col gap-[28px]">
        {children}
      </div>          

      <div className="fixed bottom-0 left-0 right-0 z-50 w-full px-5 border-t border-[#CACACA] bg-white md:hidden">
        <nav className="w-full h-full flex gap-3 items-center justify-between py-2">
          {nav.map((n, i) => (
            <a key={i} href={`/dashboard${n.href}`} className="flex flex-col items-center gap-1">
              <n.icon />
              <p className="text-xs">{n.title}</p>
            </a>
          ))}
        </nav>
      </div>

    </div>
  )
}
