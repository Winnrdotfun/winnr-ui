import postgres from "postgres";

export async function POST(request: Request) {
  const connectionString = process.env.DATABASE_URL as string;
  const sql = postgres(connectionString);

  const params = await request.json();

  if (!validateParams(params)) {
    return new Response("Invalid parameters", { status: 400 });
  }

  const codeData = (
    await sql`SELECT invite_code, wallet_address FROM winnr_codes WHERE invite_code = ${params.inviteCode}`
  )?.[0];

  if (!codeData) {
    return new Response("Code not found", { status: 404 });
  }

  if (
    codeData["wallet_address"] &&
    codeData["wallet_address"] !== params.walletAddress
  ) {
    return new Response("Code used by someone else", { status: 400 });
  }

  const result = (
    await sql`
    UPDATE winnr_codes SET wallet_address = ${params.walletAddress} WHERE invite_code = ${params.inviteCode} RETURNING invite_code, wallet_address;
  `
  )?.[0];

  return Response.json(
    {
      inviteCode: result.invite_code,
      walletAddress: result.wallet_address,
    },
    {
      headers: {
        "Set-Cookie": `invite_code=${params.inviteCode}; Path=/;`,
      },
    }
  );
}

const validateParams = ({
  inviteCode,
  walletAddress,
}: {
  inviteCode?: string;
  walletAddress?: string;
}) => {
  let isValid = true;

  if (!inviteCode || !walletAddress) {
    isValid = false;
  }

  if (typeof walletAddress !== "string") {
    isValid = false;
  }

  if (walletAddress?.length !== 44) {
    isValid = false;
  }

  return isValid;
};
