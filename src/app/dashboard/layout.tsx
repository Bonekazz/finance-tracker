import { auth } from "@clerk/nextjs/server"
import { CircleDollarSign, FileChartLine, House, LibraryBig } from "lucide-react";
import { redirect } from "next/navigation";

const nav = [
  {
    title: "Inicio", href: "/home",
    icon: House
  },
  {
    title: "Regist.", href: "/records",
    icon: CircleDollarSign 
  },
  {
    title: "Categ.", href: "/categories",
    icon: LibraryBig
  },
  {
    title: "Análise", href: "/analytics",
    icon: FileChartLine
  },
]

export default async function Layout({ children }: { children: React.ReactNode }) {
  
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  // console.log("[ SERVER ] User id: ", userId);
  
  return (
    <div className="w-full h-[100vh] grid grid-rows-[1fr_10%]">
      {children}           
      <div className="w-full bg-slate-300 px-5">
        <nav className="w-full h-full flex gap-3 items-center justify-between">
        { nav.map((n, i) => (
          <a key={i} href={n.href} className="flex flex-col items-center gap-2">
            <n.icon />
            <p>{n.title}</p>
          </a>
        ))}
        </nav>
      </div>
    </div>
  )
}
