import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const displayHost = HOST === "0.0.0.0" ? "localhost" : HOST;

function getAppInfo() {
  try {
    const pkgPath = path.join(process.cwd(), "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const name = pkg.displayName || (pkg.name ? pkg.name.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()).replace(/3d\b/i, "3D") : "Starpedia 3D");
      return {
        name,
        version: pkg.version || "2.6.0"
      };
    }
  } catch {
    // fallback if file read fails
  }
  return { name: "Starpedia 3D", version: "2.6.0" };
}

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Vite middleware & Static Serving
async function startServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
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

    const appInfo = getAppInfo();
    app.listen(PORT, HOST, () => {
      console.log(`${appInfo.name} (v${appInfo.version}) server running on http://${displayHost}:${PORT}`);
    });
  } catch (error) {
    console.error("Fatal error starting server:", error);
    process.exit(1);
  }
}

startServer();
