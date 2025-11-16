import { getValidAccessToken } from "@/lib/auth";
import { NextResponse } from "next/server";

const RESOURCE_URL = "http://localhost:8080/api/users/me";

export const GET = async () => {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(RESOURCE_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    const body = await res.text();

    const contentType = res.headers.get("Content-Type") || "text/plain";

    return new NextResponse(body, {
      status: res.status,
      statusText: res.statusText,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
