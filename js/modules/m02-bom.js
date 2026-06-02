/* ============================================================
   m02-bom.js — M02-001 프로젝트별 통합 BOM 관리
   화면ID : M02-001
   패턴   : 패턴 5-C (좌 그리드 + 우 폼)
   생성일 : 2026-06-02
   ============================================================ */

window.render_M02_001 = function(container) {
  container.style.padding = '0';

  /* ── 상태 ── */
  let searchText = '';
  let selectedProjectId = null;
  let selectedPartId    = null;
  let activePartTab     = 'basic';
  let bomExpanded       = {};          // { asmId: true/false }
  let viewMode          = 'list';      // 'list' | 'detail'

  /* ── 초기 HTML ── */
  container.innerHTML = `<div class="screen-wrapper" style="display:flex;flex-direction:column;height:100%;padding:0;box-sizing:border-box;">

    <!-- ============================  LIST  ============================ -->
    <div id="m02001-list">

      <!-- 필터바 -->
      <div class="filter-bar" style="padding:10px 16px;">
        <div class="filter-search">
          <input type="text" id="m02001-search" placeholder="Search" oninput="m02001_onSearch(this.value)">
          <i data-lucide="search"></i>
        </div>
        <button class="filter-btn" onclick="Common.showToast('필터 기능은 준비 중입니다','info')"><i data-lucide="filter" class="icon-red"></i> 필터</button>
        <button class="filter-btn" onclick="Common.showToast('상태 필터는 준비 중입니다','info')"><i data-lucide="bar-chart-2" class="icon-blue"></i> 상태</button>
        <div class="filter-date-range">
          <input type="text" value="2024/01/01" readonly>
          <span class="date-separator">~</span>
          <input type="text" value="2027/12/31" readonly>
          <i data-lucide="calendar" class="icon-red"></i>
        </div>
        <div class="filter-right">
          <button class="btn btn-outline-blue" onclick="m02001_showCreate()"><i data-lucide="plus"></i> BOM 생성</button>
        </div>
      </div>

      <!-- 인사이트 카드 -->
      <div id="m02001-cards" class="insight-cards" style="padding:0 16px 10px;"></div>

      <!-- 프로젝트 목록 그리드 -->
      <div id="m02001-grid" style="flex:1;overflow-y:auto;padding:0 16px 16px;"></div>
    </div>

    <!-- ============================  DETAIL  ============================ -->
    <div id="m02001-detail" class="hidden" style="display:flex;flex-direction:column;height:100%;">

      <!-- 상단 헤더 -->
      <div id="m02001-detail-header" style="padding:10px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:16px;flex-shrink:0;">
        <div>
          <div id="m02001-proj-name" style="font-size:16px;font-weight:700;color:var(--text-primary);"></div>
          <div id="m02001-proj-meta" style="font-size:12px;color:var(--text-muted);margin-top:2px;"></div>
        </div>
        <div style="margin-left:auto;display:flex;gap:6px;">
          <button class="btn btn-soft-blue" id="m02001-btn-ebom" onclick="Common.showToast('E-BOM 수신 기능은 준비 중입니다','info')"><i data-lucide="download-cloud"></i> E-BOM 수신</button>
          <button class="btn btn-solid-blue" id="m02001-btn-freeze" onclick="m02001_toggleFreeze()"><i data-lucide="lock"></i> BOM Freeze</button>
          <button class="btn" onclick="m02001_backToList()"><i data-lucide="x"></i> 닫기</button>
        </div>
      </div>

      <!-- VAATZ 배너 -->
      <div id="m02001-vaatz-banner" style="padding:8px 16px;background:#EBF5FF;border-bottom:1px solid #B3D4FC;display:flex;align-items:center;gap:8px;font-size:12px;flex-shrink:0;">
        <i data-lucide="refresh-cw" style="width:14px;height:14px;color:#1746a3;"></i>
        <span id="m02001-vaatz-text">VAATZ E-BOM 최신 수신: 2025-12-04 09:15 · ECN #E2025-0891 변경 Part 3건</span>
        <button class="btn" style="margin-left:auto;height:24px;padding:0 10px;font-size:11px;" onclick="Common.showToast('변경내역 확인 기능은 준비 중입니다','info')">변경내역 확인</button>
      </div>

      <!-- BOM 정보 바 -->
      <div id="m02001-bom-bar" style="padding:8px 16px;background:#f8fafc;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-shrink:0;">
        <select class="form-input form-select" id="m02001-rev-select" style="width:90px;height:28px;font-size:12px;">
          <option value="v04">v04 (최신)</option>
          <option value="v03">v03</option>
          <option value="v02">v02</option>
        </select>
        <button class="btn" style="height:28px;padding:0 10px;font-size:12px;" onclick="Common.showToast('Diff 비교는 준비 중입니다','info')"><i data-lucide="git-compare"></i> Diff 비교</button>
        <div id="m02001-bom-stats" style="margin-left:auto;font-size:12px;color:var(--text-secondary);"></div>
      </div>

      <!-- 본문 좌우 분할 -->
      <div style="display:flex;flex:1;overflow:hidden;">

        <!-- 좌측 BOM 트리 그리드 (60%) -->
        <div style="flex:0 0 60%;border-right:1px solid var(--border);overflow-y:auto;display:flex;flex-direction:column;">
          <table class="grid-table" style="width:100%;">
            <colgroup>
              <col style="width:30px">
              <col style="width:100px">
              <col style="width:160px">
              <col style="width:80px">
              <col style="width:70px">
              <col style="width:90px">
              <col style="width:90px">
              <col style="width:90px">
              <col style="width:80px">
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th class="ss-col-center">Part No.</th>
                <th class="ss-col-left">품명</th>
                <th class="ss-col-center">소재</th>
                <th class="ss-col-right">중량(g)</th>
                <th class="ss-col-right">목표단가</th>
                <th class="ss-col-right">산출단가</th>
                <th class="ss-col-right">확정단가</th>
                <th class="ss-col-center">상태</th>
              </tr>
            </thead>
            <tbody id="m02001-bom-tbody"></tbody>
          </table>
        </div>

        <!-- 우측 Part 상세 패널 (40%) -->
        <div style="flex:0 0 40%;overflow-y:auto;display:flex;flex-direction:column;">
          <div id="m02001-part-empty" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:13px;">
            <i data-lucide="mouse-pointer-click" style="width:32px;height:32px;margin-bottom:8px;"></i>
            좌측 Part를 클릭하면 상세 정보가 표시됩니다
          </div>
          <div id="m02001-part-panel" class="hidden" style="display:flex;flex-direction:column;height:100%;">
            <!-- 탭 헤더 -->
            <div style="display:flex;border-bottom:1px solid var(--border);flex-shrink:0;padding:0 12px;">
              <button class="part-tab-btn active" id="ptab-basic" onclick="m02001_switchPartTab('basic')">기본정보</button>
              <button class="part-tab-btn" id="ptab-cost" onclick="m02001_switchPartTab('cost')">원가상세</button>
              <button class="part-tab-btn" id="ptab-supplier" onclick="m02001_switchPartTab('supplier')">공급사</button>
              <button class="part-tab-btn" id="ptab-history" onclick="m02001_switchPartTab('history')">이력</button>
            </div>
            <!-- 탭 콘텐츠 -->
            <div id="m02001-part-content" style="flex:1;overflow-y:auto;padding:14px 12px;"></div>
          </div>
        </div>

      </div><!-- /본문 좌우 -->
    </div><!-- /detail -->

  </div>`;

  /* ────────── 공통 스타일 (동적 주입) ────────── */
  if (!document.getElementById('m02001-style')) {
    const st = document.createElement('style');
    st.id = 'm02001-style';
    st.textContent = `
      .part-tab-btn {
        padding: 6px 14px;
        font-size: 12px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        color: var(--text-secondary);
        font-family: inherit;
        transition: all 0.15s;
      }
      .part-tab-btn.active {
        color: var(--primary);
        border-bottom-color: var(--primary);
        font-weight: 600;
      }
      .part-tab-btn:hover { color: var(--primary); }
      .bom-asm-row { background: #f8fafc !important; font-weight: 600; }
      .bom-ecn-row { background: #FFFBEB !important; }
      .bom-tree-toggle { cursor: pointer; color: var(--text-secondary); user-select: none; text-align: center; }
      .bom-tree-toggle:hover { color: var(--primary); }
      .cost-bar-wrap { height: 8px; border-radius: 4px; background: #e5e7eb; overflow: hidden; margin-top: 6px; }
      .cost-bar-fill { height: 100%; border-radius: 4px; }
    `;
    document.head.appendChild(st);
  }

  /* ══════════════════════════════════════════════════
     LIST VIEW 함수들
  ══════════════════════════════════════════════════ */

  window.m02001_onSearch = function(val) {
    searchText = val;
    m02001_renderGrid();
  };

  window.m02001_renderCards = function() {
    const bom = MockData.getObject('bom');
    const assemblies = (bom && bom.assemblies) ? bom.assemblies : [];

    let totalParts = 0, fixedParts = 0, unfixedParts = 0, ecnParts = 0;
    assemblies.forEach(asm => {
      (asm.parts || []).forEach(p => {
        totalParts++;
        if (p.fixedPrice != null) fixedParts++;
        else unfixedParts++;
        if (p.ecn) ecnParts++;
      });
    });

    const el = document.getElementById('m02001-cards');
    if (!el) return;
    el.innerHTML = `
      <div class="insight-card">
        <div class="insight-card-icon blue"><i data-lucide="git-branch"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value">${totalParts}</span>
          <span class="insight-card-label">전체 Part</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon green"><i data-lucide="check-circle"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="color:var(--success);">${fixedParts}</span>
          <span class="insight-card-label">단가 확정</span>
        </div>
      </div>
      <div class="insight-card" style="border-color:var(--danger-border);">
        <div class="insight-card-icon red"><i data-lucide="alert-circle"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="color:var(--danger);">${unfixedParts}</span>
          <span class="insight-card-label">단가 미확정</span>
        </div>
      </div>
      <div class="insight-card" style="border-color:#FDE68A;">
        <div class="insight-card-icon amber"><i data-lucide="history"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="color:#F59E0B;">${ecnParts}</span>
          <span class="insight-card-label">ECN 변경</span>
        </div>
      </div>
    `;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  window.m02001_renderGrid = function() {
    let data = MockData.getAll('projects');
    if (searchText) {
      const q = searchText.toLowerCase();
      data = data.filter(p =>
        (p.name||'').toLowerCase().includes(q) ||
        (p.id||'').toLowerCase().includes(q) ||
        (p.oem||'').toLowerCase().includes(q) ||
        (p.model||'').toLowerCase().includes(q)
      );
    }

    const bom = MockData.getObject('bom');
    const phaseColor = { P1:'#185FA5', P2:'#0F6E56', P3:'#854F0B', P4:'#A32D2D', 'SOP완료':'#97A0AF' };
    const bomStatusStyle = {
      '작성중': `color:var(--primary);`,
      'Freeze': `color:var(--success);font-weight:600;`,
      '미작성':  `color:var(--text-muted);`
    };

    const bomRev = (bom && bom.rev) ? bom.rev : '-';

    let rows = data.map(p => {
      const sel    = p.id === selectedProjectId ? 'selected' : '';
      const pc     = phaseColor[p.phase] || 'inherit';
      const bstyle = bomStatusStyle[p.bomStatus] || '';
      const isBomProject = bom && bom.projectId === p.id;

      return `<tr class="${sel}" onclick="m02001_openDetail('${p.id}')" style="cursor:pointer;">
        <td class="center"><input type="checkbox" ${p.id === selectedProjectId ? 'checked' : ''} onclick="event.stopPropagation()"></td>
        <td class="center" style="color:var(--primary);text-decoration:underline;cursor:pointer;">${p.id}</td>
        <td class="left">${p.name}</td>
        <td class="center">${p.oem}</td>
        <td class="center">${p.model||'-'}</td>
        <td class="center">${p.platform||'-'}</td>
        <td class="center" style="color:${pc};font-weight:600;">${p.phase}</td>
        <td class="center">${p.sopDate||'-'}</td>
        <td class="center">${isBomProject ? bomRev : '-'}</td>
        <td class="center" style="${bstyle}">${p.bomStatus}</td>
      </tr>`;
    }).join('');

    const el = document.getElementById('m02001-grid');
    if (!el) return;
    el.innerHTML = `
      <div class="grid-container">
        <table class="grid-table">
          <colgroup>
            <col style="width:40px"><col style="width:110px"><col style="width:180px">
            <col style="width:70px"><col style="width:80px"><col style="width:100px">
            <col style="width:80px"><col style="width:100px"><col style="width:75px">
            <col style="width:85px">
          </colgroup>
          <thead><tr>
            <th><input type="checkbox"></th>
            <th>프로젝트ID</th><th>프로젝트명</th><th>OEM</th>
            <th>차종</th><th>플랫폼</th><th>진행Phase</th>
            <th>SOP목표일</th><th>BOM Rev</th><th>BOM상태</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  /* ── BOM 생성 모달 ── */
  window.m02001_showCreate = function() {
    const projects = MockData.getAll('projects');
    const bom      = MockData.getObject('bom');
    const bomProjId = bom && bom.projectId ? bom.projectId : null;

    const projOpts = projects.map(p => {
      const hasBom = p.id === bomProjId ? ' (BOM 있음)' : '';
      return `<option value="${p.id}">${p.name}${hasBom}</option>`;
    }).join('');

    const copyOpts = projects.map(p =>
      `<option value="${p.id}">${p.name}</option>`
    ).join('');

    const formHtml = `
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="form-field">
          <label class="form-label">프로젝트 <span class="required">*</span></label>
          <select class="form-input form-select form-input-m" id="bom-create-project">
            <option value="">-- 프로젝트 선택 --</option>
            ${projOpts}
          </select>
        </div>
        <div class="form-field">
          <label class="form-label">BOM Rev</label>
          <input class="form-input form-input-m" id="bom-create-rev" value="v01" placeholder="예: v01">
        </div>
        <div class="form-field">
          <label class="form-label">생성 방식</label>
          <select class="form-input form-select form-input-m" id="bom-create-type">
            <option value="new">신규 빈 BOM</option>
            <option value="vaatz">VAATZ E-BOM 수신</option>
            <option value="copy">기존 프로젝트 복사</option>
          </select>
        </div>
        <div class="form-field">
          <label class="form-label">복사 원본 프로젝트</label>
          <select class="form-input form-select form-input-m" id="bom-create-copy">
            <option value="">-- 선택 --</option>
            ${copyOpts}
          </select>
        </div>
        <div class="form-field">
          <label class="form-label">진행 Phase</label>
          <select class="form-input form-select form-input-m" id="bom-create-phase">
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
          </select>
        </div>
      </div>`;

    Common.openModal(
      '신규 BOM 생성',
      formHtml,
      [
        { label: '생성', class: 'btn-solid-blue', onclick: 'm02001_createBom()' },
        { label: '취소', class: '',               onclick: 'Common.closeModal()' }
      ]
    );
  };

  window.m02001_createBom = function() {
    const projectId = (document.getElementById('bom-create-project') || {}).value;
    const rev       = ((document.getElementById('bom-create-rev')     || {}).value || 'v01').trim();
    const phase     = (document.getElementById('bom-create-phase')    || {}).value || 'P1';

    if (!projectId) {
      Common.showToast('프로젝트를 선택해주세요', 'info');
      return;
    }

    const projects = MockData.getAll('projects');
    const proj     = projects.find(p => p.id === projectId);
    if (!proj) return;

    proj.bomStatus = '작성중';
    proj.phase     = phase;
    MockData.save('projects', proj);

    Common.closeModal();
    Common.showToast('BOM이 생성되었습니다', 'success');
    m02001_renderGrid();
    m02001_renderCards();
    m02001_openDetail(projectId);
  };

  /* ══════════════════════════════════════════════════
     DETAIL VIEW 함수들
  ══════════════════════════════════════════════════ */

  window.m02001_openDetail = function(projectId) {
    selectedProjectId = projectId;
    selectedPartId    = null;
    bomExpanded       = {};

    const projects = MockData.getAll('projects');
    const proj     = projects.find(p => p.id === projectId);
    if (!proj) return;

    /* 헤더 */
    document.getElementById('m02001-proj-name').textContent = proj.name;
    document.getElementById('m02001-proj-meta').textContent =
      `${proj.oem} · ${proj.model} · ${proj.platform} · SOP ${proj.sopDate}`;

    /* Freeze 상태 복원 */
    const isFrozen = proj.bomStatus === 'Freeze';
    m02001_applyFreezeUI(isFrozen);

    /* 화면 전환 */
    document.getElementById('m02001-list').classList.add('hidden');
    const detailEl = document.getElementById('m02001-detail');
    detailEl.classList.remove('hidden');
    detailEl.style.display = 'flex';

    viewMode = 'detail';

    m02001_renderBomStats();
    m02001_renderBomTree();
    m02001_showPartEmpty();
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  window.m02001_backToList = function() {
    const detailEl = document.getElementById('m02001-detail');
    detailEl.classList.add('hidden');
    detailEl.style.display = 'none';
    document.getElementById('m02001-list').classList.remove('hidden');
    viewMode = 'list';
    m02001_renderGrid();
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  window.m02001_renderBomStats = function() {
    const bom = MockData.getObject('bom');
    const assemblies = (bom && bom.assemblies) ? bom.assemblies : [];
    let total = 0, fixed = 0, unfixed = 0;
    assemblies.forEach(asm => {
      (asm.parts || []).forEach(p => {
        total++;
        if (p.fixedPrice != null) fixed++;
        else unfixed++;
      });
    });
    const el = document.getElementById('m02001-bom-stats');
    if (el) {
      el.innerHTML = `총 <b>${total}</b>개 Part &nbsp;·&nbsp; 확정 <b style="color:var(--success);">${fixed}</b>건 &nbsp;·&nbsp; 미확정 <b style="color:var(--danger);">${unfixed}</b>건`;
    }
  };

  window.m02001_renderBomTree = function() {
    const bom        = MockData.getObject('bom');
    const assemblies = (bom && bom.assemblies) ? bom.assemblies : [];
    const tbody      = document.getElementById('m02001-bom-tbody');
    if (!tbody) return;

    const statusStyle = {
      '확정':  'color:var(--success);',
      'Gap초과':'color:var(--danger);font-weight:600;',
      '검토중': 'color:#F59E0B;',
      'RFQ중':  'color:var(--primary);',
      '미확정': 'color:var(--text-muted);'
    };

    const fmt = (n) => n != null ? '₩' + Number(n).toLocaleString() : '-';

    let rows = '';
    assemblies.forEach(asm => {
      const expanded = bomExpanded[asm.id] !== false; // 기본 펼침
      const toggleIcon = expanded ? '▼' : '▶';
      const selAsm = selectedPartId === asm.id ? 'selected' : '';
      rows += `<tr class="bom-asm-row ${selAsm}" onclick="m02001_selectPart('${asm.id}','asm')" style="cursor:pointer;">
        <td class="bom-tree-toggle" onclick="event.stopPropagation();m02001_toggleAsm('${asm.id}')" id="toggle-${asm.id}">${toggleIcon}</td>
        <td class="ss-col-center">${asm.id}</td>
        <td class="ss-col-left">${asm.name}</td>
        <td class="ss-col-center">-</td>
        <td class="ss-col-right">${Number(asm.weight).toLocaleString()}</td>
        <td class="ss-col-right">${fmt(asm.targetPrice)}</td>
        <td class="ss-col-right">${fmt(asm.calcPrice)}</td>
        <td class="ss-col-right">${asm.fixedPrice != null ? fmt(asm.fixedPrice) : '-'}</td>
        <td class="ss-col-center" style="${statusStyle[asm.status]||''}">${asm.status}</td>
      </tr>`;

      if (expanded) {
        (asm.parts || []).forEach(p => {
          const ecnClass = p.ecn ? 'bom-ecn-row' : '';
          const selPart  = selectedPartId === p.partNo ? 'selected' : '';
          rows += `<tr class="${ecnClass} ${selPart}" onclick="m02001_selectPart('${p.partNo}','part')" style="cursor:pointer;">
            <td></td>
            <td class="ss-col-center" style="padding-left:24px;">${p.partNo}</td>
            <td class="ss-col-left" style="padding-left:24px;">${p.name}</td>
            <td class="ss-col-center">${p.material}</td>
            <td class="ss-col-right">${Number(p.weight).toLocaleString()}</td>
            <td class="ss-col-right">${fmt(p.targetPrice)}</td>
            <td class="ss-col-right">${fmt(p.calcPrice)}</td>
            <td class="ss-col-right">${p.fixedPrice != null ? fmt(p.fixedPrice) : '-'}</td>
            <td class="ss-col-center" style="${statusStyle[p.status]||''}">${p.status}</td>
          </tr>`;
        });
      }
    });

    tbody.innerHTML = rows;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  window.m02001_toggleAsm = function(asmId) {
    bomExpanded[asmId] = (bomExpanded[asmId] === false) ? true : false;
    m02001_renderBomTree();
  };

  window.m02001_selectPart = function(id, type) {
    selectedPartId = id;
    m02001_renderBomTree();

    if (type === 'asm') {
      m02001_showPartEmpty();
      return;
    }

    /* Part 찾기 */
    const bom  = MockData.getObject('bom');
    let part   = null;
    let asmRef = null;
    (bom.assemblies || []).forEach(asm => {
      (asm.parts || []).forEach(p => {
        if (p.partNo === id) { part = p; asmRef = asm; }
      });
    });
    if (!part) return;

    document.getElementById('m02001-part-empty').style.display = 'none';
    const panel = document.getElementById('m02001-part-panel');
    panel.classList.remove('hidden');
    panel.style.display = 'flex';

    m02001_renderPartTab(part, asmRef);
  };

  window.m02001_showPartEmpty = function() {
    document.getElementById('m02001-part-empty').style.display = 'flex';
    const panel = document.getElementById('m02001-part-panel');
    panel.classList.add('hidden');
    panel.style.display = 'none';
  };

  window.m02001_switchPartTab = function(tab) {
    activePartTab = tab;
    ['basic','cost','supplier','history'].forEach(t => {
      const btn = document.getElementById('ptab-' + t);
      if (btn) btn.classList.toggle('active', t === tab);
    });
    /* 현재 선택된 Part 다시 렌더 */
    const bom = MockData.getObject('bom');
    let part = null, asmRef = null;
    (bom.assemblies || []).forEach(asm => {
      (asm.parts || []).forEach(p => {
        if (p.partNo === selectedPartId) { part = p; asmRef = asm; }
      });
    });
    if (part) m02001_renderPartTab(part, asmRef);
  };

  window.m02001_renderPartTab = function(part, asm) {
    const el = document.getElementById('m02001-part-content');
    if (!el) return;

    const fmt = (n) => n != null ? '₩' + Number(n).toLocaleString() : '-';

    if (activePartTab === 'basic') {
      const matCost   = Math.round(part.calcPrice * 0.55);
      const procCost  = Math.round(part.calcPrice * 0.28);
      const indirCost = part.calcPrice - matCost - procCost;
      el.innerHTML = `
        <div class="section-box">
          <div class="form-grid-2col">
            <div class="form-field">
              <label class="form-label">Part No.</label>
              <input class="form-input form-input-s" value="${part.partNo}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">품명</label>
              <input class="form-input form-input-s" value="${part.name}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">소재</label>
              <input class="form-input form-input-s" value="${part.material}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">중량(g)</label>
              <input class="form-input form-input-s" value="${Number(part.weight).toLocaleString()}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">도면번호</label>
              <input class="form-input form-input-s" value="${part.itemId || '-'}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">어셈블리</label>
              <input class="form-input form-input-s" value="${asm ? asm.name : '-'}" readonly>
            </div>
          </div>
        </div>
        <div class="section-box" style="margin-top:12px;">
          <div class="section-title" style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">원가 구성</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12px;">
                <span>재료비</span><span style="color:var(--primary);font-weight:600;">55% · ${fmt(matCost)}</span>
              </div>
              <div class="cost-bar-wrap"><div class="cost-bar-fill" style="width:55%;background:var(--primary);"></div></div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12px;">
                <span>가공비</span><span style="color:var(--success);font-weight:600;">28% · ${fmt(procCost)}</span>
              </div>
              <div class="cost-bar-wrap"><div class="cost-bar-fill" style="width:28%;background:var(--success);"></div></div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12px;">
                <span>간접비</span><span style="color:#F59E0B;font-weight:600;">17% · ${fmt(indirCost)}</span>
              </div>
              <div class="cost-bar-wrap"><div class="cost-bar-fill" style="width:17%;background:#F59E0B;"></div></div>
            </div>
          </div>
        </div>`;

    } else if (activePartTab === 'cost') {
      const matCost   = Math.round(part.calcPrice * 0.55);
      const procCost  = Math.round(part.calcPrice * 0.28);
      const indirCost = Math.round(part.calcPrice * 0.12);
      const logCost   = part.calcPrice - matCost - procCost - indirCost;
      const gap       = part.calcPrice - part.targetPrice;
      const gapRate   = part.targetPrice ? ((gap / part.targetPrice) * 100).toFixed(1) : 0;
      const gapHtml   = gap > 0
        ? `<span style="color:var(--danger);font-weight:600;">▲ ${fmt(gap)} (${gapRate}% 초과)</span>`
        : `<span style="color:var(--success);font-weight:600;">▼ ${fmt(Math.abs(gap))} (${Math.abs(gapRate)}% 절감)</span>`;

      el.innerHTML = `
        <div class="section-box">
          <div class="form-grid-2col">
            <div class="form-field">
              <label class="form-label">재료비</label>
              <input class="form-input form-input-s" value="${fmt(matCost)}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">가공비</label>
              <input class="form-input form-input-s" value="${fmt(procCost)}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">간접비</label>
              <input class="form-input form-input-s" value="${fmt(indirCost)}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">물류비</label>
              <input class="form-input form-input-s" value="${fmt(logCost)}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">산출단가</label>
              <input class="form-input form-input-s" value="${fmt(part.calcPrice)}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">목표단가</label>
              <input class="form-input form-input-s" value="${fmt(part.targetPrice)}" readonly>
            </div>
          </div>
          <div style="margin-top:12px;padding:10px;background:var(--bg-page);border-radius:4px;font-size:13px;">
            <span style="color:var(--text-muted);">Gap: </span>${gapHtml}
          </div>
        </div>`;

    } else if (activePartTab === 'supplier') {
      const suppliers = MockData.getAll('suppliers');
      const sup = part.supplierId ? suppliers.find(s => s.id === part.supplierId) : null;

      el.innerHTML = sup ? `
        <div class="section-box">
          <div class="form-grid-2col">
            <div class="form-field">
              <label class="form-label">공급사코드</label>
              <input class="form-input form-input-s" value="${sup.code}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">공급사명</label>
              <input class="form-input form-input-s" value="${sup.name}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">평가등급</label>
              <input class="form-input form-input-s" value="${sup.grade}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">선정일</label>
              <input class="form-input form-input-s" value="2025-12-03" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">담당자</label>
              <input class="form-input form-input-s" value="${sup.manager||'-'}" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">연락처</label>
              <input class="form-input form-input-s" value="02-1234-5678" readonly>
            </div>
          </div>
        </div>` : `
        <div class="section-box" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:120px;gap:10px;">
          <i data-lucide="user-x" style="width:28px;height:28px;color:var(--text-muted);"></i>
          <span style="color:var(--text-muted);font-size:13px;">공급사 미선정</span>
          <button class="btn btn-outline-blue" onclick="Common.showToast('RFQ 발송 기능은 준비 중입니다','info')"><i data-lucide="send"></i> RFQ 발송</button>
        </div>`;

    } else if (activePartTab === 'history') {
      const rows = [
        { round:'1차', date:'2025-10-01', calc:9618, target:9800, gap:-182, note:'초기산출' },
        { round:'2차', date:'2025-11-10', calc:9273, target:9800, gap:-527, note:'LME갱신' },
        { round:'3차', date:'2025-12-05', calc:8963, target:9800, gap:-837, note:'협상후' }
      ];
      const rrows = rows.map(r => `
        <tr>
          <td class="ss-col-center">${r.round}</td>
          <td class="ss-col-center">${r.date}</td>
          <td class="ss-col-right">₩${r.calc.toLocaleString()}</td>
          <td class="ss-col-right">₩${r.target.toLocaleString()}</td>
          <td class="ss-col-right" style="color:${r.gap <= 0 ? 'var(--success)' : 'var(--danger)'};">
            ${r.gap <= 0 ? '▼' : '▲'}₩${Math.abs(r.gap).toLocaleString()}
          </td>
          <td class="ss-col-left">${r.note}</td>
        </tr>`).join('');

      el.innerHTML = `
        <div class="section-box">
          <div class="grid-container">
            <table class="grid-table">
              <colgroup>
                <col style="width:48px"><col style="width:90px">
                <col style="width:80px"><col style="width:80px">
                <col style="width:80px"><col>
              </colgroup>
              <thead><tr>
                <th>Round</th><th>일자</th><th class="right">산출단가</th>
                <th class="right">목표단가</th><th class="right">Gap</th><th>비고</th>
              </tr></thead>
              <tbody>${rrows}</tbody>
            </table>
          </div>
        </div>`;
    }

    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  /* ────────── BOM Freeze ────────── */
  window.m02001_toggleFreeze = function() {
    const projects = MockData.getAll('projects');
    const proj = projects.find(p => p.id === selectedProjectId);
    if (!proj) return;

    const isFrozen = proj.bomStatus === 'Freeze';

    if (!isFrozen) {
      if (!confirm('BOM을 Freeze하시겠습니까? 이후 변경은 결재가 필요합니다')) return;
      proj.bomStatus = 'Freeze';
      MockData.save('projects', proj);
      m02001_applyFreezeUI(true);
      Common.showToast('BOM이 Freeze되었습니다. 변경 시 결재가 필요합니다', 'success');
    } else {
      if (!confirm('BOM Freeze를 해제하시겠습니까?')) return;
      proj.bomStatus = '작성중';
      MockData.save('projects', proj);
      m02001_applyFreezeUI(false);
      Common.showToast('BOM Freeze가 해제되었습니다', 'info');
    }
  };

  window.m02001_applyFreezeUI = function(isFrozen) {
    const btnFreeze = document.getElementById('m02001-btn-freeze');
    const btnEbom   = document.getElementById('m02001-btn-ebom');
    const vaatzText = document.getElementById('m02001-vaatz-text');

    if (isFrozen) {
      if (btnFreeze) {
        btnFreeze.innerHTML = '<i data-lucide="lock"></i> 🔒 Freeze 해제';
        btnFreeze.style.background = '#f0fdf4';
        btnFreeze.style.color      = 'var(--success)';
        btnFreeze.style.borderColor = 'var(--success)';
      }
      if (btnEbom) btnEbom.disabled = true;
      if (vaatzText) {
        vaatzText.textContent = '[FREEZE] VAATZ E-BOM 최신 수신: 2025-12-04 09:15 · ECN #E2025-0891 변경 Part 3건';
      }
    } else {
      if (btnFreeze) {
        btnFreeze.innerHTML = '<i data-lucide="lock"></i> BOM Freeze';
        btnFreeze.style.background = '';
        btnFreeze.style.color      = '';
        btnFreeze.style.borderColor = '';
      }
      if (btnEbom) btnEbom.disabled = false;
      if (vaatzText) {
        vaatzText.textContent = 'VAATZ E-BOM 최신 수신: 2025-12-04 09:15 · ECN #E2025-0891 변경 Part 3건';
      }
    }
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  /* ────────── 초기 렌더 ────────── */
  m02001_renderCards();
  m02001_renderGrid();
  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
};

/* ============================================================
   M02-002  Part List 관리
   화면ID : M02-002
   패턴   : 패턴 5-C (좌 그리드 + 우 폼)
   생성일 : 2026-06-02
   ============================================================ */

function checkPartListProgress(part) {
  part = part || {};
  const steps = [
    {
      label: '기본정보',
      desc:  'Part No.·품명·프로젝트',
      check: !!(part.partNo && part.partName && part.projectId)
    },
    {
      label: '물성·규격',
      desc:  '소재·중량 정보',
      check: !!(part.material && part.weight && part.weight > 0)
    },
    {
      label: '원가정보',
      desc:  '재료비·가공비 산출',
      check: !!(part.materialCost > 0 && part.processCost > 0)
    },
    {
      label: '공급사 연결',
      desc:  '공급사 지정 완료',
      check: !!(part.supplierId)
    }
  ];
  const doneCount = steps.filter(s => s.check).length;
  const rate = Math.round((doneCount / 4) * 100);
  return { steps, doneCount, rate };
}

window.render_M02_002 = function(container) {
  container.style.padding = '0';

  /* partList 미초기화 시 시드 투입 */
  if (MockData.getAll('partList').length === 0) {
    localStorage.setItem('dh_partList', JSON.stringify(MockData.seed.partList));
  }

  /* ── 상태 ── */
  let searchText   = '';
  let statusFilter = '';
  let selectedId   = null;
  const STATUS_CYCLE = ['', '확정', 'Gap초과', '검토중', 'RFQ중', '미확정'];
  let statusIdx = 0;

  /* ── 레이아웃 HTML ── */
  container.innerHTML = `<div class="screen-wrapper" style="display:flex;flex-direction:column;height:100%;padding:0;">

    <!-- 필터바 -->
    <div class="filter-bar" style="padding:10px 16px 0;">
      <div class="filter-search">
        <input type="text" id="m02002-search" placeholder="Search" oninput="m02002_onSearch(this.value)">
        <i data-lucide="search"></i>
      </div>
      <button class="filter-btn" onclick="Common.showToast('필터 기능은 준비 중입니다','info')"><i data-lucide="filter" class="icon-red"></i> 필터</button>
      <button class="filter-btn" id="m02002-status-btn" onclick="m02002_cycleStatus()"><i data-lucide="bar-chart-2" class="icon-blue"></i> <span id="m02002-status-label">상태</span></button>
      <div class="filter-date-range">
        <input type="text" value="2024/01/01" readonly>
        <span class="date-separator">~</span>
        <input type="text" value="2027/12/31" readonly>
        <i data-lucide="calendar" class="icon-red"></i>
      </div>
      <div class="filter-right">
        <button class="btn btn-outline-blue" onclick="m02002_showForm('new')"><i data-lucide="plus"></i> 신규등록</button>
        <button class="btn" onclick="m02002_showForm('edit')"><i data-lucide="pencil"></i> 수정</button>
        <button class="btn btn-outline-red" onclick="m02002_delete()"><i data-lucide="trash-2"></i> 삭제</button>
      </div>
    </div>

    <!-- 인사이트 카드 -->
    <div id="m02002-cards" class="insight-cards" style="padding:10px 16px;"></div>

    <!-- 본문 좌우 분할 -->
    <div style="display:flex;flex:1;overflow:hidden;">

      <!-- 좌: 그리드 (60%) -->
      <div style="flex:0 0 60%;overflow-y:auto;border-right:1px solid var(--border);">
        <div id="m02002-grid" style="padding:0 16px 16px;"></div>
      </div>

      <!-- 우: 상세 패널 (40%) -->
      <div style="flex:0 0 40%;overflow-y:auto;display:flex;flex-direction:column;">
        <div id="m02002-detail-empty" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:13px;">
          <i data-lucide="mouse-pointer-click" style="width:32px;height:32px;margin-bottom:8px;"></i>
          좌측 Part를 선택하면 상세 정보가 표시됩니다
        </div>
        <div id="m02002-detail-panel" style="display:none;flex-direction:column;padding:14px 16px;gap:12px;"></div>
      </div>

    </div>
  </div>`;

  /* ══════════════════════════════════════════════════
     헬퍼 함수들
  ══════════════════════════════════════════════════ */

  const statusStyle = {
    '확정':   'color:var(--success);font-weight:600;',
    'Gap초과': 'color:var(--danger);font-weight:600;',
    '검토중':  'color:#F59E0B;font-weight:600;',
    'RFQ중':   'color:var(--primary);font-weight:600;',
    '미확정':  'color:var(--text-muted);'
  };

  window.m02002_onSearch = function(val) {
    searchText = val;
    m02002_renderGrid();
  };

  window.m02002_cycleStatus = function() {
    statusIdx = (statusIdx + 1) % STATUS_CYCLE.length;
    statusFilter = STATUS_CYCLE[statusIdx];
    const label = document.getElementById('m02002-status-label');
    if (label) label.textContent = statusFilter || '상태';
    m02002_renderGrid();
  };

  window.m02002_renderCards = function() {
    const parts = MockData.getAll('partList');
    const total      = parts.length;
    const withCost   = parts.filter(p => p.materialCost > 0 && p.processCost > 0).length;
    const noSupplier = parts.filter(p => !p.supplierId).length;
    const totalCost  = parts.reduce((s, p) => s + (p.calcPrice || 0), 0);

    const el = document.getElementById('m02002-cards');
    if (!el) return;
    el.innerHTML = `
      <div class="insight-card">
        <div class="insight-card-icon blue"><i data-lucide="list"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value">${total}</span>
          <span class="insight-card-label">전체 Part</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon green"><i data-lucide="check-circle"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value">${withCost}</span>
          <span class="insight-card-label">원가 산정 완료</span>
        </div>
      </div>
      <div class="insight-card" style="border-color:var(--danger-border);">
        <div class="insight-card-icon red"><i data-lucide="unlink"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="color:var(--danger);">${noSupplier}</span>
          <span class="insight-card-label">공급사 미연결</span>
        </div>
      </div>
      <div class="insight-card" style="border-color:#FDE68A;">
        <div class="insight-card-icon amber"><i data-lucide="dollar-sign"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value" style="font-size:14px;">${CalcEngine.formatCurrency(totalCost)}</span>
          <span class="insight-card-label">총 예상원가</span>
        </div>
      </div>
    `;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  window.m02002_renderGrid = function() {
    let data = MockData.getAll('partList');

    if (searchText) {
      const q = searchText.toLowerCase();
      data = data.filter(p =>
        (p.partNo   || '').toLowerCase().includes(q) ||
        (p.partName || '').toLowerCase().includes(q) ||
        (p.material || '').toLowerCase().includes(q) ||
        (p.supplierName || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      data = data.filter(p => p.bomStatus === statusFilter);
    }

    const projects = MockData.getAll('projects');
    const projName = (id) => { const p = projects.find(x => x.id === id); return p ? p.name : id; };

    const rows = data.map(p => {
      const sel      = p.id === selectedId ? 'selected' : '';
      const calcDisp = CalcEngine.formatCurrency(p.materialCost + p.processCost);
      const supDisp  = p.supplierName || '<span style="color:var(--text-muted);">미연결</span>';
      const stStyle  = statusStyle[p.bomStatus] || '';
      const ecnIcon  = p.ecn ? ' <i data-lucide="git-branch" style="width:12px;height:12px;color:#F59E0B;vertical-align:middle;"></i>' : '';

      return `<tr class="${sel}" onclick="m02002_selectRow('${p.id}')" style="cursor:pointer;">
        <td class="center"><input type="checkbox" ${p.id === selectedId ? 'checked' : ''} onclick="event.stopPropagation();m02002_selectRow('${p.id}')"></td>
        <td class="center"><span class="code-link">${p.partNo}</span>${ecnIcon}</td>
        <td class="left">${p.partName}</td>
        <td class="center" style="color:var(--text-secondary);font-size:11px;">${projName(p.projectId)}</td>
        <td class="center">${p.material}</td>
        <td class="right">${CalcEngine.formatNumber(p.weight)}</td>
        <td class="right">${CalcEngine.formatCurrency(p.materialCost)}</td>
        <td class="right">${CalcEngine.formatCurrency(p.processCost)}</td>
        <td class="right" style="font-weight:600;">${calcDisp}</td>
        <td class="left">${supDisp}</td>
        <td class="center" style="${stStyle}">${p.bomStatus}</td>
      </tr>`;
    }).join('');

    const el = document.getElementById('m02002-grid');
    if (!el) return;
    el.innerHTML = `
      <div class="grid-container">
        <table class="grid-table">
          <colgroup>
            <col style="width:40px"><col style="width:100px"><col style="width:150px">
            <col style="width:110px"><col style="width:80px"><col style="width:70px">
            <col style="width:80px"><col style="width:80px"><col style="width:90px">
            <col style="width:120px"><col style="width:80px">
          </colgroup>
          <thead><tr>
            <th><input type="checkbox"></th>
            <th>Part No.</th><th>품명</th><th>적용 프로젝트</th>
            <th>소재</th><th class="right">중량(g)</th>
            <th class="right">재료비</th><th class="right">가공비</th>
            <th class="right">산출단가</th>
            <th>공급사</th><th>상태</th>
          </tr></thead>
          <tbody>${rows || '<tr><td colspan="11" style="text-align:center;padding:24px;color:var(--text-muted);">조회된 Part가 없습니다</td></tr>'}</tbody>
        </table>
      </div>`;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  window.m02002_selectRow = function(id) {
    selectedId = id;
    m02002_renderGrid();

    const parts = MockData.getAll('partList');
    const part  = parts.find(p => p.id === id);
    if (!part) return;

    document.getElementById('m02002-detail-empty').style.display = 'none';
    const panel = document.getElementById('m02002-detail-panel');
    panel.style.display = 'flex';

    m02002_renderDetail(part);
  };

  window.m02002_renderDetail = function(part) {
    const panel    = document.getElementById('m02002-detail-panel');
    if (!panel) return;

    const suppliers = MockData.getAll('suppliers');
    const projects  = MockData.getAll('projects');
    const proj      = projects.find(x => x.id === part.projectId);
    const gap       = CalcEngine.calcGap(part.targetPrice, part.calcPrice);
    const gapRate   = CalcEngine.calcGapRate(part.targetPrice, part.calcPrice);
    const gapHtml   = gap > 0
      ? `<span style="color:var(--danger);font-weight:600;">▲ ${CalcEngine.formatCurrency(gap)} (${gapRate}% 초과)</span>`
      : `<span style="color:var(--success);font-weight:600;">▼ ${CalcEngine.formatCurrency(Math.abs(gap))} (${Math.abs(gapRate)}% 절감)</span>`;

    /* 공급사 다중 목록 */
    const supList = (part.suppliers || []).map(sid => {
      const s = suppliers.find(x => x.id === sid);
      if (!s) return '';
      const isFinal = sid === part.supplierId;
      return `<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:${isFinal ? '#f0fdf4' : 'var(--bg-page)'};border-radius:4px;margin-bottom:4px;border:1px solid ${isFinal ? '#bbf7d0' : 'var(--border)'};">
        <i data-lucide="${isFinal ? 'check-circle' : 'circle'}" style="width:14px;height:14px;color:${isFinal ? 'var(--success)' : 'var(--text-muted)'};"></i>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:${isFinal ? '600' : '400'};color:var(--text-primary);">${s.name}</div>
          <div style="font-size:11px;color:var(--text-muted);">${s.code} · 등급 ${s.grade}</div>
        </div>
        ${isFinal ? '<span style="font-size:11px;color:var(--success);font-weight:600;">선정</span>' : ''}
      </div>`;
    }).join('');

    panel.innerHTML = `
      <!-- Part 헤더 -->
      <div style="padding-bottom:12px;border-bottom:1px solid var(--border);">
        <div style="font-size:15px;font-weight:700;color:var(--text-primary);">${part.partName}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${part.partNo} · ${proj ? proj.name : part.projectId}</div>
      </div>

      <!-- 데이터 완료율 프로그레스 -->
      ${renderProgress(checkPartListProgress(part), 'Part 완성도')}

      <!-- 기본정보 섹션 -->
      <div class="section-box">
        <div class="section-box-title">기본정보</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 14px;">
          <div class="form-field">
            <label class="form-label">Part No.</label>
            <input class="form-input" value="${part.partNo}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">품명</label>
            <input class="form-input" value="${part.partName}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">소재</label>
            <input class="form-input" value="${part.material}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">중량(g)</label>
            <input class="form-input" value="${CalcEngine.formatNumber(part.weight)}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">재료비</label>
            <input class="form-input" value="${CalcEngine.formatCurrency(part.materialCost)}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">가공비</label>
            <input class="form-input" value="${CalcEngine.formatCurrency(part.processCost)}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">산출단가</label>
            <input class="form-input" value="${CalcEngine.formatCurrency(part.calcPrice)}" readonly style="font-weight:600;">
          </div>
          <div class="form-field">
            <label class="form-label">목표단가</label>
            <input class="form-input" value="${CalcEngine.formatCurrency(part.targetPrice)}" readonly>
          </div>
        </div>
        <div style="margin-top:10px;padding:10px;background:var(--bg-page);border-radius:4px;font-size:13px;">
          <span style="color:var(--text-muted);">Gap: </span>${gapHtml}
        </div>
      </div>

      <!-- 공급사 섹션 -->
      <div class="section-box">
        <div class="section-box-title">공급사</div>
        ${supList || `<div style="display:flex;flex-direction:column;align-items:center;padding:20px;color:var(--text-muted);gap:8px;font-size:13px;">
          <i data-lucide="unlink" style="width:24px;height:24px;"></i>
          공급사 미연결
          <button class="btn btn-outline-blue" style="margin-top:4px;" onclick="Common.showToast('RFQ 발송 기능은 준비 중입니다','info')"><i data-lucide="send"></i> RFQ 발송</button>
        </div>`}
      </div>
    `;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  /* ── 신규 / 수정 모달 ── */
  window.m02002_showForm = function(mode) {
    if (mode === 'edit' && !selectedId) {
      Common.showToast('수정할 Part를 선택해주세요', 'info'); return;
    }
    const parts    = MockData.getAll('partList');
    const projects = MockData.getAll('projects');
    const suppliers = MockData.getAll('suppliers');
    const part  = mode === 'edit' ? (parts.find(p => p.id === selectedId) || {}) : {};

    const projOpts = projects.map(p =>
      `<option value="${p.id}" ${part.projectId === p.id ? 'selected' : ''}>${p.name}</option>`
    ).join('');
    const supOpts = [
      `<option value="">-- 미선정 --</option>`,
      ...suppliers.map(s =>
        `<option value="${s.id}" ${part.supplierId === s.id ? 'selected' : ''}>${s.name}</option>`)
    ].join('');
    const statusOpts = ['미확정','검토중','RFQ중','Gap초과','확정'].map(s =>
      `<option value="${s}" ${part.bomStatus === s ? 'selected' : ''}>${s}</option>`
    ).join('');

    const formHtml = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 14px;">
        <div class="form-field">
          <label class="form-label">Part No. <span class="required">*</span></label>
          <input class="form-input" id="mf-partno" value="${part.partNo||''}" placeholder="P-XXXX">
        </div>
        <div class="form-field">
          <label class="form-label">품명 <span class="required">*</span></label>
          <input class="form-input" id="mf-partname" value="${part.partName||''}" placeholder="품명 입력">
        </div>
        <div class="form-field">
          <label class="form-label">적용 프로젝트 <span class="required">*</span></label>
          <select class="form-input form-select" id="mf-project">${projOpts}</select>
        </div>
        <div class="form-field">
          <label class="form-label">소재 <span class="required">*</span></label>
          <input class="form-input" id="mf-material" value="${part.material||''}" placeholder="예: SPFC440">
        </div>
        <div class="form-field">
          <label class="form-label">중량(g)</label>
          <input class="form-input" id="mf-weight" type="number" value="${part.weight||''}" placeholder="0">
        </div>
        <div class="form-field">
          <label class="form-label">재료비</label>
          <input class="form-input" id="mf-matcost" type="number" value="${part.materialCost||''}" placeholder="0">
        </div>
        <div class="form-field">
          <label class="form-label">가공비</label>
          <input class="form-input" id="mf-proccost" type="number" value="${part.processCost||''}" placeholder="0">
        </div>
        <div class="form-field">
          <label class="form-label">목표단가</label>
          <input class="form-input" id="mf-target" type="number" value="${part.targetPrice||''}" placeholder="0">
        </div>
        <div class="form-field">
          <label class="form-label">공급사</label>
          <select class="form-input form-select" id="mf-supplier">${supOpts}</select>
        </div>
        <div class="form-field">
          <label class="form-label">상태</label>
          <select class="form-input form-select" id="mf-status">${statusOpts}</select>
        </div>
      </div>`;

    Common.openModal(
      mode === 'new' ? 'Part 신규 등록' : 'Part 수정',
      formHtml,
      [
        { label: '저장', class: 'btn-solid-blue', onclick: `m02002_saveModal('${mode}','${part.id||''}')` },
        { label: '취소', class: '',               onclick: 'Common.closeModal()' }
      ]
    );
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  window.m02002_saveModal = function(mode, existingId) {
    const partNo    = (document.getElementById('mf-partno')   || {}).value?.trim();
    const partName  = (document.getElementById('mf-partname') || {}).value?.trim();
    const projectId = (document.getElementById('mf-project')  || {}).value;
    const material  = (document.getElementById('mf-material') || {}).value?.trim();
    const weight    = Number((document.getElementById('mf-weight')  || {}).value) || 0;
    const matCost   = Number((document.getElementById('mf-matcost') || {}).value) || 0;
    const procCost  = Number((document.getElementById('mf-proccost')|| {}).value) || 0;
    const target    = Number((document.getElementById('mf-target')  || {}).value) || 0;
    const supId     = (document.getElementById('mf-supplier') || {}).value || null;
    const status    = (document.getElementById('mf-status')   || {}).value || '미확정';

    if (!partNo || !partName || !projectId || !material) {
      Common.showToast('필수 항목(Part No.·품명·프로젝트·소재)을 입력해주세요', 'info');
      return;
    }

    const suppliers  = MockData.getAll('suppliers');
    const supObj     = supId ? suppliers.find(s => s.id === supId) : null;
    const calcPrice  = matCost + procCost;
    const parts      = MockData.getAll('partList');
    const newId      = mode === 'new'
      ? ('PL-' + String(parts.length + 1).padStart(3, '0'))
      : existingId;

    const partData = {
      id: newId, partNo, partName, projectId, material, weight,
      materialCost: matCost, processCost: procCost,
      calcPrice, targetPrice: target, fixedPrice: null,
      supplierId: supId, supplierName: supObj ? supObj.name : null,
      suppliers: supId ? [supId] : [],
      bomStatus: status, ecn: false,
      regDate: new Date().toISOString().slice(0, 10)
    };

    MockData.save('partList', partData);
    Common.closeModal();
    Common.showToast(mode === 'new' ? 'Part가 등록되었습니다' : 'Part 정보가 수정되었습니다', 'success');

    selectedId = newId;
    m02002_renderCards();
    m02002_renderGrid();
  };

  /* ── 삭제 ── */
  window.m02002_delete = function() {
    if (!selectedId) { Common.showToast('삭제할 Part를 선택해주세요', 'info'); return; }
    const parts = MockData.getAll('partList');
    const part  = parts.find(p => p.id === selectedId);
    if (!part) return;
    if (!confirm(`"${part.partName}" (${part.partNo}) 을(를) 삭제하시겠습니까?`)) return;
    MockData.remove('partList', selectedId);
    selectedId = null;
    document.getElementById('m02002-detail-empty').style.display = 'flex';
    document.getElementById('m02002-detail-panel').style.display = 'none';
    Common.showToast('Part가 삭제되었습니다', 'success');
    m02002_renderCards();
    m02002_renderGrid();
  };

  /* ── 초기 렌더 ── */
  m02002_renderCards();
  m02002_renderGrid();
  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
};
