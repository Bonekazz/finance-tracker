import { categoryFormSchema, categorySchema } from "@/lib/FinCategory/schema";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {

    const categories = await prisma.category.findMany({});
    return NextResponse.json({ categories });
    
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    
    const { userId: clerkId } = await auth();
    if (!clerkId) { return NextResponse.json({ error: "Not authorized" }, {status: 403}) }

    const user = await prisma.user.findFirst({ where: {clerkId} });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const validatedBody = categoryFormSchema.safeParse(await req.json())

    if (!validatedBody.success) { 
      console.log("(!) Error: ", validatedBody.error.format());
      return NextResponse.json({error: "Invalid category schema."}, {status: 400});
    }

    const category = await prisma.category.create({
      data: {
        ...validatedBody.data,
        user: { connect: { id: user.id } }
      }
    });

    console.log("@ created category: ", category);

    return NextResponse.json({ success: "category created!", category });

  } catch (error) {
    console.error("(!) Error: ", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) { return NextResponse.json({ error: "Not authorized" }, {status: 403}) }

    const user = await prisma.user.findFirst({ where: {clerkId} });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const validatedBody = categorySchema.safeParse(await req.json())

    if (!validatedBody.success) { 
      console.log("(!) Error: ", validatedBody.error.format());
      return NextResponse.json({error: "error validating request."}, {status: 400});
    }

    // Check if category exist by id
    const { id } = validatedBody.data;
    const category = await prisma.category.findFirst({where: {id}});
    if (!category) return NextResponse.json({ error: "Category id not found."} , { status: 404 });
    if (category.userId !== user.id) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

    // Check if there's something to be updated (todo)
    
    // Update category and return
    const updatedCategory = await prisma.category.update({
      where: {id}, data: { ...validatedBody.data, id: category.id }
    });

    console.log("@ Updated category: ", updatedCategory);

    return NextResponse.json({ success: "category updated!", category: updatedCategory });

  } catch (error) {
    console.error("(!) Error: ", error);
    return NextResponse.json({error: "Server Error"}, {status: 500});
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) { return NextResponse.json({ error: "Not authorized" }, {status: 403}) }

    const user = await prisma.user.findFirst({ where: {clerkId} });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const validatedBody = z.object({
      id: z.string().min(1)
    }).safeParse(await req.json());

    if (!validatedBody.success) { 
      console.log("(!) Error: ", validatedBody.error.format());
      return NextResponse.json({error: "error validating request."}, {status: 400});
    }

    // check if id exist
    const { id } = validatedBody.data;
    const category = await prisma.category.findFirst({where: {id}});
    if (!category) return NextResponse.json({ error: "Category id not found." }, { status: 404 });
    if (category.userId !== user.id) return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    
    // delete category
    await prisma.category.delete({where: {id: category.id}});
    return NextResponse.json({success: "Category deleted."});

  } catch (error) {
    console.error("(!) Error: ", error);
    return NextResponse.json({error: "Server Error"}, {status: 500});
  }
}
