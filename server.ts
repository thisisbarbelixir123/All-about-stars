import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Vite middleware & Static Serving
async function startServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
      // Self-unregister any stale PWA service worker previously cached on localhost:3000
      const cleanupSwScript = `
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((client) => client.navigate(client.url));
  })());
});
`;
      app.get(["/sw.js", "/dev-sw.js", "/registerSW.js"], (_req, res) => {
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        res.send(cleanupSwScript);
      });

      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: false,
        },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Stellaris Star Comparator server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Fatal error starting server:", error);
    process.exit(1);
  }
}

startServer();
