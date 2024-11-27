import { authOptions } from "@/app/lib/auth";
import { FCN_WEB_API } from "@/app/lib/constants";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  const { searchParams } = new URL(req.url || "");
  const date = searchParams.get("date") || "";

  const res = await fetch(`${FCN_WEB_API}/game${date ? `/${date}` : ""}`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json; charset=UTF-8",
    },
    cache: "no-store",
  });
  const data = await res.json();
  return Response.json(data);
}
