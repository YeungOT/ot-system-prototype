(() => {
  const content = document.querySelector("main .content") || document.querySelector(".content");
  if (!content) return;

  const TODAY_KEY = OT_PROTOTYPE.today;
  const HOME = OT_HOME_SETTINGS.getHome();
  const STORAGE_KEY = OT_MOCK_STORAGE_KEYS.trainingSchedule;
  const TIMES = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
    "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ];
  const LUNCH_START = HOME.lunchStart || "12:00";
  const LUNCH_END = HOME.lunchEnd || "13:00";
  const GROUP_LIMIT = Number(HOME.groupLimit) || 4;
  const WEEKDAYS = ["週一", "週二", "週三", "週四", "週五", "週六", "週日"];
  const SERVICE_WEEKDAYS = [2, 3, 4, 5];
  const MONTH_NAMES = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const clone = value => JSON.parse(JSON.stringify(value));
  const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

  const parseDate = value => {
    const [year, month, day] = String(value).split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  const pad = value => String(value).padStart(2, "0");
  const dateKey = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const addDays = (value, amount) => {
    const date = typeof value === "string" ? parseDate(value) : new Date(value);
    date.setDate(date.getDate() + amount);
    return dateKey(date);
  };
  const startOfWeek = value => {
    const date = typeof value === "string" ? parseDate(value) : new Date(value);
    const offset = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - offset);
    return dateKey(date);
  };
  const endOfWeek = value => addDays(startOfWeek(value), 6);
  const monthKey = value => {
    const date = typeof value === "string" ? parseDate(value) : new Date(value);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
  };
  const monthStart = month => `${month}-01`;
  const monthEnd = month => {
    const [year, value] = month.split("-").map(Number);
    return dateKey(new Date(year, value, 0));
  };
  const monthLabel = month => {
    const [year, value] = month.split("-").map(Number);
    return `${year}年${MONTH_NAMES[value - 1]}`;
  };
  const shiftMonth = (month, amount) => {
    const [year, value] = month.split("-").map(Number);
    return monthKey(new Date(year, value - 1 + amount, 1));
  };
  const datesBetween = (start, end) => {
    const dates = [];
    for (let date = start; date <= end; date = addDays(date, 1)) dates.push(date);
    return dates;
  };
  const daysBetween = (start, end) => (
    Math.round((parseDate(end) - parseDate(start)) / 86400000)
  );
  const weekdayIndex = date => (parseDate(date).getDay() + 6) % 7;
  const isLunchTime = time => time >= LUNCH_START && time < LUNCH_END;
  const currentMonth = () => monthKey(TODAY_KEY);
  const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  const groupLabelMarkup = label => {
    const match = String(label || "").match(/^G(\d+)$/);
    return match ? `G<sub>${match[1]}</sub>` : escapeHtml(label || "");
  };

  const sourceResidents = OT_PROTOTYPE.residents({ includeDischarged: false });
  const residents = sourceResidents.map(resident => {
    const cadence = String(resident.trainingFrequency || "").includes("星期")
      ? "weekly"
      : "biweekly";
    const admissionDate =
      resident.admissionDate ||
      resident.timeline?.find(([label]) => label === "入院")?.[1] ||
      `${currentMonth()}-01`;
    return {
      ...resident,
      cadence,
      requiredSessions: Number.parseInt(String(resident.trainingFrequency).match(/\d+/)?.[0] || "2", 10),
      extraTarget: Number(resident.extraServices) || 0,
      cycleAnchorDate: admissionDate,
      activities: resident.activityCodes?.length ? resident.activityCodes : ["C", "5", "8"]
    };
  });
  const residentById = new Map(residents.map(resident => [resident.id, resident]));

  function calendarRows(month) {
    const first = monthStart(month);
    const last = monthEnd(month);
    const firstWeek = startOfWeek(first);
    const lastWeek = startOfWeek(last);
    return datesBetween(firstWeek, lastWeek).filter(date => startOfWeek(date) === date);
  }

  function weekDates(weekStart) {
    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  }

  function serviceDates(weekStart) {
    return weekDates(weekStart).filter(date => staffOnDuty(date) !== null);
  }

  function weeksForMonth(month) {
    return calendarRows(month).map(weekStart => ({
      start: weekStart,
      end: endOfWeek(weekStart)
    }));
  }

  function cycleForDate(resident, date) {
    if (!resident || resident.cadence !== "biweekly" || date < resident.cycleAnchorDate) return null;
    const index = Math.floor(daysBetween(resident.cycleAnchorDate, date) / 14);
    const start = addDays(resident.cycleAnchorDate, index * 14);
    const end = addDays(start, 13);
    if (date > end) return null;
    return {
      key: `cycle:${resident.id}:${start}`,
      residentId: resident.id,
      start,
      end,
      ownerMonth: monthKey(start)
    };
  }

  function cyclesForMonth(resident, month) {
    if (resident.cadence !== "biweekly") return [];
    const startBoundary = monthStart(month);
    const endBoundary = monthEnd(month);
    let index = 0;
    if (resident.cycleAnchorDate < startBoundary) {
      index = Math.ceil(daysBetween(resident.cycleAnchorDate, startBoundary) / 14);
    }
    const cycles = [];
    for (let cycleIndex = index; cycleIndex < index + 5; cycleIndex += 1) {
      const start = addDays(resident.cycleAnchorDate, cycleIndex * 14);
      if (start > endBoundary) break;
      if (start >= startBoundary) {
        cycles.push({
          key: `cycle:${resident.id}:${start}`,
          residentId: resident.id,
          start,
          end: addDays(start, 13),
          ownerMonth: month
        });
      }
    }
    return cycles;
  }

  function seedPatterns() {
    const patterns = [];
    const weekly = residents
      .filter(resident => resident.cadence === "weekly")
      .sort((left, right) => (
        left.floor.localeCompare(right.floor) ||
        left.bed.localeCompare(right.bed, "en", { numeric: true })
      ));
    const byFloor = new Map();
    weekly.forEach(resident => {
      if (!byFloor.has(resident.floor)) byFloor.set(resident.floor, []);
      byFloor.get(resident.floor).push(resident);
    });
    let groupIndex = 0;
    [...byFloor.values()].forEach(groupResidents => {
      for (let index = 0; index < groupResidents.length; index += 2) {
        const members = groupResidents.slice(index, index + 2);
        const weekdayPairs = [[2, 4], [3, 5], [2, 5], [3, 4], [2, 3], [4, 5]];
        const weekdays = weekdayPairs[groupIndex % weekdayPairs.length];
        const time = TIMES[(3 + groupIndex * 2) % 16];
        patterns.push({
          id: `weekly-${groupIndex + 1}`,
          cadence: "weekly",
          residentIds: members.map(resident => resident.id),
          weekdays,
          time: isLunchTime(time) ? "09:00" : time,
          duration: 30,
          format: members.length > 1 ? "g" : "i",
          activity: members[0].activities[0] || "C",
          staffMode: groupIndex % 3 === 0 ? "T" : "A",
          paid: false,
          startDate: "2026-09-01",
          endDate: null
        });
        groupIndex += 1;
      }
    });
    residents
      .filter(resident => resident.cadence === "biweekly")
      .forEach((resident, index) => {
        const preferredWeekday = SERVICE_WEEKDAYS[index % SERVICE_WEEKDAYS.length];
        const preferredTimes = ["14:00", "14:30", "15:00", "15:30", "16:00"];
        patterns.push({
          id: `biweekly-${resident.id}`,
          cadence: "biweekly",
          residentIds: [resident.id],
          weekdays: [preferredWeekday],
          time: preferredTimes[index % preferredTimes.length],
          duration: 30,
          format: "i",
          activity: resident.activities[0] || "C",
          staffMode: index % 2 ? "A" : "T",
          paid: false,
          startDate: resident.cycleAnchorDate,
          endDate: null
        });
      });
    return patterns;
  }

  function readState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored?.version === 6 && Array.isArray(stored.patterns) && stored.plans) return stored;
    } catch (error) {
      // Start with the deterministic dated plan.
    }
    return {
      version: 6,
      homeCode: HOME.code,
      activeMonth: currentMonth(),
      activeWeek: startOfWeek(TODAY_KEY),
      view: "week",
      serviceMode: "basic",
      patterns: seedPatterns(),
      plans: {},
      history: []
    };
  }

  let state = readState();

  function autofillGroupTimes() {
    try {
      const stored = JSON.parse(localStorage.getItem(OT_MOCK_STORAGE_KEYS.autofillTimes) || "[]");
      if (Array.isArray(stored)) return stored.filter(time => TIMES.includes(time));
      return Array.isArray(stored?.[HOME.code])
        ? stored[HOME.code].filter(time => TIMES.includes(time))
        : [];
    } catch (error) {
      return [];
    }
  }

  function saveAutofillGroupTimes(times) {
    try {
      const value = [...new Set(times)].filter(time => TIMES.includes(time));
      localStorage.setItem(
        OT_MOCK_STORAGE_KEYS.autofillTimes,
        JSON.stringify({ [HOME.code]: value })
      );
    } catch (error) {
      // The current dialog remains usable without persistence.
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // The current page remains usable without persistence.
    }
    window.OT_TRAINING_PLANNER_STATE = clone(state);
  }

  function sessionCycleKey(resident, date) {
    return resident.cadence === "biweekly" ? cycleForDate(resident, date)?.key || null : null;
  }

  function generatePatternSessions(pattern, month) {
    const activeResidents = pattern.residentIds
      .map(id => residentById.get(id))
      .filter(Boolean);
    if (!activeResidents.length) return [];
    if (pattern.cadence === "weekly") {
      return weekDates(startOfWeek(monthStart(month)))
        .concat()
        .flatMap(() => [])
        .concat(
          calendarRows(month)
            .flatMap(weekStart => weekDates(weekStart))
            .filter(date => date.slice(0, 7) === month)
            .filter(date => pattern.weekdays.includes(weekdayIndex(date)))
            .filter(date => date >= pattern.startDate && (!pattern.endDate || date <= pattern.endDate))
            .map(date => ({
              id: `${pattern.id}:${date}`,
              date,
              time: pattern.time,
              duration: pattern.duration,
              memberIds: [...pattern.residentIds],
              format: pattern.format,
              activity: pattern.activity,
              staffMode: pattern.staffMode,
              paid: Boolean(pattern.paid),
              patternId: pattern.id,
              cycleKey: null,
              generated: true
            }))
        );
    }
    const resident = activeResidents[0];
    return cyclesForMonth(resident, month).flatMap(cycle => {
      const candidates = datesBetween(cycle.start, cycle.end);
      const date = candidates.find(candidate => (
        SERVICE_WEEKDAYS.includes(weekdayIndex(candidate)) &&
        pattern.weekdays.includes(weekdayIndex(candidate)) &&
        candidate >= pattern.startDate &&
        (!pattern.endDate || candidate <= pattern.endDate)
      ));
      if (!date) return [];
      return [{
        id: `${pattern.id}:${cycle.key}`,
        date,
        time: pattern.time,
        duration: pattern.duration,
        memberIds: [resident.id],
        format: "i",
        activity: pattern.activity,
        staffMode: pattern.staffMode,
        paid: Boolean(pattern.paid),
        patternId: pattern.id,
        cycleKey: cycle.key,
        generated: true,
        carryOut: monthKey(date) !== month
      }];
    });
  }

  function latestEarlierPlan(month) {
    const earlier = Object.keys(state.plans)
      .filter(key => key < month)
      .sort();
    return earlier.filter(key => state.plans[key]?.status === "valid").at(-1)
      || earlier.at(-1)
      || null;
  }

  function ensurePlan(month) {
    if (state.plans[month]) return state.plans[month];
    const sourcePlanId = latestEarlierPlan(month) || null;
    const sessions = state.patterns.flatMap(pattern => generatePatternSessions(pattern, month));
    state.plans[month] = {
      planId: `plan-${HOME.code}-${month}`,
      month,
      sourcePlanId,
      status: "draft",
      changed: false,
      generatedAt: new Date().toISOString(),
      approvedAt: null,
      sessions,
      exceptions: []
    };
    return state.plans[month];
  }

  function ensureCoverage(month) {
    [shiftMonth(month, -1), month, shiftMonth(month, 1)].forEach(ensurePlan);
  }

  function allSessionEntries() {
    return Object.values(state.plans).flatMap(plan => (
      plan.sessions.map(session => ({ ...session, planMonth: plan.month, planStatus: plan.status }))
    ));
  }

  function sessionsAt(date, time, extra = []) {
    return allSessionEntries().concat(extra).filter(session => (
      session.date === date && session.time === time
    ));
  }

  function residentSessions(residentId, extra = []) {
    return allSessionEntries().concat(extra).filter(session => session.memberIds.includes(residentId));
  }

  function weeklySessionCount(residentId, weekStart, extra = []) {
    const end = addDays(weekStart, 6);
    return residentSessions(residentId, extra).filter(session => (
      !session.paid && session.date >= weekStart && session.date <= end
    )).length;
  }

  function cycleSessionCount(residentId, cycleKey, extra = []) {
    return residentSessions(residentId, extra).filter(session => (
      !session.paid && session.cycleKey === cycleKey
    )).length;
  }

  function paidSessionCount(residentId, month, extra = []) {
    return residentSessions(residentId, extra).filter(session => (
      session.paid && session.date.slice(0, 7) === month
    )).length;
  }

  function residentActiveOn(resident, date) {
    if (!resident || resident.status === "discharged") return false;
    const admission = resident.admissionDate ||
      resident.timeline?.find(([label]) => label === "入院")?.[1];
    if (admission && date < admission) return false;
    if (resident.dischargeDate && date >= resident.dischargeDate) return false;
    if (resident.status === "hospital") return false;
    return true;
  }

  function staffOnDuty(date) {
    if (!SERVICE_WEEKDAYS.includes(weekdayIndex(date))) return null;
    if (date === "2026-11-18") return null;
    return 2;
  }

  function validateResidentPlacement(residentId, date, time, options = {}) {
    const resident = residentById.get(residentId);
    const {
      paid = false,
      ignoreSessionIds = [],
      extraSessions = []
    } = options;
    if (!resident) return { valid: false, reason: "找不到住客。" };
    if (date.slice(0, 7) !== state.activeMonth && options.allowAdjacent !== true) {
      return { valid: false, reason: "相鄰月份日期只供查看，請先切換至該月份。" };
    }
    if (!residentActiveOn(resident, date)) {
      return { valid: false, reason: resident.status === "hospital" ? "住客留醫期間不可安排訓練。" : "住客在此日期不在活躍入住期。" };
    }
    if (isLunchTime(time)) return { valid: false, reason: "午膳時段不可安排訓練。" };
    const onDuty = staffOnDuty(date);
    if (onDuty === null) return { valid: false, reason: "缺少當日 T/A 更表，未能驗證容量。" };
    const ignored = new Set(ignoreSessionIds);
    const targetSessions = sessionsAt(date, time, extraSessions).filter(session => !ignored.has(session.id));
    if (targetSessions.length >= onDuty) {
      return { valid: false, reason: `此時段已有 ${onDuty} 節，沒有空餘職員。` };
    }
    const sessions = residentSessions(residentId, extraSessions).filter(session => !ignored.has(session.id));
    if (sessions.some(session => session.date === date && session.paid === paid)) {
      return { valid: false, reason: paid ? "住客每日最多一節額外服務。" : "住客每日最多一節基本訓練。" };
    }
    if (paid) {
      if (resident.extraTarget <= 0) return { valid: false, reason: "此住客未設定額外復康服務次數。" };
      if (paidSessionCount(residentId, date.slice(0, 7), extraSessions) >= resident.extraTarget) {
        return { valid: false, reason: `本月額外服務已達 ${resident.extraTarget} 節。` };
      }
      return { valid: true, reason: "可作額外服務安排。" };
    }
    if (resident.cadence === "weekly") {
      const week = startOfWeek(date);
      const count = sessions.filter(session => (
        !session.paid && session.date >= week && session.date <= addDays(week, 6)
      )).length;
      if (count >= resident.requiredSessions) {
        return { valid: false, reason: `本週已達 ${resident.requiredSessions} 節。` };
      }
      return { valid: true, reason: `可安排 · 本週 ${count + 1}/${resident.requiredSessions}。` };
    }
    const cycle = cycleForDate(resident, date);
    if (!cycle) return { valid: false, reason: "此日期不在有效的 14 日週期內。" };
    if (cycleSessionCount(residentId, cycle.key, extraSessions) >= 1) {
      return { valid: false, reason: "此 14 日週期已有基本訓練。" };
    }
    return { valid: true, reason: `可安排 · 週期 ${cycle.start} 至 ${cycle.end}。` };
  }

  function slotDropBlock(date, time) {
    if (date.slice(0, 7) !== state.activeMonth) {
      return { valid: false, reason: "相鄰月份日期只供查看，請先切換至該月份。" };
    }
    if (isLunchTime(time)) {
      return { valid: false, reason: "午膳時段不可安排訓練。" };
    }
    return null;
  }

  function residentSlotDropResult(residentId, date, time, options = {}) {
    const blocked = slotDropBlock(date, time);
    if (blocked) return blocked;
    return validateResidentPlacement(residentId, date, time, {
      paid: options.paid ?? state.serviceMode === "extra",
      ignoreSessionIds: options.ignoreSessionIds || [],
      extraSessions: options.extraSessions || [],
      allowAdjacent: false
    });
  }

  function sessionSlotDropResult(sessionId, date, time) {
    const found = findSession(sessionId);
    if (!found) return { valid: false, reason: "找不到要移動的節數。" };
    const blocked = slotDropBlock(date, time);
    if (blocked) return blocked;
    const invalid = found.session.memberIds
      .map(residentId => validateResidentPlacement(residentId, date, time, {
        paid: found.session.paid,
        ignoreSessionIds: [sessionId],
        allowAdjacent: false
      }))
      .find(result => !result.valid);
    return invalid || { valid: true, reason: "可移動至此時段。" };
  }

  function residentToSessionResult(residentId, sessionId, options = {}) {
    const found = findSession(sessionId);
    if (!found) return { valid: false, reason: "找不到目標小組。" };
    const resident = residentById.get(residentId);
    if (!resident) return { valid: false, reason: "找不到住客。" };
    const session = found.session;
    if (session.memberIds.includes(residentId)) {
      return { valid: false, reason: "住客已在此小組。" };
    }
    if (session.memberIds.length >= GROUP_LIMIT) {
      return { valid: false, reason: `小組人數已達上限 ${GROUP_LIMIT} 人。` };
    }
    const floors = new Set(
      session.memberIds.map(id => residentById.get(id)?.floor).filter(Boolean)
    );
    if (floors.size && !floors.has(resident.floor)) {
      return { valid: false, reason: "同一小組住客必須屬於同一樓層。" };
    }
    return validateResidentPlacement(residentId, session.date, session.time, {
      paid: session.paid,
      ignoreSessionIds: [sessionId, ...(options.ignoreSessionIds || [])],
      allowAdjacent: false
    });
  }

  function memberSessionContext(residentId, sessionId) {
    const found = findSession(sessionId);
    if (!found) return null;
    if (!found.session.memberIds.includes(residentId)) return null;
    return found;
  }

  function memberSlotDropResult(residentId, sourceSessionId, date, time) {
    const source = memberSessionContext(residentId, sourceSessionId);
    if (!source) return { valid: false, reason: "找不到要移動的小組成員。" };
    if (source.session.memberIds.length <= 1) {
      return { valid: false, reason: "個別節數沒有可拖出的其他小組成員。" };
    }
    return residentSlotDropResult(residentId, date, time, {
      paid: source.session.paid,
      ignoreSessionIds: [sourceSessionId]
    });
  }

  function memberToSessionResult(residentId, sourceSessionId, targetSessionId) {
    if (sourceSessionId === targetSessionId) {
      return { valid: false, reason: "成員已在此小組。" };
    }
    const source = memberSessionContext(residentId, sourceSessionId);
    const target = findSession(targetSessionId);
    if (!source || !target) return { valid: false, reason: "找不到來源或目標節數。" };
    if (source.session.paid !== target.session.paid) {
      return { valid: false, reason: "基本訓練與額外服務成員不可混合。" };
    }
    return residentToSessionResult(residentId, targetSessionId, {
      ignoreSessionIds: [sourceSessionId]
    });
  }

  function sessionsMergeResult(sourceId, targetId) {
    const sourceFound = findSession(sourceId);
    const targetFound = findSession(targetId);
    if (!sourceFound || !targetFound) {
      return { valid: false, reason: "找不到可合併的節數。" };
    }
    if (sourceId === targetId) {
      return { valid: false, reason: "節數不能與自己合併。" };
    }
    const source = sourceFound.session;
    const target = targetFound.session;
    if (source.paid !== target.paid) {
      return { valid: false, reason: "基本訓練與額外服務不可合併。" };
    }
    const memberIds = [...new Set([...source.memberIds, ...target.memberIds])];
    if (memberIds.length > GROUP_LIMIT) {
      return { valid: false, reason: `小組人數不可超過 ${GROUP_LIMIT} 人。` };
    }
    const floors = new Set(memberIds.map(id => residentById.get(id)?.floor).filter(Boolean));
    if (floors.size > 1) {
      return { valid: false, reason: "同一小組住客必須屬於同一樓層。" };
    }
    return { valid: true, reason: "可合併為小組。" };
  }

  function dropResultForSlot(payload, date, time, targetSessionId = null) {
    if (!payload) return { valid: false, reason: "沒有可放置的項目。" };
    const blocked = slotDropBlock(date, time);
    if (blocked) return blocked;
    if (targetSessionId) {
      if (payload.type === "resident") {
        return residentToSessionResult(payload.residentId, targetSessionId);
      }
      if (payload.type === "member") {
        return memberToSessionResult(
          payload.residentId,
          payload.sessionId,
          targetSessionId
        );
      }
      return sessionsMergeResult(payload.sessionId, targetSessionId);
    }
    if (payload.type === "resident") {
      return residentSlotDropResult(payload.residentId, date, time);
    }
    if (payload.type === "member") {
      return memberSlotDropResult(
        payload.residentId,
        payload.sessionId,
        date,
        time
      );
    }
    return sessionSlotDropResult(payload.sessionId, date, time);
  }

  function markPlanDraft(month, reason) {
    const plan = ensurePlan(month);
    plan.status = "draft";
    plan.changed = true;
    plan.exceptions.push({
      id: uid("exception"),
      reason,
      at: new Date().toISOString(),
      actor: `${OT_PROTOTYPE.currentUser().role} · ${OT_PROTOTYPE.currentUser().name}`
    });
  }

  function planForDate(date) {
    return ensurePlan(monthKey(date));
  }

  function addSession(date, time, residentIds, options = {}) {
    const plan = planForDate(date);
    const resident = residentById.get(residentIds[0]);
    const session = {
      id: uid("session"),
      date,
      time,
      duration: 30,
      memberIds: [...residentIds],
      format: options.format || (residentIds.length > 1 ? "g" : "i"),
      activity: options.activity || resident?.activities[0] || "C",
      staffMode: options.staffMode || (staffOnDuty(date) > 1 ? "T" : "A"),
      paid: Boolean(options.paid),
      patternId: options.patternId || null,
      cycleKey: resident?.cadence === "biweekly" ? cycleForDate(resident, date)?.key || null : null,
      generated: false,
      carryOut: date.slice(0, 7) !== plan.month
    };
    plan.sessions.push(session);
    markPlanDraft(plan.month, "新增訓練");
    return session;
  }

  function findSession(sessionId) {
    for (const plan of Object.values(state.plans)) {
      const index = plan.sessions.findIndex(session => session.id === sessionId);
      if (index >= 0) return { plan, session: plan.sessions[index], index };
    }
    return null;
  }

  function removeSession(sessionId) {
    const found = findSession(sessionId);
    if (!found) return null;
    found.plan.sessions.splice(found.index, 1);
    markPlanDraft(found.plan.month, "移除訓練");
    return found.session;
  }

  function groupNumber(session) {
    if (session.format !== "g") return null;
    const label = OT_PROTOTYPE.groupLabelForSession(allSessionEntries(), session);
    return label ? Number(label.slice(1)) : null;
  }

  function weekProgress(resident, weekStart) {
    return {
      count: weeklySessionCount(resident.id, weekStart),
      target: resident.requiredSessions,
      label: "本週"
    };
  }

  function cycleProgress(resident, month) {
    const cycles = cyclesForMonth(resident, month);
    const count = cycles.filter(cycle => cycleSessionCount(resident.id, cycle.key) > 0).length;
    return { count, target: cycles.length, label: "本月週期", cycles };
  }

  function extraProgress(resident, month) {
    return {
      count: paidSessionCount(resident.id, month),
      target: resident.extraTarget,
      label: "本月"
    };
  }

  function residentProgress(resident) {
    if (state.serviceMode === "extra") return extraProgress(resident, state.activeMonth);
    return resident.cadence === "weekly"
      ? weekProgress(resident, state.activeWeek)
      : cycleProgress(resident, state.activeMonth);
  }

  function collectIssues(month) {
    const issues = [];
    if (state.serviceMode === "basic") {
      const weeks = weeksForMonth(month);
      residents.filter(resident => resident.cadence === "weekly").forEach(resident => {
        weeks.forEach(week => {
          const count = weeklySessionCount(resident.id, week.start);
          if (count < resident.requiredSessions) {
            issues.push({
              type: "weekly",
              residentId: resident.id,
              message: `${resident.bed} ${resident.name} · ${week.start} 週尚欠 ${resident.requiredSessions - count} 節`
            });
          }
        });
      });
      residents.filter(resident => resident.cadence === "biweekly").forEach(resident => {
        cyclesForMonth(resident, month).forEach(cycle => {
          if (cycleSessionCount(resident.id, cycle.key) < 1) {
            issues.push({
              type: "cycle",
              residentId: resident.id,
              message: `${resident.bed} ${resident.name} · ${cycle.start} 至 ${cycle.end} 尚未安排`
            });
          }
        });
      });
    } else {
      residents.filter(resident => resident.extraTarget > 0).forEach(resident => {
        const count = paidSessionCount(resident.id, month);
        if (count < resident.extraTarget) {
          issues.push({
            type: "paid",
            residentId: resident.id,
            message: `${resident.bed} ${resident.name} · 額外服務尚欠 ${resident.extraTarget - count} 節`
          });
        }
      });
    }
    const planSessions = ensurePlan(month).sessions;
    const duplicateKeys = new Map();
    planSessions.forEach(session => {
      const key = [
        session.date,
        session.time,
        session.paid ? "paid" : "basic",
        [...session.memberIds].sort().join(",")
      ].join("|");
      duplicateKeys.set(key, (duplicateKeys.get(key) || 0) + 1);
    });
    duplicateKeys.forEach((count, key) => {
      if (count > 1) {
        issues.push({
          type: "duplicate",
          message: `${key.split("|").slice(0, 2).join(" ")} 有重複節數`
        });
      }
    });
    planSessions.forEach(session => {
      if (staffOnDuty(session.date) === null) {
        issues.push({
          type: "rota",
          sessionId: session.id,
          message: `${session.date} ${session.time} 缺少 T/A 更表`
        });
      }
      if (session.format === "g") {
        const floors = new Set(session.memberIds.map(id => residentById.get(id)?.floor).filter(Boolean));
        if (floors.size > 1) {
          issues.push({
            type: "floor",
            sessionId: session.id,
            message: `${session.date} ${session.time} 小組跨樓層`
          });
        }
        if (session.memberIds.length > GROUP_LIMIT) {
          issues.push({
            type: "capacity",
            sessionId: session.id,
            message: `${session.date} ${session.time} 小組超過 ${GROUP_LIMIT} 人`
          });
        }
      }
      session.memberIds.forEach(residentId => {
        if (!residentById.has(residentId)) {
          issues.push({
            type: "stale-resident",
            sessionId: session.id,
            message: `${session.date} ${session.time} 引用已不存在的住客`
          });
        }
      });
      if (session.patternId && !state.patterns.some(pattern => pattern.id === session.patternId)) {
        issues.push({
          type: "stale-pattern",
          sessionId: session.id,
          message: `${session.date} ${session.time} 引用已失效的固定安排`
        });
      }
    });
    residents.filter(resident => resident.cadence === "biweekly").forEach(resident => {
      cyclesForMonth(resident, month).forEach(cycle => {
        if (cycleSessionCount(resident.id, cycle.key) > 1) {
          issues.push({
            type: "duplicate-cycle",
            residentId: resident.id,
            message: `${resident.bed} ${resident.name} · ${cycle.start} 至 ${cycle.end} 有超過一節基本訓練`
          });
        }
      });
    });
    const sessionsByDate = planSessions.reduce((result, session) => {
      if (!result.has(session.date)) result.set(session.date, []);
      result.get(session.date).push(session);
      return result;
    }, new Map());
    sessionsByDate.forEach((sessions, date) => {
      const onDuty = staffOnDuty(date);
      if (onDuty === null) return;
      const availableSlots = TIMES.filter(time => !isLunchTime(time)).length;
      if (sessions.length > onDuty * availableSlots) {
        issues.push({
          type: "daily-capacity",
          message: `${date} 的節數超過當日 T/A 工時容量`
        });
      }
      const residentDaily = new Map();
      sessions.forEach(session => {
        session.memberIds.forEach(residentId => {
          const key = `${residentId}|${session.paid ? "paid" : "basic"}`;
          residentDaily.set(key, (residentDaily.get(key) || 0) + 1);
        });
      });
      residentDaily.forEach((count, key) => {
        if (count <= 1) return;
        const [residentId, type] = key.split("|");
        const resident = residentById.get(residentId);
        issues.push({
          type: "daily-resident-cap",
          residentId,
          message: `${resident?.bed || residentId} ${resident?.name || ""} · ${date} ${type === "paid" ? "額外服務" : "基本訓練"}超過每日上限`
        });
      });
    });
    return issues;
  }

  function sessionMatchesMode(session) {
    return state.serviceMode === "extra" ? session.paid : !session.paid;
  }

  function queueResidents() {
    return residents.filter(resident => (
      state.serviceMode === "extra" ? resident.extraTarget > 0 : true
    ));
  }

  function sessionTitle(session) {
    const members = session.memberIds.map(id => residentById.get(id)).filter(Boolean);
    if (session.format === "g") {
      return `${members.map(member => `${member.bed} ${member.name}`).join("、")}`;
    }
    const member = members[0];
    return member ? `${member.bed} ${member.name}` : "未指定住客";
  }

  content.innerHTML = `
    <style>
      .tp2-shell { display: grid; gap: 10px; min-width: 0; }
      .tp2-toolbar {
        border: 1px solid var(--line);
        border-radius: 9px;
        background: #fff;
        box-shadow: var(--shadow);
        padding: 9px 11px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
      }
      .tp2-nav, .tp2-actions, .tp2-segmented { display: flex; align-items: center; gap: 6px; }
      .tp2-title { display: grid; gap: 1px; min-width: 170px; }
      .tp2-title strong { font-size: 17px; }
      .tp2-title span { color: var(--muted); font-size: 10px; }
      .tp2-segmented { border: 1px solid var(--line); border-radius: 7px; background: #f8fafc; padding: 2px; }
      .tp2-segmented button { border: 0; border-radius: 5px; background: transparent; padding: 6px 9px; font-size: 11px; font-weight: 800; color: var(--muted); }
      .tp2-segmented button.active { background: #fff; color: var(--teal-dark); box-shadow: var(--shadow); }
      .tp2-layout { display: grid; grid-template-columns: 230px minmax(0, 1fr); gap: 10px; align-items: start; }
      .tp2-queue, .tp2-board {
        border: 1px solid var(--line);
        border-radius: 9px;
        background: #fff;
        box-shadow: var(--shadow);
        min-width: 0;
      }
      .tp2-queue { position: sticky; top: 0; max-height: calc(100vh - 30px); overflow: hidden; display: flex; flex-direction: column; }
      .tp2-queue-head, .tp2-board-head {
        padding: 9px 10px;
        border-bottom: 1px solid var(--line);
        background: #fbfcfd;
        display: flex;
        justify-content: space-between;
        gap: 8px;
        align-items: center;
      }
      .tp2-queue-head strong, .tp2-board-head strong { font-size: 12px; }
      .tp2-queue-head span, .tp2-board-head span { color: var(--muted); font-size: 10px; }
      .tp2-queue-body { overflow: auto; padding: 6px; display: grid; gap: 8px; }
      .tp2-queue-group { display: grid; gap: 3px; }
      .tp2-queue-group h3 { margin: 5px 4px 2px; color: var(--muted); font-size: 10px; }
      .tp2-resident {
        width: 100%;
        border: 1px solid transparent;
        border-radius: 6px;
        background: #f8fafc;
        padding: 6px 7px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 3px 7px;
        text-align: left;
      }
      .tp2-resident:hover { border-color: #cbd5e1; background: #fff; }
      .tp2-resident strong { font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .tp2-resident small { color: var(--muted); font-size: 9px; }
      .tp2-resident b { grid-row: span 2; align-self: center; color: var(--teal-dark); font-size: 11px; }
      .tp2-board { overflow: hidden; }
      .tp2-board-body { padding: 8px; display: grid; gap: 9px; max-height: calc(100vh - 155px); overflow: auto; }
      .tp2-week-card { border: 1px solid var(--line); border-radius: 7px; overflow: hidden; }
      .tp2-week-card > header { padding: 6px 8px; border-bottom: 1px solid var(--line); background: #f8fafc; display: flex; justify-content: space-between; gap: 8px; }
      .tp2-week-card > header strong { font-size: 11px; }
      .tp2-week-card > header span { color: var(--muted); font-size: 9px; }
      .tp2-grid-scroll { overflow: auto; }
      .tp2-grid { display: grid; grid-template-columns: 68px repeat(4, minmax(180px, 1fr)); min-width: 788px; }
      .tp2-cell, .tp2-time, .tp2-day { border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
      .tp2-grid > :nth-child(5n) { border-right: 0; }
      .tp2-day, .tp2-time { min-height: 35px; background: #fbfcfd; padding: 5px; display: grid; place-items: center; font-size: 10px; font-weight: 800; text-align: center; }
      .tp2-day small { color: var(--muted); font-size: 8px; font-weight: 700; }
      .tp2-time { font-size: 9px; color: #475569; }
      .tp2-time.lunch { background: #fff5f5; color: var(--red); }
      .tp2-cell { min-height: 44px; padding: 3px; background: #fff; display: grid; align-content: start; gap: 2px; }
      .tp2-cell.lunch { background: #fff8f8; cursor: not-allowed; }
      .tp2-cell.readonly { background: #f1f5f9; opacity: .62; }
      .tp2-cell.today { box-shadow: inset 0 0 0 2px #5eead4; }
      .tp2-cell.drop-valid { background: #ecfdf5; box-shadow: inset 0 0 0 2px #22c55e; }
      .tp2-cell.drop-invalid { background: #fff1f2; box-shadow: inset 0 0 0 2px #ef4444; }
      .tp2-cell.drop-target.drop-valid { box-shadow: inset 0 0 0 3px #16a34a; }
      .tp2-cell.drop-target.drop-invalid { box-shadow: inset 0 0 0 3px #dc2626; }
      .tp2-session {
        width: 100%;
        border: 1px solid #b8ddd7;
        border-left: 3px solid var(--teal);
        border-radius: 5px;
        background: #f3fbf9;
        color: #115e59;
        padding: 4px 5px;
        text-align: left;
        font-size: 9px;
        line-height: 1.2;
      }
      .tp2-session.group { background: #eff6ff; border-color: #bfdbfe; border-left-color: #2563eb; color: #1d4ed8; }
      .tp2-session.extra { background: #fff7ed; border-color: #fed7aa; border-left-color: #b45309; color: #92400e; }
      .tp2-session.carry { box-shadow: inset 0 0 0 1px #f59e0b; }
      .tp2-session.combine-valid { outline: 2px solid #16a34a; outline-offset: 1px; }
      .tp2-session.combine-invalid { outline: 2px solid #dc2626; outline-offset: 1px; }
      .tp2-session strong { display: block; font-size: 9px; }
      .tp2-session small { display: block; margin-top: 1px; color: inherit; opacity: .75; font-size: 8px; }
      .tp2-vacancy {
        justify-self: end;
        align-self: end;
        color: #94a3b8;
        font-size: 8px;
        font-weight: 800;
      }
      .tp2-boundary {
        border-radius: 999px;
        background: #fff7ed;
        color: #9a3412;
        padding: 2px 6px;
        font-size: 8px;
        font-weight: 800;
      }
      .tp2-issues { border: 1px solid #fecaca; border-radius: 7px; background: #fff7f7; color: #991b1b; padding: 7px 9px; font-size: 10px; }
      .tp2-issues ul { margin: 4px 0 0; padding-left: 18px; }
      .tp2-empty { color: var(--muted); padding: 20px; text-align: center; }
      .tp2-plan-meta { color: var(--muted); font-size: 9px; }
      @media (max-width: 980px) {
        .tp2-layout { grid-template-columns: 190px minmax(0, 1fr); }
      }
      @media (max-width: 760px) {
        .tp2-layout { grid-template-columns: minmax(0, 1fr); }
        .tp2-queue { position: static; max-height: 300px; }
      }
    </style>
    <div class="tp2-shell">
      <header class="tp2-toolbar" data-spec-ids="BH-006-001,BH-006-002">
        <div class="tp2-nav">
          <button class="btn" type="button" data-tp-action="prev" data-spec-ids="BH-006-002">←</button>
          <div class="tp2-title">
            <strong id="tp2-period-title"></strong>
            <span id="tp2-plan-meta"></span>
          </div>
          <button class="btn" type="button" data-tp-action="next" data-spec-ids="BH-006-002">→</button>
          <button class="btn" type="button" data-tp-action="today" data-spec-ids="BH-006-002,BH-006-028">本月</button>
        </div>
        <div class="tp2-actions">
          <div class="tp2-segmented" role="group" aria-label="檢視" data-spec-ids="BH-006-001,BH-006-003">
            <button type="button" data-tp-view="week" data-spec-ids="BH-006-001">週</button>
            <button type="button" data-tp-view="month" data-spec-ids="BH-006-001,BH-006-003,BH-006-015,BH-006-017">月</button>
          </div>
          <div class="tp2-segmented" role="group" aria-label="服務">
            <button type="button" data-tp-mode="basic">基本</button>
            <button type="button" data-tp-mode="extra">額外服務</button>
          </div>
          <button class="btn" type="button" data-tp-action="autofill" data-spec-ids="BH-006-010,BH-006-020">自動填入</button>
          <button class="btn btn-primary" type="button" data-tp-action="validate" data-spec-ids="BH-006-013,BH-006-026,BH-006-027,BH-006-029">標為有效</button>
        </div>
      </header>
      <div id="tp2-issues"></div>
      <div class="tp2-layout">
        <aside class="tp2-queue" data-spec-ids="BH-006-004,BH-006-012,BH-006-026,BH-006-027">
          <header class="tp2-queue-head">
            <strong>住客</strong>
            <span id="tp2-queue-summary"></span>
          </header>
          <div class="tp2-queue-body" id="tp2-queue-body"></div>
        </aside>
        <section class="tp2-board" data-spec-ids="BH-006-003,BH-006-021">
          <header class="tp2-board-head">
            <strong id="tp2-board-title"></strong>
            <span id="tp2-board-summary"></span>
          </header>
          <div class="tp2-board-body" id="tp2-board-body"></div>
        </section>
      </div>
    </div>
    <dialog id="tp2-scope-dialog" aria-labelledby="tp2-scope-title" data-spec-ids="BH-006-011">
      <div class="dialog-head"><h2 id="tp2-scope-title">套用變更範圍</h2></div>
      <div class="dialog-actions">
        <button class="btn" type="button" data-tp-scope="date" data-spec-ids="BH-006-011">只更改本節</button>
        <button class="btn btn-primary" type="button" data-tp-scope="recurring" data-spec-ids="BH-006-011">更改所有相關節數</button>
      </div>
    </dialog>
    <dialog id="tp2-autofill-dialog" aria-labelledby="tp2-autofill-title" data-spec-ids="BH-006-010,BH-006-020">
      <div class="dialog-head"><h2 id="tp2-autofill-title">自動填入</h2></div>
      <div class="dialog-body" id="tp2-autofill-summary"></div>
      <div class="dialog-actions">
        <button class="btn" type="button" data-tp-action="close-autofill">取消</button>
        <button class="btn btn-primary" type="button" data-tp-action="confirm-autofill">填入</button>
      </div>
    </dialog>
  `;

  const queueBody = document.getElementById("tp2-queue-body");
  const boardBody = document.getElementById("tp2-board-body");
  const scopeDialog = document.getElementById("tp2-scope-dialog");
  const autofillDialog = document.getElementById("tp2-autofill-dialog");
  let dragPayload = null;
  let pendingMove = null;
  let autoFillCandidates = [];
  let unresolvedAutoFill = [];
  let openScopePrompt = move => {
    pendingMove = move;
    scopeDialog.showModal();
  };

  function renderQueue() {
    const visible = queueResidents();
    const weekly = visible.filter(resident => resident.cadence === "weekly");
    const biweekly = visible.filter(resident => resident.cadence === "biweekly");
    const groupMarkup = (title, residentsInGroup) => `
      <section class="tp2-queue-group">
        <h3>${title} · ${residentsInGroup.length} 位</h3>
        ${residentsInGroup.map(resident => {
          const progress = residentProgress(resident);
          const cycleDetail = resident.cadence === "biweekly"
            ? progress.cycles.map(cycle => (
                `${cycle.start.slice(5)}–${cycle.end.slice(5)} ${cycleSessionCount(resident.id, cycle.key) ? "✓" : "○"}`
              )).join(" · ")
            : "";
          const weekSummary = resident.cadence === "weekly"
            ? ` · ${weeksForMonth(state.activeMonth).filter(week => (
                weeklySessionCount(resident.id, week.start) >= resident.requiredSessions
              )).length}/${weeksForMonth(state.activeMonth).length} 週`
            : "";
          return `
            <button class="tp2-resident" type="button" draggable="true" data-tp-resident="${resident.id}"
              data-spec-ids="${resident.cadence === "biweekly" ? "BH-006-004,BH-006-005,BH-006-012,BH-006-027" : "BH-006-004,BH-006-005,BH-006-026"}"
              title="${escapeHtml(cycleDetail)}">
              <strong>${escapeHtml(resident.bed)} · ${escapeHtml(resident.name)}</strong>
              <b>${progress.count}/${progress.target}</b>
              <small>${escapeHtml(progress.label)} · ${escapeHtml(resident.place)}${weekSummary}</small>
            </button>
          `;
        }).join("") || '<div class="tp2-empty">沒有住客</div>'}
      </section>
    `;
    queueBody.innerHTML = state.serviceMode === "extra"
      ? groupMarkup("額外服務", visible)
      : groupMarkup("每週需要", weekly) + groupMarkup("14 日週期", biweekly);
    document.getElementById("tp2-queue-summary").textContent = state.serviceMode === "extra"
      ? `${visible.length} 位`
      : `${weekly.length} 常規 · ${biweekly.length} 週期`;
  }

  function sessionMarkup(session) {
    const member = residentById.get(session.memberIds[0]);
    const classes = [
      "tp2-session",
      session.format === "g" ? "group" : "",
      session.paid ? "extra" : "",
      session.carryOut ? "carry" : ""
    ].filter(Boolean).join(" ");
    const groupLabel = session.format === "g"
      ? OT_PROTOTYPE.groupLabelForSession(allSessionEntries(), session)
      : null;
    const group = groupLabel ? `${groupLabelMarkup(groupLabel)} · ` : "";
    return `
      <button class="${classes}" type="button" draggable="true"
        data-tp-session="${session.id}"
        data-spec-ids="BH-006-005,BH-006-014,BH-006-016,BH-006-022,BH-006-031,BH-006-032,BH-006-033"
        title="${escapeHtml(sessionTitle(session))}">
        <strong>${group}${escapeHtml(sessionTitle(session))}</strong>
        <small>${session.paid ? "額外" : session.format === "g" ? `小組 ${session.memberIds.length}/${GROUP_LIMIT}` : "個別"} · ${escapeHtml(session.activity)}${session.patternId ? " · 固定" : ""}</small>
      </button>
    `;
  }

  function weekGridMarkup(weekStart) {
    const dates = serviceDates(weekStart);
    const dayHeads = dates.map(date => `
      <div class="tp2-day">
        <strong data-spec-ids="BH-006-021">${date.slice(8, 10)}/${date.slice(5, 7)}</strong>
        <small>${WEEKDAYS[weekdayIndex(date)]}</small>
      </div>
    `).join("");
    const rows = TIMES.map(time => {
      const cells = dates.map(date => {
        const lunch = isLunchTime(time);
        const readonly = date.slice(0, 7) !== state.activeMonth;
        const sessions = sessionsAt(date, time).filter(sessionMatchesMode);
        const onDuty = staffOnDuty(date);
        const vacancy = !lunch && !readonly && onDuty !== null && sessions.length < onDuty
          ? `<span class="tp2-vacancy" title="可用空位">${onDuty - sessions.length} 空</span>`
          : "";
        return `
          <div class="tp2-cell ${lunch ? "lunch" : ""} ${readonly ? "readonly" : ""} ${date === TODAY_KEY ? "today" : ""}"
            data-tp-date="${date}" data-tp-time="${time}"
            data-spec-ids="BH-006-006,BH-006-019,BH-006-021,BH-006-029">
            ${sessions.map(sessionMarkup).join("")}
            ${vacancy}
          </div>
        `;
      }).join("");
      return `
        <div class="tp2-time ${isLunchTime(time) ? "lunch" : ""}">${time}</div>
        ${cells}
      `;
    }).join("");
    return `
      <div class="tp2-grid-scroll">
        <div class="tp2-grid">
          <div class="tp2-time" aria-hidden="true"></div>
          ${dayHeads}
          ${rows}
        </div>
      </div>
    `;
  }

  function renderBoard() {
    const plan = ensurePlan(state.activeMonth);
    const issues = collectIssues(state.activeMonth);
    const title = state.view === "week"
      ? `${state.activeWeek.slice(8, 10)}/${state.activeWeek.slice(5, 7)}–${addDays(state.activeWeek, 6).slice(8, 10)}/${addDays(state.activeWeek, 6).slice(5, 7)}`
      : monthLabel(state.activeMonth);
    document.getElementById("tp2-period-title").textContent = title;
    document.getElementById("tp2-board-title").textContent = state.view === "week" ? "週時間表" : "月時間表";
    document.getElementById("tp2-plan-meta").textContent =
      `${plan.status === "valid" ? "已有效" : "草稿"}${plan.sourcePlanId ? ` · 沿用 ${state.plans[plan.sourcePlanId]?.month || plan.sourcePlanId}` : " · 新計劃"}${plan.changed ? " · 已修改" : " · 未修改"}`;
    document.getElementById("tp2-board-summary").textContent = state.serviceMode === "extra" ? "額外服務" : "基本訓練";
    document.querySelectorAll("[data-tp-view]").forEach(button => {
      button.classList.toggle("active", button.dataset.tpView === state.view);
    });
    document.querySelectorAll("[data-tp-mode]").forEach(button => {
      button.classList.toggle("active", button.dataset.tpMode === state.serviceMode);
    });
    const issuesBox = document.getElementById("tp2-issues");
    issuesBox.innerHTML = issues.length
      ? `<div class="tp2-issues"><strong>${issues.length} 項需要處理</strong><ul>${issues.slice(0, 12).map(issue => `<li>${escapeHtml(issue.message)}</li>`).join("")}</ul></div>`
      : "";
    if (state.view === "week") {
      boardBody.innerHTML = `<section class="tp2-week-card">${weekGridMarkup(state.activeWeek)}</section>`;
    } else {
      boardBody.innerHTML = calendarRows(state.activeMonth).map(weekStart => {
        const dates = serviceDates(weekStart);
        const weekEnd = endOfWeek(weekStart);
        const currentSessions = dates.flatMap(date => allSessionEntries().filter(session => (
          session.date === date && sessionMatchesMode(session)
        )));
        return `
          <section class="tp2-week-card" data-spec-ids="BH-006-021,BH-006-022">
            <header>
              <strong>${weekStart.slice(8, 10)}/${weekStart.slice(5, 7)}–${weekEnd.slice(8, 10)}/${weekEnd.slice(5, 7)}</strong>
              <span>${weekStart.slice(0, 7) !== weekEnd.slice(0, 7) ? '<b class="tp2-boundary">跨月</b> · ' : ""}${currentSessions.length} 節 · ${currentSessions.reduce((sum, session) => sum + session.memberIds.length, 0)} 人次</span>
            </header>
            ${weekGridMarkup(weekStart)}
          </section>
        `;
      }).join("");
    }
    requestAnimationFrame(renderQueue);
  }

  function render() {
    ensureCoverage(state.activeMonth);
    saveState();
    renderBoard();
  }

  function createPlannedSession(date, time, residentIds, options = {}, planned = []) {
    const resident = residentById.get(residentIds[0]);
    return {
      id: uid("auto"),
      date,
      time,
      duration: 30,
      memberIds: [...residentIds],
      format: residentIds.length > 1 ? "g" : "i",
      activity: resident?.activities[0] || "C",
      staffMode: "A",
      paid: Boolean(options.paid),
      patternId: null,
      cycleKey: resident?.cadence === "biweekly" ? cycleForDate(resident, date)?.key || null : null,
      generated: false,
      planned: true
    };
  }

  function findAvailableSlot(residentId, dates, planned, paid) {
    const fallbackTimes = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    ];
    const preferred = [...new Set([...autofillGroupTimes(), ...fallbackTimes])]
      .filter(time => TIMES.includes(time) && !isLunchTime(time));
    for (const date of dates.filter(candidate => SERVICE_WEEKDAYS.includes(weekdayIndex(candidate)))) {
      for (const time of preferred) {
        const result = validateResidentPlacement(residentId, date, time, {
          paid,
          extraSessions: planned,
          allowAdjacent: true
        });
        if (result.valid) return { date, time };
      }
    }
    return null;
  }

  function buildAutoFill() {
    autoFillCandidates = [];
    unresolvedAutoFill = [];
    const monthsToEnsure = [
      shiftMonth(state.activeMonth, -1),
      state.activeMonth,
      shiftMonth(state.activeMonth, 1)
    ];
    monthsToEnsure.forEach(ensurePlan);
    if (state.serviceMode === "extra") {
      residents.filter(resident => resident.extraTarget > 0).forEach(resident => {
        let missing = resident.extraTarget - paidSessionCount(resident.id, state.activeMonth, autoFillCandidates);
        while (missing > 0) {
          const dates = datesBetween(monthStart(state.activeMonth), monthEnd(state.activeMonth));
          const slot = findAvailableSlot(resident.id, dates, autoFillCandidates, true);
          if (!slot) break;
          autoFillCandidates.push(createPlannedSession(slot.date, slot.time, [resident.id], { paid: true }, autoFillCandidates));
          missing -= 1;
        }
        if (missing > 0) unresolvedAutoFill.push(`${resident.bed} ${resident.name} · 欠 ${missing} 節`);
      });
      return;
    }
    residents.filter(resident => resident.cadence === "weekly").forEach(resident => {
      const targetWeeks = state.view === "week" ? [state.activeWeek] : calendarRows(state.activeMonth);
      targetWeeks.forEach(weekStart => {
        let missing = resident.requiredSessions - weeklySessionCount(resident.id, weekStart, autoFillCandidates);
        while (missing > 0) {
          const dates = weekDates(weekStart);
          const slot = findAvailableSlot(resident.id, dates, autoFillCandidates, false);
          if (!slot) break;
          autoFillCandidates.push(createPlannedSession(slot.date, slot.time, [resident.id], {}, autoFillCandidates));
          missing -= 1;
        }
        if (missing > 0) {
          unresolvedAutoFill.push(`${resident.bed} ${resident.name} · ${weekStart} 尚欠 ${missing} 節`);
        }
      });
    });
    residents.filter(resident => resident.cadence === "biweekly").forEach(resident => {
      cyclesForMonth(resident, state.activeMonth).forEach(cycle => {
        if (cycleSessionCount(resident.id, cycle.key, autoFillCandidates) > 0) return;
        const slot = findAvailableSlot(resident.id, datesBetween(cycle.start, cycle.end), autoFillCandidates, false);
        if (slot) {
          autoFillCandidates.push(createPlannedSession(slot.date, slot.time, [resident.id], {}, autoFillCandidates));
        } else {
          unresolvedAutoFill.push(`${resident.bed} ${resident.name} · ${cycle.start} 至 ${cycle.end} 無可用時段`);
        }
      });
    });
  }

  function openAutoFill() {
    buildAutoFill();
    const summary = document.getElementById("tp2-autofill-summary");
    summary.innerHTML = `
      <p><strong>可新增 ${autoFillCandidates.length} 節</strong></p>
      ${autoFillCandidates.length ? `<ul>${autoFillCandidates.map(session => `<li>${session.date} ${session.time} · ${escapeHtml(sessionTitle(session))}</li>`).join("")}</ul>` : ""}
      ${unresolvedAutoFill.length ? `<div class="tp2-issues"><strong>未能安排</strong><ul>${unresolvedAutoFill.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : ""}
    `;
    autofillDialog.showModal();
  }

  function confirmAutoFill() {
    if (!autoFillCandidates.length) {
      autofillDialog.close();
      return;
    }
    autoFillCandidates.forEach(session => {
      const plan = planForDate(session.date);
      session.carryOut = session.date.slice(0, 7) !== plan.month;
      session.planned = false;
      plan.sessions.push(session);
      markPlanDraft(plan.month, "自動填入");
    });
    autoFillCandidates = [];
    autofillDialog.close();
    render();
  }

  function applySessionMove(sessionId, targetDate, targetTime, scope) {
    const found = findSession(sessionId);
    if (!found) return;
    const sourceDate = found.session.date;
    if (scope === "date") {
      removeSession(sessionId);
      const moved = { ...found.session, date: targetDate, time: targetTime };
      const resident = residentById.get(moved.memberIds[0]);
      moved.cycleKey = resident?.cadence === "biweekly" ? cycleForDate(resident, targetDate)?.key || null : null;
      moved.carryOut = targetDate.slice(0, 7) !== planForDate(targetDate).month;
      planForDate(targetDate).sessions.push(moved);
      markPlanDraft(planForDate(targetDate).month, "只更改本節");
    } else {
      const pattern = state.patterns.find(item => item.id === found.session.patternId);
      if (pattern) {
        const oldWeekday = weekdayIndex(sourceDate);
        pattern.weekdays = [...new Set(pattern.weekdays.filter(day => day !== oldWeekday).concat(weekdayIndex(targetDate)))]
          .sort((left, right) => left - right);
        pattern.time = targetTime;
        const sourceMonth = monthKey(sourceDate);
        Object.entries(state.plans).forEach(([month, plan]) => {
          if (month < sourceMonth) return;
          plan.sessions = plan.sessions.filter(session => session.patternId !== pattern.id);
          plan.sessions.push(...generatePatternSessions(pattern, month));
          markPlanDraft(month, "更新固定計劃");
        });
      }
    }
    saveState();
    render();
  }

  function moveSession(sessionId, targetDate, targetTime) {
    const found = findSession(sessionId);
    if (!found) return;
    const result = sessionSlotDropResult(sessionId, targetDate, targetTime);
    if (!result.valid) {
      renderStatusMessage(result.reason);
      return;
    }
    if (!found.session.patternId) {
      applySessionMove(sessionId, targetDate, targetTime, "date");
      return;
    }
    pendingMove = { sessionId, targetDate, targetTime };
    openScopePrompt({ sessionId, targetDate, targetTime });
  }

  function renderStatusMessage(message) {
    const issues = document.getElementById("tp2-issues") || document.getElementById("legacy-issues");
    if (!issues) return;
    issues.innerHTML = `<div class="tp2-issues"><strong>${escapeHtml(message)}</strong></div>`;
  }

  function addResidentToSlot(residentId, date, time) {
    const result = residentSlotDropResult(residentId, date, time);
    if (!result.valid) {
      renderStatusMessage(result.reason);
      return;
    }
    addSession(date, time, [residentId], { paid: state.serviceMode === "extra" });
    saveState();
    render();
  }

  function joinResidentToSession(residentId, sessionId) {
    const found = findSession(sessionId);
    if (!found) return;
    const result = residentToSessionResult(residentId, sessionId);
    if (!result.valid) {
      renderStatusMessage(result.reason);
      return;
    }
    const session = found.session;
    session.memberIds.push(residentId);
    session.format = "g";
    markPlanDraft(found.plan.month, "加入小組");
    saveState();
    render();
  }

  function mergeSessions(sourceId, targetId) {
    const sourceFound = findSession(sourceId);
    const targetFound = findSession(targetId);
    if (!sourceFound || !targetFound) return;
    const result = sessionsMergeResult(sourceId, targetId);
    if (!result.valid) {
      renderStatusMessage(result.reason);
      return;
    }
    const target = targetFound.session;
    target.memberIds = [
      ...new Set([...sourceFound.session.memberIds, ...target.memberIds])
    ];
    target.format = "g";
    removeSession(sourceId);
    markPlanDraft(targetFound.plan.month, "合併小組");
    saveState();
    render();
  }

  function detachSessionMember(sessionId, residentId) {
    const found = findSession(sessionId);
    if (!found) return null;
    found.session.memberIds = found.session.memberIds.filter(id => id !== residentId);
    if (!found.session.memberIds.length) {
      removeSession(sessionId);
    } else {
      found.session.format = found.session.memberIds.length === 1 ? "i" : "g";
      markPlanDraft(found.plan.month, "移出小組成員");
    }
    return found.session;
  }

  function moveMemberToSlot(residentId, sourceSessionId, targetDate, targetTime) {
    const result = memberSlotDropResult(
      residentId,
      sourceSessionId,
      targetDate,
      targetTime
    );
    if (!result.valid) {
      renderStatusMessage(result.reason);
      return;
    }
    const source = memberSessionContext(residentId, sourceSessionId);
    const sourceMeta = {
      paid: source.session.paid,
      activity: source.session.activity,
      staffMode: source.session.staffMode
    };
    detachSessionMember(sourceSessionId, residentId);
    const created = addSession(targetDate, targetTime, [residentId], {
      paid: sourceMeta.paid,
      activity: sourceMeta.activity,
      staffMode: sourceMeta.staffMode
    });
    created.patternId = null;
    saveState();
    render();
  }

  function moveMemberToSession(residentId, sourceSessionId, targetSessionId) {
    const result = memberToSessionResult(
      residentId,
      sourceSessionId,
      targetSessionId
    );
    if (!result.valid) {
      renderStatusMessage(result.reason);
      return;
    }
    const target = findSession(targetSessionId);
    detachSessionMember(sourceSessionId, residentId);
    target.session.memberIds.push(residentId);
    target.session.format = "g";
    markPlanDraft(target.plan.month, "移動小組成員");
    saveState();
    render();
  }

  function periodStats(weekStart) {
    const sessions = weekDates(weekStart).flatMap(date => allSessionEntries().filter(session => (
      session.date === date && sessionMatchesMode(session)
    )));
    return {
      sessions: sessions.length,
      headcount: sessions.reduce((sum, session) => sum + session.memberIds.length, 0)
    };
  }

  function movePeriod(direction) {
    if (state.view === "week") {
      state.activeWeek = addDays(state.activeWeek, direction * 7);
      state.activeMonth = monthKey(state.activeWeek);
    } else {
      state.activeMonth = shiftMonth(state.activeMonth, direction);
      state.activeWeek = startOfWeek(monthStart(state.activeMonth));
    }
    ensureCoverage(state.activeMonth);
    saveState();
    render();
  }

  function moveMonth(direction) {
    state.activeMonth = direction === 0
      ? currentMonth()
      : shiftMonth(state.activeMonth, direction);
    state.activeWeek = startOfWeek(monthStart(state.activeMonth));
    ensureCoverage(state.activeMonth);
    saveState();
    render();
  }

  function validateCurrentPlan() {
    const issues = collectIssues(state.activeMonth);
    if (issues.length) {
      renderStatusMessage(`時間表仍為草稿：${issues[0].message}${issues.length > 1 ? `，另有 ${issues.length - 1} 項` : ""}`);
      return;
    }
    const plan = ensurePlan(state.activeMonth);
    plan.status = "valid";
    plan.approvedAt = new Date().toISOString();
    saveState();
    render();
  }

  content.addEventListener("click", event => {
    const readonlyCell = event.target.closest(".tp2-cell.readonly[data-tp-date]");
    if (readonlyCell && !event.target.closest("[data-tp-session]")) {
      state.activeMonth = monthKey(readonlyCell.dataset.tpDate);
      state.activeWeek = startOfWeek(readonlyCell.dataset.tpDate);
      state.view = "week";
      ensureCoverage(state.activeMonth);
      render();
      return;
    }
    const view = event.target.closest("[data-tp-view]");
    if (view) {
      state.view = view.dataset.tpView;
      saveState();
      render();
      return;
    }
    const mode = event.target.closest("[data-tp-mode]");
    if (mode) {
      state.serviceMode = mode.dataset.tpMode;
      saveState();
      render();
      return;
    }
    const scope = event.target.closest("[data-tp-scope]");
    if (scope && pendingMove) {
      const move = pendingMove;
      pendingMove = null;
      scopeDialog.close();
      applySessionMove(move.sessionId, move.targetDate, move.targetTime, scope.dataset.tpScope);
      return;
    }
    const action = event.target.closest("[data-tp-action]");
    if (!action) return;
    if (action.dataset.tpAction === "prev") movePeriod(-1);
    if (action.dataset.tpAction === "next") movePeriod(1);
    if (action.dataset.tpAction === "today") {
      state.activeMonth = currentMonth();
      state.activeWeek = startOfWeek(TODAY_KEY);
      ensureCoverage(state.activeMonth);
      render();
    }
    if (action.dataset.tpAction === "autofill") openAutoFill();
    if (action.dataset.tpAction === "close-autofill") autofillDialog.close();
    if (action.dataset.tpAction === "confirm-autofill") confirmAutoFill();
    if (action.dataset.tpAction === "validate") validateCurrentPlan();
  });

  function clearTp2DropCues() {
    content.querySelectorAll(".dragging").forEach(item => item.classList.remove("dragging"));
    content.querySelectorAll(".tp2-cell.drop-valid,.tp2-cell.drop-invalid,.tp2-cell.drop-target")
      .forEach(cell => {
        cell.classList.remove("drop-valid", "drop-invalid", "drop-target");
        delete cell.dataset.dropReason;
      });
    content.querySelectorAll(".tp2-session.combine-valid,.tp2-session.combine-invalid")
      .forEach(session => session.classList.remove("combine-valid", "combine-invalid"));
  }

  function paintTp2DropCues(payload) {
    clearTp2DropCues();
    content.querySelectorAll(".tp2-cell[data-tp-date][data-tp-time]").forEach(cell => {
      const result = dropResultForSlot(payload, cell.dataset.tpDate, cell.dataset.tpTime);
      cell.classList.add(result.valid ? "drop-valid" : "drop-invalid");
      cell.dataset.dropReason = result.reason;
    });
  }

  content.addEventListener("dragstart", event => {
    const resident = event.target.closest("[data-tp-resident]");
    const session = event.target.closest("[data-tp-session]");
    const source = resident || session;
    if (!source) return;
    dragPayload = resident
      ? { type: "resident", residentId: resident.dataset.tpResident }
      : { type: "session", sessionId: session.dataset.tpSession };
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = resident ? "copy" : "move";
    }
    paintTp2DropCues(dragPayload);
    source.classList.add("dragging");
  });

  content.addEventListener("dragover", event => {
    const sessionCard = event.target.closest("[data-tp-session]");
    const cell = event.target.closest("[data-tp-date][data-tp-time]");
    if (!dragPayload || (!cell && !sessionCard)) return;
    const result = dropResultForSlot(
      dragPayload,
      cell.dataset.tpDate,
      cell.dataset.tpTime,
      sessionCard?.dataset.tpSession
    );
    event.preventDefault();
    content.querySelectorAll(".tp2-cell.drop-target")
      .forEach(item => item.classList.remove("drop-target"));
    content.querySelectorAll(".tp2-session.combine-valid,.tp2-session.combine-invalid")
      .forEach(item => item.classList.remove("combine-valid", "combine-invalid"));
    cell.classList.remove("drop-valid", "drop-invalid");
    cell.classList.add("drop-target", result.valid ? "drop-valid" : "drop-invalid");
    cell.dataset.dropReason = result.reason;
    if (sessionCard) {
      sessionCard.classList.add(result.valid ? "combine-valid" : "combine-invalid");
    }
  });

  content.addEventListener("drop", event => {
    const sessionCard = event.target.closest("[data-tp-session]");
    const cell = event.target.closest("[data-tp-date][data-tp-time]");
    if (!dragPayload || (!cell && !sessionCard)) return;
    const payload = dragPayload;
    const result = dropResultForSlot(
      payload,
      cell.dataset.tpDate,
      cell.dataset.tpTime,
      sessionCard?.dataset.tpSession
    );
    event.preventDefault();
    clearTp2DropCues();
    dragPayload = null;
    if (!result.valid) {
      renderStatusMessage(result.reason);
      return;
    }
    if (sessionCard && payload.type === "resident") {
      joinResidentToSession(payload.residentId, sessionCard.dataset.tpSession);
    } else if (sessionCard && payload.type === "session") {
      mergeSessions(payload.sessionId, sessionCard.dataset.tpSession);
    } else if (payload.type === "resident") {
      addResidentToSlot(payload.residentId, cell.dataset.tpDate, cell.dataset.tpTime);
    } else {
      moveSession(payload.sessionId, cell.dataset.tpDate, cell.dataset.tpTime);
    }
  });

  content.addEventListener("dragend", () => {
    dragPayload = null;
    clearTp2DropCues();
  });

  document.getElementById("tp2-scope-dialog").addEventListener("cancel", () => {
    pendingMove = null;
  });

  window.addEventListener("storage", event => {
    if (event.key !== STORAGE_KEY) return;
    state = readState();
    render();
  });

  const legacyDayNames = ["週一", "週二", "週三", "週四", "週五", "週六", "週日"];
  let legacyDragPayload = null;
  let legacyListenersBound = false;

  function clearLegacyDropCues() {
    content.querySelectorAll(".slot.drop-valid,.slot.drop-invalid,.slot.drop-target")
      .forEach(slot => {
        slot.classList.remove("drop-valid", "drop-invalid", "drop-target");
        delete slot.dataset.dropReason;
      });
    content.querySelectorAll(".session-card.combine-valid,.session-card.combine-invalid")
      .forEach(card => card.classList.remove("combine-valid", "combine-invalid"));
    content.querySelectorAll(".dragging").forEach(item => item.classList.remove("dragging"));
    content.querySelectorAll(".resident-panel.session-remove-target")
      .forEach(panel => panel.classList.remove("session-remove-target"));
  }

  function paintLegacyDropCues(payload) {
    clearLegacyDropCues();
    content.querySelectorAll(".slot[data-legacy-date][data-legacy-time]").forEach(slot => {
      const result = dropResultForSlot(
        payload,
        slot.dataset.legacyDate,
        slot.dataset.legacyTime
      );
      slot.classList.add(result.valid ? "drop-valid" : "drop-invalid");
      slot.dataset.dropReason = result.reason;
    });
  }

  function paintLegacyTargetCue(slot, targetSession, result) {
    content.querySelectorAll(".slot.drop-target")
      .forEach(item => item.classList.remove("drop-target"));
    content.querySelectorAll(".session-card.combine-valid,.session-card.combine-invalid")
      .forEach(card => card.classList.remove("combine-valid", "combine-invalid"));
    slot.classList.remove("drop-valid", "drop-invalid");
    slot.classList.add("drop-target", result.valid ? "drop-valid" : "drop-invalid");
    slot.dataset.dropReason = result.reason;
    if (targetSession) {
      targetSession.classList.add(result.valid ? "combine-valid" : "combine-invalid");
    }
  }

  function legacyDateLabel(date) {
    return `${date.slice(8, 10)}/${date.slice(5, 7)}`;
  }

  function legacyWeekRange(weekStart) {
    const end = endOfWeek(weekStart);
    return `${legacyDateLabel(weekStart)}–${legacyDateLabel(end)}`;
  }

  function legacySessionCard(session, compact = false) {
    const category =
      session.paid ? "extra" :
      session.memberIds.some(id => residentById.get(id)?.cadence === "biweekly") ? "biweekly" :
      "regular";
    const classNames = [
      "session-card",
      session.format === "g" ? "group" : "",
      session.paid ? "paid" : "",
      `category-${category}`,
      session.carryOut ? "carry" : ""
    ].filter(Boolean).join(" ");
    if (session.format === "g") {
      const members = session.memberIds.map(id => residentById.get(id)).filter(Boolean);
      const activitySets = members.map(member => new Set(member.activities || []));
      const first = [...(activitySets.shift() || [])];
      const common = first.filter(code => activitySets.every(set => set.has(code)));
      const activities = common.join(", ") || "－";
      const groupLabel = OT_PROTOTYPE.groupLabelForSession(allSessionEntries(), session);
      return `
        <div class="${classNames}" draggable="true" data-legacy-session="${session.id}" data-spec-ids="BH-006-005,BH-006-014,BH-006-016,BH-006-022,BH-006-023,BH-006-031,BH-006-032,BH-006-033">
          <div class="group-heading" data-spec-ids="BH-006-016,BH-006-033">
            <span class="format-mark">${groupLabelMarkup(groupLabel || "G1")}</span>
            <span class="suggested-activity" title="組員共同建議的活動性質">${escapeHtml(activities)}</span>
            <span class="group-capacity">${members.length}/${GROUP_LIMIT}</span>
          </div>
          <div class="group-members">
            ${members.map(member => `
              <div class="schedule-resident-card" draggable="true"
                data-legacy-member="${member.id}" data-legacy-member-session="${session.id}"
                data-spec-ids="BH-006-005,BH-006-031">
                <span class="bed-number">${escapeHtml(member.bed)}</span>
                <span class="schedule-resident-name">${escapeHtml(member.name)}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
    const member = residentById.get(session.memberIds[0]);
    return `
      <div class="${classNames}" draggable="true" data-legacy-session="${session.id}" data-spec-ids="BH-006-005,BH-006-014,BH-006-016,BH-006-022,BH-006-023,BH-006-032">
        <div class="individual-line">
          <span class="format-mark">${session.paid ? "ei" : "i"}</span>
          <span class="bed-number">${escapeHtml(member?.bed || "")}</span>
          <span class="session-name">${escapeHtml(member?.name || "")}</span>
        </div>
      </div>
    `;
  }

  function legacySlotMarkup(date, time, monthView) {
    const sessions = sessionsAt(date, time).filter(sessionMatchesMode);
    if (!monthView) {
      return `<div class="slot-sessions">${sessions.map(session => legacySessionCard(session)).join("")}</div>`;
    }
    const direct = sessions.filter(session => (
      session.paid ||
      session.memberIds.some(id => residentById.get(id)?.cadence === "biweekly")
    ));
    const regular = sessions.filter(session => !direct.includes(session));
    const headcount = regular.reduce((sum, session) => sum + session.memberIds.length, 0);
    return `
      <div class="direct-cards slot-sessions">
        ${direct.map(session => legacySessionCard(session, true)).join("")}
      </div>
      ${regular.length ? `
        <button class="compact-summary ${regular.some(session => session.format === "g") ? "group" : "individual"}"
          type="button" data-legacy-expand-slot disabled>
          <strong>${headcount} 人 · ${regular.length} 節</strong>
        </button>
      ` : ""}
      ${!sessions.length ? '<span class="slot-empty-label">吉位</span>' : ""}
    `;
  }

  function legacyGridMarkup(weekStart, monthView = false) {
    const dates = serviceDates(weekStart);
    return `
      <div class="${monthView ? "month-grid" : "week-grid"}">
        <div class="time-head" aria-hidden="true"></div>
        ${dates.map((date, index) => `
          <div class="day-head ${index === dates.length - 1 ? "day-last" : ""} ${date.slice(0, 7) !== state.activeMonth ? "outside-month" : ""}">
            <span>${legacyDateLabel(date)}</span>
            <span>${legacyDayNames[weekdayIndex(date)]}</span>
            ${staffOnDuty(date) === null ? '<em class="missing-rota">缺更表</em>' : ""}
          </div>
        `).join("")}
        ${TIMES.map(time => `
          <div class="time-label ${isLunchTime(time) ? "lunch" : ""}">${time}</div>
          ${dates.map((date, index) => {
            const readonly = date.slice(0, 7) !== state.activeMonth;
            return `
              <div class="slot ${isLunchTime(time) ? "lunch" : ""} ${readonly ? "readonly" : ""} ${index === dates.length - 1 ? "day-last" : ""}"
                data-legacy-date="${date}" data-legacy-time="${time}"
                data-spec-ids="BH-006-005,BH-006-006,BH-006-019,BH-006-021,BH-006-029">
                ${legacySlotMarkup(date, time, monthView)}
              </div>
            `;
          }).join("")}
        `).join("")}
      </div>
    `;
  }

  function legacyQueueMarkup() {
    const visible = queueResidents();
    const weekly = visible.filter(resident => resident.cadence === "weekly");
    const biweekly = visible.filter(resident => resident.cadence === "biweekly");
    const residentRow = resident => {
      const progress = residentProgress(resident);
      const cycleSummary = resident.cadence === "biweekly"
        ? progress.cycles.map(cycle => (
            `${cycle.start.slice(5)}–${cycle.end.slice(5)} ${cycleSessionCount(resident.id, cycle.key) ? "✓" : "○"}`
          )).join(" · ")
        : "";
      return `
        <button class="resident-row ${progress.count >= progress.target ? "complete" : ""}"
          type="button" draggable="true" data-legacy-resident="${resident.id}"
          data-spec-ids="${resident.cadence === "biweekly"
            ? "BH-006-004,BH-006-005,BH-006-012,BH-006-027"
            : "BH-006-004,BH-006-005,BH-006-026"}"
          title="${escapeHtml(cycleSummary)}">
          <span class="resident-name">
            <span class="bed-number">${escapeHtml(resident.bed)}</span>
            ${escapeHtml(resident.name)}
          </span>
          <span class="resident-progress">
            <span class="progress-value">${progress.count}/${progress.target}</span>
            <small>${escapeHtml(progress.label)}</small>
          </span>
        </button>
      `;
    };
    return state.serviceMode === "extra"
      ? `
        <section class="queue-group">
          <header class="queue-title"><span>額外服務 · ${visible.length} 位</span></header>
          <div class="queue-list">${visible.map(residentRow).join("") || '<div class="queue-empty">沒有住客</div>'}</div>
        </section>
      `
      : `
        <section class="queue-group">
          <header class="queue-title"><span>每週需要 · ${weekly.length} 位</span><span>${weekly.filter(resident => residentProgress(resident).count < residentProgress(resident).target).length} 位尚欠</span></header>
          <div class="queue-list">${weekly.map(residentRow).join("") || '<div class="queue-empty">沒有住客</div>'}</div>
        </section>
        <section class="queue-group">
          <header class="queue-title"><span>14 日週期 · ${biweekly.length} 位</span><span>${biweekly.filter(resident => residentProgress(resident).count < residentProgress(resident).target).length} 位尚欠</span></header>
          <div class="queue-list">${biweekly.map(residentRow).join("") || '<div class="queue-empty">沒有住客</div>'}</div>
        </section>
      `;
  }

  function legacyCadenceMarkup() {
    const weeks = calendarRows(state.activeMonth);
    return weeks.map(weekStart => {
      const dates = serviceDates(weekStart);
      const sessions = dates.flatMap(date => allSessionEntries().filter(session => (
        session.date === date && sessionMatchesMode(session)
      )));
      return `
        <button class="cadence-week ${weekStart === state.activeWeek ? "active" : ""}" type="button"
          data-legacy-week="${weekStart}" data-spec-ids="BH-006-002,BH-006-021">
          <strong>${legacyWeekRange(weekStart)}</strong>
          <span class="week-count">${sessions.length} 節</span>
        </button>
      `;
    }).join("");
  }

  function legacyScheduleMarkup() {
    if (state.view === "week") {
      return legacyGridMarkup(state.activeWeek, false);
    }
    return `
      <div class="month-stack">
        ${calendarRows(state.activeMonth).map(weekStart => {
          const dates = serviceDates(weekStart);
          const sessions = dates.flatMap(date => allSessionEntries().filter(session => (
            session.date === date && sessionMatchesMode(session)
          )));
          return `
            <section class="month-week">
              ${legacyGridMarkup(weekStart, true)}
              <footer class="month-week-foot">
                <strong>${legacyWeekRange(weekStart)}${weekStart.slice(0, 7) !== endOfWeek(weekStart).slice(0, 7) ? " · 跨月" : ""}</strong>
                <span>${sessions.length} 節 · ${sessions.reduce((sum, session) => sum + session.memberIds.length, 0)} 人次</span>
              </footer>
            </section>
          `;
        }).join("")}
      </div>
    `;
  }

  function legacyPlanLabel() {
    const plan = ensurePlan(state.activeMonth);
    const issues = collectIssues(state.activeMonth);
    return `${plan.status === "valid" ? "時間表已有效" : "草稿"} · ${plan.sourcePlanId ? `沿用 ${plan.sourcePlanId}` : "新計劃"} · ${issues.length} 項需處理`;
  }

  function renderLegacyShell() {
    ensureCoverage(state.activeMonth);
    saveState();
    content.innerHTML = `
      <div class="workbench">
        <article class="resident-panel" aria-label="住客清單">
          <div class="service-switch">
            <div class="segmented" role="tablist" aria-label="服務類型">
              <button class="${state.serviceMode === "basic" ? "active" : ""}" type="button"
                role="tab" aria-selected="${state.serviceMode === "basic"}" data-legacy-mode="basic"
                data-spec-ids="BH-006-019,BH-006-030">基本</button>
              <button class="${state.serviceMode === "extra" ? "active" : ""}" type="button"
                role="tab" aria-selected="${state.serviceMode === "extra"}" data-legacy-mode="extra"
                data-spec-ids="BH-006-019,BH-006-030">額外服務</button>
            </div>
          </div>
          <div class="resident-queue" id="legacy-resident-queue">${legacyQueueMarkup()}</div>
        </article>
        <article class="schedule-panel" aria-label="訓練時段">
          <section class="cadence" id="legacy-cadence"
            style="grid-template-columns:repeat(${calendarRows(state.activeMonth).length}, minmax(150px,1fr));overflow-x:auto;">
            ${legacyCadenceMarkup()}
          </section>
          <div class="schedule-toolbar">
            <div class="schedule-toolbar-group">
              <div class="segmented" role="group" aria-label="月份" style="align-items:center;">
                <button type="button" data-legacy-action="prev-month" aria-label="上一個月" data-spec-ids="BH-006-001,BH-006-021">←</button>
                <strong data-legacy-month-label style="min-width:88px;padding:0 6px;text-align:center;">${monthLabel(state.activeMonth)}</strong>
                <button type="button" data-legacy-action="next-month" aria-label="下一個月" data-spec-ids="BH-006-001,BH-006-021">→</button>
                <button type="button" data-legacy-action="current-month" data-spec-ids="BH-006-028">本月</button>
              </div>
              <div class="segmented" role="group" aria-label="時間表檢視">
                <button class="${state.view === "week" ? "active" : ""}" type="button"
                  data-legacy-view="week" aria-pressed="${state.view === "week"}"
                  data-spec-ids="BH-006-001,BH-006-002">週</button>
                <button class="${state.view === "month" ? "active" : ""}" type="button"
                  data-legacy-view="month" aria-pressed="${state.view === "month"}"
                  data-spec-ids="BH-006-001,BH-006-003,BH-006-015,BH-006-017">月</button>
              </div>
              <button class="btn" type="button" data-legacy-action="autofill"
                data-spec-ids="BH-006-010,BH-006-020">自動填入</button>
            </div>
            <div class="schedule-toolbar-group schedule-toolbar-actions">
              <button class="btn icon-btn" type="button" disabled title="復原上一步" aria-label="復原上一步" data-spec-ids="BH-006-009">↶</button>
              <button class="btn icon-btn" type="button" disabled title="重做" aria-label="重做" data-spec-ids="BH-006-009">↷</button>
              <button class="btn btn-primary" type="button" data-legacy-action="complete" data-spec-ids="BH-006-013,BH-006-030">${state.serviceMode === "extra" ? "完成額外服務" : "完成時間表"}</button>
            </div>
          </div>
          <div id="legacy-issues"></div>
          <div class="schedule-scroll" id="legacy-schedule">${legacyScheduleMarkup()}</div>
        </article>
      </div>
      <small class="save-status-corner" id="legacy-save">${escapeHtml(legacyPlanLabel())}</small>
      <dialog class="scope-dialog" id="legacy-scope-dialog" aria-label="變更範圍"
        data-spec-ids="BH-006-011">
        <div class="scope-options" role="group" aria-label="變更範圍">
          <button class="scope-option" type="button" data-legacy-scope="date"
            data-spec-ids="BH-006-011">只更改本節</button>
          <button class="scope-option" type="button" data-legacy-scope="recurring"
            data-spec-ids="BH-006-011">更改所有相關節數</button>
        </div>
      </dialog>
    `;
    document.getElementById("legacy-scope-dialog")?.addEventListener("cancel", () => {
      pendingMove = null;
    });
    const issues = collectIssues(state.activeMonth);
    if (issues.length) {
      document.getElementById("legacy-issues").innerHTML = `
        <div class="tp2-issues"><strong>${issues.length} 項需要處理</strong><ul>${issues.slice(0, 8).map(issue => `<li>${escapeHtml(issue.message)}</li>`).join("")}</ul></div>
      `;
    }
    bindLegacyEvents();
  }

  function legacyShowToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(legacyShowToast.timer);
    legacyShowToast.timer = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function legacyComplete() {
    const issues = collectIssues(state.activeMonth);
    if (issues.length) {
      legacyShowToast(`時間表仍為草稿：${issues[0].message}`);
      return;
    }
    const plan = ensurePlan(state.activeMonth);
    plan.status = "valid";
    plan.approvedAt = new Date().toISOString();
    saveState();
    renderLegacyShell();
    legacyShowToast("時間表已標為有效。");
  }

  function legacyOpenAutofill() {
    buildAutoFill();
    const dialog = document.getElementById("autofill-dialog");
    const list = document.getElementById("autofill-list");
    if (!dialog || !list) return;
    const selectedTimes = new Set(autofillGroupTimes());
    const timeOptions = document.getElementById("autofill-time-options");
    if (timeOptions) {
      timeOptions.innerHTML = TIMES
        .filter(time => !isLunchTime(time))
        .map(time => `
          <label><input type="checkbox" data-legacy-autofill-time="${time}" ${selectedTimes.has(time) ? "checked" : ""}> ${time}</label>
        `).join("");
    }
    list.innerHTML = `
      <div class="autofill-summary-total"><strong>可新增 ${autoFillCandidates.length} 節</strong><span>${unresolvedAutoFill.length} 項未能安排</span></div>
      ${autoFillCandidates.length ? `<ul>${autoFillCandidates.map(session => `<li>${session.date} ${session.time} · ${escapeHtml(sessionTitle(session))}</li>`).join("")}</ul>` : ""}
      ${unresolvedAutoFill.length ? `<div class="autofill-exceptions"><strong>未能安排</strong><ul>${unresolvedAutoFill.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : ""}
    `;
    dialog.showModal();
  }

  function legacyConfirmAutofill() {
    autoFillCandidates.forEach(session => {
      const plan = planForDate(session.date);
      session.carryOut = session.date.slice(0, 7) !== plan.month;
      session.planned = false;
      plan.sessions.push(session);
      markPlanDraft(plan.month, "自動填入");
    });
    autoFillCandidates = [];
    document.getElementById("autofill-dialog")?.close();
    saveState();
    renderLegacyShell();
  }

  function removableToQueuePayload() {
    if (!legacyDragPayload) return null;
    if (legacyDragPayload.type === "member") return legacyDragPayload;
    if (legacyDragPayload.type === "session") {
      const found = findSession(legacyDragPayload.sessionId);
      if (found && found.session.memberIds.length === 1) return legacyDragPayload;
    }
    return null;
  }

  function bindLegacyEvents() {
    if (!legacyListenersBound) {
      legacyListenersBound = true;
      content.addEventListener("click", event => {
        const mode = event.target.closest("[data-legacy-mode]");
        if (mode) {
          state.serviceMode = mode.dataset.legacyMode;
          saveState();
          renderLegacyShell();
          return;
        }
        const view = event.target.closest("[data-legacy-view]");
        if (view) {
          state.view = view.dataset.legacyView;
          saveState();
          renderLegacyShell();
          return;
        }
        const week = event.target.closest("[data-legacy-week]");
        if (week) {
          state.activeWeek = week.dataset.legacyWeek;
          state.view = "week";
          saveState();
          renderLegacyShell();
          return;
        }
        const scope = event.target.closest("[data-legacy-scope]");
        if (scope && pendingMove) {
          const move = pendingMove;
          pendingMove = null;
          document.getElementById("legacy-scope-dialog")?.close();
          applySessionMove(move.sessionId, move.targetDate, move.targetTime, scope.dataset.legacyScope);
          return;
        }
        const action = event.target.closest("[data-legacy-action]");
        if (!action) return;
        if (action.dataset.legacyAction === "prev-month") moveMonth(-1);
        if (action.dataset.legacyAction === "next-month") moveMonth(1);
        if (action.dataset.legacyAction === "current-month") moveMonth(0);
        if (action.dataset.legacyAction === "prev") movePeriod(-1);
        if (action.dataset.legacyAction === "next") movePeriod(1);
        if (action.dataset.legacyAction === "autofill") legacyOpenAutofill();
        if (action.dataset.legacyAction === "complete") legacyComplete();
      });
      content.addEventListener("dragstart", event => {
        const member = event.target.closest("[data-legacy-member]");
        if (member) {
          legacyDragPayload = {
            type: "member",
            residentId: member.dataset.legacyMember,
            sessionId: member.dataset.legacyMemberSession
          };
          if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
          paintLegacyDropCues(legacyDragPayload);
          member.classList.add("dragging");
          return;
        }
        const resident = event.target.closest("[data-legacy-resident]");
        const session = event.target.closest("[data-legacy-session]");
        const source = resident || session;
        if (!source) return;
        legacyDragPayload = resident
          ? { type: "resident", residentId: resident.dataset.legacyResident }
          : { type: "session", sessionId: session.dataset.legacySession };
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = resident ? "copy" : "move";
        }
        paintLegacyDropCues(legacyDragPayload);
        source.classList.add("dragging");
      });
      content.addEventListener("dragover", event => {
        const slot = event.target.closest("[data-legacy-date][data-legacy-time]");
        if (!legacyDragPayload || !slot) return;
        const targetSession = event.target.closest("[data-legacy-session]");
        const result = dropResultForSlot(
          legacyDragPayload,
          slot.dataset.legacyDate,
          slot.dataset.legacyTime,
          targetSession?.dataset.legacySession
        );
        event.preventDefault();
        paintLegacyTargetCue(slot, targetSession, result);
      });
      content.addEventListener("drop", event => {
        const slot = event.target.closest("[data-legacy-date][data-legacy-time]");
        const targetSession = event.target.closest("[data-legacy-session]");
        if (!legacyDragPayload || !slot) return;
        const payload = legacyDragPayload;
        const result = dropResultForSlot(
          payload,
          slot.dataset.legacyDate,
          slot.dataset.legacyTime,
          targetSession?.dataset.legacySession
        );
        event.preventDefault();
        clearLegacyDropCues();
        legacyDragPayload = null;
        if (!result.valid) {
          renderStatusMessage(result.reason);
          return;
        }
        if (payload.type === "member" && targetSession) {
          moveMemberToSession(
            payload.residentId,
            payload.sessionId,
            targetSession.dataset.legacySession
          );
        } else if (payload.type === "member") {
          moveMemberToSlot(
            payload.residentId,
            payload.sessionId,
            slot.dataset.legacyDate,
            slot.dataset.legacyTime
          );
        } else if (payload.type === "resident" && targetSession) {
          joinResidentToSession(payload.residentId, targetSession.dataset.legacySession);
        } else if (payload.type === "resident") {
          addResidentToSlot(
            payload.residentId,
            slot.dataset.legacyDate,
            slot.dataset.legacyTime
          );
        } else if (targetSession) {
          mergeSessions(payload.sessionId, targetSession.dataset.legacySession);
        } else {
          moveSession(
            payload.sessionId,
            slot.dataset.legacyDate,
            slot.dataset.legacyTime
          );
        }
      });
      content.addEventListener("dragend", () => {
        legacyDragPayload = null;
        clearLegacyDropCues();
      });
      content.addEventListener("dragover", event => {
        const panel = event.target.closest(".resident-panel");
        if (!panel || !removableToQueuePayload()) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
        panel.classList.add("session-remove-target");
      });
      content.addEventListener("dragleave", event => {
        const panel = event.target.closest(".resident-panel");
        if (panel && !panel.contains(event.relatedTarget)) {
          panel.classList.remove("session-remove-target");
        }
      });
      content.addEventListener("drop", event => {
        const panel = event.target.closest(".resident-panel");
        if (!panel) return;
        panel.classList.remove("session-remove-target");
        const payload = removableToQueuePayload();
        if (!payload) return;
        event.preventDefault();
        if (payload.type === "member") {
          detachSessionMember(payload.sessionId, payload.residentId);
        } else {
          removeSession(payload.sessionId);
        }
        legacyDragPayload = null;
        saveState();
        render();
        legacyShowToast("已移出時間表，住客已移回左側清單。");
      });
      document.addEventListener("click", event => {
        const scopeDialog = event.target.closest?.("#legacy-scope-dialog");
        if (scopeDialog && event.target === scopeDialog) {
          scopeDialog.close();
          pendingMove = null;
          return;
        }
        if (event.target.closest('[data-action="close-dialog"]')) {
          document.getElementById("autofill-dialog")?.close();
        }
        if (event.target.closest('[data-action="confirm-autofill"]')) {
          legacyConfirmAutofill();
        }
      });
      document.addEventListener("change", event => {
        if (!event.target.matches("[data-legacy-autofill-time]")) return;
        saveAutofillGroupTimes(
          [...document.querySelectorAll("[data-legacy-autofill-time]:checked")]
            .map(input => input.dataset.legacyAutofillTime)
        );
      });
    }
    openScopePrompt = move => {
      pendingMove = move;
      document.getElementById("legacy-scope-dialog")?.showModal();
    };
  }

  render = renderLegacyShell;

  window.OT_TRAINING_PLANNER = Object.freeze({
    storageKey: STORAGE_KEY,
    state: () => clone(state),
    calendarRows,
    weekDates,
    startOfWeek,
    endOfWeek,
    cyclesForMonth,
    cycleForDate,
    collectIssues,
    ensurePlan,
    render
  });

  ensureCoverage(state.activeMonth);
  saveState();
  render();
})();
