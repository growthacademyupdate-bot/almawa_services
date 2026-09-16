import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

const fields = ["firstname", "lastname", "email", "mobile", "phone", "country", "subjects", "msg"] as const;
const contactCollection = "contactSubmissions";
type ContactPayload = Record<(typeof fields)[number], string>;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  try {
    const db = await getDatabase();
    const messages = await db
      .collection(contactCollection)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      messages.map((message) => ({
        ...message,
        _id: message._id.toString(),
      })),
    );
  } catch (error) {
    console.error("Failed to load contact messages", error);
    return NextResponse.json({ error: "Unable to load contact messages" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Message id is required" }, { status: 400 });

    const { ObjectId } = await import("mongodb");
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid message id" }, { status: 400 });

    const db = await getDatabase();
    const result = await db.collection(contactCollection).deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) return NextResponse.json({ error: "Message not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete contact message", error);
    return NextResponse.json({ error: "Unable to delete contact message" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const contact = Object.fromEntries(fields.map((field) => [field, text(body[field])])) as ContactPayload;
    const missing = fields.find((field) => !contact[field]);
    if (missing) return NextResponse.json({ error: `${missing} is required` }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(contact.email)) return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    if (!/^\+?[\d\s()-]{7,20}$/.test(contact.mobile) || !/^\+?[\d\s()-]{7,20}$/.test(contact.phone)) return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    if (contact.msg.length < 10) return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 400 });

    const db = await getDatabase();
    const result = await db.collection(contactCollection).insertOne({
      ...contact,
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("Failed to save contact", error);
    return NextResponse.json({ error: "Unable to save your enquiry" }, { status: 500 });
  }
}
