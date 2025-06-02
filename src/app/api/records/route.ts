import { recordFormSchema, recordSchema } from "@/lib/FinRecord/schema";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

  const chartData = Array.from(grouped.values())

  const totalIncome = records.filter( x => x.type === "income").reduce( (total, record) => total + record.amount, 0 );
  const totalExpense = records.filter( x => x.type === "expense").reduce( (total, record) => total + record.amount, 0 );
  const totalBalance = records.reduce( (total, rec) => {
    if (rec.type === "income") return total + rec.amount;
    if (rec.type === "expense") return total - rec.amount;
    return total;

  }, 0);

  return NextResponse.json({ totalIncome, totalExpense, totalBalance, chartData });
}

export async function POST(req: NextRequest) {
  try {
    
    const { userId: clerkId } = await auth();
    if (!clerkId) { return NextResponse.json({ error: "Not authorized" }, {status: 403}) }

    const user = await prisma.user.findFirst({ where: {clerkId} });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const validatedBody = recordFormSchema.safeParse(await req.json())
    if (!validatedBody.success) { 
      console.log("(!) Error: ", validatedBody.error.format());
      return NextResponse.json({error: "Invalid record schema"}, {status: 400});
    }

    // check categories
    if (validatedBody.data.categories.length > 0) {
      const categories = await prisma.category.findMany({
        where: {
          id: {in: validatedBody.data.categories}
        }
      });

      if (categories.length === 0) return NextResponse.json({ error: "Categories not found." }, { status: 404 });

      const record = await prisma.record.create({
        data: {
          ...validatedBody.data,
          user: { connect: { id: user.id } },
          categories: {
            connect: categories.map( cat => ({id: cat.id})),
          },
        },
        include: {categories: true}
      });

      return NextResponse.json({ success: "record created!", record});

    }

    const record = await prisma.record.create({
      data: {
        user: { connect: { id: user.id } },
        ...validatedBody.data,
        categories: undefined,
      }
    });

    return NextResponse.json({ success: "record created!", record});

  } catch (error) {
    console.error("(!) Error: ", error);
    return NextResponse.json({error: "Server Error"}, {status: 500});
  }
}

export async function PUT(req: NextRequest) {
  try {

    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Not authorized." });

    const user = await prisma.user.findFirst({ where: { clerkId }});
    if (!user) return NextResponse.json({ error: "User id not found." }, {status: 404});

    const body = await req.json();
    console.log(body);
    const validatedBody = recordSchema.extend({categories: recordFormSchema.shape.categories}).safeParse(body);

    if (!validatedBody.success) { 
      console.log("(!) Error: ", validatedBody.error.format());
      return NextResponse.json({error: "something went wrong"}, {status: 400});
    }

    // check if ID exist
    const { id, categories: categoryIds, } = validatedBody.data;
    const record = await prisma.record.findFirst({ where: {id} });

    if (!record) return NextResponse.json({ error: "Record id not found." }, { status: 404 });
    if (record.userId !== user.id) return NextResponse.json({ error: "Not authorized." }, {status: 403});

    // check if categories exist
    if (categoryIds.length > 0) {
      const categories = await prisma.category.findMany({
        where: { id: {in: categoryIds} }
      });

      if (categories.length === 0) return NextResponse.json({ error: "Category Ids not found" }, { status: 404 });

      // update record
      const updatedRecord = await prisma.record.update({
        where: { id },
        data: {
          ...validatedBody.data,
          id: record.id,
          categories: {
            set: [],
            connect: categories.map(x => ({id: x.id}))
          }
        },
        include: { categories: true }
      })

      return NextResponse.json({ success: "record updated!", record: updatedRecord });
    }

    // update record
    const updatedRecord = await prisma.record.update({
      where: { id },
      data: {
        ...validatedBody.data,
        categories: undefined,
        id: record.id,
      },
      include: { categories: true }
    })

    return NextResponse.json({ success: "record updated!", record: updatedRecord });

  } catch (error) {
    console.error("(!) Error: ", error);
    return NextResponse.json({error: "Server Error"}, {status: 500});
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Not authorized." });

    const user = await prisma.user.findFirst({ where: { clerkId }});
    if (!user) return NextResponse.json({ error: "User id not found." }, {status: 404});

     const validatedBody = z.object({
      id: z.string().min(1)
    }).safeParse(await req.json());

    if (!validatedBody.success) { 
      console.log("(!) Error: ", validatedBody.error.format());
      return NextResponse.json({error: "error validating request."}, {status: 400});
    }

    // check if id exist
    const { id } = validatedBody.data;
    const record = await prisma.record.findFirst({where: {id}});
    if (!record) return NextResponse.json({ error: "Record id not found." }, { status: 404 });
    if (record.userId !== user.id) return NextResponse.json({ error: "Not authorized." }, {status: 403});
    
    // delete record 
    await prisma.record.delete({where: {id: record.id}});
    return NextResponse.json({success: "Record deleted."});
    
  } catch (error) {
    console.error("(!) Error: ", error);
    return NextResponse.json({error: "Server Error"}, {status: 500});
  }
}
