import { NextRequest, NextResponse } from "next/server";

import { getDatabase } from "@/lib/mongodb";

const COLLECTION = "services";

const CATEGORIES = [
  "Business Consulting",
  "Strategy",
  "Digital Transformation",
  "Technology",
  "Operations",
  "Business Growth",
  "Process Optimization",
] as const;

const STATUSES = [
  "active",
  "inactive",
] as const;

function cleanSlug(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeService(service: any) {
  return {
    id: String(
      service.id ??
        service._id ??
        service.slug,
    ),

    name: String(
      service.name ?? "",
    ),

    slug: String(
      service.slug ?? "",
    ),

    shortDescription: String(
      service.shortDescription ?? "",
    ),

    content: String(
      service.content ?? "",
    ),

    icon: String(
      service.icon ?? "Briefcase",
    ),

    image: String(
      service.image ?? "",
    ),

    category: String(
      service.category ?? "",
    ),

    status:
      service.status === "inactive"
        ? "inactive"
        : "active",

    displayOrder: Number(
      service.displayOrder ?? 1,
    ),

    seoTitle: String(
      service.seoTitle ?? "",
    ),

    seoDescription: String(
      service.seoDescription ?? "",
    ),

    seoKeywords: String(
      service.seoKeywords ?? "",
    ),

    createdAt:
      service.createdAt ??
      new Date().toISOString(),

    updatedAt:
      service.updatedAt ??
      new Date().toISOString(),
  };
}

function validateService(body: any) {
  if (
    !String(body.name ?? "").trim()
  ) {
    return "Service name is required.";
  }

  if (
    !String(body.slug ?? "").trim()
  ) {
    return "Slug is required.";
  }

  if (
    !String(body.shortDescription ?? "").trim()
  ) {
    return "Short description is required.";
  }

  if (
    String(body.shortDescription ?? "")
      .trim().length > 250
  ) {
    return "Short description must be 250 characters or less.";
  }

  if (
    !String(body.content ?? "")
      .replace(/<[^>]*>/g, "")
      .trim()
  ) {
    return "Service content is required.";
  }

  if (
    !CATEGORIES.includes(
      body.category,
    )
  ) {
    return "Category is required.";
  }

  if (
    !STATUSES.includes(body.status)
  ) {
    return "Status is required.";
  }

  const order = Number(
    body.displayOrder,
  );

  if (
    !Number.isFinite(order)
  ) {
    return "Display order must be a valid number.";
  }

  return null;
}

export async function GET() {
  try {
    const db = await getDatabase();

    const services =
      await db
        .collection(COLLECTION)
        .find({})
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .toArray();

    return NextResponse.json(
      services.map(normalizeService),
    );
  } catch (error) {
    console.error(
      "GET /api/admin/services:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to load services.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const validationError =
      validateService(body);

    if (validationError) {
      return NextResponse.json(
        {
          error: validationError,
        },
        { status: 400 },
      );
    }

    const db =
      await getDatabase();

    const slug =
      cleanSlug(body.slug);

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Slug is required.",
        },
        { status: 400 },
      );
    }

    const existing =
      await db
        .collection(COLLECTION)
        .findOne({ slug });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "Slug is already in use.",
        },
        { status: 409 },
      );
    }

    const now =
      new Date().toISOString();

    const service = {
      name: String(
        body.name,
      ).trim(),

      slug,

      shortDescription:
        String(
          body.shortDescription,
        ).trim(),

      content:
        String(
          body.content,
        ).trim(),

      icon:
        String(
          body.icon ??
            "Briefcase",
        ),

      image:
        String(
          body.image ?? "",
        ),

      category:
        body.category,

      status:
        body.status ===
        "inactive"
          ? "inactive"
          : "active",

      displayOrder:
        Number(
          body.displayOrder,
        ),

      seoTitle:
        String(
          body.seoTitle ?? "",
        ).trim(),

      seoDescription:
        String(
          body.seoDescription ??
            "",
        ).trim(),

      seoKeywords:
        String(
          body.seoKeywords ??
            "",
        ).trim(),

      createdAt: now,
      updatedAt: now,
    };

    const result =
      await db
        .collection(COLLECTION)
        .insertOne(service);

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...service,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/services:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to create service.",
      },
      { status: 500 },
    );
  }
}