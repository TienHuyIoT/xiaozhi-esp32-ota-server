export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Xử lý GET/POST /ota.json
    if (url.pathname === "/ota") {

      // Import file JSON
      const data = await import("../ota.json");

      return new Response(JSON.stringify(data.default), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};