import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/event/publish - Route to receive analytics events
 * @param request - The request object
 * @returns - 200 OK
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Analytics event:", data);
    return NextResponse.json("OK", { status: 200 });
  } catch (error) {
    console.error("Failed to process analytics event:", error);
    return NextResponse.json("OK", { status: 200 });
  }
}
