(() => {
  const data = window.OT_SPEC_INSPECTOR_DATA;
  if (!data?.specs?.length) return;

  const LAYOUT_KEY = "ot.spec-inspector.layout.v2";
  const MIN_WIDTH = 300;
  const MIN_HEIGHT = 240;
  const specsById = new Map(data.specs.map(spec => [spec.id, spec]));
  const embedded = document.documentElement.classList.contains("embedded");
  const currentModule = (() => {
    const explicit = document.body.dataset.specModule;
    if (explicit) return explicit;
    const parts = location.pathname.split("/").filter(Boolean);
    const index = parts.lastIndexOf("index.html");
    if (index > 0) return parts[index - 1];
    if (parts.at(-1) === "paper-aligned.html") return "assessment";
    if (parts.at(-2) === "icp") return "icp";
    return "shell";
  })();

  const style = document.createElement("style");
  style.textContent = `
    .spec-hover-target {
      outline: 2px solid #0f766e !important;
      outline-offset: 2px !important;
    }
    .ot-spec-toggle-button {
      min-height: 32px;
      border: 1px solid #b7ded7;
      border-radius: 7px;
      background: #edf8f5;
      color: #115e59;
      padding: 5px 9px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font: inherit;
      font-size: 10px;
      font-weight: 800;
      white-space: nowrap;
    }
    .ot-spec-toggle-button:hover { background: #def2ee; }
    .ot-spec-toggle-button[aria-expanded="true"] {
      border-color: #0f766e;
      box-shadow: 0 0 0 1px #0f766e inset;
    }
    .ot-spec-toggle-button svg {
      width: 15px;
      height: 15px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .ot-spec-inspector {
      position: fixed;
      z-index: 1200;
      display: none;
      grid-template-rows: minmax(0, 1fr) auto;
      min-width: ${MIN_WIDTH}px;
      min-height: ${MIN_HEIGHT}px;
      max-width: calc(100vw - 16px);
      max-height: calc(100vh - 16px);
      color: #172033;
      background: #fff;
      border: 1px solid #cdd8e2;
      border-radius: 8px;
      box-shadow: 0 14px 34px rgba(15, 23, 42, .18);
      font-family: "Microsoft JhengHei", "Noto Sans TC", Arial, sans-serif;
      font-size: 12px;
      line-height: 1.45;
      overflow: hidden;
    }
    .ot-spec-inspector.is-open { display: grid; }
    .ot-spec-inspector.is-dragging {
      user-select: none;
      cursor: grabbing;
    }
    .ot-spec-inspector.is-resizing {
      user-select: none;
      cursor: nwse-resize;
    }
    .ot-spec-content {
      min-height: 0;
      overflow: auto;
      overscroll-behavior: contain;
      padding: 9px;
    }
    .ot-spec-empty {
      color: #64748b;
      padding: 10px 4px;
      text-align: center;
    }
    .ot-spec-card + .ot-spec-card {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e8edf2;
    }
    .ot-spec-card-head {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 6px;
    }
    .ot-spec-id {
      color: #115e59;
      font-family: "SFMono-Regular", Consolas, monospace;
      font-size: 11px;
      font-weight: 800;
    }
    .ot-spec-kind {
      border-radius: 999px;
      background: #eef2f6;
      color: #475569;
      padding: 2px 7px;
      font-size: 9px;
      font-weight: 800;
      white-space: nowrap;
    }
    .ot-spec-rule {
      margin: 0 0 8px;
      color: #101827;
      font-size: 12px;
      font-weight: 700;
    }
    .ot-spec-meta {
      display: grid;
      grid-template-columns: 62px minmax(0, 1fr);
      gap: 3px 7px;
      margin: 0;
      padding: 7px;
      border-radius: 6px;
      background: #f8fafb;
    }
    .ot-spec-meta dt { color: #64748b; font-weight: 700; }
    .ot-spec-meta dd { margin: 0; color: #243047; }
    .ot-spec-field-group { margin-top: 8px; }
    .ot-spec-field-label {
      display: block;
      margin-bottom: 4px;
      color: #64748b;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: .04em;
      text-transform: uppercase;
    }
    .ot-spec-chip-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .ot-spec-chip {
      border: 1px solid #d5e0e6;
      border-radius: 999px;
      background: #fff;
      color: #334155;
      padding: 2px 6px;
      font-family: "SFMono-Regular", Consolas, monospace;
      font-size: 9px;
      font-weight: 800;
    }
    .ot-spec-chip[data-field-defined="true"] {
      border-color: #b6d8d3;
      background: #f0f8f6;
      color: #115e59;
    }
    .ot-spec-details {
      margin-top: 8px;
      border-top: 1px solid #e8edf2;
      padding-top: 6px;
    }
    .ot-spec-details summary {
      cursor: pointer;
      color: #334155;
      font-size: 10px;
      font-weight: 800;
    }
    .ot-spec-detail-list {
      display: grid;
      gap: 5px;
      margin: 6px 0 0;
      padding: 0;
      list-style: none;
    }
    .ot-spec-detail-list li {
      border-left: 2px solid #d5e0e6;
      padding-left: 7px;
      color: #475569;
      font-size: 10px;
    }
    .ot-spec-browse-list { display: grid; gap: 4px; }
    .ot-spec-browse-button {
      width: 100%;
      border: 1px solid #e0e7ed;
      border-radius: 5px;
      background: #fff;
      padding: 6px 7px;
      color: #243047;
      text-align: left;
    }
    .ot-spec-browse-button:hover {
      background: #f2f8f7;
      border-color: #b9d8d3;
    }
    .ot-spec-browse-button strong {
      display: block;
      color: #115e59;
      font-family: "SFMono-Regular", Consolas, monospace;
      font-size: 10px;
    }
    .ot-spec-browse-button span {
      display: block;
      overflow: hidden;
      color: #64748b;
      font-size: 10px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ot-spec-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-height: 29px;
      padding: 5px 8px;
      border-top: 1px solid #e7edf2;
      color: #94a3b8;
      font-size: 9px;
    }
    .ot-spec-reset {
      border: 0;
      background: transparent;
      color: #64748b;
      padding: 2px;
      font-size: 9px;
      font-weight: 800;
    }
    .ot-spec-resizer {
      position: absolute;
      right: 2px;
      bottom: 2px;
      width: 16px;
      height: 16px;
      cursor: nwse-resize;
      touch-action: none;
    }
    .ot-spec-resizer::before,
    .ot-spec-resizer::after {
      content: "";
      position: absolute;
      right: 3px;
      bottom: 3px;
      background: #94a3b8;
      transform: rotate(-45deg);
      transform-origin: right bottom;
    }
    .ot-spec-resizer::before { width: 9px; height: 1px; }
    .ot-spec-resizer::after { width: 5px; height: 1px; bottom: 7px; }
    @media (max-width: 620px) {
      .ot-spec-inspector {
        max-width: calc(100vw - 12px);
      }
    }
  `;
  document.head.append(style);

  function parseIds(element) {
    if (!element?.getAttribute) return [];
    const value = element.getAttribute("data-spec-ids") || element.getAttribute("data-spec-id") || "";
    return value
      .split(/[\s,]+/)
      .map(id => id.trim())
      .filter(Boolean);
  }

  function closestMapping(target) {
    if (!(target instanceof Element)) return null;
    const mapped = target.closest("[data-spec-ids], [data-spec-id]");
    const ignored = target.closest("[data-spec-coverage-ignore]");
    if (ignored && (!mapped || mapped.contains(ignored))) return null;
    return mapped;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  if (embedded) {
    let lastMapped = null;
    let clearTimer = null;
    const setMapped = element => {
      if (lastMapped === element) return;
      lastMapped?.classList.remove("spec-hover-target");
      lastMapped = element;
      lastMapped?.classList.add("spec-hover-target");
    };
    const post = (action, element, ids) => {
      if (parent === window) return;
      parent.postMessage({
        type: "ot-spec-inspector",
        action,
        ids,
        module: currentModule,
        sourceText: element?.getAttribute("aria-label")
          || element?.getAttribute("title")
          || String(element?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100)
      }, "*");
    };
    const show = (element, action) => {
      const mapped = closestMapping(element);
      if (!mapped) return;
      const ids = parseIds(mapped).filter(id => specsById.has(id));
      if (!ids.length) return;
      if (clearTimer) clearTimeout(clearTimer);
      setMapped(mapped);
      post(action, mapped, ids);
    };
    document.addEventListener("pointerover", event => show(event.target, "hover"));
    document.addEventListener("pointerout", event => {
      const mapped = closestMapping(event.target);
      if (!mapped) return;
      if (event.relatedTarget instanceof Node && mapped.contains(event.relatedTarget)) return;
      if (clearTimer) clearTimeout(clearTimer);
      clearTimer = setTimeout(() => {
        setMapped(null);
        post("clear", null, []);
      }, 120);
    });
    document.addEventListener("focusin", event => show(event.target, "focus"));
    document.addEventListener("focusout", () => {
      if (clearTimer) clearTimeout(clearTimer);
      clearTimer = setTimeout(() => {
        setMapped(null);
        post("clear", null, []);
      }, 120);
    });
    return;
  }

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "ot-spec-toggle-button";
  toggleButton.dataset.specCoverageIgnore = "";
  toggleButton.setAttribute("aria-expanded", "false");
  toggleButton.setAttribute("aria-controls", "ot-spec-inspector-panel");
  toggleButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h14"></path>
      <circle cx="9" cy="7" r="1.7"></circle>
      <circle cx="15" cy="12" r="1.7"></circle>
      <circle cx="10" cy="17" r="1.7"></circle>
    </svg>
    <span>規格</span>
  `;
  const topbar = document.querySelector(".topbar");
  const topbarActions = topbar?.querySelector(".topbar-actions, .topbar-right, .actions");
  if (topbarActions) topbarActions.prepend(toggleButton);
  else topbar?.append(toggleButton);

  const inspector = document.createElement("section");
  inspector.id = "ot-spec-inspector-panel";
  inspector.className = "ot-spec-inspector";
  inspector.dataset.specCoverageIgnore = "";
  inspector.setAttribute("aria-label", "規格浮動選單");
  inspector.innerHTML = `
    <div class="ot-spec-content" data-spec-content aria-live="polite"></div>
    <div class="ot-spec-footer">
      <button class="ot-spec-reset" type="button" data-spec-reset>重設位置及大小</button>
    </div>
    <div class="ot-spec-resizer" data-spec-resizer role="separator" aria-label="調整規格選單大小"></div>
  `;
  document.body.append(inspector);

  const content = inspector.querySelector("[data-spec-content]");
  const resetButton = inspector.querySelector("[data-spec-reset]");
  const resizer = inspector.querySelector("[data-spec-resizer]");

  let activeIds = [];
  let lastMapped = null;
  let layout = null;
  let drag = null;
  let resize = null;

  function clampLayout(candidate) {
    const maxWidth = Math.max(MIN_WIDTH, innerWidth - 16);
    const maxHeight = Math.max(MIN_HEIGHT, innerHeight - 16);
    const width = Math.min(Math.max(MIN_WIDTH, candidate.width), maxWidth);
    const height = Math.min(Math.max(MIN_HEIGHT, candidate.height), maxHeight);
    const left = Math.min(Math.max(8, candidate.left), Math.max(8, innerWidth - width - 8));
    const top = Math.min(Math.max(8, candidate.top), Math.max(8, innerHeight - height - 8));
    return { left, top, width, height };
  }

  function applyLayout(candidate, persist = false) {
    layout = clampLayout(candidate);
    inspector.style.left = `${layout.left}px`;
    inspector.style.top = `${layout.top}px`;
    inspector.style.width = `${layout.width}px`;
    inspector.style.height = `${layout.height}px`;
    if (persist) {
      try {
        localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
      } catch (error) {
        // The current session remains usable without persistence.
      }
    }
  }

  function readLayout() {
    try {
      const stored = JSON.parse(localStorage.getItem(LAYOUT_KEY));
      if (
        Number.isFinite(stored?.left)
        && Number.isFinite(stored?.top)
        && Number.isFinite(stored?.width)
        && Number.isFinite(stored?.height)
      ) return stored;
    } catch (error) {
      // Fall through to the default layout.
    }
    return null;
  }

  function resetLayout() {
    const width = Math.min(372, innerWidth - 16);
    const height = Math.min(460, innerHeight - 90);
    applyLayout({
      width,
      height,
      left: innerWidth - width - 18,
      top: 74
    }, true);
  }

  function setOpen(open) {
    inspector.classList.toggle("is-open", open);
    toggleButton.setAttribute("aria-expanded", String(open));
    if (open && !activeIds.length) renderBrowse();
  }

  function openPanel() {
    setOpen(true);
  }

  function closePanel() {
    setOpen(false);
    clearHighlight();
  }

  function clearHighlight() {
    lastMapped?.classList.remove("spec-hover-target");
    lastMapped = null;
  }

  function highlight(ids) {
    clearHighlight();
    if (!ids.length) return;
    lastMapped = [...document.querySelectorAll("[data-spec-ids], [data-spec-id]")]
      .find(element => parseIds(element).some(id => ids.includes(id))) || null;
    lastMapped?.classList.add("spec-hover-target");
  }

  function specMetaRows(spec) {
    return [
      ["模組", spec.module],
      ["範圍", spec.scope],
      ["觸發", spec.trigger],
      ["條件", spec.condition]
    ].filter(([, value]) => value).map(([label, value]) => (
      `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`
    )).join("");
  }

  function fieldChips(codes) {
    return codes.map(code => {
      const field = data.fields[code];
      const title = field
        ? `${field.name}${field.option ? ` · ${field.option}` : ""}${field.notes ? ` · ${field.notes}` : ""}`
        : "Field not found in the current data specification";
      return `<span class="ot-spec-chip" data-field-defined="${Boolean(field)}" title="${escapeHtml(title)}">${escapeHtml(code)}</span>`;
    }).join("");
  }

  function specDetails(spec) {
    const tests = spec.tests.length
      ? `<details class="ot-spec-details" ${spec.tests.length === 1 ? "open" : ""}>
          <summary>測試案例 · ${spec.tests.length}</summary>
          <ul class="ot-spec-detail-list">${spec.tests.map(test => `
            <li><strong>${escapeHtml(test.id)}</strong> ${escapeHtml(test.then)}</li>
          `).join("")}</ul>
        </details>`
      : "";
    const uat = spec.uat.length
      ? `<details class="ot-spec-details">
          <summary>UAT · ${spec.uat.length}</summary>
          <ul class="ot-spec-detail-list">${spec.uat.map(item => `
            <li><strong>${escapeHtml(item.id)}</strong> ${escapeHtml(item.scenario)}<br>${escapeHtml(item.passCriteria)}</li>
          `).join("")}</ul>
        </details>`
      : "";
    const read = spec.reads.length
      ? `<div class="ot-spec-field-group"><span class="ot-spec-field-label">Reads</span><div class="ot-spec-chip-list">${fieldChips(spec.reads)}</div></div>`
      : "";
    const write = spec.writes.length
      ? `<div class="ot-spec-field-group"><span class="ot-spec-field-label">Writes</span><div class="ot-spec-chip-list">${fieldChips(spec.writes)}</div></div>`
      : "";
    return `
      <article class="ot-spec-card">
        <div class="ot-spec-card-head">
          <span class="ot-spec-id">${escapeHtml(spec.id)}</span>
          <span class="ot-spec-kind">${escapeHtml(spec.module)} · ${escapeHtml(spec.entryTypeLabel)}</span>
        </div>
        <p class="ot-spec-rule">${escapeHtml(spec.rule)}</p>
        <dl class="ot-spec-meta">${specMetaRows(spec)}</dl>
        ${read}
        ${write}
        ${tests}
        ${uat}
      </article>
    `;
  }

  function renderActive() {
    const specs = activeIds.map(id => specsById.get(id)).filter(Boolean);
    if (!specs.length) {
      renderBrowse();
      return;
    }
    content.innerHTML = specs.map(specDetails).join("");
  }

  function renderBrowse() {
    content.innerHTML = `
      <div class="ot-spec-browse-list">
        ${data.specs.map(spec => `
          <button class="ot-spec-browse-button" type="button" data-spec-pick="${escapeHtml(spec.id)}">
            <strong>${escapeHtml(spec.id)}</strong>
            <span>${escapeHtml(spec.module)} · ${escapeHtml(spec.rule)}</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  function showIds(ids) {
    if (!inspector.classList.contains("is-open")) return;
    const valid = [...new Set(ids)].filter(id => specsById.has(id));
    if (!valid.length) return;
    activeIds = valid;
    renderActive();
    highlight(valid);
  }

  function handleMappedEvent(target) {
    if (!inspector.classList.contains("is-open")) return;
    if (target instanceof Node && inspector.contains(target)) return;
    const mapped = closestMapping(target);
    if (!mapped) return;
    showIds(parseIds(mapped));
  }

  document.addEventListener("pointerover", event => handleMappedEvent(event.target));
  document.addEventListener("focusin", event => handleMappedEvent(event.target));
  document.addEventListener("pointerout", event => {
    if (closestMapping(event.target)) clearHighlight();
  });

  window.addEventListener("message", event => {
    if (event.source === window || event.data?.type !== "ot-spec-inspector") return;
    if (event.data.action === "clear") {
      clearHighlight();
      return;
    }
    showIds(event.data.ids || []);
  });

  toggleButton.addEventListener("click", () => {
    const open = !inspector.classList.contains("is-open");
    if (open) {
      activeIds = [];
      renderBrowse();
    }
    setOpen(open);
  });

  resetButton.addEventListener("click", resetLayout);

  content.addEventListener("click", event => {
    const pick = event.target.closest("[data-spec-pick]");
    if (!pick) return;
    showIds([pick.dataset.specPick]);
  });

  function isInteractiveTarget(target) {
    return Boolean(target.closest("button, a, input, select, textarea, summary, [data-spec-resizer]"));
  }

  inspector.addEventListener("pointerdown", event => {
    if (event.button !== 0 || isInteractiveTarget(event.target)) return;
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: layout.left,
      top: layout.top,
      moved: false
    };
    inspector.setPointerCapture(event.pointerId);
  });

  inspector.addEventListener("pointermove", event => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    drag.moved = true;
    inspector.classList.add("is-dragging");
    applyLayout({
      ...layout,
      left: drag.left + dx,
      top: drag.top + dy
    });
  });

  function finishDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (drag.moved) applyLayout(layout, true);
    drag = null;
    inspector.classList.remove("is-dragging");
  }
  inspector.addEventListener("pointerup", finishDrag);
  inspector.addEventListener("pointercancel", finishDrag);

  resizer.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    event.preventDefault();
    resize = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      width: layout.width,
      height: layout.height
    };
    resizer.setPointerCapture(event.pointerId);
    inspector.classList.add("is-resizing");
  });

  resizer.addEventListener("pointermove", event => {
    if (!resize || event.pointerId !== resize.pointerId) return;
    applyLayout({
      ...layout,
      width: resize.width + event.clientX - resize.startX,
      height: resize.height + event.clientY - resize.startY
    });
  });

  function finishResize(event) {
    if (!resize || event.pointerId !== resize.pointerId) return;
    resize = null;
    inspector.classList.remove("is-resizing");
    applyLayout(layout, true);
  }
  resizer.addEventListener("pointerup", finishResize);
  resizer.addEventListener("pointercancel", finishResize);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closePanel();
  });

  window.addEventListener("resize", () => {
    applyLayout(layout || {
      left: 8,
      top: 74,
      width: Math.min(372, innerWidth - 16),
      height: Math.min(460, innerHeight - 90)
    });
  });

  const storedLayout = readLayout();
  if (storedLayout) applyLayout(storedLayout);
  else resetLayout();
})();
