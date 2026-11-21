(() => {
  const style = document.createElement("style");
  style.textContent = `
    .nav small { display: none !important; }
    .brand-sub { display: none !important; }
    .top-meta { display: none !important; }
    .app:not(.app-frame) { grid-template-columns: 180px minmax(0, 1fr) !important; }
    .app > .sidebar {
      position: sticky !important;
      top: 0;
      align-self: start;
      height: 100vh;
      overflow: auto;
    }
    .topbar {
      position: sticky !important;
      top: 0;
      z-index: 40;
    }
    .resident-summary-card {
      position: sticky !important;
      top: 0;
      align-self: start;
    }
    .shared-nav-icon {
      width: 17px;
      height: 17px;
      flex: 0 0 17px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .nav button {
      display: flex;
      align-items: center;
      justify-content: flex-start !important;
      gap: 9px;
      text-align: left;
    }
    .nav button > span { min-width: 0; }
    .shared-sidebar-toggle {
      margin-top: auto;
      width: 100%;
      min-height: 34px;
      border: 0 !important;
      border-radius: 7px;
      background: transparent;
      color: var(--muted);
      padding: 6px 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 7px;
      font-size: 11px;
      font-weight: 800;
    }
    .shared-sidebar-toggle .shared-nav-icon {
      flex: 0 0 17px;
    }
    .app:not(.app-frame).sidebar-collapsed { grid-template-columns: 68px minmax(0, 1fr) !important; }
    .app:not(.app-frame).sidebar-collapsed .brand > div:last-child,
    .app:not(.app-frame).sidebar-collapsed .nav button { font-size: 0; }
    .app:not(.app-frame).sidebar-collapsed .nav button { justify-content: flex-start !important; padding-inline: 10px; }
    .app:not(.app-frame).sidebar-collapsed .nav button > span { display: none; }
    .app:not(.app-frame).sidebar-collapsed .brand { justify-content: center; padding-inline: 0; }
    .app:not(.app-frame).sidebar-collapsed .shared-sidebar-toggle span { display: none; }
    .home-pill.shared-home-picker { padding: 3px 6px; }
    .shared-home-select {
      width: 100%;
      min-width: 0;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--ink);
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    .shared-role-select {
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      font-weight: 800;
      cursor: pointer;
    }
    .shared-version-badge {
      min-height: 28px;
      border: 1px solid var(--line, #d8e1e7);
      border-radius: 6px;
      background: #fff;
      color: #475569;
      padding: 4px 7px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: "Cascadia Mono", Consolas, monospace;
      font-size: 10px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      line-height: 1;
      white-space: nowrap;
    }
    .shared-version-commit {
      padding-left: 6px;
      border-left: 1px solid var(--line, #d8e1e7);
      color: #64748b;
      font-weight: 700;
    }
    .shared-audit-toggle {
      min-height: 32px;
      border: 1px solid #b7ded7;
      border-radius: 7px;
      background: #edf8f5;
      color: var(--teal-dark, #115e59);
      padding: 5px 9px;
      font-size: 10px;
      font-weight: 800;
    }
    .shared-audit-dialog {
      width: min(760px, calc(100vw - 32px));
      max-height: min(720px, calc(100vh - 32px));
      border: 1px solid var(--line, #d8e1e7);
      border-radius: 8px;
      padding: 0;
      color: var(--ink, #111827);
      background: var(--surface, #fff);
    }
    .shared-audit-dialog::backdrop { background: rgb(15 23 42 / 45%); }
    .shared-audit-head,
    .shared-audit-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 14px;
      border-bottom: 1px solid var(--line, #d8e1e7);
    }
    .shared-audit-head h2 { margin: 0; font-size: 15px; }
    .shared-audit-list {
      max-height: 520px;
      overflow: auto;
      padding: 7px 14px;
    }
    .shared-audit-row {
      display: grid;
      grid-template-columns: 142px 118px minmax(0, 1fr);
      gap: 9px;
      padding: 8px 0;
      border-bottom: 1px solid var(--line-soft, #edf2f5);
      font-size: 10px;
    }
    .shared-audit-row span:first-child { color: var(--muted, #64748b); }
    .shared-audit-actions {
      justify-content: flex-end;
      border-top: 1px solid var(--line, #d8e1e7);
      border-bottom: 0;
    }
    .shared-runtime-banner {
      position: sticky;
      top: 0;
      z-index: 80;
      padding: 8px 14px;
      border-bottom: 1px solid #f3c56b;
      background: #fff8e6;
      color: #8a4b08;
      font-size: 11px;
      font-weight: 800;
      text-align: center;
    }
    @media (max-width: 620px) {
      .shared-audit-toggle { display: none; }
      .shared-role-select { max-width: 98px; }
      .shared-version-commit { display: none; }
    }
    html,
    body {
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }
    .app {
      height: 100vh;
      height: 100dvh;
      min-height: 0;
      overflow: hidden;
    }
    .app > .sidebar {
      min-height: 0;
      overflow-x: hidden;
      overflow-y: auto;
      overscroll-behavior: contain;
    }
    .app > .main {
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }
    .app > .main > .content {
      min-height: 0;
      overflow: auto;
      overscroll-behavior: contain;
    }
    html.embedded .app {
      display: block;
      height: 100vh;
      height: 100dvh;
      min-height: 0;
      overflow: hidden;
    }
    html.embedded .main {
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }
    html.embedded .content {
      height: 100%;
      min-height: 0;
    }
    body:has(.todo-panel) .app > .main > .content {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    body:has(.todo-panel) .workspace {
      flex: 1 1 auto;
      min-height: 0;
      align-items: stretch;
    }
    body:has(.todo-panel) .todo-panel {
      min-height: 0;
      display: grid;
      grid-template-rows: auto auto minmax(0, 1fr);
    }
    body:has(.todo-panel) .todo-list {
      min-height: 0;
      overflow: auto;
      overscroll-behavior: contain;
    }
    body:has(.todo-panel) .handover-panel {
      height: 100%;
      max-height: none;
    }
    body:has(.schedule-panel) .app > .main > .content {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    body:has(.schedule-panel) .workbench {
      flex: 1 1 auto;
      min-height: 0;
      height: auto;
    }
    @media print {
      html,
      body {
        height: auto;
        overflow: visible;
      }
      .app,
      .app > .main,
      .app > .main > .content {
        height: auto;
        min-height: 0;
        overflow: visible;
      }
    }
  `;
  document.head.append(style);

  const topbarElement = document.querySelector(".topbar");
  const topbarSpecIds = new Set(
    String(topbarElement?.dataset.specIds || "")
      .split(/[\s,]+/)
      .filter(Boolean)
  );
  topbarSpecIds.add("BH-GLOBAL-003");
  if (topbarElement) topbarElement.dataset.specIds = [...topbarSpecIds].join(",");
  const main = document.querySelector("main") || document.querySelector(".main");
  if (main) {
    if (!main.id) main.id = "main-content";
    if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");

    const skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = `#${main.id}`;
    skipLink.textContent = "跳至主要內容";
    skipLink.dataset.specCoverageIgnore = "";
    skipLink.addEventListener("click", event => {
      event.preventDefault();
      main.focus({ preventScroll: true });
      main.scrollIntoView({ block: "start" });
    });
    document.body.prepend(skipLink);
  }

  document.querySelectorAll(".nav button.active").forEach(button => {
    button.setAttribute("aria-current", "page");
  });

  const runtimeBanner = document.createElement("div");
  runtimeBanner.className = "shared-runtime-banner";
  runtimeBanner.setAttribute("role", "status");
  runtimeBanner.dataset.specIds = "BH-GLOBAL-006";
  runtimeBanner.hidden = true;
  document.body.prepend(runtimeBanner);
  const updateRuntimeBanner = () => {
    const phone = window.matchMedia("(max-width: 620px)").matches;
    const offline = !navigator.onLine;
    runtimeBanner.hidden = !phone && !offline;
    runtimeBanner.textContent = offline
      ? "目前離線。第一版不提供離線資料輸入，請改用文件化紙本備用流程。"
      : phone
        ? "第一版不支援手機資料輸入，請使用 laptop 或 tablet。"
        : "";
  };
  updateRuntimeBanner();
  window.addEventListener("online", updateRuntimeBanner);
  window.addEventListener("offline", updateRuntimeBanner);
  window.addEventListener("resize", updateRuntimeBanner);

  const routes = {
    "工作台": "workbench/index.html",
    "住客管理": "residents/index.html",
    "訓練時間表": "training/index.html",
    "復康運動紀錄": "records/index.html",
    "評估系統": "assessment/paper-aligned.html",
    "評估檔案": "assessment/paper-aligned.html",
    "ICP": "icp/worklist.html",
    "院舍設定": "settings/index.html"
  };
  const appRoot = new URL("../", document.currentScript.src);
  const iconPaths = {
    "工作台": '<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect>',
    "住客管理": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    "訓練時間表": '<rect x="3" y="4" width="18" height="17" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"></path>',
    "復康運動紀錄": '<path d="M9 11h6M9 15h6"></path><rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M8 3v2M16 3v2"></path>',
    "評估系統": '<path d="M3 19 8.2 5h1.6L15 19M5 14h7"></path><path d="m16.5 9 5 7M21.5 9l-5 7"></path>',
    "評估檔案": '<path d="M3 19 8.2 5h1.6L15 19M5 14h7"></path><path d="m16.5 9 5 7M21.5 9l-5 7"></path>',
    "ICP": '<rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M8 7h8M8 11h8M8 15h5"></path>',
    "院舍設定": '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.04.04-2.83 2.83-.04-.04A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1a1.7 1.7 0 0 0-.4-1.1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.04.04-2.83-2.83.04-.04A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1a1.7 1.7 0 0 0 1.1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.04-.04 2.83-2.83.04.04A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1a1.7 1.7 0 0 0 .4 1.1 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.04-.04 2.83 2.83-.04.04A1.7 1.7 0 0 0 19.4 9c.14.37.4.7.73.92.3.2.67.31 1.04.31H21v4h-.1a1.7 1.7 0 0 0-1.5.77Z"></path>'
  };
  const navSpecs = {
    "工作台": "BH-GLOBAL-002,BH-TODO-001,BH-HO-001",
    "住客管理": "BH-RES-001,BH-RES-002,BH-RES-004",
    "訓練時間表": "BH-006-001,BH-006-002,BH-006-003",
    "復康運動紀錄": "BH-REC-001,BH-REC-003",
    "評估系統": "BH-AX-001,BH-AX-019",
    "評估檔案": "BH-AX-001,BH-AX-019",
    "ICP": "BH-ICP-001,BH-ICP-003",
    "院舍設定": "BH-GLOBAL-001,BH-ICP-008"
  };
  const isAppShell = Boolean(document.querySelector(".app.app-frame"));
  if (!isAppShell) {
    document.querySelectorAll(".nav button").forEach(button => {
      const labelNode = button.querySelector("span") || button;
      const label = labelNode.textContent.trim();
      const target = routes[label];
      if (!target) return;
      if (navSpecs[label]) button.dataset.specIds = navSpecs[label];
      if (!button.querySelector(".shared-nav-icon")) {
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("class", "shared-nav-icon");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("aria-hidden", "true");
        icon.innerHTML = iconPaths[label] || '<circle cx="12" cy="12" r="8"></circle>';
        button.prepend(icon);
      }
      button.addEventListener("click", () => {
        window.location.href = new URL(target, appRoot).href;
      });
    });
  }

  const sidebar = document.querySelector(".app > .sidebar") || document.querySelector(".sidebar");
  const app = document.querySelector(".app");
  if (sidebar && app && !isAppShell) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "shared-sidebar-toggle";
    toggle.dataset.specCoverageIgnore = "";
    toggle.innerHTML = '<svg class="shared-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg><span>收起選單</span>';
    sidebar.append(toggle);
    const setCollapsed = collapsed => {
      app.classList.toggle("sidebar-collapsed", collapsed);
      toggle.querySelector("span").textContent = collapsed ? "展開選單" : "收起選單";
      toggle.setAttribute("aria-label", collapsed ? "展開選單" : "收起選單");
      toggle.querySelector("svg").style.transform = collapsed ? "rotate(180deg)" : "";
      try {
        localStorage.setItem("ot.shell.sidebar-collapsed", collapsed ? "1" : "0");
      } catch (error) {
        // Keep the current session usable without storage.
      }
    };
    let collapsed = false;
    try {
      collapsed = localStorage.getItem("ot.shell.sidebar-collapsed") === "1";
    } catch (error) {
      collapsed = false;
    }
    setCollapsed(collapsed);
    toggle.addEventListener("click", () => setCollapsed(!app.classList.contains("sidebar-collapsed")));
  }

  const homePill = document.querySelector(".home-pill");
  if (!isAppShell && homePill && window.OT_HOME_SETTINGS) {
    const select = document.createElement("select");
    select.className = "shared-home-select";
    select.setAttribute("aria-label", "選擇院舍");
    select.dataset.specIds = "BH-GLOBAL-001";
    select.innerHTML = OT_HOME_SETTINGS.getHomeList()
      .map(home => `<option value="${home.code}">${home.code} · ${home.name}</option>`)
      .join("");
    select.value = OT_HOME_SETTINGS.getActiveHomeCode();
    select.addEventListener("change", () => {
      OT_HOME_SETTINGS.setActiveHome(select.value);
      window.location.reload();
    });
    homePill.classList.add("shared-home-picker");
    homePill.dataset.specIds = "BH-GLOBAL-001";
    homePill.replaceChildren(select);
  }

  const userPill = document.querySelector(".user-pill");
  if (!isAppShell && userPill && window.OT_PROTOTYPE) {
    const user = OT_PROTOTYPE.currentUser();
    const avatar = userPill.querySelector(".avatar");
    userPill.replaceChildren();
    if (avatar) userPill.append(avatar);
    else {
      const replacement = document.createElement("span");
      replacement.className = "avatar";
      userPill.append(replacement);
    }
    const roleSelect = document.createElement("select");
    roleSelect.className = "shared-role-select";
    roleSelect.setAttribute("aria-label", "目前使用者");
    roleSelect.dataset.specIds = "BH-GLOBAL-004";
    roleSelect.innerHTML = `
      <option value="ot">OT · Testing</option>
      <option value="pt">PT · Testing</option>
    `;
    roleSelect.value = user.role === "PT" ? "pt" : "ot";
    roleSelect.addEventListener("change", () => {
      OT_PROTOTYPE.setCurrentUser(roleSelect.value);
      window.location.reload();
    });
    userPill.append(roleSelect);
    userPill.querySelector(".avatar").textContent = user.role === "PT" ? "P" : "T";
    userPill.title = "目前使用者";
  }

  const VERSION = "0.3.13";
  const topbarActions = document.querySelector(
    ".topbar .topbar-right, .topbar .topbar-actions, .topbar .actions"
  );
  if (topbarActions && !topbarActions.querySelector(".shared-version-badge")) {
    const versionBadge = document.createElement("span");
    versionBadge.className = "shared-version-badge";
    versionBadge.dataset.specCoverageIgnore = "";
    versionBadge.setAttribute("aria-label", "系統版本");
    const versionLabel = document.createElement("span");
    versionLabel.textContent = `v${VERSION}`;
    versionBadge.append(versionLabel);
    versionBadge.title = `OT System Prototype · v${VERSION}`;
    topbarActions.prepend(versionBadge);

    fetch(new URL("version.json", appRoot), { cache: "no-store" })
      .then(response => response.ok ? response.json() : null)
      .then(build => {
        if (!build) return;
        const deployedVersion = String(build.version || VERSION);
        const shortCommit = String(build.commit || "").slice(0, 7);
        versionLabel.textContent = `v${deployedVersion}`;
        versionBadge.querySelector(".shared-version-commit")?.remove();
        if (shortCommit && shortCommit !== "local") {
          const commitLabel = document.createElement("span");
          commitLabel.className = "shared-version-commit";
          commitLabel.textContent = shortCommit;
          versionBadge.append(commitLabel);
        }
        versionBadge.title = [
          "OT System Prototype",
          `Version ${deployedVersion}`,
          shortCommit && shortCommit !== "local" ? `Commit ${shortCommit}` : "",
          build.generatedAt ? `Built ${build.generatedAt}` : ""
        ].filter(Boolean).join(" · ");
      })
      .catch(() => {
        // The bundled version remains visible when build metadata is unavailable.
      });
  }

  document.documentElement.classList.add("ui-system-ready");
})();
