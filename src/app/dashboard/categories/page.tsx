import { prisma } from "@/lib/prisma";
import { CategoriesPage } from "./categories-page";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {

  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");
    
  try {
    const categories = await prisma.category.findMany({
      where: { userId }
    });

    return (
      <div className="w-full">
        <CategoriesPage categoriesData={categories}/>
      </div>
    )
  } catch (error) {
    return <div>Internal Error</div>
  }
  
}
