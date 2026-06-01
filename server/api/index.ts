// Vercel serverless entry. A single function that serves the whole Express
// app; server/vercel.json rewrites every request here, and Express does its own
// routing from req.url (which Vercel preserves through the rewrite). We import
// the compiled output (server/dist) to avoid esbuild resolving .js-specifier TS.
import app from "../dist/index.js";

export default app;
