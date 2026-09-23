import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

function serializeNotification(document: Record<string, unknown>) {
  return { ...document, id: String(document.id ?? document._id ?? ""), _id: undefined };
}

export async function GET() {
  try {
    const db = await getDatabase();
    const notifications = await db.collection("notifications").find({ active: { $ne: false } }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(notifications.map((notification) => serializeNotification(notification as unknown as Record<string, unknown>)));
  } catch (error) {
    console.error("Failed to load notifications:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { title?: string; message?: string; link?: string; active?: boolean };
    const title = body.title?.trim();
    const message = body.message?.trim();
    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required." }, { status: 400 });
    }

    const now = new Date();
    const notification = {
      id: new ObjectId().toString(),
      title,
      message,
      link: body.link?.trim() || "",
      active: body.active !== false,
      createdAt: now,
      updatedAt: now,
    };
    const db = await getDatabase();
    await db.collection("notifications").insertOne(notification);
    return NextResponse.json(serializeNotification(notification), { status: 201 });
  } catch (error) {
    console.error("Failed to create notification:", error);
    return NextResponse.json({ error: "Unable to create notification." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Notification ID is required." }, { status: 400 });
    const db = await getDatabase();
    await db.collection("notifications").deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return NextResponse.json({ error: "Unable to delete notification." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string; title?: string; message?: string; link?: string };
    const id = body.id?.trim();
    const title = body.title?.trim();
    const message = body.message?.trim();

    if (!id || !title || !message) {
      return NextResponse.json({ error: "ID, title, and message are required." }, { status: 400 });
    }

    const db = await getDatabase();
    const result = await db.collection("notifications").findOneAndUpdate(
      { id },
      {
        $set: {
          title,
          message,
          link: body.link?.trim() || "",
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json({ error: "Notification not found." }, { status: 404 });
    }

    return NextResponse.json(serializeNotification(result as unknown as Record<string, unknown>));
  } catch (error) {
    console.error("Failed to update notification:", error);
    return NextResponse.json({ error: "Unable to update notification." }, { status: 500 });
  }
}