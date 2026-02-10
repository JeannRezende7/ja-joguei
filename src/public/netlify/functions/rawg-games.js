export default async (req) => {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") ?? "";
    const pageSize = url.searchParams.get("page_size") ?? "30";
    const ordering = url.searchParams.get("ordering") ?? "-relevance";

    const key = process.env.RAWG_KEY;
    if (!key) {
      return new Response(JSON.stringify({ error: "RAWG_KEY não configurada" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const rawgUrl =
      `https://api.rawg.io/api/games?key=${encodeURIComponent(key)}` +
      `&search=${encodeURIComponent(search)}` +
      `&page_size=${encodeURIComponent(pageSize)}` +
      `&ordering=${encodeURIComponent(ordering)}`;

    const r = await fetch(rawgUrl);
    const text = await r.text();

    return new Response(text, {
      status: r.status,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};
