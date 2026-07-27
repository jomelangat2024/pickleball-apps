export async function onRequestGet({ params, env }) {
const row = await env.DB.prepare("SELECT data, updated_at FROM app_state WHERE app = ?").bind(params.app).first();
return Response.json(row || { data: null, updated_at: null });
}
export async function onRequestPut({ params, request, env }) {
  if (request.headers.get("x-pin") !== env.PIN) { return new Response("forbidden", { status: 403 }); }
const body = await request.json();
if (typeof body.data !== "string") { return new Response("bad request", { status: 400 }); }
await env.DB.prepare("INSERT INTO app_state (app, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(app) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at").bind(params.app, body.data, Date.now()).run();
return Response.json({ ok: true });
}
