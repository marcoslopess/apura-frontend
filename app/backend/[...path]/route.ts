import { NextRequest } from "next/server";

// Proxy server-side para o backend Apura. O navegador chama /backend/... (mesma origem)
// e este handler encaminha ao backend real, evitando bloqueio de CORS.
export const dynamic = "force-dynamic";

const BACKEND = process.env.BACKEND_ORIGIN || "https://api.apura.veltarc.com.br";

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const search = req.nextUrl.search || "";
  const target = `${BACKEND}/${(path ?? []).join("/")}${search}`;
  try {
    const res = await fetch(target, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "proxy_failed", target }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const target = `${BACKEND}/${(path ?? []).join("/")}${req.nextUrl.search || ""}`;
  try {
    const res = await fetch(target, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: await req.text(),
      cache: "no-store",
    });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") || "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "proxy_failed", target }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
