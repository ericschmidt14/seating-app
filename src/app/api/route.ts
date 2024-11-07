import { FCN_WEB_API } from "@/app/constants";

export async function GET() {
  const res = await fetch(`${FCN_WEB_API}/seat/save`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  const data = await res.json();
  return Response.json(data);
}
