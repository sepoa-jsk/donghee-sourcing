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
      { id: "SUP-001", code: "099165", name: "(주)한국정밀", bizNo: "312-81-31399", type: "등록업체", tradeStatus: "정상", approvalStatus: "승인", approval2nd: "", editRequest: "", bizType: "제조", bizCategory: "자동차부품", country: "KR - South Korea", creditGrade: "A", cashFlowGrade: "BB+", riskGrade: "정상", tier: "Tier2", managed: "Y", contract: "Y", grade: "A", manager: "김구매" },
      { id: "SUP-002", code: "099166", name: "대성금속(주)", bizNo: "139-81-01043", type: "등록업체", tradeStatus: "정상", approvalStatus: "승인", approval2nd: "수정요청", editRequest: "수정요청", bizType: "제조", bizCategory: "금속가공", country: "KR - South Korea", creditGrade: "BB+", cashFlowGrade: "BB+", riskGrade: "정상", tier: "Tier2", managed: "Y", contract: "N", grade: "B", manager: "이소싱" },
      { id: "SUP-003", code: "099167", name: "진흥스틸", bizNo: "137-81-44541", type: "등록업체", tradeStatus: "정상", approvalStatus: "승인", approval2nd: "", editRequest: "", bizType: "도매,제조,소매", bizCategory: "공구,철물", country: "KR - South Korea", creditGrade: "BB+", cashFlowGrade: "A", riskGrade: "정상", tier: "Tier3", managed: "N", contract: "N", grade: "A", manager: "박원가" },
      { id: "SUP-004", code: "099168", name: "한일수지(주)", bizNo: "133-81-38969", type: "등록업체", tradeStatus: "정상", approvalStatus: "승인", approval2nd: "", editRequest: "", bizType: "제조,도소매,서비스", bizCategory: "화학제품,수지", country: "KR - South Korea", creditGrade: "BB+", cashFlowGrade: "BB", riskGrade: "정상", tier: "Tier3", managed: "Y", contract: "Y", grade: "B", manager: "김구매" },
      { id: "SUP-005", code: "099169", name: "(주)동양알미늄", bizNo: "124-86-57972", type: "등록업체", tradeStatus: "정상", approvalStatus: "승인", approval2nd: "", editRequest: "", bizType: "서비스,제조업,도소매", bizCategory: "비철금속,알루미늄", country: "KR - South Korea", creditGrade: "A", cashFlowGrade: "BB+", riskGrade: "정상", tier: "Tier2", managed: "Y", contract: "Y", grade: "A", manager: "이소싱" },
      { id: "SUP-006", code: "099170", name: "세진테크", bizNo: "133-81-28097", type: "등록업체", tradeStatus: "정상", approvalStatus: "승인", approval2nd: "", editRequest: "", bizType: "도소매", bizCategory: "전자부품,센서", country: "KR - South Korea", creditGrade: "BB+", cashFlowGrade: "BB+", riskGrade: "정상", tier: "Tier3", managed: "N", contract: "N", grade: "C", manager: "박원가" },
      { id: "SUP-007", code: "099171", name: "(주)광명정밀", bizNo: "615-81-24555", type: "등록업체", tradeStatus: "정상", approvalStatus: "승인", approval2nd: "", editRequest: "", bizType: "건설업,제조업,서비스", bizCategory: "정밀가공,금형", country: "KR - South Korea", creditGrade: "A", cashFlowGrade: "BB+", riskGrade: "정상", tier: "Tier2", managed: "Y", contract: "N", grade: "B", manager: "김구매" },
      { id: "SUP-008", code: "099172", name: "미래소재(주)", bizNo: "134-81-04176", type: "등록업체", tradeStatus: "정상", approvalStatus: "승인", approval2nd: "", editRequest: "", bizType: "제조업,도소매", bizCategory: "특수소재,CFRP", country: "KR - South Korea", creditGrade: "BB+", cashFlowGrade: "BB+", riskGrade: "정상", tier: "Tier3", managed: "Y", contract: "Y", grade: "A", manager: "이소싱" },
      { id: "SUP-009", code: "099173", name: "대성어패럴", bizNo: "117-12-31861", type: "등록업체", tradeStatus: "정상", approvalStatus: "승인", approval2nd: "", editRequest: "", bizType: "제조업,도소매", bizCategory: "산업용섬유", country: "KR - South Korea", creditGrade: "B", cashFlowGrade: "BB+", riskGrade: "정상", tier: "Tier3", managed: "N", contract: "N", grade: "B", manager: "박원가" },
      { id: "SUP-010", code: "099175", name: "(재)환경과학연구소", bizNo: "402-82-15501", type: "등록업체", tradeStatus: "정상", approvalStatus: "승인", approval2nd: "", editRequest: "", bizType: "서비스", bizCategory: "환경분석,시험", country: "KR - South Korea", creditGrade: "BB", cashFlowGrade: "BB", riskGrade: "정상", tier: "Tier3", managed: "N", contract: "N", grade: "B", manager: "이소싱" },
      { id: "SUP-011", code: "099176", name: "철인광고", bizNo: "403-08-66809", type: "등록업체", tradeStatus: "정상", approvalStatus: "승인", approval2nd: "", editRequest: "", bizType: "제조", bizCategory: "간판및광고물", country: "KR - South Korea", creditGrade: "BB", cashFlowGrade: "BB+", riskGrade: "정상", tier: "Tier3", managed: "N", contract: "N", grade: "C", manager: "박원가" },
      { id: "SUP-012", code: "099177", name: "현대자동차(주)", bizNo: "101-81-09147", type: "등록업체", tradeStatus: "정상", approvalStatus: "승인", approval2nd: "", editRequest: "", bizType: "자동차제조업,도소매등", bizCategory: "자동차,부품", country: "KR - South Korea", creditGrade: "B", cashFlowGrade: "BB", riskGrade: "정상", tier: "Tier2", managed: "Y", contract: "Y", grade: "A", manager: "김구매" }
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
    ],

    partList: [
      { id: "PL-001", partNo: "P-S101", partName: "로어 암 브라켓",     projectId: "PRJ-2025-001", material: "SPFC440",  weight: 2840, materialCost: 3878, processCost: 1974, calcPrice: 7050,  targetPrice: 7200,  fixedPrice: 7050,  supplierId: "SUP-001", supplierName: "(주)한국정밀",  suppliers: ["SUP-001"],                       bomStatus: "확정",   ecn: false, regDate: "2025-10-01" },
      { id: "PL-002", partNo: "P-S102", partName: "스태빌라이저 링크",   projectId: "PRJ-2025-001", material: "SPFC440",  weight: 1560, materialCost: 2937, processCost: 1495, calcPrice: 5340,  targetPrice: 4800,  fixedPrice: null,  supplierId: null,      supplierName: null,           suppliers: ["SUP-001","SUP-002","SUP-003"], bomStatus: "Gap초과", ecn: true,  regDate: "2025-10-01" },
      { id: "PL-003", partNo: "P-S103", partName: "코일 스프링 시트",    projectId: "PRJ-2025-001", material: "SCM440",   weight:  980, materialCost: 1694, processCost:  862, calcPrice: 3080,  targetPrice: 3100,  fixedPrice: 3080,  supplierId: "SUP-003", supplierName: "진흥스틸",      suppliers: ["SUP-001","SUP-003","SUP-007"], bomStatus: "확정",   ecn: false, regDate: "2025-10-01" },
      { id: "PL-004", partNo: "P-F201", partName: "탱크 본체",           projectId: "PRJ-2025-001", material: "HDPE-B",   weight: 3800, materialCost: 9873, processCost: 5026, calcPrice: 17950, targetPrice: 18200, fixedPrice: 17950, supplierId: "SUP-004", supplierName: "한일수지(주)", suppliers: ["SUP-004"],                       bomStatus: "확정",   ecn: false, regDate: "2025-10-01" },
      { id: "PL-005", partNo: "P-F202", partName: "연료펌프 모듈",       projectId: "PRJ-2025-001", material: "수지+전장", weight: 1400, materialCost: 5418, processCost: 2758, calcPrice: 9850,  targetPrice: 10300, fixedPrice: null,  supplierId: null,      supplierName: null,           suppliers: ["SUP-004","SUP-005","SUP-006"], bomStatus: "RFQ중",  ecn: true,  regDate: "2025-10-15" },
      { id: "PL-006", partNo: "P-F203", partName: "연료 필러넥",         projectId: "PRJ-2025-001", material: "STS304",   weight:  650, materialCost: 2255, processCost: 1148, calcPrice: 4100,  targetPrice: 4200,  fixedPrice: 4100,  supplierId: "SUP-001", supplierName: "(주)한국정밀",  suppliers: ["SUP-001"],                       bomStatus: "확정",   ecn: false, regDate: "2025-10-01" },
      { id: "PL-007", partNo: "P-H401", partName: "수소탱크 라이너",     projectId: "PRJ-2025-004", material: "Al6061",   weight: 5200, materialCost: 15675,processCost: 7980, calcPrice: 28500, targetPrice: 32000, fixedPrice: null,  supplierId: null,      supplierName: null,           suppliers: [],                                bomStatus: "검토중", ecn: false, regDate: "2025-11-01" },
      { id: "PL-008", partNo: "P-H402", partName: "CFRP 보강층",         projectId: "PRJ-2025-004", material: "CFRP-T",   weight: 3100, materialCost: 24750,processCost: 12600,calcPrice: 45000, targetPrice: 42000, fixedPrice: null,  supplierId: "SUP-008", supplierName: "미래소재(주)", suppliers: ["SUP-008"],                       bomStatus: "Gap초과", ecn: false, regDate: "2025-11-01" },
      { id: "PL-009", partNo: "P-E101", partName: "배터리 마운트 브라켓", projectId: "PRJ-2025-002", material: "SPFH590",  weight: 4200, materialCost: 5225, processCost: 2660, calcPrice: 9500,  targetPrice: 9800,  fixedPrice: null,  supplierId: null,      supplierName: null,           suppliers: [],                                bomStatus: "미확정", ecn: false, regDate: "2025-12-01" },
      { id: "PL-010", partNo: "P-E102", partName: "전동식 조향 컬럼",    projectId: "PRJ-2025-002", material: "Al5052",   weight: 2850, materialCost: 8388, processCost: 4270, calcPrice: 15250, targetPrice: 16000, fixedPrice: null,  supplierId: null,      supplierName: null,           suppliers: [],                                bomStatus: "미확정", ecn: false, regDate: "2025-12-01" }
    ],

    ecnList: [
      {
        id: "ECN-2025-001", issueDate: "2025-10-15", source: "VAATZ",
        reason: "LME 강판 시세 상승으로 스태빌라이저 링크 소재 변경 (SPFC440→SPFH590) 및 단가 조정",
        projectId: "PRJ-2025-001", status: "조치완료",
        changes: [
          { partNo: "P-S102", partName: "스태빌라이저 링크", field: "소재", before: "SPFC440",  after: "SPFH590" },
          { partNo: "P-S102", partName: "스태빌라이저 링크", field: "단가", before: "4800",     after: "5340" }
        ],
        impactedPartIds: ["P-S102"], costGap: 540, rfqNeededCount: 1,
        history: [
          { at: "2025-10-15 09:00", by: "시스템(VAATZ)", action: "ECN 수신" },
          { at: "2025-10-16 14:30", by: "김구매",        action: "검토 시작" },
          { at: "2025-10-20 11:00", by: "김구매",        action: "BOM에 반영 완료" }
        ], createdAt: "2025-10-15 09:00"
      },
      {
        id: "ECN-2025-002", issueDate: "2025-10-28", source: "VAATZ",
        reason: "탱크 본체 설계 최적화로 중량 감소 — 경량화 목표 달성",
        projectId: "PRJ-2025-001", status: "조치완료",
        changes: [
          { partNo: "P-F201", partName: "탱크 본체", field: "중량", before: "3800",  after: "3520" },
          { partNo: "P-F201", partName: "탱크 본체", field: "단가", before: "17950", after: "17700" }
        ],
        impactedPartIds: ["P-F201"], costGap: -250, rfqNeededCount: 0,
        history: [
          { at: "2025-10-28 10:00", by: "시스템(VAATZ)", action: "ECN 수신" },
          { at: "2025-10-30 09:30", by: "이소싱",        action: "단가 재산출 완료" },
          { at: "2025-11-02 15:00", by: "이소싱",        action: "BOM에 반영 완료" }
        ], createdAt: "2025-10-28 10:00"
      },
      {
        id: "ECN-2025-003", issueDate: "2025-11-05", source: "PLM",
        reason: "로어 암 브라켓 공정 강화 — 3축 CNC를 5축으로 변경하여 정밀도 향상",
        projectId: "PRJ-2025-001", status: "검토중",
        changes: [
          { partNo: "P-S101", partName: "로어 암 브라켓", field: "공정", before: "CNC 3축", after: "CNC 5축" },
          { partNo: "P-S101", partName: "로어 암 브라켓", field: "단가", before: "7050",    after: "8250" }
        ],
        impactedPartIds: ["P-S101"], costGap: 1200, rfqNeededCount: 1,
        history: [
          { at: "2025-11-05 11:00", by: "시스템(PLM)", action: "ECN 수신" },
          { at: "2025-11-07 10:00", by: "박원가",      action: "원가 영향 분석 시작" }
        ], createdAt: "2025-11-05 11:00"
      },
      {
        id: "ECN-2025-004", issueDate: "2025-11-12", source: "VAATZ",
        reason: "연료펌프 모듈 부품 공급 불안정으로 대체 소재 적용 긴급 검토 요청",
        projectId: "PRJ-2025-001", status: "접수",
        changes: [
          { partNo: "P-F202", partName: "연료펌프 모듈", field: "소재", before: "수지+전장", after: "수지+전장(代)" }
        ],
        impactedPartIds: ["P-F202"], costGap: 800, rfqNeededCount: 2,
        history: [
          { at: "2025-11-12 08:30", by: "시스템(VAATZ)", action: "ECN 수신" }
        ], createdAt: "2025-11-12 08:30"
      },
      {
        id: "ECN-2025-005", issueDate: "2025-11-18", source: "PLM",
        reason: "수소탱크 라이너 내압 강화 요건 상향 — Al6061에서 Al7075 변경, 중량 및 단가 영향 대규모",
        projectId: "PRJ-2025-004", status: "검토중",
        changes: [
          { partNo: "P-H401", partName: "수소탱크 라이너", field: "소재", before: "Al6061", after: "Al7075" },
          { partNo: "P-H401", partName: "수소탱크 라이너", field: "중량", before: "5200",   after: "5450" },
          { partNo: "P-H401", partName: "수소탱크 라이너", field: "단가", before: "28500",  after: "34000" }
        ],
        impactedPartIds: ["P-H401"], costGap: 5500, rfqNeededCount: 1,
        history: [
          { at: "2025-11-18 14:00", by: "시스템(PLM)", action: "ECN 수신" },
          { at: "2025-11-20 10:00", by: "김구매",      action: "소재팀 확인 요청" }
        ], createdAt: "2025-11-18 14:00"
      },
      {
        id: "ECN-2025-006", issueDate: "2025-11-22", source: "Manual",
        reason: "코일 스프링 시트 목표단가 입력 오류 수정 요청 — 내부 시스템 오류",
        projectId: "PRJ-2025-001", status: "반려",
        changes: [
          { partNo: "P-S103", partName: "코일 스프링 시트", field: "단가", before: "3100", after: "3050" }
        ],
        impactedPartIds: ["P-S103"], costGap: 0, rfqNeededCount: 0,
        history: [
          { at: "2025-11-22 09:00", by: "박원가",    action: "수동 등록" },
          { at: "2025-11-23 16:00", by: "구매팀장",  action: "반려 — 정상 데이터 확인됨" }
        ], createdAt: "2025-11-22 09:00"
      },
      {
        id: "ECN-2025-007", issueDate: "2025-11-25", source: "VAATZ",
        reason: "배터리 마운트 브라켓 설계 변경 — 경량화 목표 반영으로 중량 감소",
        projectId: "PRJ-2025-002", status: "접수",
        changes: [
          { partNo: "P-E101", partName: "배터리 마운트 브라켓", field: "중량", before: "4200", after: "3900" },
          { partNo: "P-E101", partName: "배터리 마운트 브라켓", field: "단가", before: "9500", after: "9200" }
        ],
        impactedPartIds: ["P-E101"], costGap: -300, rfqNeededCount: 0,
        history: [
          { at: "2025-11-25 07:45", by: "시스템(VAATZ)", action: "ECN 수신" }
        ], createdAt: "2025-11-25 07:45"
      },
      {
        id: "ECN-2025-008", issueDate: "2025-12-01", source: "PLM",
        reason: "CFRP 보강층 접합 공정 추가 — 품질 개선을 위한 열처리 공정 삽입",
        projectId: "PRJ-2025-004", status: "접수",
        changes: [
          { partNo: "P-H402", partName: "CFRP 보강층", field: "공정", before: "적층성형",     after: "적층성형+열처리" },
          { partNo: "P-H402", partName: "CFRP 보강층", field: "단가", before: "45000",       after: "47000" }
        ],
        impactedPartIds: ["P-H402"], costGap: 2000, rfqNeededCount: 1,
        history: [
          { at: "2025-12-01 09:30", by: "시스템(PLM)", action: "ECN 수신" }
        ], createdAt: "2025-12-01 09:30"
      },
      {
        id: "ECN-2025-009", issueDate: "2025-12-04", source: "VAATZ",
        reason: "연료 필러넥·코일 스프링 시트 2건 소재 동시 변경 — 공급망 재편 대응",
        projectId: "PRJ-2025-001", status: "검토중",
        changes: [
          { partNo: "P-F203", partName: "연료 필러넥",      field: "소재", before: "STS304", after: "STS316L" },
          { partNo: "P-S103", partName: "코일 스프링 시트", field: "소재", before: "SCM440", after: "SCM415" }
        ],
        impactedPartIds: ["P-F203", "P-S103"], costGap: 1500, rfqNeededCount: 2,
        history: [
          { at: "2025-12-04 09:15", by: "시스템(VAATZ)", action: "ECN 수신" },
          { at: "2025-12-04 11:00", by: "이소싱",        action: "영향 분석 시작" }
        ], createdAt: "2025-12-04 09:15"
      }
    ],

    importExportLog: [
      { id: "LOG-001", at: "2025-11-28 10:30", type: "Import", projectId: "PRJ-2025-001", fileName: "NX5_BOM_v03.xlsx",              totalCount: 18, successCount: 18, failCount: 0, operator: "김구매", status: "완료" },
      { id: "LOG-002", at: "2025-11-28 14:15", type: "Export", projectId: "PRJ-2025-001", fileName: "PRJ-2025-001_BOM_v04.xlsx",     totalCount: 18, successCount: 18, failCount: 0, operator: "김구매", status: "완료" },
      { id: "LOG-003", at: "2025-12-01 09:00", type: "Import", projectId: "PRJ-2025-004", fileName: "수소SUV_BOM_v01.xlsx",          totalCount: 12, successCount: 10, failCount: 2, operator: "이소싱", status: "오류" },
      { id: "LOG-004", at: "2025-12-02 11:30", type: "Export", projectId: "PRJ-2025-004", fileName: "PRJ-2025-004_BOM_v01.csv",     totalCount: 10, successCount: 10, failCount: 0, operator: "이소싱", status: "완료" },
      { id: "LOG-005", at: "2025-12-03 09:15", type: "Import", projectId: "PRJ-2025-001", fileName: "NX5_BOM_v04.xlsx",              totalCount: 20, successCount: 20, failCount: 0, operator: "박원가", status: "완료" },
      { id: "LOG-006", at: "2025-12-03 14:00", type: "Export", projectId: "PRJ-2025-002", fileName: "PRJ-2025-002_BOM_v01.xlsx",     totalCount:  8, successCount:  8, failCount: 0, operator: "박원가", status: "완료" },
      { id: "LOG-007", at: "2025-12-04 10:00", type: "Import", projectId: "PRJ-2025-001", fileName: "NX5_ECN009_반영.xlsx",          totalCount:  4, successCount:  4, failCount: 0, operator: "김구매", status: "완료" },
      { id: "LOG-008", at: "2025-12-04 16:30", type: "Export", projectId: "PRJ-2025-001", fileName: "PRJ-2025-001_BOM_v04_최종.xlsx",totalCount: 20, successCount: 20, failCount: 0, operator: "김구매", status: "완료" }
    ]
  },

  init() {
    // 데이터 유효성 검사: projects 없거나, suppliers가 시드 수와 다르면 재시드
    try {
      const projects   = JSON.parse(localStorage.getItem('dh_projects')  || '[]');
      const suppliers  = JSON.parse(localStorage.getItem('dh_suppliers') || '[]');
      if (projects.length === 0 || suppliers.length < this.seed.suppliers.length) {
        this.reset();
      }
    } catch(e) {
      this.reset();
    }
  },

  reset() {
    Object.keys(this.seed).forEach(key => {
      localStorage.setItem('dh_' + key, JSON.stringify(this.seed[key]));
    });
    localStorage.setItem('dh_initialized', 'true');
    console.log('MockData reset complete. Projects:', this.seed.projects.length);
  },

  getAll(key) {
    try {
      const data = JSON.parse(localStorage.getItem('dh_' + key));
      return Array.isArray(data) ? data : [];
    } catch(e) {
      console.error('MockData.getAll error:', key, e);
      return [];
    }
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
