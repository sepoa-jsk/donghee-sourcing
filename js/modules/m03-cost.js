/* ============================================================
   m03-cost.js — M03-001 소재별 재료비 산출
   화면ID : M03-001
   패턴   : LME 배너 + 좌 입력폼(40%) / 우 산출결과(60%)
   생성일 : 2026-06-02
   ============================================================ */

window.render_M03_001 = function(container) {
  container.style.padding = '0';

  const materials = MockData.getAll('materials');
  const lmePrices = MockData.getAll('lmePrice');
  const lme       = lmePrices[0] || { date: '-', steel: 621, al: 2418, cu: 9142, ni: 16800, oil: 72.5, usdKrw: 1342 };

  /* LME 코드 → 최신 시세 매핑 ($/ton) */
  const lmeMap = {
    'LME-STEEL-HRC': lme.steel,
    'LME-AL':        lme.al,
    'LME-CU':        lme.cu,
    'LME-NICKEL':    lme.ni,
    'CRUDE-OIL':     null   /* 원유연동 → basePrice 사용 */
  };

  const matOpts = materials.map(m => {
    const tag = m.lme === 'Y' ? ` [LME]` : ` [고정]`;
    return `<option value="${m.id}">${m.name} — ${m.spec}${tag}</option>`;
  }).join('');

  /* ── 레이아웃 ── */
  container.innerHTML = `<div class="screen-wrapper" style="display:flex;flex-direction:column;height:100%;padding:0;">

    <!-- LME 배너 -->
    <div style="padding:8px 16px;background:#FFF8EC;border-bottom:1px solid #F0C060;display:flex;align-items:center;gap:20px;font-size:12px;flex-shrink:0;">
      <i data-lucide="trending-up" style="width:14px;height:14px;color:#F59E0B;"></i>
      <span style="color:var(--text-muted);">LME 기준: <b style="color:var(--text-primary);">${lme.date}</b></span>
      <span>강판(HRC): <b style="color:var(--primary);">$${lme.steel}/ton</b></span>
      <span>Al: <b style="color:var(--primary);">$${CalcEngine.formatNumber(lme.al)}/ton</b></span>
      <span>Cu: <b style="color:var(--primary);">$${CalcEngine.formatNumber(lme.cu)}/ton</b></span>
      <span>Ni: <b style="color:var(--primary);">$${CalcEngine.formatNumber(lme.ni)}/ton</b></span>
      <span>USD/KRW: <b style="color:var(--primary);">${CalcEngine.formatNumber(lme.usdKrw)}</b></span>
    </div>

    <!-- 인사이트 카드 (LME 현황 4개) -->
    <div class="insight-cards" style="padding:10px 16px;">
      <div class="insight-card">
        <div class="insight-card-icon blue"><i data-lucide="trending-up"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="font-size:15px;">$${lme.steel}</span>
          <span class="insight-card-label">Steel HRC ($/ton)</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon blue"><i data-lucide="trending-up"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="font-size:15px;">$${CalcEngine.formatNumber(lme.al)}</span>
          <span class="insight-card-label">Al LME ($/ton)</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon amber"><i data-lucide="dollar-sign"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="font-size:15px;">${CalcEngine.formatNumber(lme.usdKrw)}</span>
          <span class="insight-card-label">USD/KRW 환율</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon green"><i data-lucide="calendar"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="font-size:15px;">${lme.date}</span>
          <span class="insight-card-label">LME 기준월</span>
        </div>
      </div>
    </div>

    <!-- 본문 좌우 분할 -->
    <div style="display:flex;flex:1;overflow:hidden;">

      <!-- 좌: 계산 입력 폼 (40%) -->
      <div style="flex:0 0 40%;overflow-y:auto;border-right:1px solid var(--border);padding:14px 16px;">

        <div class="section-box">
          <div class="section-box-title">재료비 산출 조건</div>
          <div style="display:flex;flex-direction:column;gap:12px;">

            <div class="form-field">
              <label class="form-label">소재 <span class="required">*</span></label>
              <select class="form-input form-select" id="m03001-material" onchange="m03001_onMatChange(this.value)">${matOpts}</select>
            </div>

            <div id="m03001-lme-info" style="padding:8px 10px;background:var(--bg-page);border-radius:4px;font-size:12px;color:var(--text-secondary);line-height:1.6;"></div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div class="form-field">
                <label class="form-label">중량(g) <span class="required">*</span></label>
                <input class="form-input" id="m03001-weight" type="number" value="2840" min="1" placeholder="0">
              </div>
              <div class="form-field">
                <label class="form-label">수율(%)</label>
                <input class="form-input" id="m03001-yield" type="number" value="85" min="1" max="100" placeholder="85">
              </div>
              <div class="form-field">
                <label class="form-label">소재 단가 <span id="m03001-price-unit" style="color:var(--text-muted);font-weight:normal;font-size:11px;"></span></label>
                <input class="form-input" id="m03001-price" type="number" placeholder="0">
              </div>
              <div class="form-field">
                <label class="form-label">환율 (KRW/USD)</label>
                <input class="form-input" id="m03001-rate" type="number" value="${lme.usdKrw}" placeholder="${lme.usdKrw}">
              </div>
              <div class="form-field">
                <label class="form-label">할증률(%)</label>
                <input class="form-input" id="m03001-sur" type="number" value="12" min="0" placeholder="12">
              </div>
              <div class="form-field">
                <label class="form-label">물류비(원)</label>
                <input class="form-input" id="m03001-logi" type="number" value="150" min="0" placeholder="0">
              </div>
            </div>

            <button class="btn btn-solid-blue" onclick="m03001_calc()" style="width:100%;">
              <i data-lucide="calculator"></i> 재료비 산출
            </button>
          </div>
        </div>

        <!-- 같은 소재 품목 목록 -->
        <div class="section-box" style="margin-top:12px;">
          <div class="section-box-title">같은 소재 적용 Part</div>
          <div id="m03001-same-list" style="font-size:12px;"></div>
        </div>

      </div>

      <!-- 우: 산출 결과 (60%) -->
      <div style="flex:0 0 60%;overflow-y:auto;padding:14px 16px;">

        <div id="m03001-empty" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:13px;">
          <i data-lucide="calculator" style="width:36px;height:36px;margin-bottom:10px;"></i>
          좌측 조건을 입력하고 [재료비 산출]을 클릭하세요
        </div>

        <div id="m03001-result" style="display:none;flex-direction:column;gap:12px;"></div>

      </div>
    </div>
  </div>`;

  /* ══════════════════════════════════════════
     헬퍼 함수들
  ══════════════════════════════════════════ */

  /* 소재 선택 시 자동 입력 */
  window.m03001_onMatChange = function(matId) {
    const mat    = materials.find(m => m.id === matId);
    if (!mat) return;

    const infoEl  = document.getElementById('m03001-lme-info');
    const priceEl = document.getElementById('m03001-price');
    const unitEl  = document.getElementById('m03001-price-unit');
    const rateEl  = document.getElementById('m03001-rate');

    if (mat.lme === 'Y' && lmeMap[mat.lmeCode] != null) {
      /* USD/ton 연동 소재 */
      if (infoEl)  infoEl.innerHTML  = `LME 연동 &nbsp;|&nbsp; 코드: <b>${mat.lmeCode}</b> &nbsp;|&nbsp; 단위: <b>${mat.unit}</b> &nbsp;|&nbsp; 통화: <b>${mat.currency}</b><br>최신시세: <b style="color:var(--primary);">$${CalcEngine.formatNumber(lmeMap[mat.lmeCode])}/ton</b>`;
      if (priceEl) priceEl.value     = lmeMap[mat.lmeCode];
      if (unitEl)  unitEl.textContent = '(USD/ton)';
      if (rateEl)  rateEl.disabled    = false;
    } else if (mat.lme === 'Y' && mat.lmeCode === 'CRUDE-OIL') {
      /* 원유 연동 수지 — basePrice 사용 */
      if (infoEl)  infoEl.innerHTML  = `원유 연동 (HDPE계) &nbsp;|&nbsp; 기준단가 적용: <b style="color:var(--primary);">${CalcEngine.formatNumber(mat.basePrice)} KRW/${mat.unit}</b>`;
      if (priceEl) priceEl.value     = mat.basePrice;
      if (unitEl)  unitEl.textContent = `(KRW/${mat.unit})`;
      if (rateEl)  rateEl.disabled    = true;
    } else {
      /* 고정가 소재 */
      if (infoEl)  infoEl.innerHTML  = `고정가 (LME 미연동) &nbsp;|&nbsp; 기준단가: <b style="color:var(--primary);">${CalcEngine.formatNumber(mat.basePrice)} KRW/${mat.unit}</b>`;
      if (priceEl) priceEl.value     = mat.basePrice;
      if (unitEl)  unitEl.textContent = `(KRW/${mat.unit})`;
      if (rateEl)  rateEl.disabled    = true;
    }

    m03001_renderSameList(mat);
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  /* 같은 소재 Part 목록 */
  window.m03001_renderSameList = function(mat) {
    const partList = MockData.getAll('partList');
    const same     = partList.filter(p => (p.material || '') === mat.name);
    const el       = document.getElementById('m03001-same-list');
    if (!el) return;

    if (same.length === 0) {
      el.innerHTML = `<div style="color:var(--text-muted);padding:6px 0;">이 소재를 사용하는 Part 없음</div>`;
      return;
    }
    el.innerHTML = same.map(p => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);cursor:pointer;" onclick="m03001_fillWeight(${p.weight})">
        <div>
          <div style="font-weight:500;">${p.partNo}</div>
          <div style="color:var(--text-muted);font-size:11px;margin-top:1px;">${p.partName}</div>
        </div>
        <div style="text-align:right;">
          <div style="color:var(--primary);">${CalcEngine.formatCurrency(p.materialCost)}<span style="font-size:10px;color:var(--text-muted);"> 원</span></div>
          <div style="color:var(--text-muted);font-size:11px;">${CalcEngine.formatNumber(p.weight)} g</div>
        </div>
      </div>`).join('');
  };

  /* 클릭 시 중량 자동 입력 */
  window.m03001_fillWeight = function(w) {
    const el = document.getElementById('m03001-weight');
    if (el) { el.value = w; el.focus(); }
    Common.showToast(`중량 ${CalcEngine.formatNumber(w)}g 입력`, 'info');
  };

  /* ── 재료비 산출 핵심 ── */
  window.m03001_calc = function() {
    const matId  = (document.getElementById('m03001-material') || {}).value;
    const weight = Number((document.getElementById('m03001-weight') || {}).value) || 0;
    const yld    = Number((document.getElementById('m03001-yield')  || {}).value) || 85;
    const price  = Number((document.getElementById('m03001-price')  || {}).value) || 0;
    const rate   = Number((document.getElementById('m03001-rate')   || {}).value) || lme.usdKrw;
    const sur    = Number((document.getElementById('m03001-sur')    || {}).value) || 12;
    const logi   = Number((document.getElementById('m03001-logi')   || {}).value) || 0;

    if (!matId)     { Common.showToast('소재를 선택해주세요', 'info'); return; }
    if (weight <= 0){ Common.showToast('중량(g)을 입력해주세요', 'info'); return; }
    if (price  <= 0){ Common.showToast('소재 단가를 확인해주세요', 'info'); return; }

    const mat       = materials.find(m => m.id === matId);
    const yieldRate = yld / 100;
    const surRate   = sur / 100;

    let matCost = 0;
    let steps   = [];

    if (mat.unit === 'ton' && mat.lme === 'Y' && lmeMap[mat.lmeCode] != null) {
      /* ─ USD/ton LME 연동 ─ */
      const weightTon = weight / 1_000_000;
      const inputTon  = weightTon / yieldRate;
      const usdCost   = inputTon * price;
      const krwBase   = usdCost * rate;
      matCost = Math.round(krwBase * (1 + surRate));
      steps = [
        { label: '순중량',             val: `${CalcEngine.formatNumber(weight)} g` },
        { label: '투입 소재량',        val: `${(inputTon * 1000).toFixed(4)} kg (÷수율 ${yld}%)` },
        { label: `LME 시세`,           val: `$${CalcEngine.formatNumber(price)}/ton` },
        { label: '재료비 (USD)',       val: `$${usdCost.toFixed(4)}` },
        { label: `USD → KRW (×${CalcEngine.formatNumber(rate)})`, val: `${CalcEngine.formatNumber(Math.round(krwBase))} 원` },
        { label: `할증 적용 (×${sur}%)`, val: `${CalcEngine.formatCurrency(matCost)} 원` },
      ];
    } else {
      /* ─ KRW/kg 고정가 또는 원유 연동 ─ */
      const weightKg  = weight / 1000;
      const inputKg   = weightKg / yieldRate;
      const rawCost   = inputKg * price;
      matCost = Math.round(rawCost * (1 + surRate));
      steps = [
        { label: '순중량',             val: `${CalcEngine.formatNumber(weight)} g` },
        { label: '투입 소재량',        val: `${inputKg.toFixed(4)} kg (÷수율 ${yld}%)` },
        { label: `단가 (KRW/${mat.unit})`, val: `${CalcEngine.formatNumber(price)} 원` },
        { label: '재료비 (원)',        val: `${CalcEngine.formatNumber(Math.round(rawCost))} 원` },
        { label: `할증 적용 (×${sur}%)`, val: `${CalcEngine.formatCurrency(matCost)} 원` },
      ];
    }

    const total = matCost + logi;
    m03001_renderResult({ mat, weight, yld, sur, logi, matCost, total, steps });
  };

  /* ── 결과 렌더 ── */
  window.m03001_renderResult = function({ mat, weight, yld, sur, logi, matCost, total, steps }) {
    const emptyEl  = document.getElementById('m03001-empty');
    const resultEl = document.getElementById('m03001-result');
    if (emptyEl)  emptyEl.style.display  = 'none';
    if (!resultEl) return;
    resultEl.style.display = 'flex';

    /* 계산 단계 행 */
    const stepRows = steps.map((s, i) => {
      const isLast = i === steps.length - 1;
      return `<tr style="${isLast ? 'background:var(--primary-light);' : ''}">
        <td class="left" style="${isLast ? 'font-weight:600;color:var(--primary);' : 'color:var(--text-secondary);'}">${s.label}</td>
        <td class="right" style="${isLast ? 'font-weight:700;color:var(--primary);font-size:13px;' : 'font-weight:500;'}">${s.val}</td>
      </tr>`;
    }).join('');

    /* 같은 소재 Part 비교 행 */
    const partList = MockData.getAll('partList');
    const sameParts = partList.filter(p => p.material === mat.name);
    const compRows = sameParts.map(p => {
      const diff     = matCost - p.materialCost;
      const diffColor = diff > 0 ? 'var(--danger)' : diff < 0 ? 'var(--success)' : 'var(--text-muted)';
      const diffSign  = diff > 0 ? '+' : '';
      return `<tr>
        <td class="center" style="font-size:11px;">${p.partNo}</td>
        <td class="left" style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.partName}</td>
        <td class="right">${CalcEngine.formatNumber(p.weight)}</td>
        <td class="right">${CalcEngine.formatCurrency(p.materialCost)}</td>
        <td class="right" style="color:var(--primary);font-weight:600;">${CalcEngine.formatCurrency(matCost)}</td>
        <td class="right" style="color:${diffColor};font-weight:600;">${diffSign}${CalcEngine.formatCurrency(Math.abs(diff))}</td>
      </tr>`;
    }).join('');

    resultEl.innerHTML = `
      <!-- 결과 요약 카드 -->
      <div class="section-box" style="margin-bottom:0;background:#EFF6FF;border-color:var(--primary);">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
          <div>
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px;">산출 재료비 — ${mat.name} / ${CalcEngine.formatNumber(weight)}g</div>
            <div style="font-size:28px;font-weight:700;color:var(--primary);">${CalcEngine.formatCurrency(matCost)}<span style="font-size:13px;font-weight:400;color:var(--text-secondary);margin-left:4px;">원</span></div>
          </div>
          ${logi > 0 ? `
          <div style="text-align:right;border-left:1px solid #bfdbfe;padding-left:12px;">
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px;">재료비 + 물류비</div>
            <div style="font-size:20px;font-weight:700;color:var(--text-primary);">${CalcEngine.formatCurrency(total)}<span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:4px;">원</span></div>
            <div style="font-size:11px;color:var(--text-muted);">물류비 ${CalcEngine.formatCurrency(logi)} 원 포함</div>
          </div>` : ''}
        </div>
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid #bfdbfe;font-size:11px;color:var(--text-secondary);">
          수율 ${yld}% &nbsp;·&nbsp; 할증 ${sur}% &nbsp;·&nbsp; 소재: ${mat.name} (${mat.spec})
        </div>
      </div>

      <!-- 산출 단계 -->
      <div class="section-box" style="margin-bottom:0;">
        <div class="section-box-title">산출 단계</div>
        <div class="grid-container" style="margin-bottom:0;">
          <table class="grid-table">
            <colgroup><col style="width:55%"><col></colgroup>
            <thead><tr><th>항목</th><th class="right">값</th></tr></thead>
            <tbody>${stepRows}</tbody>
          </table>
        </div>
      </div>

      ${sameParts.length > 0 ? `
      <!-- Part 비교 -->
      <div class="section-box" style="margin-bottom:0;">
        <div class="section-box-title">같은 소재 Part 재료비 비교</div>
        <div class="grid-container" style="margin-bottom:0;">
          <table class="grid-table">
            <colgroup>
              <col style="width:80px"><col><col style="width:70px">
              <col style="width:90px"><col style="width:90px"><col style="width:85px">
            </colgroup>
            <thead><tr>
              <th>Part No.</th><th>품명</th><th class="right">중량(g)</th>
              <th class="right">현행 재료비</th><th class="right">산출 재료비</th><th class="right">차이</th>
            </tr></thead>
            <tbody>${compRows}</tbody>
          </table>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">
          * 산출 재료비는 입력 기준(수율 ${yld}%, 할증 ${sur}%, 중량 ${CalcEngine.formatNumber(weight)}g 기준)으로 일괄 산출된 참고값입니다
        </div>
      </div>` : ''}
    `;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  /* ── 초기화 ── */
  if (materials.length > 0) {
    m03001_onMatChange(materials[0].id);
  }
  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
};

/* ============================================================
   render_M03_002 — LME·시세 관리
   패턴 : 패턴 2 (LME 배너 + 인사이트 카드 + 필터 + 그리드)
   ============================================================ */
window.render_M03_002 = function(container) {
  container.style.padding = '0';

  const lmePrices = MockData.getAll('lmePrice');

  /* 2026년 데이터 추가 (mock) */
  const fullData = [
    { date:'2026-05', steel:638, al:2480, cu:9286, ni:17150, oil:72.5, hdpe:1342, usdKrw:1385, jpyKrw:924 },
    { date:'2026-04', steel:621, al:2453, cu:9210, ni:17020, oil:71.8, hdpe:1328, usdKrw:1368, jpyKrw:921 },
    { date:'2026-03', steel:615, al:2440, cu:9175, ni:16920, oil:70.2, hdpe:1312, usdKrw:1352, jpyKrw:918 },
    { date:'2026-02', steel:608, al:2426, cu:9102, ni:16850, oil:69.5, hdpe:1298, usdKrw:1345, jpyKrw:916 },
    { date:'2026-01', steel:618, al:2438, cu:9080, ni:16780, oil:68.8, hdpe:1285, usdKrw:1335, jpyKrw:912 },
    ...lmePrices.map(r => ({ ...r, hdpe: 1300, jpyKrw: 908 }))
  ];
  const latest = fullData[0];
  const prev   = fullData[1];

  function chg(curr, pr) {
    if (!pr) return '—';
    const p = ((curr - pr) / pr * 100).toFixed(1);
    const col = p > 0 ? '#b91c1c' : p < 0 ? '#0f6e56' : '#888';
    const icon = p > 0 ? '▲' : p < 0 ? '▼' : '─';
    return `<span style="color:${col};font-weight:600;">${icon}${p > 0 ? '+' : ''}${p}%</span>`;
  }

  const rows = fullData.map((r, i) => {
    const p   = fullData[i + 1];
    const sel = i === 0 ? 'style="background:#EBF2FB;"' : '';
    return `<tr class="lme-row" data-idx="${i}" onclick="m03002_selectRow(this)" ${sel}>
      <td class="center"><input type="checkbox" class="lme-chk"></td>
      <td class="center" style="font-weight:${i===0?'700':'400'};">${r.date}</td>
      <td class="right">${CalcEngine.formatNumber(r.steel)}</td>
      <td class="center">${chg(r.steel, p?.steel)}</td>
      <td class="right">${CalcEngine.formatNumber(r.al)}</td>
      <td class="center">${chg(r.al, p?.al)}</td>
      <td class="right">${CalcEngine.formatNumber(r.cu)}</td>
      <td class="center">${chg(r.cu, p?.cu)}</td>
      <td class="right">${CalcEngine.formatNumber(r.ni)}</td>
      <td class="center">${chg(r.ni, p?.ni)}</td>
      <td class="right">${r.oil}</td>
      <td class="right">${r.hdpe ? CalcEngine.formatNumber(r.hdpe) : '—'}</td>
      <td class="right">${CalcEngine.formatNumber(r.usdKrw)}</td>
      <td class="right">${r.jpyKrw || '—'}</td>
      <td class="center" style="font-size:11px;color:var(--text-muted);">LME Official</td>
    </tr>`;
  }).join('');

  container.innerHTML = `<div class="screen-wrapper" style="display:flex;flex-direction:column;height:100%;padding:12px 16px;box-sizing:border-box;overflow:hidden;">

    <!-- 필터바 — M01 표준과 동일 -->
    <div class="filter-bar">
      <div class="filter-search">
        <input type="text" id="m03002-search" placeholder="Search" oninput="m03002_filter()">
        <i data-lucide="search"></i>
      </div>
      <button class="filter-btn" onclick="m03002_toggleFilter(this)"><i data-lucide="filter" class="icon-red"></i> 필터</button>
      <button class="filter-btn" id="m03002-item-btn"><i data-lucide="bar-chart-2" class="icon-blue"></i> 품목</button>
      <div class="filter-date-range">
        <input type="text" id="m03002-date-from" value="2025-07" readonly>
        <span class="date-separator">~</span>
        <input type="text" id="m03002-date-to" value="2026-05" readonly>
        <i data-lucide="calendar" class="icon-red"></i>
      </div>
      <div class="filter-right">
        <button class="btn btn-outline-blue" onclick="m03002_openReg()"><i data-lucide="plus"></i> 신규</button>
        <button class="btn" id="m03002-btn-edit" onclick="m03002_edit()"><i data-lucide="pencil"></i> 수정</button>
        <button class="btn btn-outline-red" id="m03002-btn-del" onclick="m03002_del()"><i data-lucide="trash-2"></i> 삭제</button>
      </div>
    </div>

    <!-- 인사이트 카드 4개 (필터 아래) -->
    <div class="insight-cards" style="padding:12px 16px 4px;">
      <div class="insight-card">
        <div class="insight-card-icon blue"><i data-lucide="bar-chart-2"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value">$${latest.steel}</span>
          <span class="insight-card-label">강판 HRC ($/ton)</span>
          <span style="font-size:11px;color:#b91c1c;font-weight:600;margin-top:2px;">▲ +${((latest.steel-prev.steel)/prev.steel*100).toFixed(1)}% vs 전월</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon" style="background:#F5F0FF;"><i data-lucide="cpu" style="color:#6B4FA0;"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="color:#6B4FA0;">$${CalcEngine.formatNumber(latest.al)}</span>
          <span class="insight-card-label">알루미늄 Al ($/ton)</span>
          <span style="font-size:11px;color:#b91c1c;font-weight:600;margin-top:2px;">▲ +${((latest.al-prev.al)/prev.al*100).toFixed(1)}% vs 전월</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon amber"><i data-lucide="droplet"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="color:#854F0B;">$${latest.oil}</span>
          <span class="insight-card-label">WTI 원유 ($/bbl)</span>
          <span style="font-size:11px;color:#b91c1c;font-weight:600;margin-top:2px;">▲ +${((latest.oil-prev.oil)/prev.oil*100).toFixed(1)}% vs 전월</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon" style="background:#FFF1F2;"><i data-lucide="trending-up" style="color:#b91c1c;"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="color:#b91c1c;">${CalcEngine.formatNumber(latest.usdKrw)}</span>
          <span class="insight-card-label">USD/KRW 환율</span>
          <span style="font-size:11px;color:#b91c1c;font-weight:600;margin-top:2px;">▲ +${((latest.usdKrw-prev.usdKrw)/prev.usdKrw*100).toFixed(1)}% (원화 약세)</span>
        </div>
      </div>
    </div>

    <!-- 그리드 -->
    <div style="flex:1;overflow:auto;padding:0 16px 12px;">
      <div class="grid-container" style="height:100%;">
        <table class="grid-table" style="min-width:1100px;">
          <thead>
            <tr>
              <th style="width:36px;"><input type="checkbox" id="m03002-chkAll" onchange="document.querySelectorAll('.lme-chk').forEach(c=>c.checked=this.checked)"></th>
              <th style="width:80px;">기준년월</th>
              <th style="width:90px;">강판HRC<br><span style="font-weight:400;font-size:11px;">($/ton)</span></th>
              <th style="width:56px;">전월비</th>
              <th style="width:90px;">Al LME<br><span style="font-weight:400;font-size:11px;">($/ton)</span></th>
              <th style="width:56px;">전월비</th>
              <th style="width:90px;">Cu LME<br><span style="font-weight:400;font-size:11px;">($/ton)</span></th>
              <th style="width:56px;">전월비</th>
              <th style="width:90px;">Ni LME<br><span style="font-weight:400;font-size:11px;">($/ton)</span></th>
              <th style="width:56px;">전월비</th>
              <th style="width:75px;">WTI<br><span style="font-weight:400;font-size:11px;">($/bbl)</span></th>
              <th style="width:80px;">HDPE<br><span style="font-weight:400;font-size:11px;">($/MT)</span></th>
              <th style="width:80px;">USD/KRW</th>
              <th style="width:80px;">JPY100/KRW</th>
              <th style="min-width:80px;">출처</th>
            </tr>
          </thead>
          <tbody id="m03002-tbody">
            ${rows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- 등록 모달 -->
    <div id="m03002-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:500;align-items:center;justify-content:center;">
      <div style="background:#fff;border:1px solid #ccc;width:520px;display:flex;flex-direction:column;border-radius:4px;overflow:hidden;">
        <div style="height:40px;background:#0D3F7A;color:#fff;display:flex;align-items:center;padding:0 16px;font-size:13px;font-weight:700;gap:8px;">
          <i data-lucide="plus-circle" style="width:14px;height:14px;"></i>
          LME·시세 신규 등록
          <button onclick="document.getElementById('m03002-modal').style.display='none';" style="margin-left:auto;background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer;line-height:1;">×</button>
        </div>
        <div style="padding:20px;display:flex;flex-direction:column;gap:12px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div><label class="form-label">기준년월 <span style="color:#ef4444;">*</span></label><input class="form-input" id="m03002-f-date" placeholder="예: 2026-06"></div>
            <div><label class="form-label">출처</label>
              <select class="form-select" id="m03002-f-src">
                <option>LME Official</option><option>POSCO</option><option>한국석유공사</option><option>수동 입력</option>
              </select></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
            <div><label class="form-label">강판 HRC ($/ton) <span style="color:#ef4444;">*</span></label><input class="form-input" id="m03002-f-steel" placeholder="0" type="number"></div>
            <div><label class="form-label">Al ($/ton)</label><input class="form-input" id="m03002-f-al" placeholder="0" type="number"></div>
            <div><label class="form-label">Cu ($/ton)</label><input class="form-input" id="m03002-f-cu" placeholder="0" type="number"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
            <div><label class="form-label">Ni ($/ton)</label><input class="form-input" id="m03002-f-ni" placeholder="0" type="number"></div>
            <div><label class="form-label">WTI ($/bbl)</label><input class="form-input" id="m03002-f-oil" placeholder="0.0" type="number" step="0.1"></div>
            <div><label class="form-label">HDPE ($/MT)</label><input class="form-input" id="m03002-f-hdpe" placeholder="0" type="number"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div><label class="form-label">USD/KRW <span style="color:#ef4444;">*</span></label><input class="form-input" id="m03002-f-usd" placeholder="0" type="number"></div>
            <div><label class="form-label">JPY100/KRW</label><input class="form-input" id="m03002-f-jpy" placeholder="0" type="number"></div>
          </div>
          <div><label class="form-label">비고</label><input class="form-input" id="m03002-f-note" placeholder="특이사항 입력"></div>
        </div>
        <div style="height:48px;background:#F1F1F1;border-top:1px solid #DDD;display:flex;align-items:center;justify-content:flex-end;padding:0 16px;gap:6px;">
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('m03002-modal').style.display='none';">취소</button>
          <button class="btn btn-primary btn-sm" onclick="m03002_save()">
            <i data-lucide="save" style="width:13px;height:13px;"></i> 저장
          </button>
        </div>
      </div>
    </div>

  </div>`;

  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
};

window.m03002_toggleFilter = function(btn) {
  btn.classList.toggle('active');
};

window.m03002_selectRow = function(tr) {
  document.querySelectorAll('.lme-row').forEach(r => r.style.outline = '');
  tr.style.outline = '2px solid #185FA5';
};

window.m03002_filter = function() {
  const q = (document.getElementById('m03002-search')?.value || '').toLowerCase();
  document.querySelectorAll('.lme-row').forEach(tr => {
    const date = tr.children[1]?.textContent || '';
    tr.style.display = date.toLowerCase().includes(q) ? '' : 'none';
  });
};

window.m03002_openReg = function() {
  const modal = document.getElementById('m03002-modal');
  if (modal) { modal.style.display = 'flex'; }
  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
};

window.m03002_edit = function() {
  Common.showToast('수정할 행을 선택하세요', 'info');
};

window.m03002_del = function() {
  const checked = document.querySelectorAll('.lme-chk:checked');
  if (checked.length === 0) { Common.showToast('삭제할 항목을 선택하세요', 'warning'); return; }
  Common.showToast(`${checked.length}건 삭제 처리됨 (데모)`, 'success');
};

window.m03002_save = function() {
  const date = document.getElementById('m03002-f-date')?.value;
  const steel = document.getElementById('m03002-f-steel')?.value;
  const usd = document.getElementById('m03002-f-usd')?.value;
  if (!date) { Common.showToast('기준년월을 입력하세요', 'warning'); return; }
  if (!steel) { Common.showToast('강판 HRC 시세를 입력하세요', 'warning'); return; }
  if (!usd) { Common.showToast('USD/KRW 환율을 입력하세요', 'warning'); return; }
  document.getElementById('m03002-modal').style.display = 'none';
  Common.showToast(`${date} LME 시세 등록 완료`, 'success');
};

/* ============================================================
   render_M03_003 — 단가 이력 관리
   패턴 : 패턴 5-B (좌 그리드 60% + 우 상세 40%)
   생성일 : 2026-06-02
   ============================================================ */
window.render_M03_003 = function(container) {
  container.style.padding = '0';

  const partList  = MockData.getAll('partList');
  const suppliers = MockData.getAll('suppliers');

  const TYPE_CYCLE = ['전체', 'RFQ확정', '협상조정', 'ECN반영', '목표가조정', '초기등록'];
  let typeCycleIdx = 0;
  let searchQ      = '';
  let typeFilter   = '전체';
  let selectedId   = null;

  function getData() { return MockData.getAll('priceHistory'); }

  function supName(id) {
    if (!id) return '-';
    return suppliers.find(s => s.id === id)?.name || id;
  }

  function typeColor(t) {
    return { 'RFQ확정':'#0747a6', '협상조정':'#92400e', 'ECN반영':'#e11d48',
             '목표가조정':'#94a3b8', '초기등록':'#94a3b8' }[t] || '#222';
  }

  function rateCell(rate, prev) {
    if (rate === null || rate === undefined || prev === null) return '<span style="color:#94a3b8;">-</span>';
    const r = Number(rate);
    const col = r > 0 ? '#e11d48' : r < 0 ? '#0f6e56' : '#94a3b8';
    return `<span style="color:${col};font-weight:600;">${r > 0 ? '+' : ''}${r.toFixed(1)}%</span>`;
  }

  /* ── HTML 골격 ── */
  container.innerHTML = `<div class="screen-wrapper" style="display:flex;flex-direction:column;height:100%;padding:12px 16px;box-sizing:border-box;overflow:hidden;">

    <!-- 필터바 — M01 표준 100% 일치 -->
    <div class="filter-bar">
      <div class="filter-search">
        <input type="text" id="m03003-search" placeholder="Search" oninput="m03003_onSearch(this.value)">
        <i data-lucide="search"></i>
      </div>
      <button class="filter-btn" onclick="m03003_toggleFilter(this)"><i data-lucide="filter" class="icon-red"></i> 필터</button>
      <button class="filter-btn" id="m03003-type-btn" onclick="m03003_cycleType(this)"><i data-lucide="bar-chart-2" class="icon-blue"></i> <span id="m03003-type-label">변경유형</span></button>
      <div class="filter-date-range">
        <input type="text" id="m03003-date-from" value="2025/01/01" readonly>
        <span class="date-separator">~</span>
        <input type="text" id="m03003-date-to" value="2026/12/31" readonly>
        <i data-lucide="calendar" class="icon-red"></i>
      </div>
      <div class="filter-right">
        <button class="btn btn-outline-blue" onclick="m03003_showAddForm()"><i data-lucide="plus"></i> 신규등록</button>
      </div>
    </div>

    <!-- 인사이트 카드 4개 -->
    <div id="m03003-cards" class="insight-cards"></div>

    <!-- 좌우 분할 -->
    <div style="display:flex;flex:1;overflow:hidden;gap:12px;">

      <!-- 좌측 그리드 (60%) -->
      <div style="flex:0 0 60%;overflow-y:auto;display:flex;flex-direction:column;">
        <div class="grid-container" style="flex:1;">
          <table class="grid-table" style="min-width:680px;">
            <thead>
              <tr>
                <th style="width:40px;"><input type="checkbox" id="m03003-chk-all" onchange="document.querySelectorAll('.ph-chk').forEach(c=>c.checked=this.checked)"></th>
                <th style="width:90px;" class="ss-col-center">변경일</th>
                <th style="width:88px;" class="ss-col-center">Part No.</th>
                <th class="ss-col-left">품명</th>
                <th style="width:88px;" class="ss-col-center">변경유형</th>
                <th style="width:88px;" class="ss-col-right">이전단가</th>
                <th style="width:88px;" class="ss-col-right">확정단가</th>
                <th style="width:76px;" class="ss-col-center">변동률</th>
                <th style="width:100px;" class="ss-col-left">공급사</th>
                <th style="width:68px;" class="ss-col-center">확정자</th>
              </tr>
            </thead>
            <tbody id="m03003-tbody"></tbody>
          </table>
        </div>
      </div>

      <!-- 우측 상세 패널 (40%) -->
      <div id="m03003-detail" style="flex:0 0 calc(40% - 12px);overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius);padding:16px;background:#fff;">
        <div id="m03003-detail-inner">
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:180px;color:var(--text-muted);font-size:13px;gap:10px;">
            <i data-lucide="mouse-pointer-click" style="width:28px;height:28px;opacity:0.25;"></i>
            <span>이력 행을 클릭하면 상세 내용이 표시됩니다</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 신규등록 모달 -->
    <div id="m03003-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:500;align-items:center;justify-content:center;">
      <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);width:540px;display:flex;flex-direction:column;box-shadow:0 8px 24px rgba(0,0,0,0.14);">
        <div style="height:44px;background:var(--primary);color:#fff;display:flex;align-items:center;padding:0 16px;font-size:14px;font-weight:700;border-radius:var(--radius) var(--radius) 0 0;gap:8px;">
          <i data-lucide="plus-circle"></i> 단가 이력 신규등록
          <button onclick="document.getElementById('m03003-modal').style.display='none';" style="margin-left:auto;background:transparent;border:none;color:#fff;font-size:20px;cursor:pointer;line-height:1;">×</button>
        </div>
        <div style="padding:20px;display:flex;flex-direction:column;gap:12px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
              <label class="form-label">Part No. <span style="color:var(--danger);">*</span></label>
              <select class="form-input form-select" id="m03003-f-part" onchange="m03003_onPartChange(this.value)" style="width:100%;">
                <option value="">-- 선택 --</option>
                ${partList.map(p => `<option value="${p.partNo}">${p.partNo} — ${p.partName}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="form-label">변경일 <span style="color:var(--danger);">*</span></label>
              <input type="date" class="form-input" id="m03003-f-date" style="width:100%;" value="${new Date().toISOString().slice(0,10)}">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
              <label class="form-label">변경유형 <span style="color:var(--danger);">*</span></label>
              <select class="form-input form-select" id="m03003-f-type" style="width:100%;">
                <option>RFQ확정</option><option>협상조정</option><option>ECN반영</option><option>목표가조정</option><option>초기등록</option>
              </select>
            </div>
            <div>
              <label class="form-label">공급사</label>
              <select class="form-input form-select" id="m03003-f-sup" style="width:100%;">
                <option value="">-- 미지정 --</option>
                ${suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
            <div>
              <label class="form-label">이전단가</label>
              <input type="number" class="form-input" id="m03003-f-prev" placeholder="자동 로드" style="width:100%;" oninput="m03003_calcRate()">
            </div>
            <div>
              <label class="form-label">확정단가 <span style="color:var(--danger);">*</span></label>
              <input type="number" class="form-input" id="m03003-f-new" placeholder="0" style="width:100%;" oninput="m03003_calcRate()">
            </div>
            <div>
              <label class="form-label">변동률 (자동)</label>
              <input type="text" class="form-input" id="m03003-f-rate" readonly style="width:100%;background:var(--bg-soft);color:var(--text-muted);" placeholder="자동계산">
            </div>
          </div>
          <div>
            <label class="form-label">변경 사유</label>
            <textarea class="form-input" id="m03003-f-reason" style="width:100%;height:60px;resize:vertical;" placeholder="단가 변경 사유를 입력하세요"></textarea>
          </div>
        </div>
        <div style="height:52px;background:var(--bg-soft);border-top:1px solid var(--border);display:flex;align-items:center;justify-content:flex-end;padding:0 16px;gap:8px;border-radius:0 0 var(--radius) var(--radius);">
          <button class="btn" onclick="document.getElementById('m03003-modal').style.display='none';">취소</button>
          <button class="btn btn-solid-blue" onclick="m03003_saveNew()"><i data-lucide="save"></i> 저장</button>
        </div>
      </div>
    </div>

  </div>`;

  /* ── renderCards ── */
  window.m03003_renderCards = function() {
    const data   = getData();
    const total  = data.length;
    const upCnt  = data.filter(r => r.prevPrice !== null && r.newPrice > r.prevPrice).length;
    const dnCnt  = data.filter(r => r.prevPrice !== null && r.newPrice < r.prevPrice).length;
    const rates  = data.filter(r => r.changeRate !== null && r.prevPrice !== null).map(r => Math.abs(Number(r.changeRate)));
    const avgR   = rates.length ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1) : '0.0';
    const el     = document.getElementById('m03003-cards');
    if (!el) return;
    el.innerHTML = `
      <div class="insight-card">
        <div class="insight-card-icon blue"><i data-lucide="history"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value">${total}</span>
          <span class="insight-card-label">전체 이력</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon red"><i data-lucide="trending-up"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="color:var(--danger);">${upCnt}</span>
          <span class="insight-card-label">단가 인상</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon green"><i data-lucide="trending-down"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="color:var(--success);">${dnCnt}</span>
          <span class="insight-card-label">단가 인하</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon amber"><i data-lucide="percent"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="color:#92400e;">${avgR}%</span>
          <span class="insight-card-label">평균 변동률</span>
        </div>
      </div>`;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  /* ── renderGrid ── */
  window.m03003_renderGrid = function() {
    const all      = getData();
    const q        = searchQ.toLowerCase();
    const filtered = all.filter(r => {
      const mSearch = !q || r.partNo.toLowerCase().includes(q) || r.partName.includes(q) ||
                      (r.supplierId && supName(r.supplierId).toLowerCase().includes(q));
      const mType   = typeFilter === '전체' || r.changeType === typeFilter;
      return mSearch && mType;
    });
    const tbody = document.getElementById('m03003-tbody');
    if (!tbody) return;
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="center" style="padding:32px;color:var(--text-muted);">조회된 이력이 없습니다</td></tr>`;
      return;
    }
    tbody.innerHTML = filtered.map(r => {
      const tCol   = typeColor(r.changeType);
      const prevTd = r.prevPrice === null ? '<span style="color:#94a3b8;">-</span>' : CalcEngine.formatNumber(r.prevPrice);
      const isSelected = r.id === selectedId;
      return `<tr class="ph-row${isSelected ? ' selected' : ''}" data-id="${r.id}" onclick="m03003_selectRow('${r.id}')" style="cursor:pointer;">
        <td class="center"><input type="checkbox" class="ph-chk" onclick="event.stopPropagation()"></td>
        <td class="center">${r.changeDate}</td>
        <td class="center"><span class="code-link">${r.partNo}</span></td>
        <td>${r.partName}</td>
        <td class="center"><span style="color:${tCol};font-weight:500;">${r.changeType}</span></td>
        <td class="right">${prevTd}</td>
        <td class="right" style="font-weight:600;">${CalcEngine.formatNumber(r.newPrice)}</td>
        <td class="center">${rateCell(r.changeRate, r.prevPrice)}</td>
        <td style="max-width:100px;overflow:hidden;text-overflow:ellipsis;">${supName(r.supplierId)}</td>
        <td class="center">${r.confirmedBy}</td>
      </tr>`;
    }).join('');
  };

  /* ── renderDetail ── */
  window.m03003_renderDetail = function(id) {
    const all      = getData();
    const record   = all.find(r => r.id === id);
    if (!record) return;
    const timeline = all.filter(r => r.partNo === record.partNo)
                        .sort((a, b) => a.changeDate.localeCompare(b.changeDate));
    const el = document.getElementById('m03003-detail-inner');
    if (!el) return;
    el.innerHTML = `
      <div style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--border);">
        <div style="font-size:15px;font-weight:700;color:var(--text-primary);">${record.partNo}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:2px;">${record.partName}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">프로젝트: ${record.projectId}</div>
      </div>
      <div style="font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.05em;">단가 변동 타임라인</div>
      <div class="ph-timeline">
        ${timeline.map(r => {
          const tCol    = typeColor(r.changeType);
          const isAct   = r.id === id;
          const rStr    = r.changeRate !== null && r.prevPrice !== null
                          ? `${r.changeRate > 0 ? '+' : ''}${Number(r.changeRate).toFixed(1)}%` : null;
          const rCol    = r.changeRate > 0 ? '#e11d48' : r.changeRate < 0 ? '#0f6e56' : '#94a3b8';
          const prevStr = r.prevPrice !== null ? `${CalcEngine.formatNumber(r.prevPrice)} → ` : '';
          return `<div class="ph-tl-item${isAct ? ' ph-tl-active' : ''}">
            <div style="font-size:11px;color:var(--text-muted);">${r.changeDate}</div>
            <div style="font-size:12px;font-weight:600;color:${tCol};margin:2px 0;">${r.changeType}</div>
            <div style="font-size:12px;color:var(--text-primary);">${prevStr}<span style="font-weight:700;">${CalcEngine.formatNumber(r.newPrice)}</span>${rStr ? ` <span style="color:${rCol};">(${rStr})</span>` : ''}</div>
            ${r.reason ? `<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${r.reason}</div>` : ''}
            ${r.rfqId  ? `<div style="font-size:11px;color:var(--primary);margin-top:2px;">연계 RFQ: ${r.rfqId}</div>` : ''}
            ${r.ecnId  ? `<div style="font-size:11px;color:#e11d48;margin-top:2px;">연계 ECN: ${r.ecnId}</div>` : ''}
          </div>`;
        }).join('')}
      </div>
      <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;color:var(--text-muted);">
        확정자: <span style="color:var(--text-primary);font-weight:500;">${record.confirmedBy}</span>
        &nbsp;·&nbsp; 확정일: <span style="color:var(--text-primary);">${record.changeDate}</span>
      </div>`;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  /* ── 이벤트 핸들러 ── */
  window.m03003_onSearch = function(val) {
    searchQ = val;
    m03003_renderGrid();
  };

  window.m03003_toggleFilter = function(btn) {
    btn.classList.toggle('active');
  };

  window.m03003_cycleType = function(btn) {
    typeCycleIdx  = (typeCycleIdx + 1) % TYPE_CYCLE.length;
    typeFilter    = TYPE_CYCLE[typeCycleIdx];
    const lbl     = document.getElementById('m03003-type-label');
    if (lbl) lbl.textContent = typeFilter;
    m03003_renderGrid();
  };

  window.m03003_selectRow = function(id) {
    selectedId = id;
    document.querySelectorAll('.ph-row').forEach(r => r.classList.remove('selected'));
    document.querySelector('.ph-row[data-id="' + id + '"]')?.classList.add('selected');
    m03003_renderDetail(id);
  };

  window.m03003_showAddForm = function() {
    /* 이전단가 초기화 */
    const prev = document.getElementById('m03003-f-prev');
    const rate = document.getElementById('m03003-f-rate');
    const part = document.getElementById('m03003-f-part');
    if (prev) prev.value = '';
    if (rate) rate.value = '';
    if (part) part.value = '';
    const modal = document.getElementById('m03003-modal');
    if (modal) modal.style.display = 'flex';
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  window.m03003_onPartChange = function(partNo) {
    const p = partList.find(p => p.partNo === partNo);
    const el = document.getElementById('m03003-f-prev');
    if (el && p) el.value = p.fixedPrice ?? '';
    m03003_calcRate();
  };

  window.m03003_calcRate = function() {
    const prev = parseFloat(document.getElementById('m03003-f-prev')?.value);
    const next = parseFloat(document.getElementById('m03003-f-new')?.value);
    const el   = document.getElementById('m03003-f-rate');
    if (!el) return;
    if (!isNaN(prev) && !isNaN(next) && prev > 0) {
      const r = ((next - prev) / prev * 100).toFixed(1);
      el.value = `${r > 0 ? '+' : ''}${r}%`;
    } else {
      el.value = '';
    }
  };

  window.m03003_saveNew = function() {
    const partNo  = document.getElementById('m03003-f-part')?.value;
    const dateVal = document.getElementById('m03003-f-date')?.value;
    const typeVal = document.getElementById('m03003-f-type')?.value;
    const prevVal = document.getElementById('m03003-f-prev')?.value;
    const newVal  = document.getElementById('m03003-f-new')?.value;
    const reason  = document.getElementById('m03003-f-reason')?.value;
    const supVal  = document.getElementById('m03003-f-sup')?.value;
    if (!partNo)  { Common.showToast('Part No.를 선택하세요', 'warning'); return; }
    if (!dateVal) { Common.showToast('변경일을 입력하세요', 'warning'); return; }
    if (!newVal)  { Common.showToast('확정단가를 입력하세요', 'warning'); return; }
    const p         = partList.find(p => p.partNo === partNo);
    const prevPrice = prevVal ? Number(prevVal) : null;
    const newPrice  = Number(newVal);
    const changeRate = prevPrice ? parseFloat(((newPrice - prevPrice) / prevPrice * 100).toFixed(1)) : null;
    MockData.save('priceHistory', {
      id: 'PH-NEW-' + Date.now(),
      partNo, partName: p?.partName || partNo,
      projectId: p?.projectId || '',
      supplierId: supVal || null,
      changeDate: dateVal,
      changeType: typeVal,
      prevPrice, newPrice, changeRate,
      reason: reason || '',
      confirmedBy: '김구매',
      rfqId: null, ecnId: null
    });
    document.getElementById('m03003-modal').style.display = 'none';
    Common.showToast(`${partNo} 단가 이력 등록 완료`, 'success');
    m03003_renderCards();
    m03003_renderGrid();
  };

  /* ── 초기 렌더 ── */
  m03003_renderCards();
  m03003_renderGrid();
  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
};
