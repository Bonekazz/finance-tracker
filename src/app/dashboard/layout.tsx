import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Layout({ children }: { children: React.ReactNode }) {
  
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  // console.log("[ SERVER ] User id: ", userId);
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex flex-col items-center">
        <header className="w-full flex justify-between items-center py-5 px-12 bg-sidebar border-b border-sidebar-border">
          <SidebarTrigger />
          <UserButton 
            fallback={(
              <div className="flex gap-3 items-center">
                <Skeleton className="h-4 w-[100px] rounded-md"/>
                <Skeleton className="h-6 w-6 rounded-full"/>
              </div>
            )} 
            showName={true} />
        </header>
        <div className="px-12 w-full">
         {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
