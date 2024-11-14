import { authOptions } from "@/app/auth";
import { FCN_WEB_API } from "@/app/constants";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  const res = await fetch(`${FCN_WEB_API}/occupants`, {
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
