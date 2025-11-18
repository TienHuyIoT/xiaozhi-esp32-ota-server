// Type definition cho request body
interface RequestBody {
  board?: {
    name?: string;
    type?: string;
    [key: string]: any;
  };
  application?: {
    name?: string;
    version?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Handle GET/POST /ota.json
    if (url.pathname === "/ota" || url.pathname === "/ota/") {
      // Import JSON file
      const data = await import("../ota.json");

      // Handle POST request
      if (request.method === "POST") {
        try {
          // Parse JSON body from request
          const requestBody = await request.json() as RequestBody;
          
          // Get name from client (in board object)
          const clientName = requestBody?.board?.name;
          
          // Get name from ota.json (in firmware object)
          const serverName = data.default?.firmware?.name;
          
          // Compare names
          if (clientName && clientName === serverName) {
            // Return normal JSON if matched
            return new Response(JSON.stringify(data.default), {
              headers: {
                "Content-Type": "application/json",
              },
            });
          } else {
            // If not matched, return JSON but set url = ""
            const responseData = { ...data.default };
            if (responseData.firmware) {
              responseData.firmware.url = "";
            }
            return new Response(JSON.stringify(responseData), {
              headers: {
                "Content-Type": "application/json",
              },
            });
          }
        } catch (error) {
          // If there is an error parsing JSON, return JSON but set url = ""
          const responseData = { ...data.default };
          if (responseData.firmware) {
            responseData.firmware.url = "";
          }
          return new Response(JSON.stringify(responseData), {
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      }

      // Handle GET request (return normal JSON)
      return new Response(JSON.stringify(data.default), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};