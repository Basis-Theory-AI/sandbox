export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Analytics event:", data);
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Failed to process analytics event:", error);
    return new Response("OK", { status: 200 });
  }
}
