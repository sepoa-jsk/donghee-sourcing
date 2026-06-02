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
          <button class="btn btn-outline-blue" onclick="Common.showToast('BOM 생성 기능은 준비 중입니다','info')"><i data-lucide="plus"></i> BOM 생성</button>
          <button class="btn" onclick="Common.showToast('Export 기능은 준비 중입니다','info')"><i data-lucide="download"></i> Export</button>
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
        <div class="insight-card-icon blue"><i data-lucide="sitemap"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value">${totalParts}</span>
          <span class="insight-card-label">전체 Part</span>
        </div>
      </div>
      <div class="insight-card">
        <div class="insight-card-icon green"><i data-lucide="check-circle"></i></div>
        <div class="insight-card-body">
          <span class="insight-card-value">${fixedParts}</span>
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
        <div class="insight-card-icon amber"><i data-lucide="git-branch"></i></div>
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
    const assemblies = (bom && bom.assemblies) ? bom.assemblies : [];
    let totalParts = 0, unfixedParts = 0;
    assemblies.forEach(asm => {
      (asm.parts || []).forEach(p => {
        totalParts++;
        if (p.fixedPrice == null) unfixedParts++;
      });
    });

    const phaseColor = { P1:'#185FA5', P2:'#0F6E56', P3:'#854F0B', P4:'#A32D2D', 'SOP완료':'#97A0AF' };
    const bomStatusStyle = {
      '작성중': `color:var(--primary);`,
      'Freeze': `color:var(--success);font-weight:600;`,
      '미작성':  `color:var(--text-muted);`
    };

    const bomRev = (bom && bom.rev) ? bom.rev : '-';
    const bomSt  = (bom && bom.status) ? bom.status : '-';

    let rows = data.map(p => {
      const sel = p.id === selectedProjectId ? 'selected' : '';
      const pc  = phaseColor[p.phase] || 'inherit';
      const bstyle = bomStatusStyle[p.bomStatus] || '';
      const isBomProject = bom && bom.projectId === p.id;
      const partCount  = isBomProject ? totalParts   : '-';
      const unconfirmed = isBomProject ? unfixedParts : '-';

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
        <td class="right">${partCount}</td>
        <td class="right" style="${unconfirmed > 0 ? 'color:var(--danger);font-weight:600;' : ''}">${unconfirmed}</td>
      </tr>`;
    }).join('');

    const el = document.getElementById('m02001-grid');
    if (!el) return;
    el.innerHTML = `
      <div class="grid-container">
        <table class="grid-table">
          <colgroup>
            <col style="width:40px"><col style="width:100px"><col style="width:160px">
            <col style="width:70px"><col style="width:80px"><col style="width:90px">
            <col style="width:80px"><col style="width:100px"><col style="width:70px">
            <col style="width:80px"><col style="width:70px"><col style="width:70px">
          </colgroup>
          <thead><tr>
            <th><input type="checkbox"></th>
            <th>프로젝트ID</th><th>프로젝트명</th><th>OEM</th>
            <th>차종</th><th>플랫폼</th><th>진행Phase</th>
            <th>SOP목표일</th><th>BOM Rev</th><th>BOM상태</th>
            <th class="right">총Part수</th><th class="right">미확정</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
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
          const ecnIcon  = p.ecn ? ' <i data-lucide="git-branch" style="width:12px;height:12px;color:#F59E0B;vertical-align:middle;"></i>' : '';
          rows += `<tr class="${ecnClass} ${selPart}" onclick="m02001_selectPart('${p.partNo}','part')" style="cursor:pointer;">
            <td></td>
            <td class="ss-col-center" style="padding-left:24px;">${p.partNo}</td>
            <td class="ss-col-left" style="padding-left:24px;">${p.name}${ecnIcon}</td>
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
