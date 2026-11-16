(() => {
  const STORAGE_KEY = "ot.prototype.state.v4";
  const EVENT_NAME = "ot-prototype-state";
  const TODAY_KEY = "2026-10-23";
  const SCHEMA_VERSION = 4;
  const USERS = {
    ot: { id: "user-ot", name: "Testing", role: "OT", senior: true },
    pt: { id: "user-pt", name: "PT Testing", role: "PT", senior: false }
  };

  const clone = value => JSON.parse(JSON.stringify(value));
  const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const activeHomeCode = () => (
    window.OT_HOME_SETTINGS?.getActiveHomeCode?.() || "yt"
  );
  const parseBedCode = value => {
    const match = String(value || "").trim().toUpperCase().match(/^([A-Z])(\d+)([A-Z]?)$/);
    return match
      ? {
          bedCode: `${match[1]}${match[2]}${match[3]}`,
          floorLetter: match[1],
          bedNumber: `${match[2]}${match[3]}`,
          numeric: Number(match[2]),
          suffix: match[3]
        }
      : null;
  };
  const floorLabelForLetter = letter => ({
    A: "1樓",
    B: "2樓",
    C: "3樓",
    D: "4樓"
  })[letter] || "";

  function readRoot() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored?.version === SCHEMA_VERSION && stored.homes) return stored;
    } catch (error) {
      // A fresh deterministic state is safer than a partially parsed store.
    }
    return {
      version: SCHEMA_VERSION,
      activeHome: activeHomeCode(),
      currentUser: clone(USERS.ot),
      homes: {}
    };
  }

  let root = readRoot();

  function writeRoot(reason = "update") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
    } catch (error) {
      // The in-memory state remains usable for the current page.
    }
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { reason } }));
  }

  function audit(home, action, entityType, entityId, before, after) {
    home.audit.unshift({
      id: uid("audit"),
      at: `${TODAY_KEY} ${new Date().toLocaleTimeString("zh-HK", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      })}`,
      actorId: root.currentUser.id,
      actor: `${root.currentUser.role} · ${root.currentUser.name}`,
      homeCode: activeHomeCode(),
      action,
      entityType,
      entityId,
      before: before === undefined ? null : clone(before),
      after: after === undefined ? null : clone(after)
    });
  }

  function assessmentCode(resident, sequence = 1) {
    const month = TODAY_KEY.slice(0, 7).replace("-", "");
    return `AX-${month}-${String(sequence).padStart(3, "0")}-${resident.id.toUpperCase()}`;
  }

  function initialCycle(resident) {
    const completed = resident.icpState === "已完成";
    const assessed = completed || resident.icpState === "待填 ICP";
    return {
      id: `icp-${resident.id}`,
      residentId: resident.id,
      bed: resident.bed,
      name: resident.name,
      place: resident.place,
      dueDate: resident.icpDue,
      nextIcpType: resident.icpType || "6個月",
      activeAssessment: assessed
        ? {
            id: `AX-SEED-${resident.id.toUpperCase()}`,
            date: resident.lastAssessment,
            type: "ICP Ax"
          }
        : null,
      linkedAssessments: assessed
        ? [{
            id: `AX-SEED-${resident.id.toUpperCase()}`,
            date: resident.lastAssessment,
            type: "ICP Ax"
          }]
        : [],
      assessmentDone: assessed,
      assessmentCompletedAt: assessed ? resident.lastAssessment : null,
      icpDate: completed ? resident.lastIcp : "",
      icpOtDone: completed,
      icpPtDone: completed,
      icpOtCompletedAt: completed ? resident.lastIcp : null,
      icpPtCompletedAt: completed ? resident.lastIcp : null,
      urgentEvents: [],
      history: [],
      status: completed ? "filled" : assessed ? "fill" : "assess",
      endedAt: null,
      endReason: null
    };
  }

  function initialAssessment(resident) {
    if (!resident.lastAssessment || resident.icpState === "待評估") return [];
    return [{
      id: `ax-seed-${resident.id}`,
      code: `AX-SEED-${resident.id.toUpperCase()}`,
      residentId: resident.id,
      date: resident.lastAssessment,
      type: "ICP Ax",
      origin: "icp",
      status: "completed",
      owner: "OT / PT",
      updated: `${resident.lastAssessment} 10:00`,
      completedAt: `${resident.lastAssessment} 10:00`,
      completedBy: "OT / PT",
      cycleId: `icp-${resident.id}`,
      servesAsIcpAx: true,
      icpLinkIntent: true,
      contributors: [],
      clinical: {
        mbi: resident.mbi,
        moca: resident.moca,
        mobility: resident.mobility,
        orientation: resident.orientation,
        activities: resident.activities,
        history: resident.history
      }
    }];
  }

  function seedTasks(residents, cycles) {
    const tasks = cycles
      .filter(cycle => !cycle.icpOtDone || !cycle.icpPtDone || !cycle.assessmentDone)
      .slice(0, 10)
      .map(cycle => {
        const resident = residents.find(item => item.id === cycle.residentId);
        return {
          id: `todo-auto-${cycle.id}`,
          title: cycle.assessmentDone ? "完成 ICP 表格" : "完成 ICP 評估",
          residentId: cycle.residentId,
          owner: cycle.assessmentDone ? (!cycle.icpOtDone ? "OT" : "PT") : "OT",
          due: cycle.dueDate,
          status: "open",
          kind: "auto",
          source: "ICP 工作清單",
          sourceLink: "../icp/worklist.html?embed=1",
          generatedFrom: cycle.id,
          deferNote: resident?.status === "hospital" ? "留醫順延" : ""
        };
      });
    return tasks;
  }

  function seedHome(code) {
    const homeSettings = window.OT_HOME_SETTINGS?.getHome?.(code);
    const residents = code === activeHomeCode() && Array.isArray(window.OT_MOCK_RESIDENTS)
      ? clone(window.OT_MOCK_RESIDENTS).map(resident => {
          const parsed = parseBedCode(resident.bed);
          return {
            ...resident,
            version: Number(resident.version) || 1,
            bedHistory: resident.bedHistory || (
              parsed
                ? [{
                    id: uid("bed"),
                    from: null,
                    to: parsed.bedCode,
                    effectiveDate: resident.admissionDate || resident.timeline?.[0]?.[1] || TODAY_KEY
                  }]
                : []
            )
          };
        })
      : [];
    const transferIndex = residents.findIndex((resident, index) => (
      index > 0 && resident.place === "券位"
    ));
    if (transferIndex >= 0) {
      residents[transferIndex].previousPlace = "私位";
      residents[transferIndex].placeChangedAt = TODAY_KEY;
    }
    const cycles = residents.map(initialCycle);
    const assessments = residents.flatMap(initialAssessment);
    const tasks = seedTasks(residents, cycles);
    if (residents[0]) {
      tasks.unshift({
        id: uid("todo"),
        title: "核對上週入住退住名單",
        residentId: null,
        owner: "OT",
        due: TODAY_KEY,
        status: "open",
        kind: "auto",
        source: "每週核對",
        generatedFrom: "weekly-check"
      });
    }
    return {
      settings: clone(homeSettings || {}),
      residents,
      assessments,
      cycles,
      tasks,
      posts: [],
      schedules: [],
      records: { a: {}, c: {}, statuses: {} },
      audit: [],
      handoverEvents: [],
      handoverNotes: {},
      createdAt: new Date().toISOString()
    };
  }

  function getHomeState(code = activeHomeCode()) {
    if (!root.homes[code]) {
      root.homes[code] = seedHome(code);
      root.activeHome = code;
      writeRoot("seed");
    }
    return root.homes[code];
  }

  function mutate(action, entityType, entityId, mutator) {
    const home = getHomeState();
    const before = entityId
      ? home[entityType]?.find?.(item => item.id === entityId) || null
      : null;
    const result = mutator(home);
    const after = entityId
      ? home[entityType]?.find?.(item => item.id === entityId) || null
      : result;
    audit(home, action, entityType, entityId || result?.id || null, before, after);
    writeRoot(action);
    return clone(result);
  }

  function findById(collection, id) {
    return (collection || []).find(item => item.id === id || item.code === id);
  }

  function currentHome() {
    return getHomeState();
  }

  function listResidents({ includeDischarged = false } = {}) {
    return clone(currentHome().residents.filter(resident => (
      includeDischarged || resident.status !== "discharged"
    )));
  }

  function findResident(id) {
    const resident = findById(currentHome().residents, id);
    return resident ? clone(resident) : null;
  }

  function updateResident(id, patch, action = "修改住客") {
    return mutate(action, "residents", id, home => {
      const resident = findById(home.residents, id);
      if (!resident) throw new Error("找不到住客。");
      if (patch.bed && patch.bed !== resident.bed) {
        throw new Error("床位更改必須使用調床功能。");
      }
      Object.assign(resident, clone(patch));
      resident.version = Number(resident.version || 0) + 1;
      const cycle = home.cycles.find(item => item.residentId === id && !item.endedAt);
      if (cycle) {
        if (patch.bed) cycle.bed = patch.bed;
        if (patch.name) cycle.name = patch.name;
        if (patch.place) cycle.place = patch.place;
      }
      return resident;
    });
  }

  function admitResident(input) {
    const home = getHomeState();
    const settings = window.OT_HOME_SETTINGS?.getHome?.() || home.settings;
    const occupied = home.residents.filter(resident => resident.status !== "discharged");
    if (occupied.length >= Number(settings.totalBeds || Infinity)) {
      throw new Error(`已達 ${settings.name || "院舍"} 的總床位上限（${settings.totalBeds}）。`);
    }
    const voucherCount = occupied.filter(resident => resident.place === "券位").length;
    if (input.place === "券位" && voucherCount >= Number(settings.voucherBeds || Infinity)) {
      throw new Error(`已達 ${settings.name || "院舍"} 的券位上限（${settings.voucherBeds}）。`);
    }
    const duplicateBed = occupied.find(resident => resident.bed === input.bed);
    if (duplicateBed) throw new Error(`床號 ${input.bed} 已有住客。`);

    const resident = {
      id: uid("resident"),
      bed: String(input.bed || "").trim(),
      name: String(input.name || "").trim(),
      place: input.place || "券位",
      floor: input.floor || `${Math.max(1, Math.min(3, Number(String(input.bed || "A01").slice(1, 3)) <= 10 ? 1 : 2))}樓`,
      status: "active",
      version: 1,
      statusLabel: "Active",
      manualStatusLabel: "",
      infection: "Nil",
      infectionList: [],
      admissionDate: TODAY_KEY,
      icpDue: input.icpDue || "2026-11-14",
      icpType: "6個月",
      lastIcp: "",
      lastAssessment: "",
      icpState: "待評估",
      sex: input.sex || "女",
      dob: input.dob || "1945-01-01",
      age: input.age || "",
      education: input.education || "4–6 年",
      history: "",
      orientation: "時 — · 地 — · 人 —",
      mobility: "IW",
      mbi: "—",
      moca: "—",
      trainingFrequency: input.place === "券位" || input.place === "買位"
        ? "2次/星期"
        : "2次/月",
      extraServices: "0",
      activityCodes: [],
      activities: "",
      timeline: [["入院", TODAY_KEY], ["最近更新", TODAY_KEY]]
    };
    resident.bedHistory = [{
      id: uid("bed"),
      from: null,
      to: resident.bed,
      effectiveDate: TODAY_KEY
    }];
    const cycle = {
      ...initialCycle(resident),
      id: `icp-${resident.id}`,
      dueDate: resident.icpDue,
      history: [{ date: TODAY_KEY, label: "入住建立週期" }]
    };
    const assessment = {
      id: uid("ax"),
      code: assessmentCode(resident, 1),
      residentId: resident.id,
      date: TODAY_KEY,
      type: "Initial Ax",
      origin: "initial",
      status: "draft",
      owner: "OT",
      updated: "尚未儲存",
      cycleId: cycle.id,
      servesAsIcpAx: false,
      icpLinkIntent: null,
      contributors: [],
      summary: "新評估"
    };
    const task = {
      id: uid("todo"),
      title: "完成 Initial Ax",
      residentId: resident.id,
      owner: "OT",
      due: "2026-10-30",
      status: "open",
      kind: "auto",
      source: "新增住客",
      sourceLink: `../assessment/paper-aligned.html?embed=1&mode=session&origin=initial&residentId=${resident.id}`,
      generatedFrom: assessment.id
    };

    home.residents.unshift(resident);
    home.cycles.unshift(cycle);
    home.assessments.unshift(assessment);
    home.tasks.unshift(task);
    home.handoverEvents.unshift({
      id: uid("handover"),
      date: TODAY_KEY,
      type: "admission",
      residentId: resident.id,
      text: `入住：${resident.bed} ${resident.name}`
    });
    audit(home, "新增住客", "residents", resident.id, null, resident);
    audit(home, "建立 ICP 週期", "cycles", cycle.id, null, cycle);
    audit(home, "建立 Initial Ax 待辦", "tasks", task.id, null, task);
    writeRoot("admit");
    return clone({ resident, cycle, assessment, task });
  }

  function cancelTasks(home, predicate, reason) {
    home.tasks.forEach(task => {
      if (task.status !== "open" || !predicate(task)) return;
      task.status = "cancelled";
      task.cancelledAt = TODAY_KEY;
      task.cancelReason = reason;
    });
  }

  function dischargeResident(id, { date = TODAY_KEY, reason = "退住" } = {}) {
    const result = mutate("退住住客", "residents", id, home => {
      const resident = findById(home.residents, id);
      if (!resident) throw new Error("找不到住客。");
      resident.status = "discharged";
      resident.statusLabel = "已退住";
      resident.dischargeDate = date;
      resident.dischargeReason = reason;
      resident.timeline = [
        ...(resident.timeline || []),
        ["退住", date],
        ["最近更新", date]
      ];
      resident.version = Number(resident.version || 0) + 1;
      home.cycles
        .filter(cycle => cycle.residentId === id && !cycle.endedAt)
        .forEach(cycle => {
          cycle.endedAt = date;
          cycle.endReason = reason;
        });
      cancelTasks(home, task => task.residentId === id, "住客退住");
      home.tasks.unshift({
        id: uid("todo"),
        title: "將已列印評估由文件夾 E 交院舍保存",
        residentId: id,
        owner: "OT",
        due: date,
        status: "open",
        kind: "auto",
        source: "退住"
      });
      home.schedules = home.schedules
        .map(session => ({
          ...session,
          memberIds: session.memberIds?.filter(memberId => memberId !== id) || []
        }))
        .filter(session => session.memberIds.length);
      try {
        const scheduleKey = window.OT_MOCK_STORAGE_KEYS?.trainingSchedule;
        const schedule = scheduleKey
          ? JSON.parse(localStorage.getItem(scheduleKey) || "null")
          : null;
        if (scheduleKey && Array.isArray(schedule?.sessions)) {
          schedule.sessions = schedule.sessions
            .map(session => ({
              ...session,
              memberIds: (session.memberIds || []).filter(memberId => memberId !== id)
            }))
            .filter(session => session.memberIds.length);
          localStorage.setItem(scheduleKey, JSON.stringify(schedule));
        }
      } catch (error) {
        // The prototype remains usable if the schedule store is unavailable.
      }
      home.handoverEvents.unshift({
        id: uid("handover"),
        date,
        type: "discharge",
        residentId: id,
        text: `退住：${resident.bed} ${resident.name}`
      });
      return resident;
    });
    return result;
  }

  function cancelDischarge(id) {
    return mutate("取消退住", "residents", id, home => {
      const resident = findById(home.residents, id);
      if (!resident || resident.status !== "discharged") return resident;
      resident.status = "active";
      resident.statusLabel = "Active";
      resident.dischargeDate = null;
      resident.dischargeReason = null;
      resident.timeline = (resident.timeline || []).filter(([label]) => label !== "退住");
      resident.version = Number(resident.version || 0) + 1;
      const folderTask = home.tasks.find(task => (
        task.residentId === id &&
        task.title === "將已列印評估由文件夾 E 交院舍保存" &&
        task.status === "open"
      ));
      if (folderTask) {
        folderTask.status = "cancelled";
        folderTask.cancelledAt = TODAY_KEY;
        folderTask.cancelReason = "取消退住";
      }
      home.handoverEvents = home.handoverEvents.filter(event => !(
        event.residentId === id && event.type === "discharge"
      ));
      return resident;
    });
  }

  function daysBetween(start, end) {
    const startDate = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T00:00:00`);
    return Math.max(0, Math.round((endDate - startDate) / 86400000));
  }

  function syncHospitalStay(residentId, statusesByDate = {}) {
    return mutate("同步留醫期間", "residents", residentId, home => {
      const resident = findById(home.residents, residentId);
      if (!resident) throw new Error("找不到住客。");
      const hospitalDates = Object.entries(statusesByDate)
        .filter(([key, status]) => key.endsWith(`|${residentId}`) && status === "H")
        .map(([key]) => key.slice(0, 10))
        .sort();
      const periods = [];
      for (let index = 0; index + 1 < hospitalDates.length; index += 2) {
        periods.push({ start: hospitalDates[index], end: hospitalDates[index + 1] });
      }
      const openStay = hospitalDates.length % 2 === 1
        ? { start: hospitalDates.at(-1), end: null }
        : null;
      resident.hospitalPeriods = openStay ? [...periods, openStay] : periods;
      resident.status = openStay ? "hospital" : "active";
      resident.statusLabel = openStay ? "留醫中" : "Active";
      resident.timeline = (resident.timeline || [])
        .filter(([label]) => label !== "留醫中")
        .concat(openStay ? [["留醫中", openStay.start]] : []);
      resident.version = Number(resident.version || 0) + 1;

      const eligible = task => (
        task.residentId === residentId &&
        task.status === "open" &&
        !["ICP 工作清單", "每週核對"].includes(task.source) &&
        !String(task.title).includes("ICP")
      );
      if (openStay) {
        home.tasks.filter(eligible).forEach(task => {
          if (task.hospitalDeferStarted) return;
          task.hospitalDeferStarted = openStay.start;
          task.hospitalOriginalDue = task.due;
          task.deferNote = "留醫順延";
        });
      } else {
        const latestPeriod = periods.at(-1);
        home.tasks.filter(task => task.residentId === residentId && task.hospitalDeferStarted).forEach(task => {
          if (latestPeriod && task.hospitalOriginalDue) {
            const offset = daysBetween(latestPeriod.start, latestPeriod.end);
            const due = new Date(`${task.hospitalOriginalDue}T00:00:00`);
            due.setDate(due.getDate() + offset);
            task.due = [
              due.getFullYear(),
              String(due.getMonth() + 1).padStart(2, "0"),
              String(due.getDate()).padStart(2, "0")
            ].join("-");
          }
          task.hospitalDeferStarted = null;
          task.hospitalOriginalDue = null;
          task.deferNote = "";
        });
      }
      return resident;
    });
  }

  function moveResidents(moves, { effectiveDate = TODAY_KEY } = {}) {
    const home = getHomeState();
    if (!Array.isArray(moves) || moves.length === 0) {
      throw new Error("沒有可提交的調床安排。");
    }
    const activeResidents = home.residents.filter(resident => resident.status !== "discharged");
    const residentById = new Map(activeResidents.map(resident => [resident.id, resident]));
    const moveByResident = new Map(moves.map(move => [move.residentId, move]));
    if (moveByResident.size !== moves.length) {
      throw new Error("同一住客不可重複參與調床。");
    }

    const finalBeds = new Map(activeResidents.map(resident => [resident.bed, resident.id]));
    for (const move of moves) {
      const resident = residentById.get(move.residentId);
      const parsed = parseBedCode(move.targetBedCode);
      if (!resident) throw new Error("調床名單包含不存在或已退住的住客。");
      if (!parsed) throw new Error(`床號 ${move.targetBedCode} 格式不正確。`);
      if (
        move.expectedResidentVersion !== undefined &&
        Number(move.expectedResidentVersion) !== Number(resident.version)
      ) {
        throw new Error(`${resident.name} 的資料已被修改，請重新整理後再調床。`);
      }
      finalBeds.delete(resident.bed);
    }
    for (const move of moves) {
      const parsed = parseBedCode(move.targetBedCode);
      const owner = finalBeds.get(parsed.bedCode);
      if (owner && !moveByResident.has(owner)) {
        throw new Error(`床號 ${parsed.bedCode} 仍由未參與調床的住客使用。`);
      }
      if (owner && moveByResident.has(owner)) {
        throw new Error(`床號 ${parsed.bedCode} 在最終安排中重複使用。`);
      }
      finalBeds.set(parsed.bedCode, move.residentId);
    }

    const before = moves.map(move => {
      const resident = residentById.get(move.residentId);
      return {
        residentId: resident.id,
        name: resident.name,
        bedCode: resident.bed,
        version: resident.version
      };
    });
    const applied = [];
    for (const move of moves) {
      const resident = residentById.get(move.residentId);
      const parsed = parseBedCode(move.targetBedCode);
      const previousBed = resident.bed;
      resident.bed = parsed.bedCode;
      resident.floor = floorLabelForLetter(parsed.floorLetter) || resident.floor;
      resident.version = Number(resident.version || 0) + 1;
      resident.bedHistory = Array.isArray(resident.bedHistory) ? resident.bedHistory : [];
      resident.bedHistory.push({
        id: uid("bed"),
        from: previousBed,
        to: parsed.bedCode,
        effectiveDate,
        actor: `${root.currentUser.role} · ${root.currentUser.name}`
      });
      const cycle = home.cycles.find(item => item.residentId === resident.id && !item.endedAt);
      if (cycle) {
        cycle.bed = resident.bed;
        cycle.name = resident.name;
      }
      applied.push({
        residentId: resident.id,
        name: resident.name,
        fromBedCode: previousBed,
        toBedCode: resident.bed,
        residentVersion: resident.version
      });
    }

    const scheduleKey = window.OT_MOCK_STORAGE_KEYS?.trainingSchedule;
    let schedule = null;
    try {
      schedule = scheduleKey ? JSON.parse(localStorage.getItem(scheduleKey) || "null") : null;
    } catch (error) {
      schedule = null;
    }
    const groupConflicts = [];
    if (Array.isArray(schedule?.sessions)) {
      const allResidents = new Map(home.residents.map(resident => [resident.id, resident]));
      schedule.sessions.forEach(session => {
        if (!session.memberIds?.some(id => moveByResident.has(id))) return;
        const floors = new Set(
          session.memberIds.map(id => allResidents.get(id)?.floor).filter(Boolean)
        );
        if (floors.size > 1) {
          groupConflicts.push({
            sessionId: session.id,
            date: session.date || null,
            floors: [...floors]
          });
        }
      });
    }
    audit(home, "調床", "residents", applied.map(item => item.residentId).join(","), before, applied);
    writeRoot("move-residents");
    return clone({ moves: applied, groupConflicts });
  }

  function listAssessments(residentId = null) {
    return clone(currentHome().assessments.filter(record => (
      !residentId || record.residentId === residentId
    )));
  }

  function findAssessment(id) {
    const record = findById(currentHome().assessments, id);
    return record ? clone(record) : null;
  }

  function createAssessment(residentId, origin = "reassessment", cycleId = null) {
    return mutate("建立評估", "assessments", null, home => {
      const resident = findById(home.residents, residentId);
      if (!resident) throw new Error("找不到住客。");
      const type = origin === "initial"
        ? "Initial Ax"
        : origin === "icp" || origin === "urgent-icp"
          ? "ICP Ax"
          : "Re-Ax";
      const record = {
        id: uid("ax"),
        code: assessmentCode(resident, home.assessments.length + 1),
        residentId,
        date: TODAY_KEY,
        type,
        origin,
        status: "draft",
        owner: root.currentUser.role,
        updated: "尚未儲存",
        cycleId,
        servesAsIcpAx: origin === "icp" || origin === "urgent-icp",
        icpLinkIntent: origin === "icp" || origin === "urgent-icp" ? true : null,
        contributors: [],
        summary: "新評估"
      };
      home.assessments.unshift(record);
      return record;
    });
  }

  function updateAssessment(id, patch, action = "修改評估") {
    return mutate(action, "assessments", id, home => {
      const record = findById(home.assessments, id);
      if (!record) throw new Error("找不到評估。");
      Object.assign(record, clone(patch));
      if (record.status === "completed") {
        linkAssessmentToCycle(home, record);
        syncResidentClinical(home, record.residentId);
      }
      return record;
    });
  }

  function latestValidAssessment(home, residentId) {
    return home.assessments
      .filter(record => record.residentId === residentId && record.status === "completed")
      .sort((left, right) => right.date.localeCompare(left.date))[0] || null;
  }

  function syncResidentClinical(home, residentId) {
    const resident = findById(home.residents, residentId);
    const record = latestValidAssessment(home, residentId);
    if (!resident) return;
    if (!record) {
      Object.assign(resident, {
        mbi: "—",
        moca: "—",
        mobility: "—",
        orientation: "時 — · 地 — · 人 —",
        activities: "",
        history: "",
        lastAssessment: "",
        lastAssessmentCode: ""
      });
      resident.version = Number(resident.version || 0) + 1;
      return;
    }
    const clinical = record.clinical || {};
    resident.mbi = clinical.mbi || resident.mbi || "—";
    resident.moca = clinical.moca || resident.moca || "—";
    resident.mobility = clinical.mobility || resident.mobility || "—";
    resident.orientation = clinical.orientation || resident.orientation;
    resident.activities = clinical.activities || resident.activities;
    resident.activityCodes = clinical.activityCodes || resident.activityCodes || [];
    resident.history = clinical.history || resident.history;
    resident.lastAssessment = record.date;
    resident.lastAssessmentCode = record.code;
    resident.timeline = [
      ...(resident.timeline || []).filter(([label]) => label !== "最近更新"),
      ["最近更新", record.date]
    ];
    resident.version = Number(resident.version || 0) + 1;
  }

  function linkAssessmentToCycle(home, record) {
    const cycle = record.cycleId
      ? home.cycles.find(item => item.id === record.cycleId)
      : home.cycles.find(item => item.residentId === record.residentId && !item.endedAt);
    if (!cycle) return;
    record.cycleId = cycle.id;
    cycle.assessmentDone = record.status === "completed";
    cycle.assessmentCompletedAt = record.completedAt || null;
    if (record.status === "completed" && record.servesAsIcpAx) {
      if (cycle.activeAssessment && cycle.activeAssessment.id !== record.code) {
        cycle.history = Array.isArray(cycle.history) ? cycle.history : [];
        if (!cycle.history.some(item => item.id === cycle.activeAssessment.id)) {
          cycle.history.push({ ...cycle.activeAssessment, replacedAt: TODAY_KEY });
        }
      }
      const active = {
        id: record.code,
        date: record.date,
        type: record.type === "ICP Ax" ? "ICP Ax" : `${record.type} · ICP Ax`
      };
      cycle.activeAssessment = active;
      cycle.linkedAssessments = [
        active,
        ...(cycle.linkedAssessments || []).filter(item => item.id !== record.code)
      ];
    }
    cycle.status = cycle.assessmentDone
      ? (cycle.icpOtDone && cycle.icpPtDone && cycle.icpDate ? "filled" : "fill")
      : "assess";
  }

  function completeAssessment(id, clinical = {}) {
    return mutate("完成評估", "assessments", id, home => {
      const record = findById(home.assessments, id);
      if (!record) throw new Error("找不到評估。");
      record.status = "completed";
      record.completedAt = `${TODAY_KEY} ${new Date().toLocaleTimeString("zh-HK", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })}`;
      record.completedBy = `${root.currentUser.role} · ${root.currentUser.name}`;
      record.updated = record.completedAt;
      record.clinical = { ...(record.clinical || {}), ...clone(clinical) };
      linkAssessmentToCycle(home, record);
      syncResidentClinical(home, record.residentId);
      home.tasks.forEach(task => {
        if (task.generatedFrom === record.id && task.status === "open") {
          task.status = "done";
          task.completedAt = record.completedAt;
          task.completedBy = root.currentUser.name;
        }
      });
      return record;
    });
  }

  function voidAssessment(id, reason) {
    return mutate("作廢評估", "assessments", id, home => {
      const record = findById(home.assessments, id);
      if (!record) throw new Error("找不到評估。");
      if (!String(reason || "").trim()) throw new Error("作廢評估必須填寫原因。");
      record.status = "void";
      record.voidReason = reason;
      record.voidedAt = TODAY_KEY;
      record.voidedBy = root.currentUser.role;
      const cycle = home.cycles.find(item => item.id === record.cycleId);
      if (cycle?.activeAssessment?.id === record.code) {
        const replacement = home.assessments
          .filter(item => (
            item.residentId === record.residentId &&
            item.status === "completed" &&
            item.servesAsIcpAx &&
            item.id !== record.id
          ))
          .sort((left, right) => right.date.localeCompare(left.date))[0];
        cycle.activeAssessment = replacement
          ? { id: replacement.code, date: replacement.date, type: replacement.type }
          : null;
        cycle.assessmentDone = Boolean(replacement);
      }
      syncResidentClinical(home, record.residentId);
      return record;
    });
  }

  function listCycles() {
    return clone(currentHome().cycles);
  }

  function updateCycle(id, patch, action = "更新 ICP") {
    return mutate(action, "cycles", id, home => {
      const cycle = findById(home.cycles, id);
      if (!cycle) throw new Error("找不到 ICP 週期。");
      Object.assign(cycle, clone(patch));
      if (cycle.icpOtDone && cycle.icpPtDone && cycle.icpDate) cycle.status = "filled";
      else if (cycle.assessmentDone) cycle.status = "fill";
      else cycle.status = "assess";
      const resident = findById(home.residents, cycle.residentId);
      if (resident) {
        resident.icpDue = cycle.dueDate || resident.icpDue;
        resident.icpType = cycle.nextIcpType || resident.icpType;
        resident.icpState = cycle.status === "filled"
          ? "已完成"
          : cycle.status === "fill"
            ? "待填 ICP"
            : "待評估";
      }
      return cycle;
    });
  }

  function setIcpRoleComplete(id, role, complete) {
    const cycle = findById(currentHome().cycles, id);
    if (!cycle) throw new Error("找不到 ICP 週期。");
    const normalizedRole = role === "pt" ? "pt" : "ot";
    return updateCycle(id, {
      [`icp${normalizedRole === "ot" ? "Ot" : "Pt"}Done`]: Boolean(complete),
      [`icp${normalizedRole === "ot" ? "Ot" : "Pt"}CompletedAt`]: complete ? TODAY_KEY : null
    }, `記錄 ${normalizedRole.toUpperCase()} ICP 表格完成`);
  }

  function listTasks({ status = null } = {}) {
    return clone(currentHome().tasks.filter(task => !status || task.status === status));
  }

  function createTask(input) {
    return mutate("建立待辦", "tasks", null, home => {
      const task = {
        id: uid("todo"),
        title: input.title,
        residentId: input.residentId || null,
        owner: input.owner || "",
        due: input.due || null,
        status: "open",
        kind: input.kind || "manual",
        source: input.source || "工作台",
        createdBy: root.currentUser.name,
        sourceLink: input.sourceLink || null
      };
      home.tasks.unshift(task);
      return task;
    });
  }

  function completeTask(id) {
    return mutate("完成待辦", "tasks", id, home => {
      const task = findById(home.tasks, id);
      if (!task || task.status === "done") return task;
      task.status = "done";
      task.completedBy = root.currentUser.name;
      task.completedAt = `${TODAY_KEY} ${new Date().toLocaleTimeString("zh-HK", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })}`;
      return task;
    });
  }

  function updateTask(id, patch) {
    return mutate("修改待辦", "tasks", id, home => {
      const task = findById(home.tasks, id);
      if (!task || task.kind !== "manual" || task.createdBy !== root.currentUser.name) {
        throw new Error("系統自動產生的待辦不可修改。");
      }
      Object.assign(task, clone(patch));
      return task;
    });
  }

  function deleteTask(id) {
    return mutate("刪除待辦", "tasks", id, home => {
      const task = findById(home.tasks, id);
      if (!task) return null;
      if (task.kind !== "manual" || task.createdBy !== root.currentUser.name) {
        throw new Error("只有由自己建立的手動待辦可以刪除。");
      }
      home.tasks = home.tasks.filter(item => item.id !== id);
      home.posts = home.posts.filter(post => post.taskId !== id);
      return task;
    });
  }

  function listPosts(channel = null) {
    return clone(currentHome().posts.filter(post => !channel || post.channel === channel));
  }

  function createPost(input) {
    return mutate("發佈交更", "posts", null, home => {
      let taskId = null;
      if (input.type === "task") {
        const task = {
          id: uid("todo"),
          title: input.taskTitle || input.text,
          residentId: input.residentId || null,
          owner: input.owner || "",
          due: input.due || null,
          status: "open",
          kind: "manual",
          source: "交更",
          createdBy: root.currentUser.name
        };
        home.tasks.unshift(task);
        taskId = task.id;
      }
      const post = {
        id: uid("post"),
        channel: input.channel || "home",
        type: input.type || "announcement",
        author: root.currentUser.name,
        time: new Date().toLocaleTimeString("zh-HK", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }),
        text: input.text,
        taskId
      };
      home.posts.unshift(post);
      return post;
    });
  }

  function generatedHandover(date = TODAY_KEY) {
    const home = currentHome();
    const activeResidents = home.residents.filter(resident => resident.status !== "discharged");
    const selectedDate = new Date(`${date}T00:00:00`);
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const dateKey = value => [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, "0"),
      String(value.getDate()).padStart(2, "0")
    ].join("-");
    const weekStartKey = dateKey(weekStart);
    const weekEndKey = dateKey(weekEnd);
    const inCurrentWeek = value => value >= weekStartKey && value <= weekEndKey;
    const admissionDate = resident => (
      resident.admissionDate ||
      resident.timeline?.find(([label]) => label === "入院")?.[1] ||
      ""
    );
    const weekAdmissions = home.residents.filter(resident => inCurrentWeek(admissionDate(resident)));
    const weekDischarges = home.residents.filter(resident => (
      resident.dischargeDate && inCurrentWeek(resident.dischargeDate)
    ));
    const frequencyCode = resident => {
      if (resident.place === "券位") return "v 2/wk";
      if (resident.place === "買位") return "b 2/wk";
      return "p 1/2wks";
    };
    const assessorFor = resident => {
      const completed = home.assessments
        .filter(record => record.residentId === resident.id && record.status === "completed")
        .sort((left, right) => right.date.localeCompare(left.date))[0];
      return completed?.completedBy || "待評估";
    };
    const month = date.slice(0, 7);
    const monthCycles = home.cycles.filter(cycle => cycle.dueDate?.startsWith(month));
    const completed016WaitingIcp = monthCycles.filter(cycle => (
      cycle.assessmentDone && (!cycle.icpOtDone || !cycle.icpPtDone)
    )).length;
    const otAssessed = activeResidents.filter(resident => (
      home.assessments.some(record => (
        record.residentId === resident.id &&
        record.status === "completed" &&
        String(record.completedBy || "").startsWith("OT")
      ))
    )).length;
    const ptAssessed = activeResidents.filter(resident => (
      home.assessments.some(record => (
        record.residentId === resident.id &&
        record.status === "completed" &&
        (String(record.completedBy || "").includes("PT") ||
          (record.contributors || []).some(item => item.role === "PT"))
      ))
    )).length;
    const halfSummary = (yearMonth, half) => {
      const cycles = home.cycles.filter(cycle => {
        if (!cycle.dueDate?.startsWith(yearMonth)) return false;
        const day = Number(cycle.dueDate.slice(8, 10));
        return half === "first" ? day <= 15 : day >= 16;
      });
      return {
        total: cycles.length,
        ot: cycles.filter(cycle => cycle.icpOtDone).length,
        pt: cycles.filter(cycle => cycle.icpPtDone).length
      };
    };
    const previousDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    const previousMonth = [
      previousDate.getFullYear(),
      String(previousDate.getMonth() + 1).padStart(2, "0")
    ].join("-");
    const previousFirst = halfSummary(previousMonth, "first");
    const previousSecond = halfSummary(previousMonth, "second");
    const currentFirst = halfSummary(month, "first");
    const currentSecond = halfSummary(month, "second");
    const previousIncomplete =
      previousFirst.ot < previousFirst.total ||
      previousFirst.pt < previousFirst.total ||
      previousSecond.ot < previousSecond.total ||
      previousSecond.pt < previousSecond.total;
    const voucherResidents = activeResidents.filter(resident => (
      resident.place === "券位" && resident.previousPlace && resident.previousPlace !== "券位"
    ));
    const admissionLines = weekAdmissions.map(resident => (
      `${admissionDate(resident).replaceAll("-", "/")} · ${resident.bed} ${resident.name} · ${resident.place} · ${frequencyCode(resident)} · ${assessorFor(resident)}`
    ));
    const dischargeLines = weekDischarges.map(resident => (
      `${resident.dischargeDate.replaceAll("-", "/")} · ${resident.bed} ${resident.name} · ${resident.dischargeReason || "退住"}`
    ));
    const sections = [
      {
        id: "HO-003",
        title: "入住退住名單",
        text: [
          admissionLines.length ? `新入住\n${admissionLines.join("\n")}` : "",
          dischargeLines.length ? `退住\n${dischargeLines.join("\n")}` : ""
        ].filter(Boolean).join("\n\n") || "本星期沒有入住或退住記錄。"
      },
      {
        id: "HO-004",
        title: "全院評估進度",
        text: [
          `全院住客：${activeResidents.length} 人`,
          `OT 已評估：${otAssessed} 人 · PT 已評估：${ptAssessed} 人`,
          `016 完成待填 ICP：${completed016WaitingIcp} 份`
        ].join("\n")
      },
      {
        id: "HO-005",
        title: "本月 ICP 完成進度",
        text: [
          `上半月：OT ${currentFirst.ot} / ${currentFirst.total}，PT ${currentFirst.pt} / ${currentFirst.total}`,
          `下半月：OT ${currentSecond.ot} / ${currentSecond.total}，PT ${currentSecond.pt} / ${currentSecond.total}`
        ].join("\n")
      },
      {
        id: "HO-006",
        title: "轉券位住客",
        text: voucherResidents.length
          ? voucherResidents.map(resident => `${resident.bed} ${resident.name}（${resident.previousPlace} → 券位）`).join("\n")
          : "沒有待顯示的轉券位住客。"
      }
    ];
    if (previousIncomplete) {
      sections.push({
        id: "HO-007",
        title: "上月 ICP 完成進度",
        text: [
          `上半月：OT ${previousFirst.ot} / ${previousFirst.total}，PT ${previousFirst.pt} / ${previousFirst.total}`,
          `下半月：OT ${previousSecond.ot} / ${previousSecond.total}，PT ${previousSecond.pt} / ${previousSecond.total}`
        ].join("\n")
      });
    }
    return {
      id: `handover-${date}`,
      date,
      homeCode: activeHomeCode(),
      sections
    };
  }

  function handoverNote(date, sectionId) {
    const home = getHomeState();
    return home.handoverNotes?.[`${date}:${sectionId}`] || "";
  }

  function setHandoverNote(date, sectionId, text) {
    return mutate("修改交更備註", "handoverNotes", null, home => {
      home.handoverNotes = home.handoverNotes || {};
      home.handoverNotes[`${date}:${sectionId}`] = String(text || "");
      return { date, sectionId, text: home.handoverNotes[`${date}:${sectionId}`] };
    });
  }

  function listAudit() {
    return clone(currentHome().audit);
  }

  function recordAuditView() {
    const home = getHomeState();
    audit(home, "查看審計紀錄", "audit", null, null, { count: home.audit.length });
    writeRoot("audit-view");
    return listAudit();
  }

  function setCurrentUser(role) {
    root.currentUser = clone(USERS[role === "pt" ? "pt" : "ot"]);
    writeRoot("current-user");
    return clone(root.currentUser);
  }

  function getCurrentUser() {
    return clone(root.currentUser);
  }

  function updateSettings(values) {
    return mutate("修改院舍設定", "settings", null, home => {
      home.settings = { ...home.settings, ...clone(values) };
      return home.settings;
    });
  }

  function resetCurrentHome() {
    root.homes[activeHomeCode()] = seedHome(activeHomeCode());
    writeRoot("reset-home");
    return clone(root.homes[activeHomeCode()]);
  }

  function subscribe(callback) {
    const dispatch = () => callback(clone(currentHome()));
    window.addEventListener(EVENT_NAME, dispatch);
    window.addEventListener("storage", event => {
      if (event.key !== STORAGE_KEY) return;
      root = readRoot();
      dispatch();
    });
    return () => {
      window.removeEventListener(EVENT_NAME, dispatch);
    };
  }

  getHomeState();
  root.activeHome = activeHomeCode();
  writeRoot("ready");

  window.OT_PROTOTYPE = Object.freeze({
    storageKey: STORAGE_KEY,
    today: TODAY_KEY,
    homeCode: activeHomeCode,
    currentUser: getCurrentUser,
    setCurrentUser,
    updateSettings,
    state: () => clone(currentHome()),
    subscribe,
    residents: listResidents,
    resident: findResident,
    parseBedCode,
    moveResidents,
    updateResident,
    admitResident,
    dischargeResident,
    cancelDischarge,
    syncHospitalStay,
    assessments: listAssessments,
    assessment: findAssessment,
    createAssessment,
    updateAssessment,
    completeAssessment,
    voidAssessment,
    cycles: listCycles,
    updateCycle,
    setIcpRoleComplete,
    tasks: listTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    posts: listPosts,
    createPost,
    generatedHandover,
    handoverNote,
    setHandoverNote,
    audit: listAudit,
    recordAuditView,
    resetCurrentHome
  });
})();
