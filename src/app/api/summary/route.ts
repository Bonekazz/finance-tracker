import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function formatDate(date: Date) {
  return date.toISOString().split('T')[0] // yyyy-mm-dd
}

export async function GET(req: NextRequest ) {
  const searchParams = req.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  console.log({ from, to });

  if (!from || !to) return NextResponse.json({ error: "Invalid date range." }, { status: 400 });

  const records = await prisma.record.findMany({  // or your model name
    where: {
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

  const chartData = Array.from(grouped.values()).sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalIncome = records.filter( x => x.type === "income").reduce( (total, record) => total + record.amount, 0 );
  const totalExpense = records.filter( x => x.type === "expense").reduce( (total, record) => total + record.amount, 0 );
  const totalBalance = records.reduce( (total, rec) => {
    if (rec.type === "income") return total + rec.amount;
    if (rec.type === "expense") return total - rec.amount;
    return total;

  }, 0);

  return NextResponse.json({ totalIncome, totalExpense, totalBalance, chartData });
}
