(() => {
  const HOME_CODE = window.OT_HOME_SETTINGS?.getActiveHomeCode?.() || "yt";
  const HOME_LIST = window.OT_HOME_SETTINGS?.getHomeList?.() || [{ code: "yt" }];
  const HOME_INDEX = Math.max(0, HOME_LIST.findIndex(home => home.code === HOME_CODE));
  const TOTAL_RESIDENTS = HOME_INDEX === 0 ? 50 : 18;
  const baseResidents = [
    {
      id: "r1", bed: "A12", name: "陳大文", place: "券位", floor: "1樓",
      status: "active", statusLabel: "活躍", infection: "VRE",
      icpDue: "2026-11-14", lastAssessment: "2026-10-03", icpState: "待填 ICP",
      sex: "男", dob: "1948-03-12", age: "78", education: "4–6 年",
      history: "HT · DM", orientation: "時 v · 地 v · 人 ×",
      mobility: "IW", mbi: "72 / 100", moca: "21 / 30",
      lastIcp: "2026-05-14", icpType: "6個月",
      trainingFrequency: "2次/星期", extraServices: "1",
      activityCodes: ["1", "3", "O"],
      activities: "腳單車 · 站立 · 現實環境導向活動",
      timeline: [["入院", "2024-08-01"], ["留醫中", "2026-10-05"], ["最近更新", "2026-10-03"]]
    },
    {
      id: "r2", bed: "B07", name: "李秀英", place: "買位", floor: "1樓",
      status: "active", statusLabel: "活躍", infection: "Nil",
      icpDue: "2026-12-08", lastAssessment: "2026-10-04", icpState: "已完成",
      sex: "女", dob: "1939-11-20", age: "86", education: "4–6 年",
      history: "HT · CVA", orientation: "時 v · 地 x · 人 x",
      mobility: "IWC", mbi: "84 / 100", moca: "24 / 30",
      lastIcp: "2026-06-08", icpType: "6個月",
      trainingFrequency: "2次/星期", extraServices: "0",
      activityCodes: ["4", "8", "C"],
      activities: "步行 · 上肢主動 · 認知訓練",
      timeline: [["入院", "2025-02-18"], ["最近更新", "2026-10-04"]]
    },
    {
      id: "r3", bed: "A23", name: "張婆婆", place: "券位", floor: "2樓",
      status: "active", statusLabel: "活躍", infection: "Nil",
      icpDue: "2026-10-20", lastAssessment: "2026-09-28", icpState: "待評估",
      sex: "女", dob: "1940-05-06", age: "86", education: "1–3 年",
      history: "Dementia · HT", orientation: "時 x · 地 v · 人 x",
      mobility: "CB", mbi: "74 / 100", moca: "19 / 30",
      lastIcp: "2026-04-20", icpType: "6個月",
      trainingFrequency: "2次/星期", extraServices: "2",
      activityCodes: ["R", "C", "3"],
      activities: "懷緬活動 · 認知訓練 · 站立",
      timeline: [["入院", "2024-04-25"], ["最近更新", "2026-09-28"]]
    },
    {
      id: "r4", bed: "C08", name: "梁伯", place: "買位", floor: "1樓",
      status: "active", statusLabel: "活躍", infection: "Nil",
      icpDue: "2026-12-02", lastAssessment: "2026-10-12", icpState: "已完成",
      sex: "男", dob: "1942-09-15", age: "84", education: "4–6 年",
      history: "PD · HT", orientation: "時 v · 地 v · 人 v",
      mobility: "IW", mbi: "81 / 100", moca: "23 / 30",
      lastIcp: "2026-06-02", icpType: "6個月",
      trainingFrequency: "2次/星期", extraServices: "0",
      activityCodes: ["4", "8", "3"],
      activities: "步行 · 上肢主動 · 站立",
      timeline: [["入院", "2025-08-11"], ["最近更新", "2026-10-12"]]
    },
    {
      id: "r5", bed: "C15", name: "黃伯", place: "私位", floor: "2樓",
      status: "hospital", statusLabel: "留醫中", infection: "Nil",
      icpDue: "2026-10-31", lastAssessment: "2026-10-05", icpState: "待填 ICP",
      sex: "男", dob: "1950-01-24", age: "76", education: "7–9 年",
      history: "DM · CVA Lt.", orientation: "時 v · 地 v · 人 v",
      mobility: "IWC", mbi: "68 / 100", moca: "—",
      lastIcp: "2026-04-30", icpType: "1年",
      trainingFrequency: "2次/月", extraServices: "1",
      activityCodes: ["7", "5", "A"],
      activities: "手單車 · 下肢主動 · 日常生活訓練",
      timeline: [["入院", "2023-11-12"], ["留醫中", "2026-10-05"], ["最近更新", "2026-10-05"]]
    },
    {
      id: "r6", bed: "D04", name: "何美好", place: "暫託", floor: "3樓",
      status: "active", statusLabel: "活躍", infection: "Nil",
      icpDue: "2026-11-04", lastAssessment: "2026-09-30", icpState: "已完成",
      sex: "女", dob: "1945-07-08", age: "81", education: "4–6 年",
      history: "HT", orientation: "時 v · 地 v · 人 x",
      mobility: "IWC", mbi: "65 / 100", moca: "—",
      lastIcp: "2026-05-04", icpType: "6個月",
      trainingFrequency: "2次/月", extraServices: "1",
      activityCodes: ["R", "8", "A"],
      activities: "懷緬活動 · 上肢主動 · 日常活動",
      timeline: [["入院", "2026-09-30"], ["最近更新", "2026-09-30"]]
    },
    {
      id: "r7", bed: "E02", name: "容姐", place: "券位", floor: "1樓",
      status: "active", statusLabel: "活躍", infection: "Nil",
      icpDue: "2026-11-28", lastAssessment: "2026-10-06", icpState: "待評估",
      sex: "女", dob: "1952-02-17", age: "74", education: "7–9 年",
      history: "HT · DM", orientation: "時 v · 地 v · 人 v",
      mobility: "IWC", mbi: "77 / 100", moca: "22 / 30",
      lastIcp: "2026-05-28", icpType: "6個月",
      trainingFrequency: "2次/星期", extraServices: "1",
      activityCodes: ["9", "C", "A"],
      activities: "被動運動 · 認知訓練 · 日常活動",
      timeline: [["入院", "2025-05-19"], ["最近更新", "2026-10-06"]]
    }
  ];

  const extraNames = [
    "周志強", "吳美玲", "林秀珍", "鄭國華", "劉玉蘭", "蔡家輝", "謝淑儀", "楊永康",
    "許翠芳", "郭錦榮", "馬惠芳", "羅德明", "高麗珍", "徐文輝", "胡少娟", "朱偉成",
    "曾鳳儀", "鄧志明", "馮美華", "彭國雄", "葉雅芳", "鍾世傑", "江嘉欣", "潘榮發",
    "袁月娥", "盧子健", "姚婉玲", "范浩然", "唐寶儀", "石達明", "譚素貞", "邱建業",
    "溫美儀", "廖俊傑", "簡小玲", "呂宏達", "蘇佩珊", "蔣耀祖", "陸靜文", "韓國強",
    "岑秀芳", "沈振興", "翁美珍", "康文傑"
  ];
  const activityOptions = [
    ["C", "5"], ["8", "4"], ["C", "8"], ["R", "3"], ["5", "9"],
    ["O", "8"], ["A", "3"], ["C", "4"]
  ];
  const activityLabels = {
    "1": "腳單車", "3": "站立", "4": "步行", "5": "下肢主動", "7": "手單車",
    "8": "上肢主動", "9": "被動運動", C: "認知訓練", R: "懷緬活動",
    O: "現實導向", A: "日常活動"
  };
  const usedBeds = new Set(baseResidents.map(resident => resident.bed));
  const availableBeds = [];
  for (const letter of "ABCDEFGHIJ") {
    for (let number = 1; number <= 40; number += 1) {
      const bed = `${letter}${String(number).padStart(2, "0")}`;
      if (!usedBeds.has(bed)) availableBeds.push(bed);
    }
  }

  const homeBaseResidents = HOME_INDEX === 0
    ? baseResidents
    : baseResidents.map((resident, index) => ({
        ...resident,
        name: extraNames[(HOME_INDEX * 5 + index) % extraNames.length],
        infection: index === 0 ? "CPE" : index === 4 ? "MRSA" : "Nil",
        activities: resident.activities,
        timeline: resident.timeline.map(item => [...item])
      }));
  const residents = homeBaseResidents.map(resident => ({
    ...resident,
    activityCodes: [...resident.activityCodes],
    timeline: resident.timeline.map(item => [...item])
  }));
  for (let index = 0; index < TOTAL_RESIDENTS - baseResidents.length; index += 1) {
    const weekly = index < 35;
    const place = weekly
      ? (index % 2 === 0 ? "券位" : "買位")
      : (index % 2 === 0 ? "私位" : "暫託");
    const bed = availableBeds[index];
    const bedNumber = Number(bed.slice(1));
    const floor = bedNumber <= 10 ? "1樓" : bedNumber <= 20 ? "2樓" : "3樓";
    const status = index % 13 === 10 ? "hospital" : "active";
    const month = [10, 10, 11, 11, 12][index % 5];
    const dueDay = 4 + (index * 3) % 24;
    const assessmentMonth = month === 10 ? 9 : month - 1;
    const activityCodes = activityOptions[index % activityOptions.length];
    const admissionYear = 2022 + index % 4;
    const dobYear = 1938 + index % 20;
    const dueDate = `2026-${String(month).padStart(2, "0")}-${String(dueDay).padStart(2, "0")}`;
    const assessmentDate = `2026-${String(assessmentMonth).padStart(2, "0")}-${String(5 + index % 20).padStart(2, "0")}`;

    residents.push({
      id: `r${index + 8}`,
      bed,
      name: extraNames[(HOME_INDEX * 7 + index) % extraNames.length],
      place,
      floor,
      status,
      statusLabel: status === "hospital" ? "留醫中" : "活躍",
      infection: index % 9 === 0 ? "MRSA" : "Nil",
      icpDue: dueDate,
      lastAssessment: assessmentDate,
      icpState: ["待評估", "待填 ICP", "已完成"][index % 3],
      sex: index % 2 === 0 ? "女" : "男",
      dob: `${dobYear}-${String(1 + index % 12).padStart(2, "0")}-${String(2 + index % 24).padStart(2, "0")}`,
      age: String(2026 - dobYear),
      education: ["1–3 年", "4–6 年", "7–9 年"][index % 3],
      history: [["HT", "DM"], ["HT", "CVA"], ["Dementia", "HT"], ["PD"]][index % 4].join(" · "),
      orientation: index % 4 === 0 ? "時 v · 地 v · 人 x" : "時 v · 地 v · 人 v",
      mobility: ["IW", "IWC", "CB"][index % 3],
      mbi: `${58 + index % 36} / 100`,
      moca: index % 6 === 0 ? "—" : `${16 + index % 12} / 30`,
      lastIcp: `2026-0${1 + index % 6}-${String(4 + index % 20).padStart(2, "0")}`,
      icpType: index % 7 === 0 ? "1年" : "6個月",
      trainingFrequency: weekly ? "2次/星期" : "2次/月",
      extraServices: String(index % 3),
      activityCodes,
      activities: activityCodes.map(code => activityLabels[code]).join(" · "),
      timeline: [
        ["入院", `${admissionYear}-${String(1 + index % 12).padStart(2, "0")}-${String(3 + index % 24).padStart(2, "0")}`],
        ["最近更新", assessmentDate]
      ]
    });
  }

  window.OT_MOCK_RESIDENTS = residents;
  window.OT_MOCK_RESIDENT_TOTAL = TOTAL_RESIDENTS;
  window.OT_MOCK_HOME_CODE = HOME_CODE;
  window.OT_MOCK_STORAGE_KEYS = Object.freeze({
    trainingSchedule: `ot006.training-schedule.v8.${HOME_CODE}`,
    autofillTimes: `ot.training.autofill-times.v3.${HOME_CODE}`,
    records: `ot007.records.v3.${HOME_CODE}`,
    icpCycles: `ot.icp.cycles.v4.${HOME_CODE}`,
    assessmentDraft: `ot.assessment.active-draft.v2.${HOME_CODE}`
  });
})();
