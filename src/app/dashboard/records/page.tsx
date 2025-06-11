import { prisma } from "@/lib/prisma";
import { RecordPage } from "./record-page";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  try {
    const records = await prisma.record.findMany({ 
      where: {
        userId,
      },
      orderBy: {date: "desc"},
      include: { categories: true }
    });

    return (
      <div className="w-full">
        <RecordPage recordsData={records}/>
      </div>
    )

  } catch (error) {
    return <div>Internal Error</div>
  }
}
