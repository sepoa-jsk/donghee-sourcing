const MockData = {
  seed: {
    projects: [
      { id: "PRJ-2025-001", name: "NX5 SUV", oem: "HMC", model: "NX5", platform: "N플랫폼", phase: "P2", sopDate: "2026/09/01", manager: "김구매", bomStatus: "작성중", regDate: "2025/03/15" },
      { id: "PRJ-2025-002", name: "EV 세단", oem: "HMC", model: "CE", platform: "CE플랫폼", phase: "P1", sopDate: "2026/12/01", manager: "이소싱", bomStatus: "미작성", regDate: "2025/04/20" },
      { id: "PRJ-2025-003", name: "소형 SUV", oem: "기아", model: "SX2", platform: "SX플랫폼", phase: "P3", sopDate: "2026/06/01", manager: "박원가", bomStatus: "Freeze", regDate: "2025/06/10" },
      { id: "PRJ-2025-004", name: "수소 SUV", oem: "HMC", model: "NX7", platform: "N플랫폼", phase: "P2", sopDate: "2027/03/01", manager: "김구매", bomStatus: "작성중", regDate: "2025/07/25" },
      { id: "PRJ-2024-011", name: "RV 플랫폼", oem: "HMC", model: "RV1", platform: "RV플랫폼", phase: "P4", sopDate: "2025/12/01", manager: "이소싱", bomStatus: "Freeze", regDate: "2024/11/05" },
      { id: "PRJ-2024-008", name: "경차 페달", oem: "기아", model: "AX1", platform: "AX플랫폼", phase: "SOP완료", sopDate: "2025/06/01", manager: "박원가", bomStatus: "Freeze", regDate: "2024/08/12" },
      { id: "PRJ-2024-005", name: "중형 세단", oem: "HMC", model: "GN7", platform: "GN플랫폼", phase: "SOP완료", sopDate: "2025/03/01", manager: "김구매", bomStatus: "Freeze", regDate: "2024/06/30" }
    ],

    suppliers: [
      { id: "SUP-001", name: "(주)한국정밀", bizNo: "3128131399", tier: "Tier2", managed: "Y", contract: "Y", grade: "A", manager: "김구매" },
      { id: "SUP-002", name: "대성금속(주)", bizNo: "1398101043", tier: "Tier2", managed: "Y", contract: "N", grade: "B", manager: "이소싱" },
      { id: "SUP-003", name: "진흥스틸", bizNo: "1378144541", tier: "Tier3", managed: "N", contract: "N", grade: "A", manager: "박원가" },
      { id: "SUP-004", name: "한일수지(주)", bizNo: "1338138969", tier: "Tier3", managed: "Y", contract: "Y", grade: "B", manager: "김구매" },
      { id: "SUP-005", name: "(주)동양알미늄", bizNo: "1248657972", tier: "Tier2", managed: "Y", contract: "Y", grade: "A", manager: "이소싱" },
      { id: "SUP-006", name: "세진테크", bizNo: "1338128097", tier: "Tier3", managed: "N", contract: "N", grade: "C", manager: "박원가" },
      { id: "SUP-007", name: "(주)광명정밀", bizNo: "6158124555", tier: "Tier2", managed: "Y", contract: "N", grade: "B", manager: "김구매" },
      { id: "SUP-008", name: "미래소재(주)", bizNo: "1348104176", tier: "Tier3", managed: "Y", contract: "Y", grade: "A", manager: "이소싱" }
    ],

    items: [
      { id: "ITM-001", drawNo: "DWG-S101", name: "로어 암 브라켓", cat1: "가공품", cat2: "강판", cat3: "냉연강판", material: "SPFC440", weight: 2840, unit: "EA", lme: "Y", basePrice: 7050, active: "Y" },
      { id: "ITM-002", drawNo: "DWG-S102", name: "스태빌라이저 링크", cat1: "가공품", cat2: "강판", cat3: "냉연강판", material: "SPFC440", weight: 1560, unit: "EA", lme: "Y", basePrice: 5340, active: "Y" },
      { id: "ITM-003", drawNo: "DWG-F201", name: "탱크 본체", cat1: "가공품", cat2: "수지", cat3: "HDPE", material: "HDPE-B", weight: 3800, unit: "EA", lme: "Y", basePrice: 17950, active: "Y" },
      { id: "ITM-004", drawNo: "DWG-F202", name: "연료펌프 모듈", cat1: "구매품", cat2: "전장", cat3: "ECU", material: "-", weight: 1400, unit: "EA", lme: "N", basePrice: 9850, active: "Y" },
      { id: "ITM-005", drawNo: "DWG-P301", name: "브레이크 페달 암", cat1: "가공품", cat2: "강판", cat3: "합금강", material: "SCM440", weight: 980, unit: "EA", lme: "Y", basePrice: 3080, active: "Y" },
      { id: "ITM-006", drawNo: "DWG-H401", name: "수소탱크 라이너", cat1: "가공품", cat2: "비철금속", cat3: "Al합금", material: "Al6061", weight: 5200, unit: "EA", lme: "Y", basePrice: 28500, active: "Y" },
      { id: "ITM-007", drawNo: "DWG-H402", name: "CFRP 보강층", cat1: "원자재", cat2: "기타", cat3: "탄소섬유", material: "CFRP-T", weight: 3100, unit: "kg", lme: "N", basePrice: 45000, active: "Y" },
      { id: "ITM-008", drawNo: "DWG-S103", name: "코일 스프링 시트", cat1: "가공품", cat2: "강판", cat3: "합금강", material: "SCM440", weight: 980, unit: "EA", lme: "Y", basePrice: 3080, active: "Y" },
      { id: "ITM-009", drawNo: "DWG-F203", name: "연료 필러넥", cat1: "가공품", cat2: "강판", cat3: "스테인리스", material: "STS304", weight: 650, unit: "EA", lme: "Y", basePrice: 4200, active: "Y" },
      { id: "ITM-010", drawNo: "DWG-P302", name: "전자식 페달 센서", cat1: "구매품", cat2: "전장", cat3: "반도체", material: "-", weight: 120, unit: "EA", lme: "N", basePrice: 12500, active: "Y" }
    ],

    materials: [
      { id: "MAT-001", name: "SPFC440", group: "강판", spec: "냉연강판", unit: "ton", lme: "Y", lmeCode: "LME-STEEL-HRC", basePrice: 621000, currency: "USD", active: "Y" },
      { id: "MAT-002", name: "SPFH590", group: "강판", spec: "고강도강", unit: "ton", lme: "Y", lmeCode: "LME-STEEL-HRC", basePrice: 680000, currency: "USD", active: "Y" },
      { id: "MAT-003", name: "SCM440", group: "강판", spec: "합금강", unit: "ton", lme: "Y", lmeCode: "LME-STEEL-HRC", basePrice: 920000, currency: "USD", active: "Y" },
      { id: "MAT-004", name: "HDPE-B", group: "수지", spec: "고밀도PE", unit: "kg", lme: "Y", lmeCode: "CRUDE-OIL", basePrice: 1850, currency: "USD", active: "Y" },
      { id: "MAT-005", name: "PP-HI", group: "수지", spec: "PP", unit: "kg", lme: "N", lmeCode: "", basePrice: 1620, currency: "KRW", active: "Y" },
      { id: "MAT-006", name: "Al5052", group: "비철금속", spec: "Al합금", unit: "ton", lme: "Y", lmeCode: "LME-AL", basePrice: 2418000, currency: "USD", active: "Y" },
      { id: "MAT-007", name: "Al6061", group: "비철금속", spec: "Al합금", unit: "ton", lme: "Y", lmeCode: "LME-AL", basePrice: 2520000, currency: "USD", active: "Y" },
      { id: "MAT-008", name: "CFRP-T", group: "기타", spec: "탄소섬유", unit: "kg", lme: "N", lmeCode: "", basePrice: 45000, currency: "KRW", active: "Y" },
      { id: "MAT-009", name: "STS304", group: "강판", spec: "스테인리스", unit: "ton", lme: "Y", lmeCode: "LME-NICKEL", basePrice: 3200000, currency: "USD", active: "Y" },
      { id: "MAT-010", name: "Cu-ETP", group: "비철금속", spec: "전기동", unit: "ton", lme: "Y", lmeCode: "LME-CU", basePrice: 9142000, currency: "USD", active: "Y" }
    ],

    processes: [
      { id: "PRC-001", name: "프레스 300톤", group: "성형", sub: "프레스", cost: 1200, unit: "shot", hourRate: 45000, indirectRate: 15, active: "Y" },
      { id: "PRC-002", name: "프레스 800톤", group: "성형", sub: "프레스", cost: 2800, unit: "shot", hourRate: 52000, indirectRate: 15, active: "Y" },
      { id: "PRC-003", name: "열간단조", group: "성형", sub: "단조", cost: 3500, unit: "EA", hourRate: 58000, indirectRate: 16, active: "Y" },
      { id: "PRC-004", name: "블로우성형", group: "사출/성형", sub: "블로우", cost: 4200, unit: "EA", hourRate: 48000, indirectRate: 14, active: "Y" },
      { id: "PRC-005", name: "CNC 5축", group: "가공", sub: "CNC", cost: 85000, unit: "시간", hourRate: 65000, indirectRate: 18, active: "Y" },
      { id: "PRC-006", name: "전착도장", group: "표면처리", sub: "도장", cost: 1500, unit: "m2", hourRate: 38000, indirectRate: 12, active: "Y" },
      { id: "PRC-007", name: "점용접", group: "접합", sub: "용접", cost: 350, unit: "점", hourRate: 42000, indirectRate: 14, active: "Y" },
      { id: "PRC-008", name: "수동조립", group: "조립", sub: "수동", cost: 2500, unit: "EA", hourRate: 35000, indirectRate: 12, active: "Y" }
    ],

    bom: {
      projectId: "PRJ-2025-001",
      rev: "v04",
      status: "작성중",
      lastEbomDate: "2025-12-04 09:15",
      ecnCount: 3,
      assemblies: [
        {
          id: "ASM-S100", name: "서스펜션 어셈블리 FR", weight: 18420,
          targetPrice: 52000, calcPrice: 51240, fixedPrice: null, status: "검토중",
          parts: [
            { partNo: "P-S101", itemId: "ITM-001", name: "로어 암 브라켓", material: "SPFC440", weight: 2840, targetPrice: 7200, calcPrice: 7050, fixedPrice: 7050, status: "확정", ecn: false, supplierId: "SUP-001" },
            { partNo: "P-S102", itemId: "ITM-002", name: "스태빌라이저 링크", material: "SPFC440", weight: 1560, targetPrice: 4800, calcPrice: 5340, fixedPrice: null, status: "Gap초과", ecn: true, supplierId: null },
            { partNo: "P-S103", itemId: "ITM-008", name: "코일 스프링 시트", material: "SCM440", weight: 980, targetPrice: 3100, calcPrice: 3080, fixedPrice: 3080, status: "확정", ecn: false, supplierId: "SUP-003" }
          ]
        },
        {
          id: "ASM-F200", name: "연료탱크 어셈블리", weight: 5200,
          targetPrice: 28500, calcPrice: 27800, fixedPrice: 27800, status: "확정",
          parts: [
            { partNo: "P-F201", itemId: "ITM-003", name: "탱크 본체", material: "HDPE-B", weight: 3800, targetPrice: 18200, calcPrice: 17950, fixedPrice: 17950, status: "확정", ecn: false, supplierId: "SUP-004" },
            { partNo: "P-F202", itemId: "ITM-004", name: "연료펌프 모듈", material: "수지+전장", weight: 1400, targetPrice: 10300, calcPrice: 9850, fixedPrice: null, status: "RFQ중", ecn: true, supplierId: null },
            { partNo: "P-F203", itemId: "ITM-009", name: "연료 필러넥", material: "STS304", weight: 650, targetPrice: 4200, calcPrice: 4100, fixedPrice: 4100, status: "확정", ecn: false, supplierId: "SUP-001" }
          ]
        }
      ]
    },

    lmePrice: [
      { date: "2025-12", steel: 621, al: 2418, cu: 9142, ni: 16800, oil: 72.5, usdKrw: 1342 },
      { date: "2025-11", steel: 608, al: 2390, cu: 9050, ni: 16500, oil: 71.2, usdKrw: 1338 },
      { date: "2025-10", steel: 595, al: 2365, cu: 8980, ni: 16200, oil: 69.8, usdKrw: 1325 },
      { date: "2025-09", steel: 612, al: 2400, cu: 9100, ni: 16600, oil: 73.1, usdKrw: 1310 },
      { date: "2025-08", steel: 598, al: 2350, cu: 8920, ni: 16100, oil: 70.5, usdKrw: 1298 },
      { date: "2025-07", steel: 585, al: 2320, cu: 8850, ni: 15900, oil: 68.9, usdKrw: 1285 }
    ],

    targetCost: {
      projectId: "PRJ-2025-001",
      version: "v03",
      status: "승인",
      hmcPrice: 82000,
      targetPrice: 76500,
      crRate: 6.7,
      modules: [
        { name: "서스펜션", target: 52000, actual: 51240, rate: 98.5 },
        { name: "연료탱크", target: 28500, actual: 27800, rate: 97.5 },
        { name: "페달", target: 15800, actual: 16200, rate: 97.5 },
        { name: "수소부품", target: 45000, actual: 52000, rate: 86.5 },
        { name: "내장부품", target: 12000, actual: 11500, rate: 104.3 }
      ]
    },

    rfq: [
      { id: "RFQ-2025-001", projectId: "PRJ-2025-001", partNo: "P-S102", partName: "스태빌라이저 링크", targetPrice: 4800, deadline: "2025-12-20", status: "견적접수중", suppliers: ["SUP-001", "SUP-002", "SUP-003"] },
      { id: "RFQ-2025-002", projectId: "PRJ-2025-001", partNo: "P-F202", partName: "연료펌프 모듈", targetPrice: 10300, deadline: "2025-12-25", status: "견적접수중", suppliers: ["SUP-004", "SUP-005", "SUP-006"] },
      { id: "RFQ-2025-003", projectId: "PRJ-2025-001", partNo: "P-S103", partName: "코일 스프링 시트", targetPrice: 3100, deadline: "2025-12-15", status: "선정완료", suppliers: ["SUP-001", "SUP-003", "SUP-007"] }
    ],

    quotes: [
      { rfqId: "RFQ-2025-001", supplierId: "SUP-001", supplierName: "(주)한국정밀", materialCost: 2800, processCost: 1500, indirectCost: 580, logisticsCost: 120, totalPrice: 5000, status: "접수" },
      { rfqId: "RFQ-2025-001", supplierId: "SUP-002", supplierName: "대성금속(주)", materialCost: 2650, processCost: 1600, indirectCost: 550, logisticsCost: 150, totalPrice: 4950, status: "접수" },
      { rfqId: "RFQ-2025-001", supplierId: "SUP-003", supplierName: "진흥스틸", materialCost: 2900, processCost: 1400, indirectCost: 520, logisticsCost: 100, totalPrice: 4920, status: "접수" }
    ],

    approvals: [
      { id: "APR-001", type: "목표가승인", projectId: "PRJ-2025-001", title: "NX5 SUV 목표가 승인", requester: "김구매", status: "승인", approvers: [{name: "구매팀장", status: "승인"}, {name: "원가팀장", status: "승인"}, {name: "이사", status: "승인"}], requestDate: "2025-11-20", completeDate: "2025-11-22" },
      { id: "APR-002", type: "공급사선정", projectId: "PRJ-2025-001", title: "P-S103 공급사 선정", requester: "김구매", status: "승인", approvers: [{name: "구매팀장", status: "승인"}, {name: "이사", status: "승인"}], requestDate: "2025-12-01", completeDate: "2025-12-03" },
      { id: "APR-003", type: "단가확정", projectId: "PRJ-2025-001", title: "P-S102 단가 확정", requester: "김구매", status: "진행중", approvers: [{name: "구매팀장", status: "승인"}, {name: "원가팀장", status: "대기"}, {name: "이사", status: "대기"}], requestDate: "2025-12-10", completeDate: null }
    ]
  },

  init() {
    if (!localStorage.getItem('dh_initialized')) {
      this.reset();
    }
  },

  reset() {
    Object.keys(this.seed).forEach(key => {
      localStorage.setItem('dh_' + key, JSON.stringify(this.seed[key]));
    });
    localStorage.setItem('dh_initialized', 'true');
  },

  getAll(key) {
    return JSON.parse(localStorage.getItem('dh_' + key) || '[]');
  },

  getById(key, id) {
    const data = this.getAll(key);
    return Array.isArray(data) ? data.find(d => d.id === id) : data;
  },

  save(key, item) {
    const data = this.getAll(key);
    const idx = data.findIndex(d => d.id === item.id);
    if (idx >= 0) data[idx] = item;
    else data.push(item);
    localStorage.setItem('dh_' + key, JSON.stringify(data));
  },

  remove(key, id) {
    let data = this.getAll(key);
    data = data.filter(d => d.id !== id);
    localStorage.setItem('dh_' + key, JSON.stringify(data));
  },

  getObject(key) {
    return JSON.parse(localStorage.getItem('dh_' + key) || '{}');
  },

  saveObject(key, obj) {
    localStorage.setItem('dh_' + key, JSON.stringify(obj));
  }
};

MockData.init();
