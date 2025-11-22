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

// Function to compare version strings (e.g., "2.0.4" vs "2.0.5")
function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);
  
  const maxLength = Math.max(v1Parts.length, v2Parts.length);
  
  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    
    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }
  
  return 0; // versions are equal
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
          const serverEnable = data.default?.firmware?.enable;
          
          // Get version from client (in application object)
          const clientVersion = requestBody?.application?.version;
          
          // Get version from ota.json (in firmware object)
          const serverVersion = data.default?.firmware?.version;
          
          // Compare names
          if (clientName && clientName === serverName && serverEnable) {
            // Create response data (deep copy to avoid mutation)
            const responseData = JSON.parse(JSON.stringify(data.default));
            
            // Compare versions - if client version > server version, set force = 1
            if (clientVersion && serverVersion && compareVersions(clientVersion, serverVersion) > 0) {
              if (responseData.firmware) {
                responseData.firmware.force = 1;
              }
            }
            
            // Return JSON response
            return new Response(JSON.stringify(responseData), {
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

    // Handle GET/POST /ota.json
    if (url.pathname === "/ota_v2" || url.pathname === "/ota_v2/") {
      // Import JSON file
      const data = await import("../ota_v2.json");

      // Handle POST request
      if (request.method === "POST") {
        try {
          // Parse JSON body from request
          const requestBody = await request.json() as RequestBody;
          
          // Get name from client (in board object)
          const clientName = requestBody?.board?.name;
          
          // Get name from ota.json (in firmware object)
          const serverName = data.default?.firmware?.name;
          const serverEnable = data.default?.firmware?.enable;
          
          // Get version from client (in application object)
          const clientVersion = requestBody?.application?.version;
          
          // Get version from ota.json (in firmware object)
          const serverVersion = data.default?.firmware?.version;
          
          // Compare names
          if (clientName && clientName === serverName && serverEnable) {
            // Create response data (deep copy to avoid mutation)
            const responseData = JSON.parse(JSON.stringify(data.default));
            
            // Compare versions - if client version > server version, set force = 1
            if (clientVersion && serverVersion && compareVersions(clientVersion, serverVersion) > 0) {
              if (responseData.firmware) {
                responseData.firmware.force = 1;
              }
            }
            
            // Return JSON response
            return new Response(JSON.stringify(responseData), {
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