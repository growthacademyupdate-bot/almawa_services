import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

const SETTINGS_KEY = "almawa_settings";

export async function GET() {
  try {
    const db = await getDatabase();

    const settings = await db
      .collection("settings")
      .findOne({ key: SETTINGS_KEY });

    return NextResponse.json({
      maintenanceMode: settings?.maintenanceMode ?? false,
    });
  } catch (error) {
    console.error("Failed to load settings:", error);

    return NextResponse.json(
      { maintenanceMode: false },
      { status: 200 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const maintenanceMode = Boolean(body.maintenanceMode);

    const db = await getDatabase();

    await db.collection("settings").updateOne(
      { key: SETTINGS_KEY },
      {
        $set: {
          key: SETTINGS_KEY,
          maintenanceMode,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({
      success: true,
      maintenanceMode,
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