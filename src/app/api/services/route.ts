import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }
    
    if (category) {
      query.category = category;
    }

    if (status && status !== "All") {
      query.status = status;
    }

    const services = await Service.find(query).sort({ displayOrder: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Basic server-side validation
    if (!body.name || !body.slug || !body.shortDescription || !body.content || !body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check for duplicate slug
    const existingService = await Service.findOne({ slug: body.slug });
    if (existingService) {
      return NextResponse.json(
        { success: false, error: "Slug is already in use." },
        { status: 400 }
      );
    }

    const service = await Service.create(body);
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating service:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
