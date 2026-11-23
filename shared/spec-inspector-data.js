(() => {
  window.OT_SPEC_INSPECTOR_DATA = Object.freeze({
  "sourceHash": "6ddf5cbc155fe52fb5228e8dabaeabb73d11fba0fa84d8da5801823dfd95189b",
  "sourceFiles": [
    "spec/canonical/rules.tsv",
    "spec/canonical/rule-fields.tsv",
    "spec/canonical/tests.tsv",
    "spec/canonical/drafts/high-risk-tests.tsv",
    "spec/canonical/uat-scenarios.tsv",
    "field-spec-live/ICP.tsv",
    "field-spec-live/交更.tsv",
    "field-spec-live/住客管理.tsv",
    "field-spec-live/待辦事項.tsv",
    "field-spec-live/復康運動紀錄.tsv",
    "field-spec-live/訓練時間表.tsv",
    "field-spec-live/評估系統.tsv",
    "field-spec-live/院舍設定.tsv"
  ],
  "specs": [
    {
      "id": "BH-HO-001",
      "legacyId": "BH-HO-001",
      "module": "交更",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "右欄結構",
      "trigger": "",
      "rule": "右欄上方固定顯示交更訊息，下方顯示跟進貼文，整個右欄可以捲動。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-023",
          "given": "已開啟交更，並具備所需權限。",
          "when": "查看右欄。",
          "then": "右欄上方固定顯示交更訊息，下方顯示跟進貼文，整個右欄可以捲動。",
          "expectedErrors": "交更訊息或跟進貼文被遮擋無法捲動，或兩者位置對調。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-HO-002",
      "legacyId": "BH-HO-002",
      "module": "交更",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "頻道",
      "trigger": "開啟交更",
      "rule": "交更頁面設有公告頻道及所選院舍的院舍頻道，可在右欄切換頻道。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-024",
          "given": "已載入院舍資料。",
          "when": "開啟交更。",
          "then": "可見公告頻道及所選院舍的院舍頻道，並可在右欄切換。",
          "expectedErrors": "只見一個頻道，或右欄無法切換頻道。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-HO-003",
      "legacyId": "BH-HO-003",
      "module": "交更",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "頻道",
      "trigger": "生成交更訊息",
      "rule": "系統按 HO-003 至 HO-016 的欄位自動產生所選院舍的交更訊息，顯示於院舍頻道；每個欄位的內容在資料規格說明。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-025",
          "given": "已符合產生交更訊息的條件。",
          "when": "產生交更訊息。",
          "then": "交更訊息顯示於所選院舍的院舍頻道。",
          "expectedErrors": "交更訊息顯示在其他院舍的頻道。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-HO-004",
      "legacyId": "BH-HO-004",
      "module": "交更",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "發文權限",
      "trigger": "在頻道發文",
      "rule": "一部分同事可在公告頻道發文；院舍頻道則由該院舍的同事發文。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-026",
          "given": "已開啟頻道發文功能。",
          "when": "在頻道發文。",
          "then": "一部分同事可在公告頻道發文；院舍頻道則由該院舍的同事發文。",
          "expectedErrors": "沒有權限的同事成功發文，或該院舍同事無法在自己院舍的頻道發文。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-HO-006",
      "legacyId": "BH-HO-006",
      "module": "交更",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "交更訊息",
      "trigger": "上月 ICP 未完成",
      "rule": "上月 ICP 未完成時，保留上月 ICP 完成進度段落；完成後段落保留至該工作日結束，然後自動移除。",
      "condition": "",
      "reads": [
        "HO-011",
        "HO-012"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-027",
          "given": "上月 ICP 尚未完成。",
          "when": "產生交更訊息，其後完成上月 ICP。",
          "then": "未完成時保留上月 ICP 完成進度段落；完成後段落保留至該工作日結束，然後自動移除。",
          "expectedErrors": "完成後段落即時消失，或翌日仍保留在交更內。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-HO-007",
      "legacyId": "BH-HO-007",
      "module": "交更",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "交更訊息",
      "trigger": "",
      "rule": "自動產生的交更內容不可修改；發文者可為每段加備註。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-028",
          "given": "已開啟「交更訊息」，並具備所需權限。",
          "when": "查看交更訊息。",
          "then": "自動產生的內容不可修改，可為每段加備註。",
          "expectedErrors": "自動產生的內容被修改，或無法為段落加備註。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-HO-008",
      "legacyId": "BH-HO-008",
      "module": "交更",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "交更訊息",
      "trigger": "",
      "rule": "交更訊息按日期列出歷史記錄，可按日期篩選及搜尋。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-029",
          "given": "已開啟「交更訊息」，並具備所需權限。",
          "when": "查看交更歷史。",
          "then": "交更訊息按日期列出歷史記錄，可按日期篩選及搜尋。",
          "expectedErrors": "歷史記錄沒有按日期排列，或無法篩選及搜尋。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-HO-009",
      "legacyId": "BH-HO-009",
      "module": "交更",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "發文",
      "trigger": "發文時",
      "rule": "發文者可選擇「公告事項」或「任務」；選擇「任務」時，系統建立對應的待辦。",
      "condition": "",
      "reads": [],
      "writes": [
        "TODO-017"
      ],
      "tests": [
        {
          "id": "TST-017",
          "given": "使用者建立「任務」形式的交更貼文",
          "when": "為任務設定負責人及到期日",
          "then": "同一項目出現在待辦清單",
          "expectedErrors": "系統建立兩個互不相關的項目"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-GLOBAL-001",
      "legacyId": "BH-GLOBAL-002",
      "module": "Global",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "院舍範圍",
      "trigger": "所有畫面",
      "rule": "所有系統只顯示所選院舍的資料。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-030",
          "given": "系統已載入各院舍的資料。",
          "when": "開啟任何畫面。",
          "then": "只顯示所選院舍的資料。",
          "expectedErrors": "看到其他院舍的資料。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-GLOBAL-002",
      "legacyId": "BH-GLOBAL-003",
      "module": "Global",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "首頁",
      "trigger": "",
      "rule": "首頁是工作台：主欄顯示待辦分組，右欄顯示交更，首頁只放待辦及交更。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-031",
          "given": "已登入並具備所需權限。",
          "when": "開啟「首頁」。",
          "then": "主欄顯示待辦分組，右欄顯示交更，首頁不出現待辦及交更以外的內容。",
          "expectedErrors": "首頁顯示待辦及交更以外的內容，或兩欄位置對調。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-GLOBAL-003",
      "legacyId": "BH-GLOBAL-004",
      "module": "Global",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "語言",
      "trigger": "所有畫面",
      "rule": "介面及操作文字使用繁體中文；評估系統用到的臨床英文術語保留英文。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-032",
          "given": "各畫面已開啟可使用。",
          "when": "檢查介面及操作文字。",
          "then": "文字使用繁體中文；只有評估系統用到的臨床英文術語保留英文。",
          "expectedErrors": "出現例外以外的英文文字，或改用簡體中文。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-GLOBAL-004",
      "legacyId": "NEW-GLOBAL-001",
      "module": "Global",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "審計",
      "trigger": "臨床或營運操作",
      "rule": "出現登入、建立、修改、完成、作廢、取消退住、刪除、列印、匯出或權限變更時，系統記錄操作者、時間、院舍及變更前後值。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-104",
          "given": "有人登入、建立、修改、完成、作廢、取消退住、刪除、列印、匯出或變更權限。",
          "when": "操作成功。",
          "then": "產生審計紀錄，包括操作者、時間、院舍及變更前後值。",
          "expectedErrors": "其中一種指定操作沒有留下審計紀錄，或紀錄缺少操作者、時間或變更前後值。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-GLOBAL-005",
      "legacyId": "NEW-GLOBAL-002",
      "module": "Global",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "審計紀錄",
      "trigger": "",
      "rule": "資深同事及中央管理員可以查看所屬範圍的審計紀錄；一般用戶看不到審計紀錄的入口。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-105",
          "given": "系統已有審計紀錄。",
          "when": "資深同事、中央管理員及一般用戶查看紀錄。",
          "then": "資深同事及中央管理員看到所屬範圍的審計紀錄，一般用戶看不到查看入口。",
          "expectedErrors": "一般用戶可以查看審計紀錄，或資深同事及中央管理員無法查看。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-GLOBAL-006",
      "legacyId": "NEW-GLOBAL-003",
      "module": "Global",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "裝置及離線",
      "trigger": "",
      "rule": "介面支援 laptop 及 tablet，不支援 phone。第一版不提供離線資料輸入；停機時改用紙本備用流程，並以文件說明做法。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-109",
          "given": "分別以 laptop、tablet、phone 或離線環境開啟系統。",
          "when": "檢查介面及資料輸入。",
          "then": "laptop 及 tablet 可操作；phone 不支援；離線時不可輸入資料，並提示改用紙本備用流程。",
          "expectedErrors": "phone 被標示為支援，或離線時看似可輸入資料但沒有提示。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-001",
      "legacyId": "BH-RES-001",
      "module": "住客管理",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "主畫面",
      "trigger": "",
      "rule": "住客管理主區顯示住客名冊。住客詳情以單頁分區顯示基本資料、臨床概況、ICP 週期、訓練安排及住客紀錄。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-033",
          "given": "已開啟住客詳情，並具備所需權限。",
          "when": "查看住客詳情。",
          "then": "基本資料、臨床概況、ICP 週期、訓練安排及住客紀錄以單頁分區顯示。",
          "expectedErrors": "仍以分頁切換五個部分。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-002",
      "legacyId": "BH-RES-002",
      "module": "住客管理",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "住客清單",
      "trigger": "",
      "rule": "住客清單顯示床號、姓名、宿位、狀態、入住日期、下次 ICP 限期及最近評估日期；顯示欄位可以自行調整。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-034",
          "given": "已開啟「住客清單」，並具備所需權限。",
          "when": "查看住客清單。",
          "then": "清單顯示床號、姓名、宿位、狀態、入住日期、下次 ICP 限期及最近評估日期。",
          "expectedErrors": "缺少上述任何一個欄位。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-003",
      "legacyId": "BH-RES-003",
      "module": "住客管理",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "住客清單",
      "trigger": "",
      "rule": "欄位可顯示或隱藏、拖曳排序，欄位偏好會儲存，下次開畫面仍跟隨。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-035",
          "given": "已開啟「住客清單」，並具備所需權限。",
          "when": "顯示或隱藏欄位、拖曳排序。",
          "then": "顯示即時跟隨操作，欄位偏好儲存後下次仍跟隨。",
          "expectedErrors": "欄位偏好沒有儲存，或排序改變不生效。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-004",
      "legacyId": "BH-RES-004",
      "module": "住客管理",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "住客清單",
      "trigger": "",
      "rule": "住客清單提供新增住客、開啟詳情、快速更改狀態及退住操作，亦可開啟退住清單查看已退住住客。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-036",
          "given": "已開啟「住客清單」，並具備所需權限。",
          "when": "查看清單可用操作。",
          "then": "提供新增住客、開啟詳情、快速更改狀態、退住及查看退住清單。",
          "expectedErrors": "缺少上述任何一個操作。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-005",
      "legacyId": "BH-RES-005",
      "module": "住客管理",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "新增住客",
      "trigger": "有住客入住",
      "rule": "確認入住後，系統建立住客基本紀錄、ICP 週期及初始評估任務。",
      "condition": "",
      "reads": [],
      "writes": [
        "RES-001",
        "RES-015",
        "RES-023",
        "RES-024",
        "RES-025"
      ],
      "tests": [
        {
          "id": "TST-001",
          "given": "住客獲安排入住",
          "when": "職員確認入住",
          "then": "系統建立住客紀錄、第一個 ICP 週期、初始評估任務及相關待辦",
          "expectedErrors": "只建立部分紀錄，令住客資料不一致"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-006",
      "legacyId": "BH-RES-006",
      "module": "住客管理",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "退住",
      "trigger": "有住客退住",
      "rule": "住客退住後，系統更新住客狀態及狀態紀錄，以退住原因結束或取消進行中的 ICP 週期並保留歷史，取消所有未完成的住客相關待辦，最後只建立一項待辦：「將已列印評估由文件夾 E 交院舍保存」。",
      "condition": "",
      "reads": [],
      "writes": [
        "RES-016"
      ],
      "tests": [
        {
          "id": "TST-002",
          "given": "住客有進行中的 ICP、未來住客待辦及已列印評估。",
          "when": "確認退住。",
          "then": "系統更新住客狀態及狀態紀錄，結束或取消進行中的 ICP 並保留歷史，取消未來住客待辦，最後只建立「將已列印評估由文件夾 E 交院舍保存」待辦。",
          "expectedErrors": "ICP 歷史被刪除、其他退住待辦仍被建立，或文件夾 E 待辦被取消。"
        },
        {
          "id": "TST-004",
          "given": "住客有進行中的 ICP 週期",
          "when": "住客退住",
          "then": "系統以退住原因結束或取消該週期，歷史仍可查閱",
          "expectedErrors": "ICP 歷史被刪除"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-014",
      "legacyId": "BH-RES-014",
      "module": "住客管理",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "宿位",
      "trigger": "住客宿位改變",
      "rule": "住客宿位改變時，系統重新計算其所需訓練次數，訓練時間表的每週／每月節數要求及缺漏檢查亦一併更新；宿位與頻率的對應仍查詢資料規格。",
      "condition": "",
      "reads": [
        "RES-006"
      ],
      "writes": [
        "RES-007"
      ],
      "tests": [
        {
          "id": "TST-037",
          "given": "住客宿位已改變。",
          "when": "系統重算訓練要求。",
          "then": "所需訓練次數重新計算，訓練時間表的每週／每月節數要求及缺漏檢查一併更新。",
          "expectedErrors": "節數要求仍按舊宿位的頻率。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-015",
      "legacyId": "BH-RES-015",
      "module": "住客管理",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "退住",
      "trigger": "記錄退住",
      "rule": "住客退住後，除 BH-RES-006 指明的待辦外，該住客其餘未完成的住客相關待辦一律取消。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-003",
          "given": "住客有未來的住客相關待辦",
          "when": "住客退住",
          "then": "系統取消未來住客相關待辦",
          "expectedErrors": "連住院、ICP 或院舍層面的待辦亦被取消"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-017",
      "legacyId": "BH-RES-017",
      "module": "住客管理",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "退住",
      "trigger": "記錄退住",
      "rule": "住客退住後，自動移出 006 訓練時間表。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-038",
          "given": "住客已安排在 006 訓練時間表。",
          "when": "記錄退住。",
          "then": "該住客自動移出 006 訓練時間表。",
          "expectedErrors": "時間表仍留有已退住住客。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-018",
      "legacyId": "BH-RES-018",
      "module": "住客管理",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "退住",
      "trigger": "記錄退住",
      "rule": "住客退住後，不再向該住客發出 007a／007c 紀錄要求。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-039",
          "given": "住客有 007a／007c 紀錄要求。",
          "when": "記錄退住。",
          "then": "不再向該住客發出 007a／007c 紀錄要求。",
          "expectedErrors": "退住住客仍被要求填寫 007 紀錄。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-019",
      "legacyId": "BH-RES-019",
      "module": "住客管理",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "退住",
      "trigger": "記錄退住",
      "rule": "住客退住後，其臨床及相關營運歷史紀錄保留 7 年，包括評估、ICP、007、狀態及審計紀錄。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-040",
          "given": "住客有評估、ICP、007、狀態及審計歷史。",
          "when": "記錄退住。",
          "then": "臨床及相關營運歷史紀錄保留 7 年。",
          "expectedErrors": "任何一類歷史紀錄被提早刪除。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-020",
      "legacyId": "BH-RES-020",
      "module": "住客管理",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "退住",
      "trigger": "記錄退住",
      "rule": "住客退住後，系統自動把該住客加入下一次交更的退住名單。",
      "condition": "",
      "reads": [],
      "writes": [
        "HO-004"
      ],
      "tests": [
        {
          "id": "TST-041",
          "given": "住客即將退住。",
          "when": "記錄退住。",
          "then": "該住客加入下一次交更的退住名單。",
          "expectedErrors": "下一次交更沒有列出已退住住客。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-021",
      "legacyId": "BH-RES-021",
      "module": "住客管理",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "退住",
      "trigger": "取消退住",
      "rule": "退住可以取消；系統保留退住及取消退住的審計紀錄。",
      "condition": "",
      "reads": [],
      "writes": [
        "RES-016"
      ],
      "tests": [
        {
          "id": "TST-042",
          "given": "住客已退住。",
          "when": "取消退住。",
          "then": "退住被取消，退住及取消退住的審計紀錄保留。",
          "expectedErrors": "沒有留下退住或取消退住的審計紀錄。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-022",
      "legacyId": "BH-RES-022",
      "module": "住客管理",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "臨床資料",
      "trigger": "評估完成",
      "rule": "臨床欄位以該住客最新一份已完成評估更新：MBI、MoCA、MoCA 百分位、現實導向、活動現況、建議活動性質／內容及病歷。",
      "condition": "",
      "reads": [],
      "writes": [
        "RES-017",
        "RES-018",
        "RES-019",
        "RES-020",
        "RES-021",
        "RES-027",
        "RES-029",
        "RES-030",
        "RES-031"
      ],
      "tests": [
        {
          "id": "TST-043",
          "given": "住客有一份最新已完成的評估。",
          "when": "系統更新臨床欄位。",
          "then": "MBI、MoCA、MoCA 百分位、現實導向、活動現況、建議活動性質／內容及病歷按最新已完成評估更新。",
          "expectedErrors": "臨床欄位仍使用較舊評估的資料。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-023",
      "legacyId": "BH-RES-023",
      "module": "住客管理",
      "entryType": "TRANSITION",
      "entryTypeLabel": "狀態轉換",
      "scope": "評估",
      "trigger": "更正已完成評估",
      "rule": "評估更正後，臨床衍生欄位按更正後的資料重新計算。",
      "condition": "評估仍為有效",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-005",
          "given": "臨床衍生欄位來自某份評估",
          "when": "已完成的評估被更正",
          "then": "系統依更正後的評估重新計算衍生欄位",
          "expectedErrors": "衍生欄位仍保留更正前的資料"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-024",
      "legacyId": "BH-RES-023",
      "module": "住客管理",
      "entryType": "TRANSITION",
      "entryTypeLabel": "狀態轉換",
      "scope": "評估",
      "trigger": "作廢評估",
      "rule": "評估作廢後，臨床衍生欄位按最新仍有效的評估重新計算；沒有有效評估時清空。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-006",
          "given": "某份評估是最新有效評估",
          "when": "該評估被作廢",
          "then": "系統改用最新仍有效的評估；沒有有效評估時清空欄位",
          "expectedErrors": "系統仍以已作廢評估作為來源"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-025",
      "legacyId": "NEW-RES-001",
      "module": "住客管理",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "入住容量",
      "trigger": "確認入住",
      "rule": "入住前，系統檢查院舍總床位及券位床位上限；已達上限時不能確認入住並提示。留醫住客在退住前仍佔用床位及券位。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-106",
          "given": "院舍床位或券位已達上限。",
          "when": "確認新住客入住。",
          "then": "入住被阻止並提示已達上限。",
          "expectedErrors": "入住成功而沒有上限提示。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-RES-026",
      "legacyId": "NEW-RES-002",
      "module": "住客管理",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "臨床概況",
      "trigger": "",
      "rule": "臨床概況只顯示相關 Ax 的編號、日期及評估性質，不加其他 Ax 詳細資料。",
      "condition": "",
      "reads": [
        "AX-001",
        "AX-004",
        "AX-005"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-111",
          "given": "住客有已完成的 Ax。",
          "when": "開啟住客詳情臨床概況。",
          "then": "顯示相關 Ax 的編號、日期及評估性質，不顯示其他 Ax 詳細資料。",
          "expectedErrors": "缺少 Ax 編號、日期或評估性質，或顯示不必要的 Ax 詳細資料。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-TODO-001",
      "legacyId": "BH-TODO-001",
      "module": "待辦事項",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "主欄",
      "trigger": "",
      "rule": "待辦按逾期、今日、本週分組；更遠的待辦收納在可展開的「之後」分組。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-044",
          "given": "已開啟工作台，並具備所需權限。",
          "when": "查看待辦欄。",
          "then": "待辦按逾期、今日、本週分組，更遠的收納在可展開的「之後」分組。",
          "expectedErrors": "待辦沒有分組，或「之後」分組無法展開。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-TODO-005",
      "legacyId": "BH-TODO-006",
      "module": "待辦事項",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "自動待辦",
      "trigger": "建立自動待辦",
      "rule": "自動產生的待辦一律設有期限。",
      "condition": "",
      "reads": [],
      "writes": [
        "TODO-006",
        "TODO-017"
      ],
      "tests": [
        {
          "id": "TST-045",
          "given": "系統準備自動產生待辦。",
          "when": "自動產生待辦。",
          "then": "每個自動產生的待辦也設有期限。",
          "expectedErrors": "自動產生的待辦沒有期限。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-TODO-006",
      "legacyId": "BH-TODO-009",
      "module": "待辦事項",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "到期日",
      "trigger": "建立自建待辦時未設定限期",
      "rule": "自建待辦沒有設定限期時，會顯示在「今日」，一直保留至完成。",
      "condition": "",
      "reads": [],
      "writes": [
        "TODO-013"
      ],
      "tests": [
        {
          "id": "TST-046",
          "given": "要建立自建待辦。",
          "when": "建立時不設限期。",
          "then": "該項顯示在「今日」，一直保留至完成。",
          "expectedErrors": "沒有設限期的自建待辦不出現在「今日」，或未到完成就消失。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-TODO-007",
      "legacyId": "BH-TODO-010",
      "module": "待辦事項",
      "entryType": "TRANSITION",
      "entryTypeLabel": "狀態轉換",
      "scope": "完成",
      "trigger": "完成待辦",
      "rule": "完成待辦後，系統記錄完成者姓名及時間，項目由待辦欄移入已完成清單。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-047",
          "given": "待辦尚未完成。",
          "when": "完成該待辦。",
          "then": "記錄完成者姓名及時間，項目由待辦欄移入已完成清單。",
          "expectedErrors": "沒有記錄完成者或時間，或項目仍留在待辦欄。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-TODO-008",
      "legacyId": "BH-TODO-011",
      "module": "待辦事項",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "操作",
      "trigger": "開啟待辦列",
      "rule": "獲指派院舍的用戶可以建立手動待辦；手動待辦只有建立者可修改或刪除；自動產生的待辦不可修改或刪除；待辦列提供「完成」操作。",
      "condition": "",
      "reads": [],
      "writes": [
        "TODO-011"
      ],
      "tests": [
        {
          "id": "TST-048",
          "given": "已獲指派院舍。",
          "when": "建立手動待辦，再由建立者修改及刪除。",
          "then": "可建立手動待辦；只有建立者可修改或刪除；自動產生的待辦不可修改或刪除。",
          "expectedErrors": "非建立者也能修改或刪除手動待辦，或自動待辦被刪除。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-TODO-009",
      "legacyId": "BH-TODO-012",
      "module": "待辦事項",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "重複性",
      "trigger": "週期屆滿",
      "rule": "重複性待辦按其週期重設；「已完成」清單只保留該待辦最近一次完成紀錄。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-008",
          "given": "重複性待辦已有完成紀錄",
          "when": "再次完成該待辦",
          "then": "待辦重設至下一週期，已完成清單只保留最近一次完成紀錄",
          "expectedErrors": "已完成清單顯示所有歷史完成紀錄"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-TODO-010",
      "legacyId": "BH-TODO-013",
      "module": "待辦事項",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "留醫",
      "trigger": "住客留醫期間",
      "rule": "住客留醫期間，只有與該住客直接相關的待辦會按留醫日數順延，包括初始評估、交更任務及自建待辦；ICP 限期、每週核對及院舍層面待辦不順延。",
      "condition": "",
      "reads": [
        "TODO-010",
        "TODO-013"
      ],
      "writes": [
        "TODO-013"
      ],
      "tests": [
        {
          "id": "TST-009",
          "given": "住客相關待辦有未來到期日",
          "when": "住客留醫後出院",
          "then": "系統按留醫日數順延該待辦到期日",
          "expectedErrors": "院舍層面或 ICP 限期待辦亦被順延"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-TODO-011",
      "legacyId": "BH-TODO-016",
      "module": "待辦事項",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "逾期",
      "trigger": "重複性待辦的限期已過",
      "rule": "錯過的重複性待辦以「逾期」顯示，一週後消失。",
      "condition": "",
      "reads": [
        "TODO-011",
        "TODO-013"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-049",
          "given": "重複性待辦的限期已過。",
          "when": "查看待辦欄。",
          "then": "該待辦以「逾期」顯示，一週後消失。",
          "expectedErrors": "逾期沒有標示，或一週後仍留在待辦欄。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-TODO-012",
      "legacyId": "BH-TODO-017",
      "module": "待辦事項",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "「我的」分頁",
      "trigger": "",
      "rule": "待辦的「我的」分頁顯示負責人為空、屬於我的職級或指派給我的待辦；指派給其他同事姓名的項目不會顯示。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-050",
          "given": "已開啟待辦清單，並具備所需權限。",
          "when": "切換至「我的」分頁。",
          "then": "顯示負責人為空、屬於我的職級或指派給我的待辦；指派給其他同事的不顯示。",
          "expectedErrors": "「我的」分頁出現指派給其他同事的項目，或指派給我的項目沒有顯示。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-001",
      "legacyId": "BH-006-001",
      "module": "訓練時間表",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "檢視切換",
      "trigger": "",
      "rule": "訓練時間表預設顯示一週，可以切換顯示一個月。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-051",
          "given": "已開啟 006 訓練時間表，並具備所需權限。",
          "when": "切換檢視。",
          "then": "預設顯示一週，可以切換顯示一個月。",
          "expectedErrors": "不能切換月檢視，或預設不是週檢視。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-002",
      "legacyId": "BH-006-002",
      "module": "訓練時間表",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "週期選擇",
      "trigger": "",
      "rule": "週檢視以上方週期卡選擇要查看的一週；不設左右箭頭切換上一週或下一週。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-052",
          "given": "週檢視已開啟。",
          "when": "選擇另一個週期卡。",
          "then": "畫面切換至所選週期；沒有左右上一週／下一週箭頭。",
          "expectedErrors": "仍以左右箭頭切換週期，或週期卡不能選擇週期。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-003",
      "legacyId": "BH-006-003",
      "module": "訓練時間表",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "月檢視",
      "trigger": "",
      "rule": "「月檢視」按星期一至日的實際日期範圍由上至下排列，可以上下捲動查看整個月；不顯示第 1、2、3 週等週次名稱。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-053",
          "given": "已開啟 006 訓練時間表，並具備所需權限。",
          "when": "切換至月檢視。",
          "then": "月檢視按星期一至日的實際日期範圍由上至下排列，可上下捲動查看整個月，不顯示第 1、2、3 週等週次名稱。",
          "expectedErrors": "月份區段仍以第 1、2、3 週命名。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-004",
      "legacyId": "BH-006-004",
      "module": "訓練時間表",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "左側清單",
      "trigger": "",
      "rule": "左側清單分開顯示每週住客及 14 日週期住客：每週住客顯示本週進度，14 日週期住客顯示當月動態週期進度，例如 0/2 或 0/3。",
      "condition": "",
      "reads": [
        "006-005"
      ],
      "writes": [
        "006-023"
      ],
      "tests": [
        {
          "id": "TST-054",
          "given": "訓練時間表同時有每週住客及私位／暫託住客。",
          "when": "查看左側清單。",
          "then": "每週住客與 14 日週期住客分開顯示；週期住客按當月實際週期數顯示 0/2 或 0/3。",
          "expectedErrors": "仍以固定每月兩節顯示，或兩類住客沒有分開。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-005",
      "legacyId": "BH-006-005",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "拖放",
      "trigger": "拖放住客",
      "rule": "可以把住客由左側清單拖入時段，或由一個時段拖到另一個時段。",
      "condition": "",
      "reads": [
        "006-011"
      ],
      "writes": [
        "006-011"
      ],
      "tests": [
        {
          "id": "TST-055",
          "given": "時間表已載入可編排的住客及時段。",
          "when": "把住客由左側清單拖入時段，或拖到另一個時段。",
          "then": "住客按拖放位置排入時段。",
          "expectedErrors": "拖放後住客沒有排入目標時段，或原時段沒有更新。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-006",
      "legacyId": "BH-006-006",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "拖放",
      "trigger": "拖放期間",
      "rule": "拖放開始時，全部可見時段按實際驗證結果顯示綠色或紅色；懸停目標有更強標示，小組合併目標亦顯示可否合併；被阻止的拖放顯示原因。",
      "condition": "缺少 T/A 更表、職員衝突、組容量已滿、同一小組住客不同樓層、基本與額外服務混合合併、週期或付費要求已達、住院或退住、住客每日基本或額外節數上限、ES／組內／吉位 Vacancy 使用衝突、當日或時段節數上限、午膳、相鄰月份唯讀日期",
      "reads": [
        "006-005",
        "006-008",
        "006-009",
        "006-010",
        "006-019",
        "006-020",
        "006-021"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-056",
          "given": "訓練時間表已有 T/A 更表，並同時存在有效及無效放置目標。",
          "when": "開始拖放住客或節數，懸停有效、無效及小組合併目標，再放到無效目標。",
          "then": "全部可見時段即時以綠色或紅色顯示；懸停目標有更強標示；小組合併目標顯示可否合併；無效放置後顯示原因且不儲存。",
          "expectedErrors": "只有單一懸停格改變顏色、無效目標沒有紅色、原因立即消失，或無效放置仍儲存。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-009",
      "legacyId": "BH-006-009",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "儲存",
      "trigger": "有效拖放後",
      "rule": "系統自動儲存；可復原上一步；無效拖放不會儲存。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-057",
          "given": "剛完成一次拖放。",
          "when": "查看儲存狀態並復原上一步。",
          "then": "有效拖放自動儲存，可復原上一步；無效拖放不會儲存。",
          "expectedErrors": "無效拖放被儲存，或復原不能回退上一步。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-010",
      "legacyId": "BH-006-010",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "自動填入",
      "trigger": "新增每週住客",
      "rule": "新增每週住客時，可用相同星期及相同時段自動填入其餘週；儲存前顯示預覽。",
      "condition": "",
      "reads": [],
      "writes": [
        "006-011"
      ],
      "tests": [
        {
          "id": "TST-058",
          "given": "有新的每週住客需要排期。",
          "when": "使用自動填入新增每週住客。",
          "then": "相同星期及相同時段自動填入其餘週，儲存前顯示預覽。",
          "expectedErrors": "自動填入的星期或時段不符，或沒有預覽直接儲存。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-011",
      "legacyId": "BH-006-011",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "改動範圍",
      "trigger": "編輯時段",
      "rule": "編輯時段時只提供兩個範圍選項：「只更改本節」只調整選取節數；「更改所有相關節數」由選取節數起更改相關固定安排及之後月份；畫面不顯示額外說明文字。",
      "condition": "",
      "reads": [],
      "writes": [
        "006-030"
      ],
      "tests": [
        {
          "id": "TST-059",
          "given": "系統已載入已有固定安排及未來月份計劃的訓練時間表。",
          "when": "移動一個實際日期節數並開啟改動範圍。",
          "then": "畫面只有「只更改本節」及「更改所有相關節數」兩個選項，沒有額外說明文字；前者只改選取節數，後者由選取節數起更改相關及未來計劃，不重寫歷史。",
          "expectedErrors": "顯示第三個範圍、顯示額外說明文字，或「更改所有相關節數」改寫已完成紀錄。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-012",
      "legacyId": "BH-006-012",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "14 日週期",
      "trigger": "安排私位/暫託",
      "rule": "私位及暫託住客在每個固定 14 日週期內需要一節基本訓練；週期由入院日開始、包含首尾日期，不按月份重置，兩節之間亦沒有七日間距規定。",
      "condition": "同一週期已有基本訓練時阻止另一節基本訓練；兩個相鄰週期可使用相鄰日期。",
      "reads": [
        "006-023",
        "006-024",
        "006-025",
        "006-004"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-011",
          "given": "私位住客有固定 14 日週期及入院日作錨定日期",
          "when": "使用者在同一週期安排第二節基本訓練",
          "then": "系統阻止同一週期的第二節基本訓練，但允許相鄰週期使用相鄰日期",
          "expectedErrors": "系統要求七日間距、按月份重置週期，或允許同一週期兩節"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-013",
      "legacyId": "BH-006-013",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "有效性",
      "trigger": "時間表未能符合所有要求",
      "rule": "月度計劃只有在涵蓋範圍、週期、日期、人員及資源要求全部符合時才可標為有效。",
      "condition": "完整週要求未完成、14 日週期未安排、重複日期或節數、同一週期跨月重複計算、住客或固定模式已失效、缺少 T/A 更表、容量、樓層、住院、午膳或 Vacancy 衝突",
      "reads": [
        "006-005",
        "006-007",
        "006-009",
        "006-010",
        "006-019",
        "006-020",
        "006-023",
        "006-024",
        "006-025",
        "006-026",
        "006-030"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-012",
          "given": "時間表無法容納所有所需節數",
          "when": "使用者嘗試把時間表標為有效",
          "then": "時間表維持草稿並顯示未滿足項目",
          "expectedErrors": "無效時間表可供 007a、007c、交更或出席紀錄使用"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-014",
      "legacyId": "BH-006-014",
      "module": "訓練時間表",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "月檢視",
      "trigger": "",
      "rule": "點擊時段可查看完整組員及活動詳情；14 日週期住客姓名在月檢視保持可見。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-060",
          "given": "已開啟月檢視，並具備所需權限。",
          "when": "點擊時段。",
          "then": "顯示完整組員及活動詳情；14 日週期住客姓名保持可見。",
          "expectedErrors": "組員或活動詳情不完整，或姓名被收起。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-015",
      "legacyId": "BH-006-015",
      "module": "訓練時間表",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "月檢視",
      "trigger": "",
      "rule": "月檢視隱藏詳細職員標籤，不供選擇活動性質；住客姓名、總人數、小組及付費節數照常顯示。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-061",
          "given": "已開啟 006 訓練時間表。",
          "when": "切換至月檢視。",
          "then": "詳細職員標籤及活動性質選擇不顯示；住客姓名、總人數、小組及付費節數照常顯示。",
          "expectedErrors": "住客姓名被隱藏，或職員標籤及活動性質選擇仍然出現。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-016",
      "legacyId": "BH-006-016",
      "module": "訓練時間表",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "活動性質",
      "trigger": "",
      "rule": "每個時段只設一個活動性質，小組成員共用同一個；可選的性質列出所有可用選項並標示建議。小組標題以簡寫列出全組成員共同建議的活動性質，例如「G1 C, 5, 8 2/4」；沒有共同建議時顯示「－」。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-062",
          "given": "已開啟 006 訓練時間表。",
          "when": "查看時段及小組的活動性質。",
          "then": "可選性質列出所有可用選項並標示建議；時段只設一個性質，組員共用；小組標題列出共同建議的性質簡寫，沒有共同建議時顯示「－」。",
          "expectedErrors": "組員活動性質不一致，或小組標題列出非組員共同的活動性質。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-017",
      "legacyId": "BH-006-017",
      "module": "訓練時間表",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "月檢視",
      "trigger": "",
      "rule": "月檢視顯示總人數、小組及付費節數，並分開顯示常規、14 日週期及額外服務住客的標記。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-063",
          "given": "已開啟 006 訓練時間表，並具備所需權限。",
          "when": "切換至月檢視。",
          "then": "顯示總人數、小組及付費節數，常規、14 日週期及額外服務住客各有可辨識標記。",
          "expectedErrors": "三類住客沒有可辨識標記。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-019",
      "legacyId": "BH-006-019",
      "module": "訓練時間表",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "時段空位",
      "trigger": "",
      "rule": "時段顯示兩種空位：組內餘額及吉位。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-064",
          "given": "時間表有小組餘位及沒有節數的時段。",
          "when": "查看時段。",
          "then": "分別顯示組內餘額及吉位。",
          "expectedErrors": "某一種空位沒有標示，或兩者混淆。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-020",
      "legacyId": "NEW-006-001",
      "module": "訓練時間表",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "自動填入",
      "trigger": "",
      "rule": "自動填入可選擇固定開組時間作為偏好；偏好按院舍保存，日後自動填入會重用；手動排期不受偏好限制。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-110",
          "given": "院舍已保存自動填入的固定開組時間偏好。",
          "when": "使用自動填入，並手動把小組放到其他時間。",
          "then": "自動填入重用院舍偏好；手動排期仍可放到偏好以外的時間。",
          "expectedErrors": "手動排期被偏好阻止，或下次自動填入沒有重用偏好。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-021",
      "legacyId": "NEW-006-002",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "日期範圍",
      "trigger": "顯示訓練時間表",
      "rule": "時間表以實際星期一至日範圍標示星期，但只顯示有 T/A 更表覆蓋的服務日；週期要求仍按完整星期一至日週計算。月份邊界使用完整週列，相鄰月份日期淡化並在當前月份唯讀；選取後前往該日期所屬月份編輯。",
      "condition": "",
      "reads": [
        "006-022"
      ],
      "writes": [
        "006-022"
      ],
      "tests": [
        {
          "id": "TST-114",
          "given": "訓練時間表跨越多個月份，且只有部分日期有 T/A 更表。",
          "when": "開啟月檢視並查看月頭及月尾。",
          "then": "每個區段使用實際星期一至日範圍，但只顯示有 T/A 更表的服務日；相鄰月份日期淡化並在當前月份唯讀，選取後前往所屬月份。",
          "expectedErrors": "區段使用第 1、2、3 週名稱、顯示沒有更表的可編輯日期，或跨月日期可被重複編輯。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-022",
      "legacyId": "NEW-006-003",
      "module": "訓練時間表",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "月檢視",
      "trigger": "",
      "rule": "月檢視直接顯示 14 日週期住客姓名。同一住客的連續個別時段合併為一個視覺區塊，顯示姓名、時間範圍及節數；底層仍保留逐節紀錄。",
      "condition": "",
      "reads": [
        "006-014"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-115",
          "given": "月檢視有多個 14 日週期住客，其中一位有連續個別時段。",
          "when": "開啟月檢視。",
          "then": "14 日週期住客姓名直接顯示；同一住客的連續個別時段合併為一個區塊並保留逐節底層紀錄。",
          "expectedErrors": "住客姓名被收起，或合併後刪除其中一節。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-023",
      "legacyId": "NEW-006-004",
      "module": "訓練時間表",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "住客類別顏色",
      "trigger": "",
      "rule": "常規住客使用 teal，14 日週期住客使用藍色，額外服務住客使用琥珀色。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-116",
          "given": "月檢視同時有常規、14 日週期及額外服務住客。",
          "when": "開啟月檢視。",
          "then": "三類住客分別使用 teal、藍色及琥珀色。",
          "expectedErrors": "三類住客無法以顏色分辨。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-025",
      "legacyId": "NEW-006-006",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "編輯建議活動",
      "trigger": "編輯訓練建議",
      "rule": "OT 及 PT 均可編輯建議活動；儲存前必須選擇「同時修改 Ax 內容」或「只修改住客詳情頁內容」。",
      "condition": "",
      "reads": [
        "006-014"
      ],
      "writes": [
        "006-014"
      ],
      "tests": [
        {
          "id": "TST-118",
          "given": "OT 或 PT 已編輯住客訓練建議。",
          "when": "儲存修改。",
          "then": "系統要求選擇「同時修改 Ax 內容」或「只修改住客詳情頁內容」，並按選擇更新對應資料。",
          "expectedErrors": "提供第三個選項、沒有選擇，或修改錯資料來源。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-026",
      "legacyId": "NEW-006-007",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "完整週",
      "trigger": "計算每週要求",
      "rule": "每週住客的兩節要求按完整星期一至日週計算；同一邊界週在兩個月份只計一次，完成節數可位於任一相交日期。",
      "condition": "",
      "reads": [
        "006-005"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-124",
          "given": "某完整星期一至日週跨越兩個相鄰月份，住客在兩個相交日期各有一節訓練。",
          "when": "分別開啟兩個月份的訓練時間表。",
          "then": "同一邊界週只計一次要求，兩個月份顯示相同完成狀態及跨月承接／移出標示，不把該週拆成兩個要求。",
          "expectedErrors": "兩個月份各自要求額外節數，或把同一節數重複計算。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-027",
      "legacyId": "NEW-006-008",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "週期所屬月份",
      "trigger": "產生月度週期目標",
      "rule": "每個 14 日週期只屬於其開始日期所在月份；跨月完成仍計入原月份，之後月份不得重複計算。",
      "condition": "",
      "reads": [
        "006-023",
        "006-024",
        "006-025",
        "006-026"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-125",
          "given": "住客以入院日錨定 14 日週期，測試 30 日及 31 日月份的跨月週期。",
          "when": "開啟兩個月份並安排相鄰週期於相鄰日期。",
          "then": "每個週期只屬於開始日期所在月份，月度分母按實際週期數顯示 0/2 或 0/3；跨月完成仍計入原月份，之後月份不重複計算。",
          "expectedErrors": "週期按月份重置、跨月重複計分，或相鄰週期因日期相鄰被阻止。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-028",
      "legacyId": "NEW-006-009",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "月度計劃",
      "trigger": "開啟新月份",
      "rule": "月度計劃是連續時間表的快照。新月份依最近已批准計劃重新產生實際日期；沒有改動時只需確認重用，不複製舊日期。",
      "condition": "",
      "reads": [
        "006-027",
        "006-028",
        "006-029"
      ],
      "writes": [
        "006-027",
        "006-028",
        "006-029"
      ],
      "tests": [
        {
          "id": "TST-126",
          "given": "最近月份已有已批准計劃及固定安排。",
          "when": "開啟下一個月份；先不作任何改動，再新增一個只限該日的例外。",
          "then": "新月份由最近已批准計劃重新產生正確實際日期，無改動時只確認重用；日期例外不帶入之後月份，固定安排改動會帶入。",
          "expectedErrors": "直接複製舊日期、每月重新建立不同安排，或日期例外錯誤地帶入下月。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-029",
      "legacyId": "NEW-006-010",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "服務日",
      "trigger": "T/A 更表變更",
      "rule": "時間表只把有 T/A 更表覆蓋的日期顯示為可編輯服務日；缺少更表的日期阻止排期，完整週要求仍保留。",
      "condition": "",
      "reads": [
        "006-031"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-127",
          "given": "某星期一至日週內只有部分日期有 T/A 更表。",
          "when": "查看週及月檢視並嘗試把住客放到缺少更表的日期。",
          "then": "時間表只顯示及允許編輯有 T/A 更表的服務日；缺少更表日期阻止排期，但完整週要求仍保留。",
          "expectedErrors": "顯示全部七日為可編輯、固定假設四日，或缺少更表仍可排期。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-030",
      "legacyId": "NEW-006-011",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "007 整合",
      "trigger": "月度計劃已有效",
      "rule": "只有已有效月度計劃中的實際日期節數可提示 007a／007c 所需紀錄；提示不會建立出席或改寫既有紀錄，跨月節數只影響其日期所屬月份。",
      "condition": "",
      "reads": [
        "006-022"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-128",
          "given": "006 已有有效計劃，包括一個跨月實際日期節數。",
          "when": "查看對應日期的 007a／007c 月曆。",
          "then": "只有有效 006 節數所在實際日期顯示需要輸入紀錄的提示；提示不建立出席或改寫既有紀錄，跨月節數只影響其日期所屬月份。",
          "expectedErrors": "草稿計劃也提示、提示寫入出席，或跨月節數影響錯誤月份。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-031",
      "legacyId": "NEW-006-012",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "小組成員拖放",
      "trigger": "拖曳小組成員至空時段",
      "rule": "把個別小組成員拖到空時段時，系統從原小組移除該住客並在目標時段建立新的個別節數；原小組只餘一位時自動轉為個別節數。",
      "condition": "",
      "reads": [
        "006-015"
      ],
      "writes": [
        "006-015"
      ],
      "tests": [
        {
          "id": "TST-129",
          "given": "一個小組有兩位或以上住客，目標為空時段。",
          "when": "把小組其中一位住客拖到空時段。",
          "then": "系統從原小組移除該住客，並在目標時段建立個別節數；原小組只餘一位時自動轉為個別節數。",
          "expectedErrors": "整組被移動、原小組仍保留被移住客，或目標仍為小組。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-001",
      "legacyId": "BH-REC-001",
      "module": "復康運動紀錄",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "主畫面",
      "trigger": "",
      "rule": "復康運動紀錄分開顯示 007a 及 007c；007a 是復康訓練紀錄，007c 是額外服務，兩者紀錄不會混合。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-065",
          "given": "已開啟復康運動紀錄，並具備所需權限。",
          "when": "查看紀錄。",
          "then": "007a（復康訓練紀錄）及 007c（額外服務）分開顯示，兩者的紀錄不會混合。",
          "expectedErrors": "007a 及 007c 混在同一畫面，或其中一個不顯示。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-002",
      "legacyId": "BH-REC-002",
      "module": "復康運動紀錄",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "宿位篩選",
      "trigger": "",
      "rule": "篩選可同時選取買位、券位及私位；暫託住客歸入私位一併顯示。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-066",
          "given": "已開啟復康運動紀錄，並具備所需權限。",
          "when": "使用宿位篩選。",
          "then": "可同時選取買位、券位及私位；暫託住客歸入私位一併顯示。",
          "expectedErrors": "只能選一種宿位，或暫託住客沒有歸入私位。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-003",
      "legacyId": "BH-REC-003",
      "module": "復康運動紀錄",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "輸入",
      "trigger": "",
      "rule": "復康運動紀錄以月曆時間表輸入；點選月曆格即開啟選單。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-067",
          "given": "已開啟復康運動紀錄。",
          "when": "點選月曆格。",
          "then": "該月曆格開啟選單。",
          "expectedErrors": "點選月曆格沒有開啟選單，或需另開輸入畫面。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-004",
      "legacyId": "BH-REC-004",
      "module": "復康運動紀錄",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "007a 月曆格選單",
      "trigger": "點 007a cell",
      "rule": "點選 007a 的月曆格後，可選 i（個別）或 g（小組），再選活動性質。",
      "condition": "",
      "reads": [],
      "writes": [
        "REC-005",
        "REC-006",
        "REC-007"
      ],
      "tests": [
        {
          "id": "TST-068",
          "given": "已開啟 007a。",
          "when": "點該日的月曆格。",
          "then": "可選 i（個別）或 g（小組），再選活動性質。",
          "expectedErrors": "選單沒有 i／g 選項，或不能選活動性質。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-005",
      "legacyId": "BH-REC-005",
      "module": "復康運動紀錄",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "007c 月曆格選單",
      "trigger": "點 007c cell",
      "rule": "點選 007c 的月曆格後，可選 ei（額外個別）或 eg（額外小組），再選活動性質。",
      "condition": "",
      "reads": [],
      "writes": [
        "REC-005",
        "REC-006",
        "REC-007"
      ],
      "tests": [
        {
          "id": "TST-069",
          "given": "已開啟 007c。",
          "when": "點該日的月曆格。",
          "then": "可選 ei（額外個別）或 eg（額外小組），再選活動性質。",
          "expectedErrors": "選單沒有 ei／eg 選項，或不能選活動性質。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-006",
      "legacyId": "BH-REC-006",
      "module": "復康運動紀錄",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "出席及住客狀態",
      "trigger": "點 cell menu",
      "rule": "同一個月曆格選單可輸入該日的出席紀錄及住客狀態，選項包括 X、H、入住及退住；兩個欄位不另設獨立輸入畫面。",
      "condition": "",
      "reads": [],
      "writes": [
        "REC-005",
        "REC-008"
      ],
      "tests": [
        {
          "id": "TST-070",
          "given": "已開啟 007a。",
          "when": "點選月曆格，在選單輸入出席紀錄及住客狀態。",
          "then": "兩個欄位可在同一個月曆格選單輸入，選項包括 X、H、入住及退住。",
          "expectedErrors": "任一欄位要另開獨立畫面，或選項不全。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-007",
      "legacyId": "BH-REC-007",
      "module": "復康運動紀錄",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "留醫",
      "trigger": "選 H",
      "rule": "選 H 後，需在入院日及出院日各記錄一次 H，中間日期會顯示為留醫期間。",
      "condition": "",
      "reads": [],
      "writes": [
        "REC-008"
      ],
      "tests": [
        {
          "id": "TST-013",
          "given": "住客留醫",
          "when": "使用者在入院日及出院日記錄 H",
          "then": "系統正確標示留醫期間",
          "expectedErrors": "中間日期仍被當作正常出席"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-008",
      "legacyId": "BH-REC-008",
      "module": "復康運動紀錄",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "缺漏紀錄",
      "trigger": "系統檢查",
      "rule": "系統檢查 007a 的所需節數及 007c 的額外服務目標；如有缺漏會提示，但不顯示「超」。",
      "condition": "",
      "reads": [
        "REC-005"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-071",
          "given": "007a 有住客未達所需節數，007c 未達額外服務目標。",
          "when": "系統檢查紀錄。",
          "then": "缺漏會提示；不顯示「超」。",
          "expectedErrors": "缺漏沒有提示，或出現「超」的提示。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-009",
      "legacyId": "BH-REC-009",
      "module": "復康運動紀錄",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "X/H",
      "trigger": "選 X 或 H",
      "rule": "X 及 H 均會計為缺漏紀錄。",
      "condition": "",
      "reads": [
        "REC-003",
        "REC-005"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-014",
          "given": "所需節數被記錄為 X 或 H",
          "when": "系統執行缺漏紀錄檢查",
          "then": "該節數計為缺漏",
          "expectedErrors": "該節數仍計為出席"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-011",
      "legacyId": "BH-REC-011",
      "module": "復康運動紀錄",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "X/H 與活動性質",
      "trigger": "選 X 或 H",
      "rule": "月曆格已選 X 或 H 時，不可再選活動性質。",
      "condition": "",
      "reads": [
        "REC-005"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-072",
          "given": "月曆格已選 X 或 H。",
          "when": "查看活動性質選項。",
          "then": "不可再選活動性質。",
          "expectedErrors": "仍出現可選的活動性質。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-012",
      "legacyId": "BH-REC-012",
      "module": "復康運動紀錄",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "列印",
      "trigger": "",
      "rule": "007a／007c 可以列印。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-073",
          "given": "已開啟復康運動紀錄。",
          "when": "使用列印功能。",
          "then": "007a 及 007c 也提供列印。",
          "expectedErrors": "007a 或 007c 沒有列印功能。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-013",
      "legacyId": "NEW-REC-001",
      "module": "復康運動紀錄",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "007a／007c 月曆",
      "trigger": "開啟 007a 或 007c",
      "rule": "006 有效計劃已安排但未填的個別月曆格使用淡黃色背景且不顯示文字；小組月曆格顯示斜線及下標編號，例如 G₁、G₂；日期已過而仍未輸入紀錄時使用淡粉紅色並顯示「欠」；已填月曆格沿用其形式分類的淡色背景。",
      "condition": "",
      "reads": [],
      "writes": [
        "REC-004"
      ],
      "tests": [
        {
          "id": "TST-074",
          "given": "系統已有有效的 006 計劃，並同時包含個別及小組、未到期及已逾期而未填紀錄的預約。",
          "when": "開啟 007a 或 007c。",
          "then": "未填個別格使用淡黃色背景且不顯示文字；未填小組格顯示斜線及下標編號 G₁、G₂ 等；逾期格使用淡粉紅色及「欠」；已填格沿用形式分類的淡色背景。",
          "expectedErrors": "個別待填格顯示文字、小組格缺少斜線或下標 G 編號、逾期格不是淡粉紅色「欠」，或已填格失去原有分類顏色。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-014",
      "legacyId": "NEW-REC-002",
      "module": "復康運動紀錄",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "紀錄修改資料",
      "trigger": "",
      "rule": "每個已記錄項目，例如 I/4，顯示最後修改人及最後修改日期時間。",
      "condition": "",
      "reads": [
        "REC-010",
        "REC-011"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-119",
          "given": "007a 已有例如 I/4 的紀錄。",
          "when": "查看該紀錄。",
          "then": "每個紀錄顯示最後修改人及最後修改日期時間。",
          "expectedErrors": "只顯示紀錄內容，沒有修改人或修改日期。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-015",
      "legacyId": "NEW-REC-003",
      "module": "復康運動紀錄",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "007a 篩選",
      "trigger": "",
      "rule": "007a 提供樓層及活動現況篩選。",
      "condition": "",
      "reads": [
        "REC-012",
        "REC-013"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-120",
          "given": "007a 載入多個樓層及活動現況的住客。",
          "when": "使用樓層及活動現況篩選。",
          "then": "兩個篩選可套用至 007a，結果只顯示符合條件的住客。",
          "expectedErrors": "篩選不存在或結果不符。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-REC-016",
      "legacyId": "NEW-REC-004",
      "module": "復康運動紀錄",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "007a 搜尋",
      "trigger": "",
      "rule": "007a 提供床號及姓名搜尋列。",
      "condition": "",
      "reads": [
        "REC-001",
        "REC-002"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-121",
          "given": "007a 載入多個住客。",
          "when": "輸入床號或姓名搜尋。",
          "then": "007a 顯示相符的住客。",
          "expectedErrors": "搜尋列不存在，或不能用床號及姓名搜尋。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-001",
      "legacyId": "BH-AX-001",
      "module": "評估系統",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "版面",
      "trigger": "",
      "rule": "ES-RH-016 畫面沿用印刷表格的版面及用語。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-075",
          "given": "已開啟評估系統，並具備所需權限。",
          "when": "開啟 ES-RH-016。",
          "then": "畫面沿用印刷表格的版面及用語。",
          "expectedErrors": "版面或用語偏離印刷表格。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-002",
      "legacyId": "BH-AX-002",
      "module": "評估系統",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "評估性質",
      "trigger": "",
      "rule": "Initial Ax、Re-Ax 及 ICP Ax 會以標籤顯示，位置與印刷表格相同。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-076",
          "given": "已開啟評估系統，並具備所需權限。",
          "when": "查看評估性質標籤。",
          "then": "Initial Ax、Re-Ax 及 ICP Ax 以標籤顯示，位置與印刷表格相同。",
          "expectedErrors": "性質沒有以標籤顯示，或位置與印刷表格不同。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-003",
      "legacyId": "BH-AX-003",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "評估性質",
      "trigger": "評估符合多於一種性質",
      "rule": "同一份評估可以同時屬於多於一種評估性質。",
      "condition": "",
      "reads": [
        "AX-004"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-077",
          "given": "一份評估同時符合兩種評估性質的條件。",
          "when": "查看評估性質。",
          "then": "同一份評估同時顯示兩種評估性質。",
          "expectedErrors": "只能顯示一種性質，或需要重複建立評估。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-004",
      "legacyId": "BH-AX-004",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "評估性質",
      "trigger": "建立評估",
      "rule": "評估性質由入口決定：新增住客建立 Initial Ax，評估系統建立 Re-Ax，ICP 工作清單或緊急 ICP 建立 ICP Ax。一份評估如亦作為 ICP Ax，畫面可同時顯示原評估性質及 ICP Ax。",
      "condition": "",
      "reads": [
        "ICP-003"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-078",
          "given": "評估由新增住客、評估系統、ICP 工作清單或緊急 ICP 建立。",
          "when": "建立評估並查看性質。",
          "then": "系統按入口顯示 Initial Ax、Re-Ax 或 ICP Ax；同一評估如亦作為 ICP Ax，可同時顯示原評估性質及 ICP Ax。",
          "expectedErrors": "評估性質由使用者自由選擇或與入口不一致。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-006",
      "legacyId": "BH-AX-006",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "段落責任",
      "trigger": "編輯評估",
      "rule": "按評估部分自動記錄每位實際編輯者的身份及編輯時間；同一部分可由 OT 及 PT 分別完成。",
      "condition": "",
      "reads": [],
      "writes": [
        "AX-055"
      ],
      "tests": [
        {
          "id": "TST-079",
          "given": "OT 或 PT 已登入，且同一份評估的不同部分由不同使用者編輯。",
          "when": "逐一編輯各評估部分。",
          "then": "系統按部分記錄實際使用者、部分標識及編輯時間；同一部分可保留 OT 及 PT 各自的編輯紀錄。",
          "expectedErrors": "只記錄評估層級的 OT／PT，或沒有記錄部分標識及編輯時間。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-007",
      "legacyId": "BH-AX-007",
      "module": "評估系統",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "段落責任",
      "trigger": "",
      "rule": "每個部分會顯示完成該部分的評估者姓名；如 OT 及 PT 均完成同一部分，會同時顯示兩個姓名。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-080",
          "given": "評估已有部分被完成。",
          "when": "查看各部分的評估者。",
          "then": "每個部分顯示完成者的姓名；OT 及 PT 均完成同一部分時同時顯示兩個姓名。",
          "expectedErrors": "部分不顯示姓名，或只显示其中一個職系。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-009",
      "legacyId": "BH-AX-010",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "共同編輯",
      "trigger": "編輯評估",
      "rule": "OT 及 PT 可以編輯所有共同評估部分。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-015",
          "given": "OT 及 PT 正在處理同一份 016",
          "when": "OT 或 PT 編輯任何共同評估部分",
          "then": "兩者均可編輯，系統記錄實際編輯者及時間",
          "expectedErrors": "系統限制非 MoCA 部分只可由單一職系編輯"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-010",
      "legacyId": "BH-AX-011",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "整體狀態",
      "trigger": "開啟評估",
      "rule": "所需部分未全部完成前，整體評估會作為草稿儲存。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-081",
          "given": "評估仍有必填部分未完成。",
          "when": "開啟評估。",
          "then": "整體評估作為草稿儲存。",
          "expectedErrors": "未完成的評估被標為已完成。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-011",
      "legacyId": "BH-AX-012",
      "module": "評估系統",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "整體狀態",
      "trigger": "",
      "rule": "整體評估狀態顯示於評估頁頂部，只顯示草稿或已完成。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-082",
          "given": "已開啟評估。",
          "when": "查看評估頁頂部。",
          "then": "整體評估狀態顯示於評估頁頂部，只顯示草稿或已完成。",
          "expectedErrors": "頁頂沒有狀態，或出現草稿及已完成以外的狀態。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-012",
      "legacyId": "BH-AX-013",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "整體狀態",
      "trigger": "自動檢查",
      "rule": "所有必填評估項目均已有有效輸入值或逐項標為「N/A」，條件欄位符合，且 MoCA 要求符合後，系統自動把整份評估標為「已完成」；不設手動完成操作。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-019",
          "given": "ES-RH-016 評估為草稿；除一項必填評估項目外，其餘必填項目均已輸入有效值。",
          "when": "將該單一項目格標為「N/A」。",
          "then": "系統接受該項目的「N/A」，並在條件欄位及 MoCA 要求符合後自動完成評估。",
          "expectedErrors": "系統要求整個部分標為「N/A」或另設手動完成步驟。"
        },
        {
          "id": "TST-020",
          "given": "某必填項目格為空白；同一部分的另一項目格已標為「N/A」。",
          "when": "填寫其他項目並等候自動檢查。",
          "then": "評估維持草稿，系統指出空白必填項目。",
          "expectedErrors": "一個項目的「N/A」令其他空白項目被視為不適用。"
        },
        {
          "id": "TST-021",
          "given": "評估項目的部分內有多個必填項目。",
          "when": "把其中一個項目格標為「N/A」。",
          "then": "只有該項目格維持「N/A」；同部分其他必填項目仍須輸入有效值或逐一標為「N/A」。",
          "expectedErrors": "「N/A」自動套用到同部分其他項目或整個部分。"
        },
        {
          "id": "TST-022",
          "given": "一個必填項目格已標為「N/A」，另一必填項目仍為空白。",
          "when": "再次開啟評估並查看狀態。",
          "then": "「N/A」保留於原本的項目格，整體評估維持草稿，直到空白項目獲得有效值或個別標為「N/A」。",
          "expectedErrors": "「N/A」被當成整個部分或整份評估的不適用狀態。"
        },
        {
          "id": "TST-016",
          "given": "評估仍有未完成的必填部分",
          "when": "使用者完成最後一個必填項目",
          "then": "系統自動把評估標為已完成，不要求手動完成",
          "expectedErrors": "評估缺少必填資料時仍自動完成"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-013",
      "legacyId": "BH-AX-014",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "MOCA",
      "trigger": "開啟 MOCA",
      "rule": "只有 OT 可以編輯 MOCA；PT 可以查看摘要，但不能編輯。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-083",
          "given": "OT 及 PT 均可檢視同一份評估的 MOCA。",
          "when": "分別以 OT 及 PT 開啟 MOCA。",
          "then": "只有 OT 可以編輯 MOCA；PT 可查看摘要但不能編輯。",
          "expectedErrors": "PT 能編輯 MOCA，或 OT 不能編輯。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-014",
      "legacyId": "BH-AX-015",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "MOCA",
      "trigger": "開啟 MOCA",
      "rule": "MOCA 可選標準版或 Alternate Version 1。",
      "condition": "",
      "reads": [
        "AX-087"
      ],
      "writes": [
        "AX-087"
      ],
      "tests": [
        {
          "id": "TST-084",
          "given": "已開啟 MOCA。",
          "when": "查看版本選項。",
          "then": "可選標準版或 Alternate Version 1。",
          "expectedErrors": "只能使用其中一個版本，或沒有版本選擇。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-015",
      "legacyId": "BH-AX-016",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "MOCA",
      "trigger": "標為 Unable to Ax",
      "rule": "如 MOCA 標為 Unable to Ax，總分及百分位會留空並要求填寫原因；016 其餘部分仍可繼續。",
      "condition": "",
      "reads": [],
      "writes": [
        "AX-020",
        "AX-086"
      ],
      "tests": [
        {
          "id": "TST-085",
          "given": "MOCA 標為 Unable to Ax。",
          "when": "查看 016 各部分。",
          "then": "MOCA 總分及百分位留空並要求填寫原因；016 其餘部分仍可繼續。",
          "expectedErrors": "總分或百分位仍有數值，或其餘部分被鎖定。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-016",
      "legacyId": "BH-AX-017",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "儲存",
      "trigger": "編輯評估",
      "rule": "編輯評估時自動儲存；離開評估頁後，進行中的 016 會保留，其他系統顯示返回評估的提示；關閉提示不會刪除草稿，可隨時在評估系統重新開啟。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-086",
          "given": "正在編輯 016 評估。",
          "when": "離開評估頁，到其他系統繼續操作。",
          "then": "草稿自動儲存，其他系統顯示返回評估的提示；關閉提示不刪除草稿，可在評估系統重新開啟。",
          "expectedErrors": "草稿沒有自動儲存，或關閉提示後草稿被刪除。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-017",
      "legacyId": "BH-AX-018",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "更正",
      "trigger": "編輯已完成評估",
      "rule": "已完成評估可以更正並保持已完成狀態；系統保留編輯歷史。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-087",
          "given": "評估已自動完成。",
          "when": "更正已完成評估。",
          "then": "評估保持已完成狀態，系統保留編輯歷史。",
          "expectedErrors": "更正令評估失去已完成狀態，或未保留編輯歷史。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-018",
      "legacyId": "BH-AX-019",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "更正",
      "trigger": "作廢評估",
      "rule": "作廢評估必須記錄原因；系統保留編輯歷史，預設不直接刪除。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-088",
          "given": "評估已被作廢。",
          "when": "查看處理結果。",
          "then": "作廢時已記錄原因，編輯歷史保留，評估沒有被直接刪除。",
          "expectedErrors": "作廢沒有記錄原因，或評估被直接刪除。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-019",
      "legacyId": "BH-AX-020",
      "module": "評估系統",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "評估清單",
      "trigger": "",
      "rule": "評估清單顯示住客、評估性質、日期、狀態及 ICP 連結，不設院舍篩選。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-089",
          "given": "已開啟評估清單，並具備所需權限。",
          "when": "查看評估清單。",
          "then": "清單顯示住客、評估性質、日期、狀態及 ICP 連結，不設院舍篩選。",
          "expectedErrors": "缺少任何一個欄位，或出現院舍篩選。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-021",
      "legacyId": "BH-AX-022",
      "module": "評估系統",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "入口",
      "trigger": "",
      "rule": "評估頁設有快速連結。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-090",
          "given": "已開啟評估頁。",
          "when": "查看評估頁。",
          "then": "評估頁設有快速連結。",
          "expectedErrors": "快速連結缺失。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-023",
      "legacyId": "NEW-AX-001",
      "module": "評估系統",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "列印",
      "trigger": "按列印",
      "rule": "已完成的 ES-RH-016 及 MOCA 評估表可以列印。",
      "condition": "",
      "reads": [],
      "writes": [
        "AX-001"
      ],
      "tests": [
        {
          "id": "TST-091",
          "given": "已有已完成的 ES-RH-016 及 MOCA 評估。",
          "when": "使用列印功能。",
          "then": "已完成的 ES-RH-016 及 MOCA 評估表也可列印。",
          "expectedErrors": "已完成的評估沒有列印入口。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-024",
      "legacyId": "NEW-AX-002",
      "module": "評估系統",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "段落 Clinical Notes",
      "trigger": "",
      "rule": "每個 ES-RH-016 段落 subtitle 旁設有 Clinical Notes 按鈕，點擊後顯示單一備註文字框；移除段落內原本的臨床備註文字框。備註不影響分數、段落狀態或整體完成狀態。",
      "condition": "",
      "reads": [],
      "writes": [
        "AX-088",
        "AX-089",
        "AX-090",
        "AX-091",
        "AX-092",
        "AX-093",
        "AX-094",
        "AX-095",
        "AX-096"
      ],
      "tests": [
        {
          "id": "TST-122",
          "given": "ES-RH-016 段落內有原有臨床備註文字框。",
          "when": "點擊段落 subtitle 的 Clinical Notes 按鈕。",
          "then": "顯示單一備註文字框，原有段落內備註文字框已移除；備註不影響分數或完成狀態。",
          "expectedErrors": "仍有多個備註框，或備註改變完成狀態。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-AX-025",
      "legacyId": "NEW-AX-003",
      "module": "評估系統",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "段落 Clinical Notes",
      "trigger": "",
      "rule": "備註有內容時直接顯示該備註欄位；OT 及 PT 均可查看及修改，備註列入列印。",
      "condition": "",
      "reads": [
        "AX-088",
        "AX-089",
        "AX-090",
        "AX-091",
        "AX-092",
        "AX-093",
        "AX-094",
        "AX-095",
        "AX-096"
      ],
      "writes": [
        "AX-088",
        "AX-089",
        "AX-090",
        "AX-091",
        "AX-092",
        "AX-093",
        "AX-094",
        "AX-095",
        "AX-096"
      ],
      "tests": [
        {
          "id": "TST-123",
          "given": "某段落已有非空 Clinical Notes。",
          "when": "OT 或 PT 查看及列印評估。",
          "then": "該段落直接顯示備註欄位，兩者均可修改，列印內容包含備註。",
          "expectedErrors": "備註有內容仍被隱藏、只有一方可修改，或列印缺少備註。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-001",
      "legacyId": "BH-ICP-001",
      "module": "ICP",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "工作清單",
      "trigger": "",
      "rule": "ICP 工作清單預設顯示當前月份，可逐月預覽未來月份。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-092",
          "given": "已開啟 ICP 工作清單，並具備所需權限。",
          "when": "查看工作清單。",
          "then": "預設顯示當前月份，可逐月預覽未來月份。",
          "expectedErrors": "預設不是當前月份，或不能預覽未來月份。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-002",
      "legacyId": "BH-ICP-002",
      "module": "ICP",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "工作清單",
      "trigger": "",
      "rule": "可按月份、半月、自訂日期範圍、狀態及 OT/PT 篩選。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-093",
          "given": "已開啟 ICP 工作清單，並具備所需權限。",
          "when": "使用篩選。",
          "then": "可按月份、半月、自訂日期範圍、狀態及 OT/PT 篩選。",
          "expectedErrors": "缺少上述任何一種篩選。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-003",
      "legacyId": "BH-ICP-003",
      "module": "ICP",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "工作清單",
      "trigger": "",
      "rule": "ICP 工作清單顯示床號、姓名、宿位、狀態、評估窗口、ICP 限期、已連結評估、評估進度、ICP 日期、ICP 表格 OT/PT 完成紀錄及下一步。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-094",
          "given": "工作清單有住客含評估進度及 ICP 完成紀錄。",
          "when": "查看評估進度及完成紀錄。",
          "then": "016 評估顯示單一進度；ICP 表格分開顯示 OT 及 PT 完成紀錄。",
          "expectedErrors": "把 016 評估顯示為 OT/PT 兩個獨立完成狀態。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-004",
      "legacyId": "BH-ICP-004",
      "module": "ICP",
      "entryType": "TRANSITION",
      "entryTypeLabel": "狀態轉換",
      "scope": "ICP 週期",
      "trigger": "已連結評估自動完成",
      "rule": "已連結評估自動完成後，ICP 週期由「待評估」轉為「已完成評估，待填ICP」。",
      "condition": "評估已連結至週期",
      "reads": [],
      "writes": [],
      "tests": [],
      "uat": []
    },
    {
      "id": "BH-ICP-005",
      "legacyId": "BH-ICP-004",
      "module": "ICP",
      "entryType": "TRANSITION",
      "entryTypeLabel": "狀態轉換",
      "scope": "ICP 週期",
      "trigger": "記錄 OT 或 PT 已填寫 ICP",
      "rule": "系統分別記錄 OT 及 PT 的 ICP 表格完成情況。兩者均完成後，週期由「已完成評估，待填 ICP」轉為「已填 ICP」。只有一方完成時仍顯示「待填 ICP」。",
      "condition": "ICP 表格已填寫",
      "reads": [],
      "writes": [],
      "tests": [],
      "uat": []
    },
    {
      "id": "BH-ICP-006",
      "legacyId": "BH-ICP-005",
      "module": "ICP",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "完成紀錄",
      "trigger": "完成 ICP",
      "rule": "OT 及 PT 的完成紀錄分開記錄；簽名留在紙本表格。",
      "condition": "",
      "reads": [],
      "writes": [
        "ICP-012",
        "ICP-014"
      ],
      "tests": [
        {
          "id": "TST-095",
          "given": "OT 及 PT 分別完成 ICP 表格。",
          "when": "查看完成紀錄。",
          "then": "OT 及 PT 的完成紀錄分開記錄；簽名留在紙本表格。",
          "expectedErrors": "兩方完成紀錄合併為一，或系統要求電子簽署。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-032",
      "legacyId": "NEW-006-013",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "007 整合",
      "trigger": "007a／007c 顯示計劃節數",
      "rule": "007 按 006 有效計劃自動選定記錄形式：一位住客為個別，兩位或以上為小組；基本訓練為 i／g，額外服務為 ei／eg，使用者不可在已連結 006 的預約格改選另一形式。",
      "condition": "",
      "reads": [
        "006-015"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-130",
          "given": "006 有效計劃包含一位住客的個別節數、多位住客的小組節數，以及基本和額外服務節數。",
          "when": "在 007a／007c 開啟已連結 006 的預約格。",
          "then": "系統自動選定 i、g、ei 或 eg；已連結預約的形式不可由使用者改選，活動及特殊狀態仍可輸入。",
          "expectedErrors": "使用者可改選形式，或 007a／007c 使用錯誤形式。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-006-033",
      "legacyId": "NEW-006-014",
      "module": "訓練時間表",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "小組編號",
      "trigger": "新增、移動或合併小組",
      "rule": "系統按實際日期為所有小組自動編號，每日第一個小組為 G₁，其後按時間及固定次序為 G₂、G₃ 等；006、007a 及 007c 的小組格均以斜線及相同下標編號顯示；小組拆分、合併或改為個別時重新推算，編號不作為固定資料。",
      "condition": "",
      "reads": [
        "006-013"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-131",
          "given": "同一日有多個小組，包括不同時間及同一時間的小組，並有對應的 007a／007c 預約。",
          "when": "新增、移動、合併或拆分小組，再開啟 007a／007c。",
          "then": "當日小組按時間及固定次序顯示斜線及下標編號 G₁、G₂ 等；006 與 007 顯示相同編號，改動後即時重新編號，改為個別後不再顯示小組編號。",
          "expectedErrors": "編號跨日重複、007 與 006 不一致、缺少斜線或下標、每次改動不更新，或個別節數仍顯示 G 編號。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-007",
      "legacyId": "BH-ICP-006",
      "module": "ICP",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "操作",
      "trigger": "使用工作清單",
      "rule": "ICP 工作清單提供直接開啟已連結評估的連結。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-096",
          "given": "ICP 週期已連結評估。",
          "when": "在工作清單開啟該評估。",
          "then": "直接開啟對應的評估。",
          "expectedErrors": "沒有直接連結，或開啟了錯誤的評估。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-008",
      "legacyId": "BH-ICP-007",
      "module": "ICP",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "緊急 ICP",
      "trigger": "建立緊急 ICP",
      "rule": "記錄緊急 ICP 的日期及原因後，按院舍設定的「緊急 ICP 影響」方式計算下次限期：沒有影響、重啟週期或計算於本週期內。",
      "condition": "",
      "reads": [
        "HOME-007",
        "ICP-003"
      ],
      "writes": [
        "ICP-003",
        "ICP-016",
        "ICP-017"
      ],
      "tests": [
        {
          "id": "TST-097",
          "given": "院舍已設定「緊急 ICP 影響」方式。",
          "when": "記錄緊急 ICP 的日期及原因。",
          "then": "按所設方式計算下次限期：沒有影響、重啟週期或計算於本週期內。",
          "expectedErrors": "下次限期沒有按所設方式計算。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-009",
      "legacyId": "BH-ICP-008",
      "module": "ICP",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "評估連結",
      "trigger": "連結評估",
      "rule": "一個 ICP 週期可以連結多份評估，但只能有一份標記為 ICP Ax；評估記錄會以「對應 ICP 週期」指定所屬週期。",
      "condition": "",
      "reads": [
        "AX-003"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-098",
          "given": "一個 ICP 週期已連結多份評估。",
          "when": "再標記另一份評估為 ICP Ax。",
          "then": "只有一份為 ICP Ax；評估記錄以「對應 ICP 週期」指定所屬週期。",
          "expectedErrors": "同時有兩份標記為 ICP Ax，或所屬週期錯誤。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-010",
      "legacyId": "BH-ICP-009",
      "module": "ICP",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "歷史",
      "trigger": "開啟住客詳情",
      "rule": "所有 ICP 週期均保留，包括退住住客的週期。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-099",
          "given": "住客有多於五份 ICP 歷史紀錄。",
          "when": "開啟住客 ICP 歷史。",
          "then": "只顯示最近五份；其他紀錄收在「顯示更多」；歷史本身完整保留。",
          "expectedErrors": "所有紀錄一次顯示，或較舊紀錄被刪除。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-011",
      "legacyId": "BH-ICP-010",
      "module": "ICP",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "交更",
      "trigger": "生成交更",
      "rule": "交更訊息按半月及月份顯示按 ICP 完成記錄計算的 OT 及 PT ICP 表格完成數，並列出尚未評估的住客。",
      "condition": "",
      "reads": [
        "ICP-012"
      ],
      "writes": [
        "HO-008",
        "HO-009",
        "HO-011",
        "HO-012",
        "HO-013",
        "HO-014"
      ],
      "tests": [
        {
          "id": "TST-100",
          "given": "ICP 週期已有 OT／PT 紙本 ICP 表格完成記錄，交更同時載入評估及 ICP 資料。",
          "when": "生成交更。",
          "then": "交更訊息按半月及月份顯示由 ICP 完成記錄計算的 OT 及 PT ICP 表格完成數，並列出尚未評估的住客。",
          "expectedErrors": "系統以已完成 016 份數代替 ICP 表格完成記錄，或結果與規則不一致。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-012",
      "legacyId": "BH-ICP-011",
      "module": "ICP",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "紙本表格",
      "trigger": "任何 ICP 流程",
      "rule": "ICP 內容在紙本表格填寫；電子系統只追蹤週期、限期、已連結評估及完成紀錄，只有治療師可完成 ICP。",
      "condition": "",
      "reads": [],
      "writes": [],
      "tests": [
        {
          "id": "TST-101",
          "given": "任何 ICP 流程。",
          "when": "處理 ICP。",
          "then": "ICP 內容在紙本表格填寫；電子系統只追蹤週期、限期、已連結評估及完成紀錄，只有治療師可完成 ICP。",
          "expectedErrors": "系統要求電子填寫 ICP 內容，或非治療師可完成 ICP。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-015",
      "legacyId": "BH-ICP-014",
      "module": "ICP",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "評估連結",
      "trigger": "連結評估",
      "rule": "ICP 窗口內自動完成的 Initial Ax 自動成為該週期 ICP Ax。窗口內建立 Re-Ax 草稿時會詢問是否用作 ICP Ax，選擇保存於草稿，自動完成後才生效；拒絕後可日後由 ICP 工作清單連結。",
      "condition": "",
      "reads": [],
      "writes": [
        "AX-004"
      ],
      "tests": [
        {
          "id": "TST-102",
          "given": "Initial Ax 日期在 ICP 評估窗口內。",
          "when": "完成 Initial Ax。",
          "then": "Initial Ax 自動成為該週期 ICP Ax。",
          "expectedErrors": "Initial Ax 已完成但仍未連結 ICP Ax。"
        },
        {
          "id": "TST-107",
          "given": "Re-Ax 日期在 ICP 評估窗口內，該週期尚無 ICP Ax。",
          "when": "建立 Re-Ax 草稿。",
          "then": "系統詢問是否用作 ICP Ax，並把選擇保存於草稿；Re-Ax 自動完成後才建立連結。",
          "expectedErrors": "草稿尚未完成便取代 ICP Ax，或選擇沒有保存。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-016",
      "legacyId": "BH-ICP-015",
      "module": "ICP",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "評估連結",
      "trigger": "取代 ICP Ax",
      "rule": "確認用作 ICP Ax 的 Re-Ax 自動完成後，取代原有 ICP Ax；原 ICP Ax 保留為已連結歷史。使用中的 ICP Ax 不可在沒有替代評估時移除。",
      "condition": "",
      "reads": [],
      "writes": [
        "AX-004"
      ],
      "tests": [
        {
          "id": "TST-103",
          "given": "ICP 週期已有 ICP Ax；新的 Re-Ax 已確認用作 ICP Ax 並自動完成。",
          "when": "完成 Re-Ax。",
          "then": "Re-Ax 取代原有 ICP Ax，原 ICP Ax 保留為已連結歷史。",
          "expectedErrors": "原有 ICP Ax 被刪除，或新的 Re-Ax 未成為 ICP Ax。"
        },
        {
          "id": "TST-108",
          "given": "ICP 週期已有使用中的 ICP Ax。",
          "when": "嘗試移除 ICP Ax 而沒有選擇替代評估。",
          "then": "系統阻止移除。",
          "expectedErrors": "ICP 週期可在沒有替代評估時失去 ICP Ax。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-018",
      "legacyId": "NEW-ICP-001",
      "module": "ICP",
      "entryType": "UI_POLICY",
      "entryTypeLabel": "介面政策",
      "scope": "ICP 歷史",
      "trigger": "開啟住客 ICP 歷史",
      "rule": "ICP 歷史只顯示最近五份紀錄，其餘收在「顯示更多」按鈕下。",
      "condition": "",
      "reads": [
        "ICP-002",
        "ICP-003"
      ],
      "writes": [],
      "tests": [
        {
          "id": "TST-112",
          "given": "住客有六份或以上 ICP 歷史紀錄。",
          "when": "開啟住客 ICP 歷史。",
          "then": "只顯示最近五份，其餘收在「顯示更多」按鈕下，按鈕可展開其餘紀錄。",
          "expectedErrors": "一次顯示全部紀錄、沒有「顯示更多」，或舊紀錄被移除。"
        }
      ],
      "uat": []
    },
    {
      "id": "BH-ICP-019",
      "legacyId": "NEW-ICP-002",
      "module": "ICP",
      "entryType": "RULE",
      "entryTypeLabel": "規則",
      "scope": "ICP 欄位",
      "trigger": "開啟 ICP 工作清單或住客資料",
      "rule": "ICP 工作清單顯示下次 ICP 性質。下次 ICP 限期可在住客資料頁及 ICP 頁修改，兩處共用同一資料值。",
      "condition": "",
      "reads": [
        "ICP-003",
        "ICP-022"
      ],
      "writes": [
        "ICP-003",
        "ICP-022"
      ],
      "tests": [
        {
          "id": "TST-113",
          "given": "住客資料頁及 ICP 工作清單已載入同一住客。",
          "when": "查看下次 ICP 性質，並在兩頁其中一頁修改下次 ICP 限期。",
          "then": "ICP 工作清單顯示下次 ICP 性質；兩頁顯示相同限期，修改後另一頁同步更新。",
          "expectedErrors": "ICP 頁缺少性質，或兩頁限期不同步。"
        }
      ],
      "uat": []
    }
  ],
  "fields": {
    "ICP-001": {
      "code": "ICP-001",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "ICP評估期",
      "option": "上半月 (1-15)",
      "notes": "預設 · ICP評估須於「限期所屬半個月」的前一個半月內完成： - 限期在下半月 → 於同月上半月完成"
    },
    "ICP-002": {
      "code": "ICP-002",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "是次 ICP 會議日期",
      "option": "",
      "notes": "手動輸入"
    },
    "ICP-003": {
      "code": "ICP-003",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "下次ICP會議限期",
      "option": "",
      "notes": "自動產生，可手動更改 · 由住客管理系統同步；可在 ICP 頁或住客資料頁修改，兩處共用同一值"
    },
    "ICP-004": {
      "code": "ICP-004",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "上半月ICP數量",
      "option": "",
      "notes": "自動產生 · 按下次ICP會議限期計算"
    },
    "ICP-005": {
      "code": "ICP-005",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "下半月ICP數量",
      "option": "",
      "notes": "自動產生 · 按下次ICP會議限期計算"
    },
    "ICP-006": {
      "code": "ICP-006",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "本月ICP總數",
      "option": "",
      "notes": "自動產生"
    },
    "ICP-007": {
      "code": "ICP-007",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "已填ICP",
      "option": "",
      "notes": "自動產生 · OT 及 PT 均記錄已填寫後，系統顯示已完成。"
    },
    "ICP-008": {
      "code": "ICP-008",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "床號",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "ICP-009": {
      "code": "ICP-009",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "姓名",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "ICP-010": {
      "code": "ICP-010",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "宿位",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "ICP-011": {
      "code": "ICP-011",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "評估人",
      "option": "",
      "notes": "自動產生 · 由當前用戶名稱產生，1-2位(OT/PT)"
    },
    "ICP-012": {
      "code": "ICP-012",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "OT簽署",
      "option": "",
      "notes": "列印後手寫"
    },
    "ICP-013": {
      "code": "ICP-013",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "評估日期 (OT)",
      "option": "",
      "notes": "自動產生，可手動更改 · 預設為當日"
    },
    "ICP-014": {
      "code": "ICP-014",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "PT簽署",
      "option": "",
      "notes": "列印後手寫"
    },
    "ICP-015": {
      "code": "ICP-015",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "評估日期 (PT)",
      "option": "",
      "notes": "自動產生，可手動更改 · 預設為當日"
    },
    "ICP-016": {
      "code": "ICP-016",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "緊急ICP",
      "option": "",
      "notes": "手動輸入"
    },
    "ICP-017": {
      "code": "ICP-017",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "緊急ICP日期",
      "option": "",
      "notes": "手動輸入 · ⌈緊急ICP⌋對下次會議限期計算影響有三種，於⌈院舍設定⌋內設定"
    },
    "ICP-018": {
      "code": "ICP-018",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "OT 已填寫ICP",
      "option": "",
      "notes": "勾選"
    },
    "ICP-019": {
      "code": "ICP-019",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "PT 已填寫ICP",
      "option": "",
      "notes": "勾選 · OT／PT 分開記錄。"
    },
    "ICP-022": {
      "code": "ICP-022",
      "sheet": "ICP",
      "priority": "1",
      "system": "ICP",
      "subsystem": "-",
      "name": "下次ICP性質",
      "option": "",
      "notes": "自動產生，可手動更改 · 由住客管理系統同步；顯示於 ICP 工作清單"
    },
    "HO-001": {
      "code": "HO-001",
      "sheet": "交更",
      "priority": "2",
      "system": "交更",
      "subsystem": "-",
      "name": "交更日期",
      "option": "",
      "notes": "自動產生 · 預設為當日"
    },
    "HO-002": {
      "code": "HO-002",
      "sheet": "交更",
      "priority": "2",
      "system": "交更",
      "subsystem": "-",
      "name": "院舍代號",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步；例如 油塘康璟 = YT"
    },
    "HO-003": {
      "code": "HO-003",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "新入住住客",
      "option": "",
      "notes": "自動產生 · 自本星期的入住名單"
    },
    "HO-004": {
      "code": "HO-004",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "退住住客",
      "option": "",
      "notes": "自動產生 · 自本星期的退住／離世名單"
    },
    "HO-005": {
      "code": "HO-005",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "新入住段落內容",
      "option": "",
      "notes": "自動產生 · 日期、床號、姓名、宿位、訓練頻率（p 1/2wks / v 2/wk / b 2/wk）、評估人"
    },
    "HO-006": {
      "code": "HO-006",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "訓練頻率代號",
      "option": "p 1/2wks",
      "notes": "自動產生"
    },
    "HO-007": {
      "code": "HO-007",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "評估人",
      "option": "",
      "notes": "自動產生 · 由評估系統產生；已完成顯示治療師姓名，未完成顯示「待評估」"
    },
    "HO-008": {
      "code": "HO-008",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "OT已評估數",
      "option": "",
      "notes": "自動產生 · 由評估系統產生"
    },
    "HO-009": {
      "code": "HO-009",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "PT已評估數",
      "option": "",
      "notes": "自動產生 · 由評估系統產生"
    },
    "HO-010": {
      "code": "HO-010",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "全院住客數",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "HO-011": {
      "code": "HO-011",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "上月上半月ICP完成度",
      "option": "",
      "notes": "自動產生 · 由 ICP 完成記錄產生；OT／PT 各自完成數及總數"
    },
    "HO-012": {
      "code": "HO-012",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "上月下半月ICP完成度",
      "option": "",
      "notes": "自動產生 · 由 ICP 完成記錄產生；OT／PT 各自完成數及總數"
    },
    "HO-013": {
      "code": "HO-013",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "本月上半月ICP完成度",
      "option": "",
      "notes": "自動產生 · 由 ICP 完成記錄產生；OT／PT 各自完成數及總數"
    },
    "HO-014": {
      "code": "HO-014",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "本月下半月ICP完成度",
      "option": "",
      "notes": "自動產生 · 由 ICP 完成記錄產生；OT／PT 各自完成數及總數"
    },
    "HO-015": {
      "code": "HO-015",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "已完成016份數",
      "option": "",
      "notes": "自動產生 · 已做評估但未填ICP的份數"
    },
    "HO-016": {
      "code": "HO-016",
      "sheet": "交更",
      "priority": "5",
      "system": "交更",
      "subsystem": "-",
      "name": "轉券位住客",
      "option": "",
      "notes": "自動產生 · 由住客管理系統的宿位變更產生，列出床號及姓名"
    },
    "HO-017": {
      "code": "HO-017",
      "sheet": "交更",
      "priority": "3",
      "system": "交更",
      "subsystem": "-",
      "name": "公告事項",
      "option": "",
      "notes": "手動輸入資料 · 由當日當值同事發出，需其他同事跟進"
    },
    "RES-001": {
      "code": "RES-001",
      "sheet": "住客管理",
      "priority": "2",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "序號",
      "option": "",
      "notes": "手動輸入資料 · 系統自動檢查有否重覆"
    },
    "RES-002": {
      "code": "RES-002",
      "sheet": "住客管理",
      "priority": "1",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "院舍",
      "option": "",
      "notes": "多選一"
    },
    "RES-003": {
      "code": "RES-003",
      "sheet": "住客管理",
      "priority": "2",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "樓層",
      "option": "",
      "notes": "手動輸入資料 · 限制限制資料類型G、數字 限制訓練時間表中分組, 如2樓住客不能和1樓住客同組"
    },
    "RES-004": {
      "code": "RES-004",
      "sheet": "住客管理",
      "priority": "1",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "床號",
      "option": "",
      "notes": "手動輸入資料 · 系統自動檢查有否重覆"
    },
    "RES-005": {
      "code": "RES-005",
      "sheet": "住客管理",
      "priority": "1",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "姓名",
      "option": "",
      "notes": "手動輸入資料 · 系統自動檢查有否奇怪符號"
    },
    "RES-006": {
      "code": "RES-006",
      "sheet": "住客管理",
      "priority": "1",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "宿位",
      "option": "私位",
      "notes": "多選一"
    },
    "RES-007": {
      "code": "RES-007",
      "sheet": "住客管理",
      "priority": "1",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "訓練次數",
      "option": "2次/星期",
      "notes": "自動產生 · 券位/買位住客每星期2次"
    },
    "RES-008": {
      "code": "RES-008",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "感染控制",
      "option": "VRE",
      "notes": "多項選擇"
    },
    "RES-009": {
      "code": "RES-009",
      "sheet": "住客管理",
      "priority": "2",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "性別",
      "option": "男",
      "notes": "多選一"
    },
    "RES-010": {
      "code": "RES-010",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "出生日期",
      "option": "",
      "notes": "手動輸入日期 · 有機會只有年份 決定ICP週期的開始"
    },
    "RES-011": {
      "code": "RES-011",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "年齡",
      "option": "",
      "notes": "自動產生"
    },
    "RES-012": {
      "code": "RES-012",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "學歷",
      "option": "0-3",
      "notes": "多選一 · 分類參考自HK-MoCA"
    },
    "RES-013": {
      "code": "RES-013",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "語言(表達)",
      "option": "廣東話",
      "notes": "多項選擇"
    },
    "RES-014": {
      "code": "RES-014",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "語言(接收)",
      "option": "廣東話",
      "notes": "多項選擇"
    },
    "RES-015": {
      "code": "RES-015",
      "sheet": "住客管理",
      "priority": "2",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "入住日期",
      "option": "",
      "notes": "手動輸入日期 · 容許只輸入年份、月份，但會持續提醒資料未齊"
    },
    "RES-016": {
      "code": "RES-016",
      "sheet": "住客管理",
      "priority": "2",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "退住日期",
      "option": "",
      "notes": "自動產生 · 由復康運動紀錄同步"
    },
    "RES-017": {
      "code": "RES-017",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "病歷",
      "option": "",
      "notes": "多項選擇 · 由評估系統同步（評估系統名為 Medical History）；此副本唯讀"
    },
    "RES-018": {
      "code": "RES-018",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "現實導向(時)",
      "option": "",
      "notes": "多選一 · 由評估系統同步"
    },
    "RES-019": {
      "code": "RES-019",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "現實導向(地)",
      "option": "",
      "notes": "多選一 · 由評估系統同步"
    },
    "RES-020": {
      "code": "RES-020",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "現實導向(人)",
      "option": "",
      "notes": "多選一 · 由評估系統同步； 交叉：VIP個案，必須接觸；雙交叉：VIP個案，必須每節服務足夠時間"
    },
    "RES-021": {
      "code": "RES-021",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "活動現況",
      "option": "IW： 自由活動",
      "notes": "多選一 · 由評估系統同步"
    },
    "RES-022": {
      "code": "RES-022",
      "sheet": "住客管理",
      "priority": "2",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "最近更新日期",
      "option": "",
      "notes": "自動產生"
    },
    "RES-023": {
      "code": "RES-023",
      "sheet": "住客管理",
      "priority": "1",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "上次ICP會議日期",
      "option": "",
      "notes": "手動輸入資料"
    },
    "RES-024": {
      "code": "RES-024",
      "sheet": "住客管理",
      "priority": "1",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "下次ICP性質",
      "option": "1個月",
      "notes": "多選一 · 如：今次ICP日期為2/1/2026，下次ICP限期為1/2/2026"
    },
    "RES-025": {
      "code": "RES-025",
      "sheet": "住客管理",
      "priority": "1",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "下次ICP會議限期",
      "option": "",
      "notes": "由系統自動計算 · 根據下次ICP性質"
    },
    "RES-026": {
      "code": "RES-026",
      "sheet": "住客管理",
      "priority": "1",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "額外復康服務次數",
      "option": "",
      "notes": "手動輸入"
    },
    "RES-027": {
      "code": "RES-027",
      "sheet": "住客管理",
      "priority": "2",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "建議活動性質/內容",
      "option": "1： 腳單車",
      "notes": "多項選擇 · 由評估系統同步（於評估系統名為 Treatment Plan）；只與最新已完成評估同步；此副本唯讀"
    },
    "RES-028": {
      "code": "RES-028",
      "sheet": "住客管理",
      "priority": "2",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "入院時段",
      "option": "",
      "notes": "自動產生 · 由復康運動紀錄同步"
    },
    "RES-029": {
      "code": "RES-029",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "MBI",
      "option": "",
      "notes": "自動產生 · 由評估系統同步；只跟隨最新一份已完成評估"
    },
    "RES-030": {
      "code": "RES-030",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "MoCA",
      "option": "",
      "notes": "自動產生 · 由評估系統同步；只跟隨最新一份已完成評估"
    },
    "RES-031": {
      "code": "RES-031",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "MoCA percentile",
      "option": "",
      "notes": "自動產生 · 由評估系統同步；只跟隨最新一份已完成評估"
    },
    "RES-032": {
      "code": "RES-032",
      "sheet": "住客管理",
      "priority": "3",
      "system": "住客管理系統",
      "subsystem": "-",
      "name": "狀態",
      "option": "留醫中",
      "notes": "自動產生 · 由復康運動紀錄的入院／出院 H 記錄產生；可手動加標籤，例如 Covid"
    },
    "TODO-001": {
      "code": "TODO-001",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "任務狀態",
      "option": "待辦",
      "notes": "預設"
    },
    "TODO-002": {
      "code": "TODO-002",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "任務類別",
      "option": "每日",
      "notes": "預設"
    },
    "TODO-003": {
      "code": "TODO-003",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "觸發來源",
      "option": "住客管理系統",
      "notes": "預設"
    },
    "TODO-004": {
      "code": "TODO-004",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "任務編號",
      "option": "",
      "notes": "手動輸入資料 · 系統自動檢查有否重覆"
    },
    "TODO-005": {
      "code": "TODO-005",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "任務名稱",
      "option": "",
      "notes": "手動輸入資料"
    },
    "TODO-006": {
      "code": "TODO-006",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "觸發條件",
      "option": "",
      "notes": "手動輸入資料 · 系統偵測到此條件時產生待辦"
    },
    "TODO-007": {
      "code": "TODO-007",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "限期規則",
      "option": "",
      "notes": "手動輸入資料"
    },
    "TODO-008": {
      "code": "TODO-008",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "實例編號",
      "option": "",
      "notes": "自動產生"
    },
    "TODO-009": {
      "code": "TODO-009",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "院舍",
      "option": "",
      "notes": "自動產生 · 由院舍設定同步"
    },
    "TODO-010": {
      "code": "TODO-010",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "住客",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "TODO-011": {
      "code": "TODO-011",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "狀態",
      "option": "",
      "notes": "預設"
    },
    "TODO-012": {
      "code": "TODO-012",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "建立日期",
      "option": "",
      "notes": "自動產生"
    },
    "TODO-013": {
      "code": "TODO-013",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "到期日",
      "option": "",
      "notes": "自動產生 · 依限期規則"
    },
    "TODO-014": {
      "code": "TODO-014",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "完成日期",
      "option": "",
      "notes": "自動產生"
    },
    "TODO-015": {
      "code": "TODO-015",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "完成人",
      "option": "",
      "notes": "自動產生 · 由當前用戶名稱產生"
    },
    "TODO-016": {
      "code": "TODO-016",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "備註",
      "option": "",
      "notes": "手動輸入資料"
    },
    "TODO-017": {
      "code": "TODO-017",
      "sheet": "待辦事項",
      "priority": "1",
      "system": "待辦事項",
      "subsystem": "-",
      "name": "負責人",
      "option": "",
      "notes": "手動輸入資料 · 可輸入 OT／PT／OTA 或同事姓名；可留空"
    },
    "REC-001": {
      "code": "REC-001",
      "sheet": "復康運動紀錄",
      "priority": "2",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "床號",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "REC-002": {
      "code": "REC-002",
      "sheet": "復康運動紀錄",
      "priority": "2",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "姓名",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "REC-003": {
      "code": "REC-003",
      "sheet": "復康運動紀錄",
      "priority": "3",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "宿位",
      "option": "買位",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "REC-004": {
      "code": "REC-004",
      "sheet": "復康運動紀錄",
      "priority": "1",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "日期",
      "option": "1-31",
      "notes": "自動產生 · 每月一個循環"
    },
    "REC-005": {
      "code": "REC-005",
      "sheet": "復康運動紀錄",
      "priority": "1",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "出席記錄",
      "option": "例： I/4",
      "notes": "手動輸入資料 · 每格輸入「形式 / 活動性質」"
    },
    "REC-006": {
      "code": "REC-006",
      "sheet": "復康運動紀錄",
      "priority": "1",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "形式",
      "option": "i： 個別",
      "notes": "多選一 · 於 ES-RH-007a「買位/院舍券復康運動紀錄表⌋紀錄"
    },
    "REC-007": {
      "code": "REC-007",
      "sheet": "復康運動紀錄",
      "priority": "1",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "活動性質",
      "option": "多選一",
      "notes": "自動產生 · 由住客管理系統產生 如：該住客的活動建議為1, 2, 3，可於此三項(以及Ax)中選一"
    },
    "REC-008": {
      "code": "REC-008",
      "sheet": "復康運動紀錄",
      "priority": "1",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "住客狀態",
      "option": "入住醫院 H",
      "notes": "手動輸入資料 · 入院當日填 H，入院期間以橫線表示，出院當日填 H"
    },
    "REC-009": {
      "code": "REC-009",
      "sheet": "復康運動紀錄",
      "priority": "1",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "補做節數",
      "option": "",
      "notes": "由系統自動計算 · *只限券位住客 因入院而錯過的訓練節數會被記低， 並於出院後的每一個有空餘節數的工作日提醒補回 入院超過1個月不用補回"
    },
    "REC-010": {
      "code": "REC-010",
      "sheet": "復康運動紀錄",
      "priority": "1",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "最後修改人",
      "option": "",
      "notes": "自動產生 · 顯示於每個已記錄項目的詳細資料"
    },
    "REC-011": {
      "code": "REC-011",
      "sheet": "復康運動紀錄",
      "priority": "1",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "最後修改日期時間",
      "option": "",
      "notes": "自動產生 · 顯示於每個已記錄項目的詳細資料"
    },
    "REC-012": {
      "code": "REC-012",
      "sheet": "復康運動紀錄",
      "priority": "1",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "樓層",
      "option": "",
      "notes": "自動產生 · 由住客管理系統 RES-003 同步；用於 007a 篩選"
    },
    "REC-013": {
      "code": "REC-013",
      "sheet": "復康運動紀錄",
      "priority": "1",
      "system": "復康運動紀錄",
      "subsystem": "-",
      "name": "活動現況",
      "option": "",
      "notes": "自動產生 · 由住客管理系統 RES-021 同步；用於 007a 篩選，選項 IW／IWC／CB／BB"
    },
    "006-001": {
      "code": "006-001",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "樓層",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步 同一小組住客必須為同一樓層"
    },
    "006-002": {
      "code": "006-002",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "床號",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "006-003": {
      "code": "006-003",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "住客姓名",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "006-004": {
      "code": "006-004",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "宿位",
      "option": "買位",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "006-005": {
      "code": "006-005",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "訓練次數",
      "option": "2次/星期",
      "notes": "自動產生 · 券位/買位"
    },
    "006-006": {
      "code": "006-006",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "付費訓練節數",
      "option": "",
      "notes": "手動輸入資料 · 額外付費節數"
    },
    "006-007": {
      "code": "006-007",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "付費頻率檢核",
      "option": "欠N節",
      "notes": "自動產生 · 對比基本訓練次數"
    },
    "006-008": {
      "code": "006-008",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "小組人數上限",
      "option": "",
      "notes": "自動產生 · 由院舍管理系統同步"
    },
    "006-009": {
      "code": "006-009",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "當日節數上限",
      "option": "當日總工時(治療師+助理) X 2 - 午膳",
      "notes": "由系統自動計算 · 計算自更表"
    },
    "006-010": {
      "code": "006-010",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "每時段(半小時)節數上限",
      "option": "當時段當值員工數",
      "notes": "由系統自動計算 · 計算自更表"
    },
    "006-011": {
      "code": "006-011",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "時段",
      "option": "08:00-08:30",
      "notes": "預設 · 如有自動排期功能，最後先放此節"
    },
    "006-012": {
      "code": "006-012",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "午膳時段",
      "option": "",
      "notes": "多項選擇 · 由院舍設定的午膳開始及結束時間控制，期間不能安排訓練。"
    },
    "006-013": {
      "code": "006-013",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "小組編號",
      "option": "",
      "notes": "自動產生 · 每日第一個小組為 G1，如此類推"
    },
    "006-014": {
      "code": "006-014",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "建議活動性質/內容",
      "option": "",
      "notes": "自動產生 · 由住客管理系統產生"
    },
    "006-015": {
      "code": "006-015",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "訓練形式",
      "option": "i： 個別",
      "notes": "多選一 · 每節一位住客"
    },
    "006-016": {
      "code": "006-016",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "Individual ES Vacancy",
      "option": "",
      "notes": "由系統自動計算 · 時段未被佔用，可作額外服務"
    },
    "006-017": {
      "code": "006-017",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "Group ES Vacancy",
      "option": "",
      "notes": "由系統自動計算 · 小組人數上限 - 當前人數"
    },
    "006-018": {
      "code": "006-018",
      "sheet": "訓練時間表",
      "priority": "2",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "吉位數量",
      "option": "",
      "notes": "由系統自動計算 · 時段未被佔用，預留給未入住住客(總床位-當前住客數)"
    },
    "006-019": {
      "code": "006-019",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "住客基本每日節數上限",
      "option": "1",
      "notes": "預設"
    },
    "006-020": {
      "code": "006-020",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "住客每日額外節數上限",
      "option": "1",
      "notes": "預設"
    },
    "006-021": {
      "code": "006-021",
      "sheet": "訓練時間表",
      "priority": "2",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "每天固定開組時間",
      "option": "時段",
      "notes": "多項選擇 · 只作自動填入偏好，按院舍保存並重用；不限制手動排期"
    },
    "006-022": {
      "code": "006-022",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "訓練日期",
      "option": "",
      "notes": "自動產生 · 實際日期（YYYY-MM-DD）；時間表按完整星期一至日範圍標示，但只顯示有 T/A 更表的服務日；月邊界相鄰日期在當前月份唯讀"
    },
    "006-023": {
      "code": "006-023",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "訓練週期錨定日期",
      "option": "",
      "notes": "手動輸入日期 · 預設為入院日；固定14日週期由此日期起連續計算"
    },
    "006-024": {
      "code": "006-024",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "訓練週期開始日期",
      "option": "",
      "notes": "自動產生 · 由週期錨定日期起每14日計算；包含開始日期"
    },
    "006-025": {
      "code": "006-025",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "訓練週期結束日期",
      "option": "",
      "notes": "自動產生 · 開始日期後第13日；包含結束日期"
    },
    "006-026": {
      "code": "006-026",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "訓練週期所屬月份",
      "option": "",
      "notes": "自動產生 · 週期開始日期所屬月份；跨月完成只計入此月份"
    },
    "006-027": {
      "code": "006-027",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "訓練計劃編號",
      "option": "",
      "notes": "自動產生 · 每院舍每月一個月度計劃快照"
    },
    "006-028": {
      "code": "006-028",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "訓練計劃來源",
      "option": "",
      "notes": "自動產生 · 最近已批准計劃；新月份按實際日期重新產生"
    },
    "006-029": {
      "code": "006-029",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "訓練計劃狀態",
      "option": "草稿",
      "notes": "自動產生 · 未符合全部要求"
    },
    "006-030": {
      "code": "006-030",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "改動範圍",
      "option": "只更改本節",
      "notes": "手動輸入資料 · 只調整選取實際日期節數，不改固定安排"
    },
    "006-031": {
      "code": "006-031",
      "sheet": "訓練時間表",
      "priority": "1",
      "system": "訓練時間表",
      "subsystem": "-",
      "name": "服務日",
      "option": "",
      "notes": "自動產生 · 由當日 T/A 更表決定是否顯示及可排期"
    },
    "AX-001": {
      "code": "AX-001",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "AX-HDR",
      "name": "評估編號",
      "option": "",
      "notes": "自動產生"
    },
    "AX-002": {
      "code": "AX-002",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "AX-HDR",
      "name": "住客",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "AX-003": {
      "code": "AX-003",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "AX-HDR",
      "name": "對應ICP週期",
      "option": "",
      "notes": "手動輸入資料 · 只適用於 ICP Ax"
    },
    "AX-004": {
      "code": "AX-004",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-BG",
      "name": "評估性質",
      "option": "Initial Ax",
      "notes": "自動產生"
    },
    "AX-005": {
      "code": "AX-005",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-BG",
      "name": "評估日期",
      "option": "",
      "notes": "自動產生，可手動更改 · 預設為當日"
    },
    "AX-006": {
      "code": "AX-006",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-BG",
      "name": "評估人",
      "option": "OT",
      "notes": "自動產生 · 按評估部分由實際編輯者自動記錄；保留部分、使用者及時間"
    },
    "AX-007": {
      "code": "AX-007",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-BG",
      "name": "牌照處檔號",
      "option": "",
      "notes": "自動產生 · 由院舍設定同步"
    },
    "AX-008": {
      "code": "AX-008",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-BG",
      "name": "安老院名稱",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "AX-009": {
      "code": "AX-009",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-BG",
      "name": "住客姓名",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "AX-010": {
      "code": "AX-010",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-BG",
      "name": "住客床號",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "AX-011": {
      "code": "AX-011",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-BG",
      "name": "性別",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "AX-012": {
      "code": "AX-012",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-BG",
      "name": "床位",
      "option": "",
      "notes": "自動產生 · 由住客管理系統同步"
    },
    "AX-013": {
      "code": "AX-013",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MH",
      "name": "Medical History",
      "option": "HT",
      "notes": "多項選擇"
    },
    "AX-014": {
      "code": "AX-014",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-COG",
      "name": "Alertness",
      "option": "Alert",
      "notes": "多選一"
    },
    "AX-015": {
      "code": "AX-015",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-COG",
      "name": "Receptive",
      "option": "Nil.",
      "notes": "多選一"
    },
    "AX-016": {
      "code": "AX-016",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-COG",
      "name": "Expressive",
      "option": "Nil.",
      "notes": "多選一"
    },
    "AX-017": {
      "code": "AX-017",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-COG",
      "name": "Attend to stimulus",
      "option": "verbal",
      "notes": "多選一"
    },
    "AX-018": {
      "code": "AX-018",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-COG",
      "name": "Speech",
      "option": "Nil.",
      "notes": "多選一"
    },
    "AX-019": {
      "code": "AX-019",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-COG",
      "name": "Following steps of command",
      "option": "≥2 (with / without object)",
      "notes": "多選一"
    },
    "AX-020": {
      "code": "AX-020",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-TOT",
      "name": "HK-MoCA 總分",
      "option": "/30",
      "notes": "自動產生 · 同步自HK-MoCA結果"
    },
    "AX-021": {
      "code": "AX-021",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-TOT",
      "name": "Unable to Ax",
      "option": "",
      "notes": "勾選 · 無法完成評估時勾選"
    },
    "AX-022": {
      "code": "AX-022",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-COG",
      "name": "Percentile",
      "option": "",
      "notes": "自動產生 · 同步自HK-MoCA結果"
    },
    "AX-023": {
      "code": "AX-023",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-COG",
      "name": "Safety awareness / Insight",
      "option": "High",
      "notes": "多選一"
    },
    "AX-024": {
      "code": "AX-024",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-SEN",
      "name": "Vision",
      "option": "Unable to Ax",
      "notes": "多選一"
    },
    "AX-025": {
      "code": "AX-025",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-SEN",
      "name": "Auditory",
      "option": "Unable to Ax",
      "notes": "多選一"
    },
    "AX-026": {
      "code": "AX-026",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOT",
      "name": "AROM",
      "option": "",
      "notes": "手動輸入資料"
    },
    "AX-027": {
      "code": "AX-027",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOT",
      "name": "PROM",
      "option": "",
      "notes": "手動輸入資料"
    },
    "AX-028": {
      "code": "AX-028",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOT",
      "name": "MMT",
      "option": "0",
      "notes": "多選一"
    },
    "AX-029": {
      "code": "AX-029",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOT",
      "name": "Muscle Tone",
      "option": "Flaccid",
      "notes": "多選一"
    },
    "AX-030": {
      "code": "AX-030",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOT",
      "name": "Deformity / Contracture",
      "option": "",
      "notes": "手動輸入資料"
    },
    "AX-031": {
      "code": "AX-031",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOT",
      "name": "Balance",
      "option": "Static — Sit： Good",
      "notes": "多選一"
    },
    "AX-032": {
      "code": "AX-032",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOT",
      "name": "Coordination",
      "option": "Rt. — UL： Good",
      "notes": "多選一"
    },
    "AX-033": {
      "code": "AX-033",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOB",
      "name": "臥床>坐",
      "option": "2 獨立完成",
      "notes": "多選一"
    },
    "AX-034": {
      "code": "AX-034",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOB",
      "name": "坐>臥床",
      "option": "3 3秒內獨立完成",
      "notes": "多選一"
    },
    "AX-035": {
      "code": "AX-035",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOB",
      "name": "坐>站立",
      "option": "3 不需支撐(可伸展)",
      "notes": "多選一"
    },
    "AX-036": {
      "code": "AX-036",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOB",
      "name": "站立",
      "option": "3 獨立完成(拐杖/四腳叉)",
      "notes": "多選一"
    },
    "AX-037": {
      "code": "AX-037",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOB",
      "name": "步行",
      "option": "3 獨立完成（拐杖或四腳叉）",
      "notes": "多選一"
    },
    "AX-038": {
      "code": "AX-038",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOB",
      "name": "6米計時步行",
      "option": "3 ≤15 秒",
      "notes": "多選一"
    },
    "AX-039": {
      "code": "AX-039",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOB",
      "name": "站立向前伸展",
      "option": "4 >20cm",
      "notes": "多選一"
    },
    "AX-040": {
      "code": "AX-040",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOB",
      "name": "Elderly Mobility Scale 總分",
      "option": "/20",
      "notes": "自動產生"
    },
    "AX-041": {
      "code": "AX-041",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "梳洗",
      "option": "0 完全依賴",
      "notes": "多選一"
    },
    "AX-042": {
      "code": "AX-042",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "進食",
      "option": "0 完全依賴",
      "notes": "多選一"
    },
    "AX-043": {
      "code": "AX-043",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "穿脫衣物",
      "option": "0 完全依賴",
      "notes": "多選一"
    },
    "AX-044": {
      "code": "AX-044",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "如廁",
      "option": "0 完全依賴",
      "notes": "多選一"
    },
    "AX-045": {
      "code": "AX-045",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "洗澡",
      "option": "0 完全依賴",
      "notes": "多選一"
    },
    "AX-046": {
      "code": "AX-046",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "轉移",
      "option": "0 完全依賴",
      "notes": "多選一"
    },
    "AX-085": {
      "code": "AX-085",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "步行",
      "option": "0 完全依賴",
      "notes": "多選一 · 評分為 0、3、8、12、15。輪椅項目只可在本項為 0 分時記錄。"
    },
    "AX-047": {
      "code": "AX-047",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "輪椅",
      "option": "0 完全依賴",
      "notes": "多選一 · 只限步行為 0 分時記錄。評分為 0、1、3、4、5。"
    },
    "AX-048": {
      "code": "AX-048",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "上下樓梯",
      "option": "0 完全依賴",
      "notes": "多選一"
    },
    "AX-049": {
      "code": "AX-049",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "排尿控制",
      "option": "0 完全依賴",
      "notes": "多選一"
    },
    "AX-050": {
      "code": "AX-050",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "排便控制",
      "option": "0 完全依賴",
      "notes": "多選一"
    },
    "AX-051": {
      "code": "AX-051",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "Modified Barthel Index 總分",
      "option": "/100",
      "notes": "自動產生"
    },
    "AX-052": {
      "code": "AX-052",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "Walking Aids",
      "option": "Stick",
      "notes": "多選一"
    },
    "AX-053": {
      "code": "AX-053",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-PRB",
      "name": "Main Problem Identified",
      "option": "Cognitive decline",
      "notes": "多選一"
    },
    "AX-054": {
      "code": "AX-054",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-TX",
      "name": "Treatment Plan",
      "option": "Static bike (UL/LL)",
      "notes": "多項選擇 · 同步至住客管理系統"
    },
    "AX-055": {
      "code": "AX-055",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-ASR",
      "name": "Assessor",
      "option": "Occupational Therapist",
      "notes": "多選一"
    },
    "AX-056": {
      "code": "AX-056",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-ASR",
      "name": "評估人名稱",
      "option": "",
      "notes": "自動產生 · 由當前用戶名稱產生，1-2位(OT/PT)"
    },
    "AX-057": {
      "code": "AX-057",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-ASR",
      "name": "簽署",
      "option": "",
      "notes": "列印後手寫 · OT 及 PT 各自簽署"
    },
    "AX-058": {
      "code": "AX-058",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-MEM",
      "name": "HK-MoCA 記憶 — 第一次測試",
      "option": "面孔",
      "notes": "勾選 · 第一次測試；標準版"
    },
    "AX-059": {
      "code": "AX-059",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-MEM",
      "name": "HK-MoCA 記憶 — 第二次測試",
      "option": "面孔",
      "notes": "勾選 · 第二次測試；標準版"
    },
    "AX-060": {
      "code": "AX-060",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-MEM",
      "name": "HK-MoCA 記憶 — 分數",
      "option": "/5",
      "notes": "自動產生 · 第一次測試的剔號數"
    },
    "AX-061": {
      "code": "AX-061",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-FLU",
      "name": "HK-MoCA 語言流暢度 — 詞類",
      "option": "動物",
      "notes": "多選一 · 標準版"
    },
    "AX-062": {
      "code": "AX-062",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-FLU",
      "name": "HK-MoCA 語言流暢度 — 全部詞語",
      "option": "",
      "notes": "手動輸入資料 · 一分鐘內說出的詞語總數"
    },
    "AX-063": {
      "code": "AX-063",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-FLU",
      "name": "HK-MoCA 語言流暢度 — 重複詞語",
      "option": "",
      "notes": "手動輸入資料"
    },
    "AX-064": {
      "code": "AX-064",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-FLU",
      "name": "HK-MoCA 語言流暢度 — 非動物／非生果詞語",
      "option": "",
      "notes": "手動輸入資料"
    },
    "AX-065": {
      "code": "AX-065",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-FLU",
      "name": "HK-MoCA 語言流暢度 — 總正確答案",
      "option": "",
      "notes": "自動產生 · 全部詞語 − 重複詞語 − 非該類詞語"
    },
    "AX-066": {
      "code": "AX-066",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-FLU",
      "name": "HK-MoCA 語言流暢度 — 分數",
      "option": "/9",
      "notes": "自動產生 · 每個正確答案 0.5 分，上限 9 分"
    },
    "AX-067": {
      "code": "AX-067",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-ORI",
      "name": "HK-MoCA 定向 — 日",
      "option": "",
      "notes": "勾選 · 每項 1 分"
    },
    "AX-068": {
      "code": "AX-068",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-ORI",
      "name": "HK-MoCA 定向 — 月",
      "option": "",
      "notes": "勾選 · 每項 1 分"
    },
    "AX-069": {
      "code": "AX-069",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-ORI",
      "name": "HK-MoCA 定向 — 年",
      "option": "",
      "notes": "勾選 · 每項 1 分"
    },
    "AX-070": {
      "code": "AX-070",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-ORI",
      "name": "HK-MoCA 定向 — 星期",
      "option": "",
      "notes": "勾選 · 每項 1 分"
    },
    "AX-071": {
      "code": "AX-071",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-ORI",
      "name": "HK-MoCA 定向 — 地點",
      "option": "",
      "notes": "勾選 · 每項 1 分"
    },
    "AX-072": {
      "code": "AX-072",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-ORI",
      "name": "HK-MoCA 定向 — 地區",
      "option": "",
      "notes": "勾選 · 每項 1 分"
    },
    "AX-073": {
      "code": "AX-073",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-ORI",
      "name": "HK-MoCA 定向 — 分數",
      "option": "/6",
      "notes": "自動產生 · 剔號數"
    },
    "AX-074": {
      "code": "AX-074",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-DEL",
      "name": "HK-MoCA 延遲記憶 — 回憶詞語",
      "option": "面孔",
      "notes": "勾選 · 無提示下回憶；標準版"
    },
    "AX-075": {
      "code": "AX-075",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-DEL",
      "name": "HK-MoCA 延遲記憶 — 類目提示",
      "option": "面孔",
      "notes": "勾選 · 標準版；身體的一部份 → 鼻哥、面孔、手"
    },
    "AX-076": {
      "code": "AX-076",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-DEL",
      "name": "HK-MoCA 延遲記憶 — 多項選擇",
      "option": "面孔",
      "notes": "勾選 · 標準版；鼻哥、面孔、手"
    },
    "AX-077": {
      "code": "AX-077",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-DEL",
      "name": "HK-MoCA 延遲記憶 — 分數 (a)",
      "option": "/5",
      "notes": "自動產生 · 回憶詞語的剔號數"
    },
    "AX-078": {
      "code": "AX-078",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-DEL",
      "name": "HK-MoCA 延遲記憶 — 總回憶 (b)",
      "option": "/5",
      "notes": "自動產生 · 回憶詞語 + 類目提示 + 多項選擇"
    },
    "AX-079": {
      "code": "AX-079",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-DEL",
      "name": "HK-MoCA 延遲記憶分數 (a+b)",
      "option": "/10",
      "notes": "自動產生"
    },
    "AX-080": {
      "code": "AX-080",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-EDU",
      "name": "yr. edu.",
      "option": "0-3",
      "notes": "多選一 · 分類參考"
    },
    "AX-086": {
      "code": "AX-086",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-PCT",
      "name": "Percentile",
      "option": ">16th",
      "notes": "自動產生 · 按年齡及教育程度校正"
    },
    "AX-081": {
      "code": "AX-081",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "AX-OUT",
      "name": "現實導向(時)",
      "option": "",
      "notes": "多選一(勾、勾點、交叉) · 同步至住客管理系統"
    },
    "AX-082": {
      "code": "AX-082",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "AX-OUT",
      "name": "現實導向(地)",
      "option": "",
      "notes": "多選一(勾、勾點、交叉) · 同步至住客管理系統"
    },
    "AX-083": {
      "code": "AX-083",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "AX-OUT",
      "name": "現實導向(人)",
      "option": "",
      "notes": "多選一(勾、勾點、交叉、雙交叉) · 同步至住客管理系統；／交叉：VIP個案，必須接觸；／雙交叉：VIP個案，必須每節服務足夠時間"
    },
    "AX-084": {
      "code": "AX-084",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "AX-OUT",
      "name": "活動現況",
      "option": "IW： 自由活動",
      "notes": "多選一 · 同步至住客管理系統"
    },
    "AX-087": {
      "code": "AX-087",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "MOCA-HDR",
      "name": "HK-MoCA 5min 版本",
      "option": "標準版",
      "notes": "多選一 · 治療師於評估時選擇版本"
    },
    "AX-088": {
      "code": "AX-088",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-BG",
      "name": "Clinical Notes",
      "option": "",
      "notes": "手動輸入資料 · 每段一個備註框；按 subtitle 旁按鈕開啟；不影響分數或完成狀態；OT／PT 可編輯及列印"
    },
    "AX-089": {
      "code": "AX-089",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MH",
      "name": "Clinical Notes",
      "option": "",
      "notes": "手動輸入資料 · 每段一個備註框；按 subtitle 旁按鈕開啟；不影響分數或完成狀態；OT／PT 可編輯及列印"
    },
    "AX-090": {
      "code": "AX-090",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-COG",
      "name": "Clinical Notes",
      "option": "",
      "notes": "手動輸入資料 · 每段一個備註框；按 subtitle 旁按鈕開啟；不影響分數或完成狀態；OT／PT 可編輯及列印"
    },
    "AX-091": {
      "code": "AX-091",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-SEN",
      "name": "Clinical Notes",
      "option": "",
      "notes": "手動輸入資料 · 每段一個備註框；按 subtitle 旁按鈕開啟；不影響分數或完成狀態；OT／PT 可編輯及列印"
    },
    "AX-092": {
      "code": "AX-092",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOT",
      "name": "Clinical Notes",
      "option": "",
      "notes": "手動輸入資料 · 每段一個備註框；按 subtitle 旁按鈕開啟；不影響分數或完成狀態；OT／PT 可編輯及列印"
    },
    "AX-093": {
      "code": "AX-093",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MOB",
      "name": "Clinical Notes",
      "option": "",
      "notes": "手動輸入資料 · 每段一個備註框；按 subtitle 旁按鈕開啟；不影響分數或完成狀態；OT／PT 可編輯及列印"
    },
    "AX-094": {
      "code": "AX-094",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-MBI",
      "name": "Clinical Notes",
      "option": "",
      "notes": "手動輸入資料 · 每段一個備註框；按 subtitle 旁按鈕開啟；不影響分數或完成狀態；OT／PT 可編輯及列印"
    },
    "AX-095": {
      "code": "AX-095",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-PRB",
      "name": "Clinical Notes",
      "option": "",
      "notes": "手動輸入資料 · 每段一個備註框；按 subtitle 旁按鈕開啟；不影響分數或完成狀態；OT／PT 可編輯及列印"
    },
    "AX-096": {
      "code": "AX-096",
      "sheet": "評估系統",
      "priority": "1",
      "system": "評估系統",
      "subsystem": "016-TX",
      "name": "Clinical Notes",
      "option": "",
      "notes": "手動輸入資料 · 每段一個備註框；按 subtitle 旁按鈕開啟；不影響分數或完成狀態；OT／PT 可編輯及列印"
    },
    "HOME-001": {
      "code": "HOME-001",
      "sheet": "院舍設定",
      "priority": "1",
      "system": "院舍設定",
      "subsystem": "-",
      "name": "院舍名稱",
      "option": "一城富璟 (co)",
      "notes": "預設"
    },
    "HOME-002": {
      "code": "HOME-002",
      "sheet": "院舍設定",
      "priority": "1",
      "system": "院舍設定",
      "subsystem": "-",
      "name": "牌照處檔號",
      "option": "",
      "notes": "預設"
    },
    "HOME-003": {
      "code": "HOME-003",
      "sheet": "院舍設定",
      "priority": "1",
      "system": "院舍設定",
      "subsystem": "-",
      "name": "每月所需治療師時數",
      "option": "",
      "notes": "手動輸入資料 · 人力資料記錄；時間表容量由每日 T/A 更表推算"
    },
    "HOME-004": {
      "code": "HOME-004",
      "sheet": "院舍設定",
      "priority": "1",
      "system": "院舍設定",
      "subsystem": "-",
      "name": "總床位",
      "option": "",
      "notes": "手動輸入資料"
    },
    "HOME-005": {
      "code": "HOME-005",
      "sheet": "院舍設定",
      "priority": "1",
      "system": "院舍設定",
      "subsystem": "-",
      "name": "券位床位數",
      "option": "",
      "notes": "手動輸入資料"
    },
    "HOME-006": {
      "code": "HOME-006",
      "sheet": "院舍設定",
      "priority": "1",
      "system": "院舍設定",
      "subsystem": "-",
      "name": "小組人數上限",
      "option": "",
      "notes": "手動輸入資料 · 限制單一時段的小組最多住客人數"
    },
    "HOME-007": {
      "code": "HOME-007",
      "sheet": "院舍設定",
      "priority": "1",
      "system": "院舍設定",
      "subsystem": "-",
      "name": "⌈緊急ICP⌋對下次會議限期計算影響",
      "option": "沒有影響",
      "notes": "多選一"
    },
    "HOME-008": {
      "code": "HOME-008",
      "sheet": "院舍設定",
      "priority": "1",
      "system": "院舍設定",
      "subsystem": "-",
      "name": "午膳開始時間",
      "option": "",
      "notes": "手動輸入資料 · 與午膳結束時間共同設定每日不可安排訓練的時段，最少半小時。"
    },
    "HOME-009": {
      "code": "HOME-009",
      "sheet": "院舍設定",
      "priority": "1",
      "system": "院舍設定",
      "subsystem": "-",
      "name": "午膳結束時間",
      "option": "",
      "notes": "手動輸入資料"
    }
  },
  "uatScenarios": [
    {
      "id": "UAT-001",
      "scenario": "入住與初始工作",
      "preconditions": "使用院舍已有床位資料；住客尚未建立；操作者具新增住客權限。",
      "steps": "1. 新增住客並填寫必要資料。 2. 確認入住。 3. 開啟住客詳情及待辦清單。",
      "passCriteria": "住客紀錄、第一個 ICP 週期、初始評估任務及相關待辦建立；住客清單和狀態紀錄同步更新；沒有重複住客或重複週期。"
    },
    {
      "id": "UAT-002",
      "scenario": "評估自動完成與個別 N/A",
      "preconditions": "ES-RH-016 評估為草稿；一項必填項目已標為 N/A，另一必填項目仍空白。",
      "steps": "1. 查看評估狀態。 2. 補回空白必填項目。 3. 查看完成狀態及編輯者紀錄。",
      "passCriteria": "評估在資料未完整時保持草稿；所有必填項目有效或逐項 N/A、條件欄位符合及 MoCA 要求符合後自動完成；系統記錄實際編輯者及時間。"
    },
    {
      "id": "UAT-003",
      "scenario": "評估分工、更正與作廢",
      "preconditions": "OT 及 PT 均有權開啟同一份 016；該評估為最新有效來源。",
      "steps": "1. OT 編輯一般共同部分。 2. PT 編輯同一共同部分。 3. PT 嘗試編輯 MoCA。 4. 更正已完成評估。 5. 作廢該評估並查看臨床衍生欄位。",
      "passCriteria": "OT 及 PT 均可編輯共同部分；MoCA 只可由 OT 編輯；系統記錄實際編輯者；更正後評估保持已完成並保留歷史；作廢後臨床衍生欄位改由最新仍有效的評估更新。"
    },
    {
      "id": "UAT-004",
      "scenario": "退住全流程",
      "preconditions": "住客有未來待辦、進行中的 ICP、未來訓練安排、已列印評估及歷史復康紀錄。",
      "steps": "1. 執行退住清單並確認退住。 2. 檢查住客、ICP、待辦、訓練時間表、復康紀錄及下一次交更。",
      "passCriteria": "住客狀態及狀態紀錄更新；未來住客待辦取消；住客移出未來訓練安排；停止新的 007a／007c 要求；ICP 週期結束或取消但歷史保留；只餘下「將已列印評估由文件夾 E 交院舍保存」待辦；退住資料出現在下一次交更。"
    },
    {
      "id": "UAT-005",
      "scenario": "待辦生命週期",
      "preconditions": "測試資料包含手動待辦、自動待辦、重複性待辦、ICP 限期待辦、院舍待辦及留醫住客。",
      "steps": "1. 不設限期建立手動待辦。 2. 完成待辦。 3. 再次完成重複性待辦。 4. 記錄住客留醫及出院。",
      "passCriteria": "未設限期的手動待辦顯示於今日；完成紀錄包含完成者及時間；重複性待辦只保留最近一次完成紀錄；系統待辦不可任意修改或刪除；留醫只順延該住客的初始評估、交更任務及自建待辦，ICP 限期、每週核對及院舍層面待辦不順延。"
    },
    {
      "id": "UAT-006",
      "scenario": "交更任務與待辦同步",
      "preconditions": "操作者可在指定院舍頻道發文；院舍已有可指派同事。",
      "steps": "1. 建立公告事項。 2. 建立任務並設定負責人及到期日。 3. 從待辦完成任務。 4. 查看交更歷史及搜尋。",
      "passCriteria": "任務只建立一筆共用項目；任務同時顯示於待辦和交更；完成只從待辦進行並同步顯示；交更歷史可按日期篩選及搜尋。"
    },
    {
      "id": "UAT-007",
      "scenario": "訓練時間表",
      "preconditions": "測試院舍有部分日期缺少 T/A 更表、每週住客、以入院日錨定的 14 日週期住客、額外服務住客、跨月週期、固定活動性質、已保存的固定開組時間，以及最近一個已批准月份計劃。",
      "steps": "1. 切換週檢視及月檢視，檢查只顯示有更表的服務日。 2. 檢查跨月完整週只計一次。 3. 安排 14 日週期住客於相鄰日期完成相鄰週期。 4. 拖放住客到有效、無效及小組合併目標，並把小組成員拖到空時段。 5. 新增、移動、合併及拆分小組並檢查下標編號 G₁、G₂ 重新編號。 6. 使用只更改本節及更改所有相關節數。 7. 開啟下一個月份並確認重用計劃。 8. 查看 007 中由有效 006 節數產生的日期提示。 9. 嘗試把未滿足週期或資源要求的時間表標為有效。",
      "passCriteria": "每週要求按完整星期一至日計算且邊界週只計一次；私位／暫託按固定 14 日週期每期一節，不設七日本身間距；月度分母顯示 0/2 或 0/3；缺少更表日期不可編輯或排期；只有有更表的服務日顯示於時間表；拖放以全時段綠色／紅色提示，無效放置不儲存並顯示原因；小組成員可拖出成為個別節數；每日小組按時間及固定次序自動編為斜線及下標 G₁、G₂ 等並即時重新推算；改動範圍只有兩項且不重寫歷史；下月無改動時重新產生並重用已批准安排；只有有效 006 節數提示其日期所屬月份的 007 紀錄，不寫入出席。"
    },
    {
      "id": "UAT-008",
      "scenario": "復康運動紀錄",
      "preconditions": "測試住客已安排 007a 及 007c 活動，並需要測試留醫、修改資料、篩選及搜尋。",
      "steps": "1. 查看有效 006 產生的待填及逾期格。 2. 核對 006、007a 及 007c 的小組編號。 3. 在 007a 開啟已連結 006 的個別及小組預約並輸入活動。 4. 查看個別紀錄的最後修改人及日期。 5. 使用樓層及活動現況篩選。 6. 使用床號及姓名搜尋。 7. 在 007c 開啟已連結 006 的額外服務預約並輸入活動。 8. 檢視缺漏紀錄及列印預覽。",
      "passCriteria": "007a 與 007c 紀錄分開顯示；待填個別格為淡黃色且無文字；待填小組格顯示斜線及與 006 相同的下標編號 G₁、G₂ 等；逾期未填格為淡粉紅色「欠」；已填格沿用形式分類淡色背景；系統按 006 自動選定 i／g／ei／eg 且不可改選；每個已記錄項目顯示最後修改人及日期時間；樓層、活動現況篩選及床號／姓名搜尋有效；已選 X 或 H 後不能加入活動性質；X 及 H 計為缺漏；留醫期間及列印預覽正確。"
    },
    {
      "id": "UAT-009",
      "scenario": "ICP 生命週期",
      "preconditions": "住客有一個進行中的 ICP，已有 ICP Ax 及多於五份 ICP 歷史。院舍已設定緊急 ICP 對限期計算的影響。",
      "steps": "1. 查看 ICP 歷史並按 Show more。 2. 查看下次 ICP 性質。 3. 在住客資料頁修改下次限期，再到 ICP 頁核對。 4. 建立評估窗口內的 Re-Ax 草稿並選擇用作 ICP Ax。 5. 完成 Re-Ax。 6. 分別記錄 OT 及 PT 的 ICP 表格已完成。 7. 查看交更中的 ICP 進度。",
      "passCriteria": "ICP 歷史預設只顯示最近五份，其餘由 Show more 展開且沒有刪除；ICP 頁顯示下次 ICP 性質；兩頁共用同一下次限期並同步修改；Re-Ax 完成後取代原有 ICP Ax 並保留歷史；OT 及 PT 的 ICP 表格完成紀錄分開保存。"
    },
    {
      "id": "UAT-010",
      "scenario": "院舍範圍、權限與介面語言",
      "preconditions": "系統內有兩個院舍，各自有不同住客、待辦及評估資料；第一版只有 OT 及 PT 使用者。",
      "steps": "1. 選擇院舍 A 並檢查主要頁面。 2. 切換至院舍 B。 3. 由一般用戶查看審計入口。 4. 由資深同事查看審計紀錄。 5. 檢查介面語言。",
      "passCriteria": "一次切換會更新所有系統；畫面不顯示另一間院舍的資料；一般用戶沒有審計檢視入口；資深同事可查看所屬範圍審計紀錄；介面文字為繁體中文並保留既定臨床英文術語。"
    },
    {
      "id": "UAT-011",
      "scenario": "裝置、列印及離線備用",
      "preconditions": "系統已載入完成評估及 007 紀錄；測試 laptop、tablet、phone 及網絡中斷。",
      "steps": "1. 在 laptop 及 tablet 開啟主要畫面。 2. 嘗試以 phone 開啟。 3. 列印 016、MOCA、007a 及 007c。 4. 中斷網絡並嘗試輸入資料。",
      "passCriteria": "Laptop 及 tablet 可操作；phone 不支援；所需列印輸出與畫面一致；離線輸入不可用並顯示紙本備用提示；006 不提供列印。"
    },
    {
      "id": "UAT-012",
      "scenario": "016 Clinical Notes",
      "preconditions": "ES-RH-016 多個段落已有內嵌臨床備註文字框，OT 及 PT 均有權編輯同一份評估。",
      "steps": "1. 查看各段落 subtitle 旁的 Clinical Notes 按鈕。 2. 在一個段落輸入備註。 3. 由另一職系修改同一備註。 4. 查看非空備註及完成狀態。 5. 列印評估。",
      "passCriteria": "每段只顯示一個 Clinical Notes 按鈕及單一備註框；原有內嵌備註框已移除；OT 及 PT 均可修改；備註不影響分數或完成狀態；非空備註直接顯示；列印輸出包含備註。"
    }
  ]
});
})();
