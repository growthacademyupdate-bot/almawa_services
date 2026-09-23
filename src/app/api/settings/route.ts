import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { defaultSettings } from "@/mock/data";

const SETTINGS_KEY = "almawa_settings";

export async function GET() {
  try {
    const db = await getDatabase();

    const settings = await db
      .collection("settings")
      .findOne({ key: SETTINGS_KEY });

    return NextResponse.json({
      ...defaultSettings,
      ...(settings ?? {}),
      _id: undefined,
      key: undefined,
    });
  } catch (error) {
    console.error("Failed to load settings:", error);

    return NextResponse.json(
      defaultSettings,
      { status: 200 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const nextSettings = {
      companyName: typeof body.companyName === "string" ? body.companyName.trim() : defaultSettings.companyName,
      tagline: typeof body.tagline === "string" ? body.tagline.trim() : defaultSettings.tagline,
      phone: typeof body.phone === "string" ? body.phone.trim() : defaultSettings.phone,
      phoneTwo: typeof body.phoneTwo === "string" ? body.phoneTwo.trim() : defaultSettings.phoneTwo,
      email: typeof body.email === "string" ? body.email.trim() : defaultSettings.email,
      address: typeof body.address === "string" ? body.address.trim() : defaultSettings.address,
      social: {
        ...defaultSettings.social,
        ...(body.social && typeof body.social === "object" ? body.social : {}),
      },
      seoTitle: typeof body.seoTitle === "string" ? body.seoTitle.trim() : defaultSettings.seoTitle,
      seoDescription: typeof body.seoDescription === "string" ? body.seoDescription.trim() : defaultSettings.seoDescription,
      maintenanceMode: Boolean(body.maintenanceMode),
    };

    const db = await getDatabase();

    await db.collection("settings").updateOne(
      { key: SETTINGS_KEY },
      {
        $set: {
          key: SETTINGS_KEY,
          ...nextSettings,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({
      success: true,
      ...nextSettings,
    });
  } catch (error) {
    console.error("Failed to update settings:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update settings",
      },
      { status: 500 },
    );
  }
}