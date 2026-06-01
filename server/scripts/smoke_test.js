const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

async function run() {
  const base = process.env.API_BASE || "http://localhost:5000";
  try {
    const r = await fetch(`${base}/api/health`);
    const j = await r.json();
    console.log("health:", j);
    process.exit(0);
  } catch (err) {
    console.error("smoke test failed:", err);
    process.exit(2);
  }
}

run();
