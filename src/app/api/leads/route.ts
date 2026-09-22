import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function GET() {
  try {
    await dbConnect();

    const leads = await Lead.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Failed to load leads:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load leads",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const lead = await Lead.create({
      ...body,
      status: body.status ?? "new",
    });

    return NextResponse.json(
      {
        success: true,
        data: lead,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Failed to create lead:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create lead",
      },
      {
        status: 400,
      },
    );
  }
}