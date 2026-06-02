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
