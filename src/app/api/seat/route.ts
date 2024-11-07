import { FCN_WEB_API } from "@/app/constants";

export async function POST(request: Request) {
  const res = await fetch(`${FCN_WEB_API}/seat/save`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(await request.json()),
  });
  const data = await res.text();
  return Response.json(data);
}
