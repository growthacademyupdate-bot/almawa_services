import { NextResponse } from "next/server";

export const runtime = "nodejs";

type GeoNamesPlace = {
  geonameId: number;
  name: string;
  countryName: string;
  countryCode?: string;
  adminName1?: string;
};

export async function GET(request: Request) {
  const username = process.env.GEONAMES_USERNAME;
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (!username) {
    return NextResponse.json({ error: "GeoNames is not configured" }, { status: 500 });
  }
  if (query.length < 2) return NextResponse.json({ places: [] });

  const params = new URLSearchParams({
    name_startsWith: query,
    country: "IN",
    featureClass: "P",
    maxRows: "10",
    username,
    style: "FULL",
  });

  try {
    const response = await fetch(`https://secure.geonames.org/searchJSON?${params}`, {
      next: { revalidate: 3600 },
    });
    const data = (await response.json()) as {
      geonames?: GeoNamesPlace[];
      status?: { message?: string };
    };
    if (!response.ok) {
      throw new Error(data.status?.message ?? `GeoNames responded with ${response.status}`);
    }
    if (data.status) throw new Error(data.status.message ?? "GeoNames request failed");

    return NextResponse.json({
      places: (data.geonames ?? []).map(({ geonameId, name, countryName, countryCode, adminName1 }) => ({
        geonameId,
        name,
        countryName: countryName ?? (countryCode === "IN" ? "India" : ""),
        adminName1,
      })),
    });
  } catch (error) {
    console.error("Failed to load GeoNames places", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load locations",
      },
      { status: 502 },
    );
  }
}