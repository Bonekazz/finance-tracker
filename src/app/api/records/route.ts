import { recordFormSchema, recordSchema } from "@/lib/FinRecord/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const validatedBody = recordFormSchema.safeParse(await req.json())
    if (!validatedBody.success) { 
      console.log("(!) Error: ", validatedBody.error.format());
      return NextResponse.json({error: "something went wrong"}, {status: 400});
    }

    return NextResponse.json({ success: "record created!" });

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

    return NextResponse.json({ success: "record updated!" });

  } catch (error) {
    console.error("(!) Error: ", error);
    return NextResponse.json({error: "Server Error"}, {status: 500});
  }
}
