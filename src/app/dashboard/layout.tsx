import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  console.log("[ SERVER ] User id: ", userId);
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex flex-col items-center">
        <div className="w-[80vw] flex flex-col items-start">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
