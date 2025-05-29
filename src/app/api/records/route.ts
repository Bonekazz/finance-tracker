import { recordFormSchema, recordSchema } from "@/lib/FinRecord/schema";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const validatedBody = recordFormSchema.safeParse(await req.json())
    if (!validatedBody.success) { 
      console.log("(!) Error: ", validatedBody.error.format());
      return NextResponse.json({error: "Invalid record schema"}, {status: 400});
    }
    
    // check categories
    // const { categories } = validatedBody.data;
    const categories = await prisma.category.findMany({
      where: {
        id: {in: validatedBody.data.categories}
      }
    });

    if (categories.length === 0) return NextResponse.json({ error: "Categories not found." }, { status: 404 });

    const record = await prisma.record.create({
      data: {
        ...validatedBody.data,
        categories: {
          connect: categories.map( cat => ({id: cat.id})),
        },
      },
      include: {categories: true}
    });

    console.log("@ new record: ", record);

    return NextResponse.json({ success: "record created!", record});

  } catch (error) {
    console.error("(!) Error: ", error);
    return NextResponse.json({error: "Server Error"}, {status: 500});
  }
}

export async function PUT(req: NextRequest) {
  try {

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

    // check if categories exist
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

  } catch (error) {
    console.error("(!) Error: ", error);
    return NextResponse.json({error: "Server Error"}, {status: 500});
  }
}
