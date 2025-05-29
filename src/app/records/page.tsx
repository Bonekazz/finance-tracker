import { prisma } from "@/lib/prisma";
import { RecordPage } from "./record-page";

export default async function Page() {
  try {
    const records = await prisma.record.findMany({ 
      where: {},
      orderBy: {date: "desc"},
      include: { categories: true }
    });

    return (
      <div>
        <RecordPage recordsData={records}/>
      </div>
    )

  } catch (error) {
    return <div>Internal Error</div>
  }
}
