(function () {
  const STORAGE_KEY = "ot.home-settings.v1";
  const ACTIVE_HOME_KEY = "ot.active-home.v1";

  const homes = [
    ["co", "一城富璟"],
    ["ss", "上水富璟"],
    ["tp", "大埔富樺"],
    ["f2", "花二富璟"],
    ["f3", "花三富璟"],
    ["w1", "威一慶楠"],
    ["tw", "荃灣慶楠"],
    ["sp", "深水慶楠"],
    ["e1", "聖輝"],
    ["kt", "觀塘慶樺"],
    ["yt", "油塘康璟"],
    ["sk", "新崗康璟"],
    ["qb", "鰂魚富璟"]
  ];

  const profileDefaults = {
    co: { totalBeds: 120, voucherBeds: 68, monthlyTherapistHours: 42 },
    ss: { totalBeds: 100, voucherBeds: 56, monthlyTherapistHours: 36 },
    tp: { totalBeds: 130, voucherBeds: 76, monthlyTherapistHours: 44 },
    f2: { totalBeds: 110, voucherBeds: 60, monthlyTherapistHours: 40 },
    f3: { totalBeds: 115, voucherBeds: 62, monthlyTherapistHours: 40 },
    w1: { totalBeds: 96, voucherBeds: 52, monthlyTherapistHours: 36 },
    tw: { totalBeds: 105, voucherBeds: 58, monthlyTherapistHours: 38 },
    sp: { totalBeds: 108, voucherBeds: 60, monthlyTherapistHours: 40 },
    e1: { totalBeds: 90, voucherBeds: 44, monthlyTherapistHours: 34 },
    kt: { totalBeds: 125, voucherBeds: 72, monthlyTherapistHours: 42 },
    yt: { totalBeds: 120, voucherBeds: 65, monthlyTherapistHours: 40 },
    sk: { totalBeds: 118, voucherBeds: 66, monthlyTherapistHours: 40 },
    qb: { totalBeds: 102, voucherBeds: 58, monthlyTherapistHours: 38 }
  };

  const defaults = Object.fromEntries(homes.map(([code, name]) => [
    code,
    {
      code,
      name,
      licenseNumber: code === "yt" ? "1498" : "",
      groupLimit: 4,
      lunchStart: "12:00",
      lunchEnd: "13:00",
      urgentIcpRule: "none",
      ...profileDefaults[code]
    }
  ]));

  function readStore() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return value && typeof value === "object" ? value : {};
    } catch (error) {
      return {};
    }
  }

  function notify(source) {
    window.dispatchEvent(new CustomEvent("ot-home-settings-changed", { detail: { source } }));
  }

  function normalize(code, values = {}) {
    const base = defaults[code];
    const totalBeds = Math.max(1, Math.min(999, Number(values.totalBeds ?? base.totalBeds) || 1));
    const voucherBeds = Math.max(0, Math.min(totalBeds, Number(values.voucherBeds ?? base.voucherBeds) || 0));
    const monthlyTherapistHours = Math.max(0, Math.min(744, Number(values.monthlyTherapistHours ?? base.monthlyTherapistHours) || 0));
    const groupLimit = Math.max(1, Math.min(20, Number(values.groupLimit ?? base.groupLimit) || 1));
    let lunchStart = /^\d{2}:\d{2}$/.test(values.lunchStart ?? "")
      ? values.lunchStart
      : base.lunchStart;
    let lunchEnd = /^\d{2}:\d{2}$/.test(values.lunchEnd ?? "")
      ? values.lunchEnd
      : base.lunchEnd;
    if (lunchStart >= lunchEnd) {
      lunchStart = base.lunchStart;
      lunchEnd = base.lunchEnd;
    }
    const urgentIcpRule = ["none", "restart", "current"].includes(values.urgentIcpRule)
      ? values.urgentIcpRule
      : base.urgentIcpRule;
    return {
      code,
      name: String(values.name ?? base.name).trim() || base.name,
      licenseNumber: String(values.licenseNumber ?? base.licenseNumber).trim(),
      monthlyTherapistHours,
      totalBeds,
      voucherBeds,
      groupLimit,
      lunchStart,
      lunchEnd,
      urgentIcpRule
    };
  }

  function saveHome(code, values) {
    if (!defaults[code]) throw new Error("Unknown home code");
    const store = readStore();
    store[code] = normalize(code, values);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    notify("save");
    return store[code];
  }

  function getActiveHomeCode() {
    try {
      const code = localStorage.getItem(ACTIVE_HOME_KEY);
      return defaults[code] ? code : "yt";
    } catch (error) {
      return "yt";
    }
  }

  function setActiveHome(code) {
    if (!defaults[code]) throw new Error("Unknown home code");
    localStorage.setItem(ACTIVE_HOME_KEY, code);
    notify("active-home");
    return code;
  }

  function getHome(code = getActiveHomeCode()) {
    return normalize(code, readStore()[code] || {});
  }

  function getHomeList() {
    return homes.map(([code]) => getHome(code));
  }

  window.OT_HOME_SETTINGS = Object.freeze({
    storageKey: STORAGE_KEY,
    activeHomeKey: ACTIVE_HOME_KEY,
    defaults,
    getActiveHomeCode,
    setActiveHome,
    getHome,
    getHomeList,
    saveHome
  });
}());
