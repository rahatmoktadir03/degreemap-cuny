// Vercel serverless entry. Catch-all so every /api/* request reaches the
// Express app with its full path intact. We import the compiled output
// (server/dist) — plain ESM JS with native .js resolution — to avoid esbuild
// choking on the project's .js-specifier TypeScript imports.
import app from "../dist/index.js";

export default app;
