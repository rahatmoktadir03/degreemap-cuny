/* Simple registration test runner for local server */
(async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test+regrun@local.test",
        password: "TestPass123!",
        name: "Test Run",
      }),
    });
    const text = await res.text();
    console.log("HTTP", res.status);
    console.log(text);
  } catch (err) {
    console.error("REQUEST ERROR", err);
    process.exit(2);
  }
})();
