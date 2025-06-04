import { prisma } from "@/lib/prisma";
import { CategoriesPage } from "./categories-page";

export default async function Page() {
    
  try {
    const categories = await prisma.category.findMany({});

    return (
      <div className="w-full">
        <CategoriesPage categoriesData={categories}/>
      </div>
    )
  } catch (error) {
    return <div>Internal Error</div>
  }
  
}
