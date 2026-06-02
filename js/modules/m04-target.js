/* ============================================================
   m04-target.js — M04-001 목표가 설정·버전 관리
   화면ID : M04-001
   패턴   : 좌 설정 패널(38%) + 우 모듈 편집 그리드(62%)
   생성일 : 2026-06-02
   ============================================================ */

window.render_M04_001 = function(container) {
  container.style.padding = '0';

  /* targetCostList 미초기화 시 시드 투입 */
  if (MockData.getAll('targetCostList').length === 0) {
    localStorage.setItem('dh_targetCostList', JSON.stringify(MockData.seed.targetCostList));
  }

  /* ── 상태 ── */
  const projects   = MockData.getAll('projects');
  let   curProjId  = 'PRJ-2025-001';
  let   curTcId    = null;   // 선택된 targetCostList 항목 id
  let   curTc      = null;   // 작업 중인 사본 (deep copy)

  const stStyle = {
    '작성중': 'color:var(--primary);',
    '결재중': 'color:#F59E0B;font-weight:600;',
    '승인':   'color:var(--success);font-weight:600;',
    '반려':   'color:var(--danger);font-weight:600;',
  };

  const projOpts = projects.map(p =>
    `<option value="${p.id}" ${p.id === curProjId ? 'selected' : ''}>${p.name}</option>`
  ).join('');

  /* ── 레이아웃 ── */
  container.innerHTML = `<div class="screen-wrapper" style="display:flex;flex-direction:column;height:100%;padding:0;">

    <!-- 필터바 -->
    <div class="filter-bar" style="padding:10px 16px 0;">
      <div class="filter-search" style="width:260px;">
        <select class="form-input form-select" id="m04001-proj" onchange="m04001_onProjChange(this.value)" style="border:none;width:100%;background:transparent;">
          ${projOpts}
        </select>
        <i data-lucide="chevron-down" style="color:var(--text-muted);pointer-events:none;"></i>
      </div>
      <div class="filter-right">
        <button class="btn" onclick="m04001_newVersion()"><i data-lucide="copy-plus"></i> 버전 복사</button>
        <button class="btn btn-solid-blue" onclick="m04001_save()"><i data-lucide="save"></i> 저장</button>
        <button class="btn btn-outline-blue" onclick="m04001_submitApproval()"><i data-lucide="send"></i> 결재 상신</button>
      </div>
    </div>

    <!-- 인사이트 카드 -->
    <div id="m04001-cards" class="insight-cards" style="padding:10px 16px;"></div>

    <!-- 본문 좌우 분할 -->
    <div style="display:flex;flex:1;overflow:hidden;">

      <!-- 좌: 설정 패널 (38%) -->
      <div id="m04001-left" style="flex:0 0 38%;overflow-y:auto;border-right:1px solid var(--border);padding:14px 16px;display:flex;flex-direction:column;gap:12px;"></div>

      <!-- 우: 모듈 편집 그리드 (62%) -->
      <div id="m04001-right" style="flex:0 0 62%;overflow-y:auto;padding:14px 16px;"></div>

    </div>
  </div>`;

  /* ══════════════════════════════════════════
     헬퍼 함수
  ══════════════════════════════════════════ */

  /* 버전 목록 가져오기 (현재 프로젝트) */
  const getVersions = (projId) =>
    MockData.getAll('targetCostList').filter(t => t.projectId === projId)
      .sort((a, b) => a.version.localeCompare(b.version));

  /* 깊은 복사 */
  const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

  /* 프로젝트 변경 */
  window.m04001_onProjChange = function(projId) {
    curProjId = projId;
    const vers = getVersions(projId);
    if (vers.length > 0) {
      curTcId = vers[vers.length - 1].id; // 최신 버전 선택
      curTc   = deepCopy(vers[vers.length - 1]);
    } else {
      curTcId = null;
      curTc   = null;
    }
    m04001_renderAll();
  };

  /* 버전 변경 */
  window.m04001_onVersionChange = function(tcId) {
    const item = MockData.getAll('targetCostList').find(t => t.id === tcId);
    if (!item) return;
    curTcId = tcId;
    curTc   = deepCopy(item);
    m04001_renderAll();
  };

  /* OEM가 변경 → 목표가 재계산 */
  window.m04001_onHmcChange = function(val) {
    if (!curTc) return;
    curTc.hmcPrice = Number(val) || 0;
    const crRate    = parseFloat(document.getElementById('m04001-crrate')?.value) || curTc.crRate;
    curTc.targetPrice = Math.round(curTc.hmcPrice * (1 - crRate / 100));
    curTc.crRate      = crRate;
    m04001_renderLeft();
    m04001_updatePriceBars();
  };

  /* CR율 변경 → 목표가 재계산 */
  window.m04001_onCrChange = function(val) {
    if (!curTc) return;
    curTc.crRate      = parseFloat(val) || 0;
    curTc.targetPrice = Math.round(curTc.hmcPrice * (1 - curTc.crRate / 100));
    m04001_updatePriceBars();
  };

  /* 목표가 직접 변경 → CR율 역산 */
  window.m04001_onTargetChange = function(val) {
    if (!curTc) return;
    curTc.targetPrice = Number(val) || 0;
    curTc.crRate = curTc.hmcPrice > 0
      ? Math.round(((curTc.hmcPrice - curTc.targetPrice) / curTc.hmcPrice) * 1000) / 10
      : 0;
    m04001_updatePriceBars();
  };

  /* 시각화 바 갱신 */
  window.m04001_updatePriceBars = function() {
    if (!curTc) return;
    const barEl = document.getElementById('m04001-bar-fill');
    const crEl  = document.getElementById('m04001-cr-disp');
    const tpEl  = document.getElementById('m04001-tp-disp');
    const crInp = document.getElementById('m04001-crrate');
    const tpInp = document.getElementById('m04001-target');
    const pct   = curTc.hmcPrice > 0 ? Math.round((curTc.targetPrice / curTc.hmcPrice) * 100) : 0;
    if (barEl) barEl.style.width = pct + '%';
    if (crEl)  crEl.textContent  = curTc.crRate + '%';
    if (tpEl)  tpEl.textContent  = CalcEngine.formatCurrency(curTc.targetPrice);
    if (crInp) crInp.value       = curTc.crRate;
    if (tpInp) tpInp.value       = curTc.targetPrice;
  };

  /* 모듈 목표가 변경 */
  window.m04001_onModuleTargetChange = function(idx, val) {
    if (!curTc?.modules) return;
    curTc.modules[idx].target = Number(val) || 0;
    m04001_renderModuleGrid();   // 합계 재렌더
  };

  /* 인사이트 카드 */
  window.m04001_renderCards = function() {
    const el = document.getElementById('m04001-cards');
    if (!el) return;
    if (!curTc) {
      el.innerHTML = `
        <div class="insight-card"><div class="insight-card-icon blue"><i data-lucide="target"></i></div>
          <div class="insight-card-body"><span class="insight-card-value">-</span><span class="insight-card-label">OEM 제시가</span></div></div>
        <div class="insight-card"><div class="insight-card-icon amber"><i data-lucide="trending-down"></i></div>
          <div class="insight-card-body"><span class="insight-card-value">-</span><span class="insight-card-label">내부 목표가</span></div></div>
        <div class="insight-card"><div class="insight-card-icon green"><i data-lucide="percent"></i></div>
          <div class="insight-card-body"><span class="insight-card-value">-</span><span class="insight-card-label">CR율</span></div></div>
        <div class="insight-card"><div class="insight-card-icon blue"><i data-lucide="circle-check"></i></div>
          <div class="insight-card-body"><span class="insight-card-value">-</span><span class="insight-card-label">상태</span></div></div>`;
      return;
    }
    const st = curTc.status || '-';
    el.innerHTML = `
      <div class="insight-card">
        <div class="insight-card-icon amber"><i data-lucide="tag"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="font-size:15px;">${CalcEngine.formatCurrency(curTc.hmcPrice)}</span>
          <span class="insight-card-label">OEM 제시가(원)</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon blue"><i data-lucide="target"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="font-size:15px;color:var(--primary);">${CalcEngine.formatCurrency(curTc.targetPrice)}</span>
          <span class="insight-card-label">내부 목표가(원)</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon green"><i data-lucide="trending-down"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="color:var(--success);">${curTc.crRate}%</span>
          <span class="insight-card-label">CR율 (원가절감)</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon ${st==='승인'?'green':st==='결재중'?'amber':st==='반려'?'red':'blue'}">
          <i data-lucide="${st==='승인'?'circle-check':st==='결재중'?'clock':st==='반려'?'circle-alert':'file-edit'}"></i>
        </div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="${stStyle[st]||''}">${st}</span>
          <span class="insight-card-label">승인 상태 (${curTc.version})</span>
        </div>
      </div>`;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  /* 좌: 설정 패널 */
  window.m04001_renderLeft = function() {
    const el = document.getElementById('m04001-left');
    if (!el) return;

    const vers    = getVersions(curProjId);
    const verOpts = vers.map(t =>
      `<option value="${t.id}" ${t.id === curTcId ? 'selected' : ''}>${t.version} — ${t.status}${t.approvedAt ? ' ('+t.approvedAt+')' : ''}</option>`
    ).join('');
    const pct = curTc && curTc.hmcPrice > 0
      ? Math.round((curTc.targetPrice / curTc.hmcPrice) * 100)
      : 0;

    el.innerHTML = curTc ? `
      <!-- 버전 선택 -->
      <div class="section-box" style="margin-bottom:0;">
        <div class="section-box-title">버전 관리</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="form-field">
            <label class="form-label">버전 선택</label>
            <select class="form-input form-select" id="m04001-version" onchange="m04001_onVersionChange(this.value)">${verOpts}</select>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">
            <div><span style="color:var(--text-muted);">상태</span><br><b style="${stStyle[curTc.status]||''}">${curTc.status}</b></div>
            <div><span style="color:var(--text-muted);">생성일</span><br><b>${curTc.createdAt||'-'}</b></div>
            <div><span style="color:var(--text-muted);">생성자</span><br><b>${curTc.createdBy||'-'}</b></div>
            <div><span style="color:var(--text-muted);">승인일</span><br><b>${curTc.approvedAt||'미승인'}</b></div>
          </div>
        </div>
      </div>

      <!-- 가격 설정 -->
      <div class="section-box" style="margin-bottom:0;">
        <div class="section-box-title">OEM·목표가 설정</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="form-field">
            <label class="form-label">OEM 제시가(원)</label>
            <input class="form-input" id="m04001-hmc" type="number" value="${curTc.hmcPrice}"
                   onchange="m04001_onHmcChange(this.value)" placeholder="0">
          </div>
          <div class="form-field">
            <label class="form-label">CR율(%) <span style="font-size:11px;color:var(--text-muted);font-weight:normal;">— OEM가 × (1-CR%) = 목표가</span></label>
            <input class="form-input" id="m04001-crrate" type="number" step="0.1" value="${curTc.crRate}"
                   onchange="m04001_onCrChange(this.value)" placeholder="0.0">
          </div>
          <div class="form-field">
            <label class="form-label">내부 목표가(원)</label>
            <input class="form-input" id="m04001-target" type="number" value="${curTc.targetPrice}"
                   onchange="m04001_onTargetChange(this.value)" placeholder="0">
          </div>

          <!-- OEM vs 목표가 시각화 -->
          <div style="margin-top:4px;">
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:3px;">
              <span>OEM 제시가</span>
              <span>${CalcEngine.formatCurrency(curTc.hmcPrice)} 원</span>
            </div>
            <div style="height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
              <div style="height:100%;width:100%;background:#e5e7eb;border-radius:4px;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;margin-top:6px;color:var(--text-muted);">
              <span>내부 목표가 <b id="m04001-cr-disp" style="color:var(--success);">${curTc.crRate}%</b> 절감</span>
              <b id="m04001-tp-disp" style="color:var(--primary);">${CalcEngine.formatCurrency(curTc.targetPrice)} 원</b>
            </div>
            <div style="height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;margin-top:3px;">
              <div id="m04001-bar-fill" style="height:100%;width:${pct}%;background:var(--primary);border-radius:4px;transition:width 0.3s;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 액션 버튼 -->
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:auto;padding-top:4px;">
        <button class="btn btn-solid-blue" onclick="m04001_save()" style="width:100%;"><i data-lucide="save"></i> 저장</button>
        <button class="btn btn-outline-blue" onclick="m04001_submitApproval()" style="width:100%;"><i data-lucide="send"></i> 결재 상신</button>
        <button class="btn" onclick="m04001_newVersion()" style="width:100%;"><i data-lucide="copy-plus"></i> 이 버전 기준으로 신규 버전 생성</button>
      </div>
    ` : `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--text-muted);gap:12px;font-size:13px;">
        <i data-lucide="file-plus" style="width:36px;height:36px;"></i>
        이 프로젝트에 목표가가 없습니다
        <button class="btn btn-outline-blue" onclick="m04001_createFirst()"><i data-lucide="plus"></i> 목표가 최초 생성</button>
      </div>`;

    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  /* 우: 모듈 편집 그리드 */
  window.m04001_renderRight = function() {
    const el = document.getElementById('m04001-right');
    if (!el || !curTc) {
      if (el) el.innerHTML = `<div style="color:var(--text-muted);text-align:center;margin-top:60px;font-size:13px;">좌측에서 프로젝트와 버전을 선택하세요</div>`;
      return;
    }

    const mods = curTc.modules || [];
    const totalTarget = mods.reduce((s, m) => s + (m.target || 0), 0);
    const totalActual = mods.reduce((s, m) => s + (m.actual || 0), 0);
    const totalRate   = totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(1) : '-';
    const totalGap    = totalActual - totalTarget;
    const totGapSign  = totalGap > 0 ? '+' : '';
    const totGapColor = totalGap <= 0 ? 'var(--success)' : 'var(--danger)';
    const totRateColor = totalActual <= totalTarget ? 'var(--success)' : 'var(--danger)';

    const rows = mods.map((m, idx) => {
      const rate      = m.target > 0 ? ((m.actual / m.target) * 100).toFixed(1) : '-';
      const gap       = m.actual - m.target;
      const gapSign   = gap > 0 ? '+' : '';
      const gapColor  = gap <= 0 ? 'var(--success)' : 'var(--danger)';
      const rateColor = m.actual <= m.target ? 'var(--success)' : 'var(--danger)';
      const barPct    = curTc.targetPrice > 0 ? Math.min(100, Math.round((m.target / curTc.targetPrice) * 100)) : 0;
      return `<tr>
        <td class="left" style="font-weight:500;">${m.name}</td>
        <td class="right" style="padding:4px 8px;">
          <input type="number" class="form-input" value="${m.target}"
                 style="height:28px;width:100%;text-align:right;font-size:12px;padding:0 6px;"
                 onchange="m04001_onModuleTargetChange(${idx}, this.value)">
        </td>
        <td class="right">${CalcEngine.formatCurrency(m.actual)}</td>
        <td class="right" style="color:${rateColor};font-weight:600;">${rate}%</td>
        <td class="right" style="color:${gapColor};font-weight:600;">${gapSign}${CalcEngine.formatCurrency(Math.abs(gap))}</td>
        <td class="left" style="padding:4px 8px;">
          <div style="height:6px;background:#e5e7eb;border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${barPct}%;background:var(--primary);border-radius:3px;"></div>
          </div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">목표가 비중 ${barPct}%</div>
        </td>
      </tr>`;
    }).join('');

    el.innerHTML = `
      <div class="section-box" style="margin-bottom:0;">
        <div class="section-box-title">모듈별 목표가 설정 — ${curTc.version}</div>
        <div class="grid-container" style="margin-bottom:12px;">
          <table class="grid-table">
            <colgroup>
              <col style="width:120px"><col style="width:110px"><col style="width:100px">
              <col style="width:80px"><col style="width:90px"><col>
            </colgroup>
            <thead><tr>
              <th>모듈명</th>
              <th class="right">목표가(원) <span style="font-size:10px;font-weight:normal;">[편집가능]</span></th>
              <th class="right">산출단가(원)</th>
              <th class="right">달성률(%)</th>
              <th class="right">Gap(원)</th>
              <th>목표가 비중</th>
            </tr></thead>
            <tbody>
              ${rows}
              <tr style="background:#f8fafc;font-weight:600;">
                <td class="left">합계</td>
                <td class="right">${CalcEngine.formatCurrency(totalTarget)}</td>
                <td class="right">${CalcEngine.formatCurrency(totalActual)}</td>
                <td class="right" style="color:${totRateColor};">${totalRate}%</td>
                <td class="right" style="color:${totGapColor};">${totGapSign}${CalcEngine.formatCurrency(Math.abs(totalGap))}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 모듈 합계 vs 목표가 정합성 체크 -->
        ${Math.abs(totalTarget - curTc.targetPrice) > 100 ? `
        <div style="padding:8px 12px;background:#FFF8EC;border:1px solid #F0C060;border-radius:4px;font-size:12px;color:#92400E;">
          모듈 합계(${CalcEngine.formatCurrency(totalTarget)}원)가 내부 목표가(${CalcEngine.formatCurrency(curTc.targetPrice)}원)와 ${CalcEngine.formatCurrency(Math.abs(totalTarget - curTc.targetPrice))}원 차이가 있습니다. 저장 전 확인해주세요.
        </div>` : `
        <div style="padding:8px 12px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:4px;font-size:12px;color:#166534;">
          모듈 합계와 내부 목표가가 일치합니다. (${CalcEngine.formatCurrency(curTc.targetPrice)}원)
        </div>`}
      </div>`;
  };

  /* 전체 렌더 */
  window.m04001_renderAll = function() {
    m04001_renderCards();
    m04001_renderLeft();
    m04001_renderRight();
  };

  /* ── 모듈 그리드만 재렌더 (합계 갱신용) ── */
  window.m04001_renderModuleGrid = function() {
    m04001_renderRight();
  };

  /* ── 저장 ── */
  window.m04001_save = function() {
    if (!curTc) { Common.showToast('저장할 목표가 데이터가 없습니다', 'info'); return; }
    curTc.hmcPrice    = Number(document.getElementById('m04001-hmc')?.value)    || curTc.hmcPrice;
    curTc.targetPrice = Number(document.getElementById('m04001-target')?.value) || curTc.targetPrice;
    curTc.crRate      = Number(document.getElementById('m04001-crrate')?.value) || curTc.crRate;
    MockData.save('targetCostList', curTc);
    Common.showToast('목표가가 저장되었습니다', 'success');
    m04001_renderAll();
  };

  /* ── 결재 상신 ── */
  window.m04001_submitApproval = function() {
    if (!curTc) { Common.showToast('목표가를 먼저 설정해주세요', 'info'); return; }
    if (curTc.status === '승인') { Common.showToast('이미 승인된 버전입니다', 'info'); return; }
    if (curTc.status === '결재중') { Common.showToast('이미 결재 진행 중입니다', 'info'); return; }
    if (!confirm(`${curTc.version} 목표가를 결재 상신하시겠습니까?`)) return;
    curTc.status = '결재중';
    MockData.save('targetCostList', curTc);
    Common.showToast('결재 상신이 완료되었습니다. 목표가 결재 화면으로 이동합니다', 'info');
    m04001_renderAll();
    App.navigate('M07-001');
  };

  /* ── 신규 버전 생성 ── */
  window.m04001_newVersion = function() {
    if (!curTc) { m04001_createFirst(); return; }
    const vers   = getVersions(curProjId);
    const maxVer = vers.length > 0
      ? 'v' + String(parseInt(vers[vers.length - 1].version.slice(1)) + 1).padStart(2, '0')
      : 'v01';

    const newTc = deepCopy(curTc);
    const list  = MockData.getAll('targetCostList');
    newTc.id        = 'TC-' + String(list.length + 1).padStart(3, '0');
    newTc.version   = maxVer;
    newTc.status    = '작성중';
    newTc.createdAt = new Date().toISOString().slice(0, 10);
    newTc.createdBy = '김구매';
    newTc.approvedAt = null;

    MockData.save('targetCostList', newTc);
    curTcId = newTc.id;
    curTc   = newTc;
    Common.showToast(`${maxVer} 버전이 생성되었습니다`, 'success');
    m04001_renderAll();
  };

  /* ── 목표가 최초 생성 ── */
  window.m04001_createFirst = function() {
    const proj = projects.find(p => p.id === curProjId);
    const list = MockData.getAll('targetCostList');
    const newTc = {
      id: 'TC-' + String(list.length + 1).padStart(3, '0'),
      projectId:   curProjId,
      version:     'v01',
      status:      '작성중',
      hmcPrice:    0,
      targetPrice: 0,
      crRate:      0,
      createdAt:   new Date().toISOString().slice(0, 10),
      createdBy:   '김구매',
      approvedAt:  null,
      modules:     [{ name: '모듈1', target: 0, actual: 0, rate: 0 }]
    };
    MockData.save('targetCostList', newTc);
    curTcId = newTc.id;
    curTc   = newTc;
    Common.showToast('v01 목표가가 생성되었습니다. 내용을 입력하고 저장하세요', 'info');
    m04001_renderAll();
  };

  /* ── 초기화 ── */
  m04001_onProjChange(curProjId);
};
