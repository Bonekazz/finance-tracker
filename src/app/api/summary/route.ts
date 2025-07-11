import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

function formatDate(date: Date) {
  return date.toISOString().split('T')[0] // yyyy-mm-dd
}

export async function GET(req: NextRequest ) {
  try {
    const { userId } = await auth();
    if (!userId) { return NextResponse.json({ error: "Not authorized" }, {status: 403}) }

    // Get current month range
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const records = await prisma.record.findMany({
      where: {
        userId,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const grouped = new Map<string, { date: string; income: number; expense: number }>()

    for (const record of records) {
      const date = formatDate(record.date);

      if (!grouped.has(date)) {
        grouped.set(date, { date, income: 0, expense: 0 })
      }

      const current = grouped.get(date)!

      if (record.type === 'income') {
        current.income += record.amount; continue;
      }

      if (record.type === 'expense') {
        current.expense += record.amount; continue;
      }
    }

    const summaryData = Array.from(grouped.values()).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const totalIncome = records.filter( x => x.type === "income").reduce( (total, record) => total + record.amount, 0 );
    const totalExpense = records.filter( x => x.type === "expense").reduce( (total, record) => total + record.amount, 0 );

    return NextResponse.json({ totalIncome, totalExpense, summaryData });

  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
