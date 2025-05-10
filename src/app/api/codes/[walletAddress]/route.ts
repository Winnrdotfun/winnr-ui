import postgres from "postgres";

const connectionString = process.env.DATABASE_URL as string;

export async function GET(request: Request) {
  const sql = postgres(connectionString);

  // Extract walletAddress from url
  const walletAddress = request.url.split("/").pop();

  if (!walletAddress) {
    return new Response("Invalid parameters: walletAddress is required", {
      status: 400,
    });
  }

  // Query the database using walletAddress
  const codeData = (
    await sql`SELECT invite_code, wallet_address FROM winnr_codes WHERE wallet_address = ${walletAddress}`
  )?.[0];

  if (!codeData) {
    return new Response("Wallet address not found", { status: 404 });
  }

  // Return the matching record
  return Response.json({
    inviteCode: codeData.invite_code,
    walletAddress: codeData.wallet_address,
  });
}
