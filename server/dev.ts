import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start the Express server
const server = spawn("tsx", ["server/index.ts"], {
  cwd: resolve(__dirname, ".."),
  stdio: "inherit",
  shell: true,
});

server.on("error", (error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

process.on("SIGINT", () => {
  server.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  server.kill();
  process.exit(0);
});

