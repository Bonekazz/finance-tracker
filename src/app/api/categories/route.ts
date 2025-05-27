import { categoryFormSchema, categorySchema } from "@/lib/FinCategory/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const validatedBody = categoryFormSchema.safeParse(await req.json())

    if (!validatedBody.success) { 
      console.log("(!) Error: ", validatedBody.error.format());
      return NextResponse.json({error: "something went wrong"}, {status: 400});
    }

    return NextResponse.json({ success: "category created!" });

  } catch (error) {
    console.error("(!) Error: ", error);
    return NextResponse.json({error: "Server Error"}, {status: 500});
  }
}

export async function PUT(req: NextRequest) {
  try {

    const validatedBody = categorySchema.safeParse(await req.json())

    if (!validatedBody.success) { 
      console.log("(!) Error: ", validatedBody.error.format());
      return NextResponse.json({error: "error validating request."}, {status: 400});
    }

    // Check if category exist by id
    // Check if there's something to be updated
    // Update category and return

    return NextResponse.json({ success: "category updated!" });

  } catch (error) {
    console.error("(!) Error: ", error);
    return NextResponse.json({error: "Server Error"}, {status: 500});
  }
}
