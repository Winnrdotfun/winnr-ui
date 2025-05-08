export const dynamic = "force-static";

export async function GET() {
  const data = { status: "ok" };
  return Response.json({ data });
}
