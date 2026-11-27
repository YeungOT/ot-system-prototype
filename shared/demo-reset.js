(() => {
  // Supports ?demo=fresh (or demo=reset) on any prototype page: clears all
  // prototype data for every home so the page loads the deterministic
  // seeded demo state, then strips the parameter from the URL.
  let params;
  try {
    params = new URLSearchParams(location.search);
  } catch (error) {
    return;
  }
  const mode = params.get("demo");
  if (mode !== "fresh" && mode !== "reset") return;
  try {
    const keys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key && /^(ot[0-9a-z]*\.|icp[0-9]*\.)/.test(key)) keys.push(key);
    }
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    // Without storage access the deterministic demo simply loads as-is.
  }
  params.delete("demo");
  const query = params.toString();
  try {
    history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}${location.hash}`);
  } catch (error) {
    // URL cleanup is cosmetic only.
  }
})();
