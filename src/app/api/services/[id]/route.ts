import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Check if ID is a valid MongoDB ObjectId or a slug
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isValidObjectId ? { _id: id } : { slug: id };
    
    const service = await Service.findOne(query);

    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error: any) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isValidObjectId ? { _id: id } : { slug: id };

    // Check slug uniqueness if slug is being updated
    if (body.slug) {
      const existingService = await Service.findOne({ slug: body.slug, _id: { $ne: isValidObjectId ? id : undefined } });
      if (existingService && existingService.slug !== id) {
         return NextResponse.json(
          { success: false, error: "Slug is already in use." },
          { status: 400 }
        );
      }
    }

    const service = await Service.findOneAndUpdate(query, body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error: any) {
    console.error("Error updating service:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isValidObjectId ? { _id: id } : { slug: id };

    const deletedService = await Service.findOneAndDelete(query);

    if (!deletedService) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
