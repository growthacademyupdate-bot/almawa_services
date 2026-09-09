import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { ConsultationInput } from "@/server/consultation";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Partial<ConsultationInput>;
    const requiredFields: Array<keyof ConsultationInput> = [
      "firstName",
      "lastName",
      "email",
      "mobile",
      "country",
      "subject",
      "service",
      "stage",
      "message",
    ];
    const missingField = requiredFields.find(
      (field) => typeof data[field] !== "string" || !data[field]?.trim(),
    );

    if (missingField) {
      return NextResponse.json(
        { error: `${missingField} is required` },
        { status: 400 },
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(data.email!)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!/^\+?[\d\s-]{7,15}$/.test(data.mobile!)) {
      return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 });
    }

    const consultation: ConsultationInput = {
      firstName: data.firstName!.trim(),
      lastName: data.lastName!.trim(),
      email: data.email!.trim(),
      mobile: data.mobile!.trim(),
      phone: data.phone?.trim() ?? "",
      country: data.country!.trim(),
      subject: data.subject!.trim(),
      service: data.service!.trim(),
      stage: data.stage!.trim(),
      message: data.message!.trim(),
    };
    const db = await getDatabase();
    const result = await db.collection("consultations").insertOne({
      ...consultation,
      status: "new",
      createdAt: new Date(),
    });

    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("Failed to save consultation", error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : "Unable to save consultation",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const consultations = await db
      .collection("consultations")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(consultations);
  } catch (error) {
    console.error("Failed to load consultations", error);
    return NextResponse.json(
      { error: "Unable to load consultations" },
      { status: 500 },
    );
  }
}