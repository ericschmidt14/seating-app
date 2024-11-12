import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  if (data.password !== process.env.PASSWORD) {
    return new NextResponse(null, { status: 401 });
  } else {
    return new NextResponse(new Date().toISOString(), { status: 200 });
  }
}
