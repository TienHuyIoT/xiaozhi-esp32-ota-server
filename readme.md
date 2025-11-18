# OTA Server trên Cloudflare Workers

- Link cập nhật OTA
[https://ota-server.xiaozhi-ota.workers.dev/ota](https://ota-server.xiaozhi-ota.workers.dev/ota)

Đây là hướng dẫn tạo một **OTA server** đơn giản trên **Cloudflare Workers** để ESP32 hoặc thiết bị IoT có thể **GET/POST** lấy file `ota.json`.

---

## 1. Yêu cầu

- Máy tính đã cài **Node.js** (với npm)  
  - Kiểm tra:
    ```bash
    node -v
    npm -v
    ```
- Tài khoản **Cloudflare** (miễn phí được)
- Wrangler CLI:
    ```bash
    npm install -g wrangler
    ```

---

## 2. Tạo project Workers

```bash
mkdir ota-server
cd ota-server
wrangler init .
```

- Chọn TypeScript khi được hỏi (mặc định)
- Project sẽ tạo:
  ```
  src/index.ts
  wrangler.toml
  package.json
  tsconfig.json
  ```

---

## 3. Thêm file OTA

Tạo file `ota.json` ở **root project** (cùng cấp với `wrangler.toml`):

```json
{
  "version": "1.0.2",
  "url": "https://example.com/fw.bin"
}
```

---

## 4. Sửa code Worker (`src/index.ts`)

```ts
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // GET/POST /ota trả về file ota.json
    if (url.pathname === "/ota" || url.pathname === "/ota/") {
      const data = await import("../ota.json");
      return new Response(JSON.stringify(data.default), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
```

---

## 5. Test local

Chạy:

```bash
wrangler dev
```

- Mặc định server chạy ở: `http://127.0.0.1:8787`

Test GET:

```bash
curl http://127.0.0.1:8787/ota
```

Test POST:

```bash
curl -X POST http://127.0.0.1:8787/ota
```

Cả hai đều trả về nội dung `ota.json`.

---

## 6. Deploy lên Cloudflare

```bash
wrangler deploy
```

Sau khi deploy, terminal sẽ trả link như:

```
https://ota-server.<tên-bạn>.workers.dev/ota
```

Test GET/POST:

```bash
curl https://ota-server.<tên-bạn>.workers.dev/ota
curl -X POST https://ota-server.<tên-bạn>.workers.dev/ota
```

---

## 7. Thay đổi file OTA

Nếu bạn update `ota.json`, chỉ cần:

```bash
wrangler deploy
```

→ Link `/ota` luôn trả phiên bản mới nhất.

---

## 8. Tùy chọn nâng cao

- **CORS** để ESP32 fetch từ bất kỳ nguồn
- **Route `/ota/` nhận cả slash cuối**
- **Token xác thực** để bảo mật OTA

---

> Hướng dẫn này dùng **gói Cloudflare Workers Free**, đủ cho **100k requests/ngày**, hoàn toàn miễn phí cho OTA server nhỏ.

