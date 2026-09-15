import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

const COLLECTIONS = new Set([
  "services",
  "blogs",
  "testimonials",
  "industries",
  "faqs",
]);

type RouteContext = {
  params: Promise<{ collection: string }>;
};

function getCollectionName(collection: string) {
  if (!COLLECTIONS.has(collection)) {
    return null;
  }

  return `admin_${collection}`;
}

export async function GET(_request: Request, context: RouteContext) {
  const { collection } = await context.params;
  const collectionName = getCollectionName(collection);

  if (!collectionName) {
    return NextResponse.json({ error: "Unsupported collection" }, { status: 404 });
  }

  try {
    const db = await getDatabase();
    const documents = await db
      .collection(collectionName)
      .find({})
      .sort({ updatedAt: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json(
      documents.map((document) => ({
        ...document,
        id: String(document.id ?? document._id),
        _id: undefined,
      })),
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load content" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { collection } = await context.params;
  const collectionName = getCollectionName(collection);

  if (!collectionName) {
    return NextResponse.json({ error: "Unsupported collection" }, { status: 404 });
  }

  try {
    const data = await request.json();
    const document = {
      ...data,
      id: data.id ?? crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const db = await getDatabase();
    await db.collection(collectionName).insertOne(document);

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create content" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { collection } = await context.params;
  const collectionName = getCollectionName(collection);

  if (!collectionName) {
    return NextResponse.json({ error: "Unsupported collection" }, { status: 404 });
  }

  try {
    const data = await request.json();
    const id = String(data.id ?? "");
    const db = await getDatabase();
    const filter = ObjectId.isValid(id)
      ? { $or: [{ id }, { _id: new ObjectId(id) }] }
      : { id };
    const { id: _id, ...changes } = data;
    const result = await db.collection(collectionName).findOneAndUpdate(
      filter,
      { $set: { ...changes, updatedAt: new Date() } },
      {
        returnDocument: "after",
        upsert: true,
      },
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update content" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const { collection } = await context.params;
  const collectionName = getCollectionName(collection);

  if (!collectionName) {
    return NextResponse.json({ error: "Unsupported collection" }, { status: 404 });
  }

  try {
    const data = await request.json();
    const id = String(data.id ?? "");
    const db = await getDatabase();
    const filter = ObjectId.isValid(id)
      ? { $or: [{ id }, { _id: new ObjectId(id) }] }
      : { id };
    const result = await db.collection(collectionName).deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete content" },
      { status: 400 },
    );
  }
}
