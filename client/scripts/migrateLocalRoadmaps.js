// Migration helper - run this in the browser console on the client while logged in.
// It will read localStorage roadmaps and POST them to the server API using the
// Supabase session token available to the running app.

(async function migrateLocalRoadmaps() {
  if (!window.localStorage) {
    console.error("localStorage not available");
    return;
  }

  const keys = Object.keys(localStorage).filter((k) => k.startsWith("degreemap.roadmaps.item."));
  if (!keys.length) {
    console.info("No local roadmaps found");
    return;
  }

  if (!confirm(`Found ${keys.length} local roadmap(s). Continue and POST them to server?`)) return;

  const apiBase =
    window.__DEGREEMAP_API_URL__ || `${window.location.origin.replace(/:\d+$/, ":5000")}/api`;
  const supabase = window.supabase;

  const getToken = async () => {
    try {
      if (supabase && supabase.auth && supabase.auth.getSession) {
        const s = await supabase.auth.getSession();
        return s?.data?.session?.access_token;
      }
    } catch (e) {
      // ignore
    }
    return null;
  };

  const token = await getToken();
  if (!token) {
    if (
      !confirm(
        "No Supabase session detected. You must be logged in for migration to attach roadmaps to your account. Continue and POST anonymously?"
      )
    ) {
      return;
    }
  }

  for (const k of keys) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const roadmap = JSON.parse(raw);
      const res = await fetch(apiBase.replace(/\/api$/, "") + "/api/roadmaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title: roadmap.title, nodes: roadmap.nodes, edges: roadmap.edges }),
      });
      const data = await res.json().catch(() => null);
      console.log("Migrated", k, "->", res.status, data);
    } catch (err) {
      console.error("Failed to migrate", k, err);
    }
  }

  alert("Migration complete — check server logs and /api/roadmaps/mine to verify.");
})();
