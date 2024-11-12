import { FCN_WEB_API } from "@/app/constants";

export async function GET() {
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
