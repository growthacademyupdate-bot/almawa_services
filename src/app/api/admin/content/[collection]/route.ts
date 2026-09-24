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
  params: Promise<{
    collection: string;
  }>;
};

/*
 * These are the industries that were previously hard-coded
 * on the public website.
 *
 * They are seeded into MongoDB automatically so that:
 *
 * Admin -> Industries
 * Website -> Industries
 *
 * both use the same database records.
 */
const DEFAULT_INDUSTRIES = [
  {
    id: "legacy-banking-financial-services",
    name: "Banking & Financial Services",
    description:
      "Helping financial organizations improve operational efficiency, customer experience, compliance, and digital transformation.",
    focus: [
      "Process Optimization",
      "Digital Transformation",
      "Customer Experience",
      "Business Strategy",
    ],
    icon: "bank",
  },
  {
    id: "legacy-healthcare",
    name: "Healthcare",
    description:
      "Supporting healthcare organizations with better processes, technology adoption, operational improvement, and patient-focused strategies.",
    focus: [
      "Operational Efficiency",
      "Digital Solutions",
      "Process Improvement",
      "Strategic Planning",
    ],
    icon: "healthcare",
  },
  {
    id: "legacy-manufacturing",
    name: "Manufacturing",
    description:
      "Helping manufacturers optimize operations, reduce inefficiencies, improve productivity, and build scalable business processes.",
    focus: [
      "Process Optimization",
      "Supply Chain Improvement",
      "Cost Reduction",
      "Productivity Enhancement",
    ],
    icon: "factory",
  },
  {
    id: "legacy-retail-e-commerce",
    name: "Retail & E-Commerce",
    description:
      "Helping retail and e-commerce businesses improve customer experience, streamline operations, and build strategies for sustainable growth.",
    focus: [
      "Customer Experience",
      "E-Commerce Strategy",
      "Sales Optimization",
      "Digital Transformation",
    ],
    icon: "retail",
  },
  {
    id: "legacy-technology-it",
    name: "Technology & IT",
    description:
      "Supporting technology companies with business strategy, process improvement, digital transformation, and scalable growth solutions.",
    focus: [
      "Technology Strategy",
      "Business Growth",
      "Process Automation",
      "Digital Transformation",
    ],
    icon: "technology",
  },
  {
    id: "legacy-real-estate-construction",
    name: "Real Estate & Construction",
    description:
      "Helping real estate and construction businesses improve project management, operational processes, customer relationships, and business performance.",
    focus: [
      "Project Management",
      "Business Strategy",
      "Process Improvement",
      "Operational Efficiency",
    ],
    icon: "construction",
  },
];

function getCollectionName(collection: string) {
  if (!COLLECTIONS.has(collection)) {
    return null;
  }

  return `admin_${collection}`;
}

async function seedDefaultIndustries() {
  const db = await getDatabase();
  const collection = db.collection("admin_industries");

  const operations = DEFAULT_INDUSTRIES.map(
    (industry) => ({
      updateOne: {
        filter: {
          id: industry.id,
        },
        update: {
          $setOnInsert: {
            ...industry,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }),
  );

  if (operations.length > 0) {
    await collection.bulkWrite(operations);
  }
}

function serializeDocument(
  document: Record<string, unknown>,
) {
  return {
    ...document,
    id: String(
      document.id ??
        document._id ??
        "",
    ),
    _id: undefined,
  };
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const { collection } =
    await context.params;

  const collectionName =
    getCollectionName(collection);

  if (!collectionName) {
    return NextResponse.json(
      {
        error:
          "Unsupported collection",
      },
      { status: 404 },
    );
  }

  try {
    /*
     * Seed the old public website industries
     * into MongoDB the first time this endpoint
     * is used.
     */
    if (collection === "industries") {
      await seedDefaultIndustries();
    }

    const db = await getDatabase();

    const documents = await db
      .collection(collectionName)
      .find({})
      .sort({
        updatedAt: -1,
        createdAt: -1,
      })
      .toArray();

    return NextResponse.json(
      documents.map((document) =>
        serializeDocument(
          document as unknown as Record<
            string,
            unknown
          >,
        ),
      ),
    );
  } catch (error) {
    console.error(
      `Failed to load ${collection}:`,
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load content",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  const { collection } =
    await context.params;

  const collectionName =
    getCollectionName(collection);

  if (!collectionName) {
    return NextResponse.json(
      {
        error:
          "Unsupported collection",
      },
      { status: 404 },
    );
  }

  try {
    const data =
      (await request.json()) as Record<
        string,
        unknown
      >;

    const id =
      String(
        data.id ??
          crypto.randomUUID(),
      );

    const now = new Date();

    const document = {
      ...data,
      id,
      createdAt:
        data.createdAt ??
        now,
      updatedAt: now,
    };

    const db = await getDatabase();

    /*
     * Prevent accidental duplicate IDs.
     */
    const existing =
      await db
        .collection(collectionName)
        .findOne({ id });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "An item with this ID already exists.",
        },
        { status: 409 },
      );
    }

    await db
      .collection(collectionName)
      .insertOne(document);

    return NextResponse.json(
      serializeDocument(
        document,
      ),
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      `Failed to create ${collection}:`,
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create content",
      },
      { status: 400 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const { collection } =
    await context.params;

  const collectionName =
    getCollectionName(collection);

  if (!collectionName) {
    return NextResponse.json(
      {
        error:
          "Unsupported collection",
      },
      { status: 404 },
    );
  }

  try {
    const data =
      (await request.json()) as Record<
        string,
        unknown
      >;

    const id = String(
      data.id ?? "",
    );

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Missing content ID",
        },
        { status: 400 },
      );
    }

    const db = await getDatabase();

    const filter = ObjectId.isValid(id)
      ? {
          $or: [
            { id },
            {
              _id:
                new ObjectId(
                  id,
                ),
            },
          ],
        }
      : {
          id,
        };

    const {
      id: _ignoredId,
      createdAt: _ignoredCreatedAt,
      _id: _ignoredMongoId,
      ...changes
    } = data;

    const shouldRemoveImage =
      collection === "industries" &&
      (changes.imageUrl === null ||
        changes.imageUrl === "");

    if (shouldRemoveImage) {
      delete changes.imageUrl;
    }

    const update: {
      $set: Record<string, unknown>;
      $unset?: Record<string, "">;
    } = {
      $set: {
        ...changes,
        updatedAt: new Date(),
      },
    };

    if (shouldRemoveImage) {
      update.$unset = {
        imageUrl: "",
      };
    }

    const result =
      await db
        .collection(collectionName)
        .findOneAndUpdate(
          filter,
          update,
          {
            returnDocument:
              "after",
          },
        );

    if (!result) {
      return NextResponse.json(
        {
          error:
            "Content not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      serializeDocument(
        result as unknown as Record<
          string,
          unknown
        >,
      ),
    );
  } catch (error) {
    console.error(
      `Failed to update ${collection}:`,
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update content",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
  const { collection } =
    await context.params;

  const collectionName =
    getCollectionName(collection);

  if (!collectionName) {
    return NextResponse.json(
      {
        error:
          "Unsupported collection",
      },
      { status: 404 },
    );
  }

  try {
    const data =
      (await request.json()) as {
        id?: string;
      };

    const id = String(
      data.id ?? "",
    );

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Missing content ID",
        },
        { status: 400 },
      );
    }

    const db = await getDatabase();

    const filter = ObjectId.isValid(id)
      ? {
          $or: [
            { id },
            {
              _id:
                new ObjectId(
                  id,
                ),
            },
          ],
        }
      : {
          id,
        };

    const result =
      await db
        .collection(collectionName)
        .deleteOne(
          filter,
        );

    if (
      result.deletedCount === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Content not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      `Failed to delete ${collection}:`,
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete content",
      },
      { status: 400 },
    );
  }
}