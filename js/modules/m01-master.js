/* ============================================================
   m01-master.js — M01-001 프로젝트 관리 + M01-002 협력사 관리
   ============================================================ */

/* ────────────────────────────────────────
   M01-001  신차 프로젝트 등록·조회
   ──────────────────────────────────────── */
window.render_M01_001 = function(container) {
  container.style.padding = '0';

  // 데이터 안전 로드
  let projects = MockData.getAll('projects');
  if (projects.length === 0) { MockData.reset(); projects = MockData.getAll('projects'); }
  console.log('M01-001 render, projects:', projects.length);

  // 상태 관리
  let selectedId = null;
  let searchText = '';
  let viewMode = 'list'; // 'list' | 'new' | 'edit'

  container.innerHTML = `<div class="screen-wrapper" style="display:flex;flex-direction:column;height:100%;padding:12px 16px;box-sizing:border-box;">
    <div id="m01001-list">
      <!-- 필터바 -->
      <div class="filter-bar">
        <div class="filter-search">
          <input type="text" id="m01001-search" placeholder="Search" oninput="m01001_onSearch(this.value)">
          <i data-lucide="search"></i>
        </div>
        <button class="filter-btn" onclick="m01001_toggleFilter()"><i data-lucide="filter" class="icon-red"></i> 필터</button>
        <button class="filter-btn" onclick="Common.showToast('상태 필터는 준비 중입니다','info')"><i data-lucide="bar-chart-2" class="icon-blue"></i> 상태</button>
        <div class="filter-date-range">
          <input type="text" id="m01001-date-from" value="2025/01/01" readonly>
          <span class="date-separator">~</span>
          <input type="text" id="m01001-date-to" value="2027/12/31" readonly>
          <i data-lucide="calendar" class="icon-red"></i>
        </div>
        <div class="filter-right">
          <button class="btn btn-outline-blue" onclick="m01001_showForm('new')"><i data-lucide="plus"></i> 신규등록</button>
          <button class="btn" onclick="m01001_showForm('edit')"><i data-lucide="pencil"></i> 수정</button>
          <button class="btn btn-outline-red" onclick="m01001_delete()"><i data-lucide="trash-2"></i> 삭제</button>
        </div>
      </div>
      <!-- 요약카드 -->
      <div id="m01001-cards" class="summary-cards" style="margin-bottom:12px;"></div>
      <!-- 그리드 -->
      <div id="m01001-grid" style="flex:1;overflow-y:auto;"></div>
    </div>
    <!-- 등록/수정 폼 -->
    <div id="m01001-form" class="hidden">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border);">
        <span id="m01001-form-title" style="font-size:var(--font-l);font-weight:700;"></span>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary" onclick="m01001_save()"><i data-lucide="save"></i> 저장</button>
          <button class="btn" onclick="m01001_backToList()"><i data-lucide="x"></i> 취소</button>
        </div>
      </div>
      <div class="form-section">
        <div class="form-grid-2col">
          <div class="form-field">
            <label class="form-label">프로젝트명 <span class="required">*</span></label>
            <input type="text" class="form-input form-input-m" id="f-name" placeholder="프로젝트명 입력">
          </div>
          <div class="form-field">
            <label class="form-label">OEM <span class="required">*</span></label>
            <select class="form-input form-select form-input-m" id="f-oem">
              <option value="HMC">HMC</option>
              <option value="기아">기아</option>
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">차종명</label>
            <input type="text" class="form-input form-input-m" id="f-model" placeholder="예: NX5">
          </div>
          <div class="form-field">
            <label class="form-label">플랫폼</label>
            <input type="text" class="form-input form-input-m" id="f-platform" placeholder="예: N플랫폼">
          </div>
          <div class="form-field">
            <label class="form-label">SOP 목표일 <span class="required">*</span></label>
            <input type="date" class="form-input form-input-m" id="f-sop">
          </div>
          <div class="form-field">
            <label class="form-label">담당자 <span class="required">*</span></label>
            <input type="text" class="form-input form-input-m" id="f-manager" placeholder="담당자명">
          </div>
          <div class="form-field full">
            <label class="form-label">비고</label>
            <textarea class="form-textarea form-input-l" id="f-remark" placeholder="비고 입력"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  // ── 함수 정의 ──
  window.m01001_onSearch = function(val) {
    searchText = val;
    m01001_renderGrid();
  };

  window.m01001_toggleFilter = function() {
    // 추후 필터 패널 확장 예정
    Common.showToast('필터 기능은 준비 중입니다', 'info');
  };

  window.m01001_renderCards = function() {
    const projects = MockData.getAll('projects');
    const inProgress = projects.filter(p => ['P1','P2','P3','P4'].includes(p.phase)).length;
    document.getElementById('m01001-cards').innerHTML = `
      <div class="summary-card">
        <div class="summary-card-title">전체 프로젝트</div>
        <div class="summary-card-value">${projects.length} <span>건</span></div>
      </div>
      <div class="summary-card">
        <div class="summary-card-title">진행 중 (P1~P4)</div>
        <div class="summary-card-value">${inProgress} <span>건</span></div>
      </div>
      <div class="summary-card">
        <div class="summary-card-title">이번달 SOP 예정</div>
        <div class="summary-card-value">2 <span>건</span></div>
      </div>
      <div class="summary-card">
        <div class="summary-card-title">목표가 미승인</div>
        <div class="summary-card-value danger">3 <span>건</span></div>
      </div>
    `;
  };

  window.m01001_renderGrid = function() {
    let data = MockData.getAll('projects');
    if (searchText) {
      const q = searchText.toLowerCase();
      data = data.filter(p =>
        (p.name||'').toLowerCase().includes(q) ||
        (p.id||'').toLowerCase().includes(q) ||
        (p.oem||'').toLowerCase().includes(q) ||
        (p.manager||'').toLowerCase().includes(q)
      );
    }
    const phaseColor = { P1:'#185FA5', P2:'#0F6E56', P3:'#854F0B', P4:'#A32D2D', 'SOP완료':'#97A0AF' };
    const bomColor   = { '작성중':'#185FA5', 'Freeze':'#0F6E56', '미작성':'#97A0AF' };

    let rows = data.map(p => {
      const sel = p.id === selectedId ? 'selected' : '';
      const pc = phaseColor[p.phase] || 'inherit';
      const bc = bomColor[p.bomStatus] || 'inherit';
      return `<tr class="${sel}" onclick="m01001_selectRow('${p.id}')" style="cursor:pointer;">
        <td class="center"><input type="checkbox" ${p.id === selectedId ? 'checked' : ''} onclick="event.stopPropagation();m01001_selectRow('${p.id}')"></td>
        <td class="center">${p.id}</td>
        <td class="left">${p.name}</td>
        <td class="center">${p.oem}</td>
        <td class="center">${p.model||'-'}</td>
        <td class="center">${p.platform||'-'}</td>
        <td class="center" style="color:${pc};font-weight:500;">${p.phase}</td>
        <td class="center">${p.sopDate||'-'}</td>
        <td class="center">${p.manager||'-'}</td>
        <td class="center" style="color:${bc};font-weight:500;">${p.bomStatus||'-'}</td>
        <td class="center">${p.regDate||'-'}</td>
      </tr>`;
    }).join('');

    document.getElementById('m01001-grid').innerHTML = `
      <div class="grid-container" style="overflow-y:auto;height:calc(100vh - 40px - 36px - 56px - 116px - 32px - 5px);">
        <table class="grid-table">
          <colgroup>
            <col style="width:40px"><col style="width:110px"><col style="width:180px">
            <col style="width:80px"><col style="width:90px"><col style="width:100px">
            <col style="width:80px"><col style="width:100px"><col style="width:80px">
            <col style="width:80px"><col style="width:100px">
          </colgroup>
          <thead><tr>
            <th><input type="checkbox" onclick="m01001_toggleAll(this)"></th>
            <th>프로젝트ID</th><th>프로젝트명</th><th>OEM</th><th>차종</th>
            <th>플랫폼</th><th>진행Phase</th><th>SOP목표일</th>
            <th>담당자</th><th>BOM상태</th><th>등록일</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  };

  window.m01001_toggleAll = function(cb) {
    selectedId = null;
    m01001_renderGrid();
  };

  window.m01001_selectRow = function(id) {
    selectedId = selectedId === id ? null : id;
    m01001_renderGrid();
  };

  window.m01001_showForm = function(mode) {
    viewMode = mode;
    document.getElementById('m01001-list').classList.add('hidden');
    document.getElementById('m01001-form').classList.remove('hidden');

    if (mode === 'new') {
      document.getElementById('m01001-form-title').textContent = '(신규 등록)';
      document.getElementById('f-name').value = '';
      document.getElementById('f-oem').value = 'HMC';
      document.getElementById('f-model').value = '';
      document.getElementById('f-platform').value = '';
      document.getElementById('f-sop').value = '';
      document.getElementById('f-manager').value = '';
      document.getElementById('f-remark').value = '';
    } else {
      if (!selectedId) { Common.showToast('수정할 항목을 선택해주세요', 'error'); return; }
      const p = MockData.getById('projects', selectedId);
      if (!p) return;
      document.getElementById('m01001-form-title').textContent = p.name;
      document.getElementById('f-name').value = p.name || '';
      document.getElementById('f-oem').value = p.oem || 'HMC';
      document.getElementById('f-model').value = p.model || '';
      document.getElementById('f-platform').value = p.platform || '';
      document.getElementById('f-sop').value = (p.sopDate||'').replace(/\//g,'-');
      document.getElementById('f-manager').value = p.manager || '';
      document.getElementById('f-remark').value = p.remark || '';
    }
  };

  window.m01001_save = function() {
    const name = document.getElementById('f-name').value.trim();
    const sop  = document.getElementById('f-sop').value;
    const mgr  = document.getElementById('f-manager').value.trim();
    if (!name || !sop || !mgr) {
      Common.showToast('필수 항목을 입력해주세요', 'error'); return;
    }
    const today = new Date().toISOString().slice(0,10).replace(/-/g,'/');
    if (viewMode === 'new') {
      const item = {
        id: 'PRJ-' + Date.now(),
        name,
        oem: document.getElementById('f-oem').value,
        model: document.getElementById('f-model').value.trim(),
        platform: document.getElementById('f-platform').value.trim(),
        phase: 'P1',
        sopDate: sop.replace(/-/g,'/'),
        manager: mgr,
        bomStatus: '미작성',
        regDate: today,
        remark: document.getElementById('f-remark').value.trim()
      };
      MockData.save('projects', item);
    } else {
      const p = MockData.getById('projects', selectedId);
      Object.assign(p, {
        name,
        oem: document.getElementById('f-oem').value,
        model: document.getElementById('f-model').value.trim(),
        platform: document.getElementById('f-platform').value.trim(),
        sopDate: sop.replace(/-/g,'/'),
        manager: mgr,
        remark: document.getElementById('f-remark').value.trim()
      });
      MockData.save('projects', p);
    }
    Common.showToast('저장되었습니다', 'success');
    m01001_backToList();
  };

  window.m01001_delete = function() {
    if (!selectedId) { Common.showToast('삭제할 항목을 선택해주세요', 'error'); return; }
    if (confirm('선택된 프로젝트를 삭제하시겠습니까?')) {
      MockData.remove('projects', selectedId);
      selectedId = null;
      Common.showToast('삭제되었습니다', 'success');
      m01001_renderCards();
      m01001_renderGrid();
    }
  };

  window.m01001_backToList = function() {
    document.getElementById('m01001-list').classList.remove('hidden');
    document.getElementById('m01001-form').classList.add('hidden');
    m01001_renderCards();
    m01001_renderGrid();
  };

  // 모든 함수 정의 완료 후 초기 렌더
  window.m01001_renderCards();
  window.m01001_renderGrid();
};


/* ────────────────────────────────────────
   M01-002  협력사 관리
   ──────────────────────────────────────── */
window.render_M01_002 = function(container) {
  container.style.padding = '0';

  // 데이터 안전 로드
  let suppliers = MockData.getAll('suppliers');
  if (suppliers.length === 0) { MockData.reset(); suppliers = MockData.getAll('suppliers'); }
  console.log('M01-002 render, suppliers:', suppliers.length);

  let selectedSuppId = null;
  let tierFilter = null; // null | 'Tier2' | 'Tier3'
  let searchText = '';
  let activeTab = '일반정보';
  let detailMode = 'new'; // 'new' | 'edit'

  container.innerHTML = `<div class="screen-wrapper" style="display:flex;flex-direction:column;height:100%;padding:12px 16px;box-sizing:border-box;">
    <!-- 리스트 뷰 -->
    <div id="m01002-list">
      <div class="filter-bar">
        <div class="filter-search">
          <input type="text" id="m01002-search" placeholder="Search" oninput="m01002_onSearch(this.value)">
          <i data-lucide="search"></i>
        </div>
        <button class="filter-btn" onclick="m01002_toggleFilter()"><i data-lucide="filter" class="icon-red"></i> 필터</button>
        <button class="filter-btn" onclick="Common.showToast('상태 필터는 준비 중입니다','info')"><i data-lucide="bar-chart-2" class="icon-blue"></i> 상태</button>
        <div class="filter-date-range">
          <input type="text" value="2025/01/01" readonly>
          <span class="date-separator">~</span>
          <input type="text" value="2027/12/31" readonly>
          <i data-lucide="calendar" class="icon-red"></i>
        </div>
        <div class="filter-right">
          <button class="btn btn-outline-blue" onclick="m01002_showDetail('new')"><i data-lucide="plus"></i> 신규</button>
        </div>
      </div>
      <div id="m01002-grid" style="flex:1;overflow:auto;"></div>
    </div>
    <!-- 상세 뷰 -->
    <div id="m01002-detail" class="hidden" style="flex:1;display:flex;flex-direction:column;height:100%;">
      <!-- 업체명 + 버튼 행 -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;margin-bottom:16px;border-bottom:1px solid var(--border);">
        <span id="m01002-detail-title" style="font-size:var(--font-xl);font-weight:700;"></span>
        <div id="m01002-detail-btns" style="display:flex;gap:6px;"></div>
      </div>
      <!-- 좌우 2단 -->
      <div class="detail-layout" style="flex:1;overflow:hidden;">
        <!-- 좌측 세로탭 (160px, 파일첨부 없음) -->
        <div class="detail-left" style="width:160px;">
          <div class="detail-left-tabs" id="m01002-vtabs"></div>
        </div>
        <!-- 우측 콘텐츠 -->
        <div class="detail-right" id="m01002-tab-content"></div>
      </div>
    </div>
  </div>`;

  const TABS = ['일반정보','사업자정보','담당자정보','경영정보','영업현황','품질·인증정보','공급역량','신용평가정보'];

  // ── 함수 ──
  window.m01002_onSearch = function(val) {
    searchText = val;
    m01002_renderGrid();
  };

  window.m01002_toggleFilter = function() {
    Common.showToast('필터 기능은 준비 중입니다', 'info');
  };

  window.m01002_toggleBizType = function() {
    Common.showToast('업체구분 필터는 준비 중입니다', 'info');
  };

  window.m01002_renderGrid = function() {
    let data = MockData.getAll('suppliers');
    if (data.length === 0) { MockData.reset(); data = MockData.getAll('suppliers'); }
    if (searchText) {
      const q = searchText.toLowerCase();
      data = data.filter(s =>
        (s.name||'').toLowerCase().includes(q) ||
        (s.code||'').toLowerCase().includes(q) ||
        (s.bizNo||'').toLowerCase().includes(q)
      );
    }

    const rows = data.map(s => {
      const sel = s.id === selectedSuppId ? 'selected' : '';
      return `<tr class="${sel}" onclick="m01002_selectRow('${s.id}')" style="cursor:pointer;">
        <td class="center"><input type="checkbox" ${s.id === selectedSuppId ? 'checked' : ''} onclick="event.stopPropagation();m01002_selectRow('${s.id}')"></td>
        <td class="center"><span class="supplier-type">${s.type||'등록업체'}</span></td>
        <td class="center">${s.tradeStatus||'정상'}</td>
        <td class="center">${s.approvalStatus||'승인'}</td>
        <td class="center">${s.approval2nd||''}</td>
        <td class="center">${s.editRequest||''}</td>
        <td class="center"><span class="code-link" onclick="event.stopPropagation();m01002_showDetail('edit','${s.id}')">${s.code||s.id}</span></td>
        <td class="left">${s.name}</td>
        <td class="center">${s.bizNo||'-'}</td>
        <td class="left">${s.bizType||'-'}</td>
        <td class="left">${s.bizCategory||'-'}</td>
        <td class="center">${s.country||'-'}</td>
        <td class="center">${s.creditGrade||'-'}</td>
        <td class="center">${s.cashFlowGrade||'-'}</td>
        <td class="center">${s.riskGrade||'-'}</td>
      </tr>`;
    }).join('');

    document.getElementById('m01002-grid').innerHTML = `
      <div class="grid-container" style="height:calc(100vh - 40px - 36px - 56px - 32px - 5px);">
        <table class="grid-table grid-table-wide">
          <colgroup>
            <col style="width:40px"><col style="width:80px"><col style="width:70px">
            <col style="width:70px"><col style="width:90px"><col style="width:70px">
            <col style="width:80px"><col style="width:180px"><col style="width:120px">
            <col style="width:140px"><col style="width:160px"><col style="width:120px">
            <col style="width:70px"><col style="width:90px"><col style="width:70px">
          </colgroup>
          <thead><tr>
            <th><input type="checkbox" onclick="m01002_toggleAll(this)"></th>
            <th>업체구분</th><th>거래상태</th><th>결재상태</th><th>2차결재상태</th>
            <th>수정요청</th><th>업체코드</th><th>업체명</th><th>사업자등록번호</th>
            <th>업태</th><th>업종</th><th>국가</th>
            <th>신용등급</th><th>현금흐름등급</th><th>외치등급</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  };

  window.m01002_toggleAll = function() { selectedSuppId = null; m01002_renderGrid(); };
  window.m01002_selectRow = function(id) {
    selectedSuppId = selectedSuppId === id ? null : id;
    m01002_renderGrid();
  };

  window.m01002_showDetail = function(mode, overrideId) {
    detailMode = mode;
    if (overrideId) selectedSuppId = overrideId;
    if (mode === 'edit' && !selectedSuppId) {
      Common.showToast('수정할 항목을 선택해주세요', 'error'); return;
    }
    const supp = mode === 'edit'
      ? MockData.getById('suppliers', selectedSuppId)
      : MockData.getAll('suppliers')[0] || null;
    document.getElementById('m01002-list').classList.add('hidden');
    document.getElementById('m01002-detail').classList.remove('hidden');
    document.getElementById('m01002-detail-title').textContent = supp ? supp.name : '';

    // 모드별 버튼 렌더
    const btns = document.getElementById('m01002-detail-btns');
    if (mode === 'edit') {
      btns.innerHTML = `
        <button class="btn btn-outline-red" onclick="Common.showToast('거래정지 처리되었습니다','success')"><i data-lucide="ban"></i> 거래정지</button>
        <button class="btn" onclick="Common.showToast('수정 모드로 전환합니다','info')"><i data-lucide="edit-2"></i> 수정</button>
        <button class="btn" onclick="m01002_backToList()"><i data-lucide="x"></i> 닫기</button>`;
    } else {
      btns.innerHTML = `
        <button class="btn btn-primary" onclick="m01002_save()"><i data-lucide="save"></i> 저장</button>
        <button class="btn" onclick="m01002_backToList()"><i data-lucide="x"></i> 닫기</button>`;
    }
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);

    // 세로탭 렌더
    activeTab = '일반정보';
    m01002_renderVtabs(supp);
    m01002_renderTabContent(activeTab, supp);
  };

  window.m01002_renderVtabs = function(supp) {
    document.getElementById('m01002-vtabs').innerHTML = TABS.map(t =>
      `<div class="detail-tab ${t === activeTab ? 'active' : ''}" onclick="m01002_switchTab('${t}')">${t}</div>`
    ).join('');
  };

  window.m01002_switchTab = function(tab) {
    activeTab = tab;
    const supp = detailMode === 'edit' ? MockData.getById('suppliers', selectedSuppId) : null;
    m01002_renderVtabs(supp);
    m01002_renderTabContent(tab, supp);
  };

  window.m01002_renderTabContent = function(tab, supp) {
    const el = document.getElementById('m01002-tab-content');
    const map = {
      '일반정보':    () => m01002_tabGeneral(supp),
      '사업자정보':  () => m01002_tabBizInfo(supp),
      '담당자정보':  () => m01002_tabContacts(supp),
      '경영정보':    () => m01002_tabFinance(supp),
      '영업현황':    () => m01002_tabSales(supp),
      '품질·인증정보': () => m01002_tabQuality(supp),
      '공급역량':    () => m01002_tabCapacity(supp),
      '신용평가정보': () => m01002_tabCredit(supp),
    };
    el.innerHTML = (map[tab] || (() => ''))();
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  // ── 탭 헬퍼 ──
  function _inp(id, val, ph, ro) {
    return `<input class="form-input" id="${id}" value="${val||''}" placeholder="${ph||''}" ${ro?'readonly':''}>`;
  }
  function _sel(id, opts, cur) {
    return `<select class="form-input form-select" id="${id}">${opts.map(o=>`<option ${o===cur?'selected':''}>${o}</option>`).join('')}</select>`;
  }
  function _fg(cls, lbl, req, html) {
    return `<div class="form-group ${cls}"><label class="form-label">${lbl}${req?' <span class="required">*</span>':''}</label>${html}</div>`;
  }
  function _addDel() {
    return `<div style="display:flex;gap:6px;margin-bottom:10px;"><button class="btn btn-outline-blue"><i data-lucide="plus"></i> 추가</button><button class="btn btn-outline-red"><i data-lucide="trash-2"></i> 삭제</button></div>`;
  }
  function _fileBox(label) {
    return `<div style="flex:1;">
      <div style="font-size:var(--font-s);font-weight:500;margin-bottom:8px;">${label}</div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);padding:8px;">
        <button class="btn" style="font-size:11px;margin-bottom:8px;"><i data-lucide="download"></i> AllDownLoad</button>
        <div style="border:1px solid #E5E7EB;border-radius:var(--radius);background:#FAFBFC;min-height:120px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:var(--font-xs);text-align:center;">파일을 드래그하거나<br>클릭하여 업로드</div>
      </div>
    </div>`;
  }
  function _fileRow(l1, l2) {
    return `<div style="display:flex;gap:24px;">${_fileBox(l1)}${_fileBox(l2)}</div>`;
  }
  function _box(title, content) {
    return `<div class="section-box"><div class="section-box-title">${title}</div>${content}</div>`;
  }
  function _row(...fields) {
    return `<div class="form-row">${fields.join('')}</div>`;
  }

  // ── 탭 1: 일반정보 ──
  window.m01002_tabGeneral = function(supp) {
    const s = supp || {};
    return (
      _box('기본정보',
        _row(_fg('form-group-m','업체코드',false,_inp('sf-code',s.code||'자동발급','',true)),
             _fg('form-group-m','업체구분',false,_sel('sf-tier',['Tier2','Tier3','계열사'],s.tier||'Tier2')),
             _fg('form-group-m','협력사등급',false,_sel('sf-grade',['A','B','C','D','신규'],s.grade||'B'))) +
        _row(_fg('form-group-m','관리상태',false,_sel('sf-status',['정상','거래중단','블랙리스트','휴면'],'정상')),
             _fg('form-group-m','등록일',false,_inp('sf-regdate',s.regDate||'2025/03/15','',true)),
             _fg('form-group-m','최종수정일',false,_inp('sf-moddate','2025/12/01','',true))) +
        _row(_fg('form-group-m','담당 구매자',false,_inp('sf-buyer',s.manager,'')),
             _fg('form-group-m','VAATZ 업체코드',false,_inp('sf-vaatz','','')),
             _fg('form-group-m','ERP 거래처코드',false,_inp('sf-erp','','')))
      ) +
      _box('회사정보',
        _row(_fg('form-group-full','회사명',true,_inp('sf-name',s.name,'회사명 입력'))) +
        _row(_fg('form-group-full','회사명(영문)',false,_inp('sf-nameEn',s.nameEn,'Company Name'))) +
        _row(_fg('form-group-m','대표자명',true,_inp('sf-ceo',s.ceo,'대표자명')),
             _fg('form-group-m','설립일자',false,`<input type="date" class="form-input" id="sf-founded" value="${s.founded||''}">`),
             _fg('form-group-m','법인형태',false,_sel('sf-corptype',['법인','개인','외국법인'],'법인'))) +
        _row(_fg('form-group-m','대표이메일',false,_inp('sf-email',s.email,'email@co.kr')),
             _fg('form-group-m','대표전화번호',false,_inp('sf-tel',s.tel,'031-000-0000')),
             _fg('form-group-m','팩스',false,_inp('sf-fax','','031-000-0001'))) +
        _row(_fg('form-group-l','홈페이지',false,_inp('sf-web','','https://www.company.co.kr')))
      ) +
      _box('소재지 정보',
        `<div class="form-row" style="align-items:flex-end;">
          <div class="form-group" style="flex:0 0 auto;">
            <label class="form-label" style="white-space:nowrap;">우편번호</label>
            <div style="display:flex;gap:4px;"><input class="form-input" style="width:80px;" id="sf-zip" value="${s.zip||''}" placeholder="12345"><button class="btn" style="height:var(--input-height);padding:0 8px;font-size:11px;flex-shrink:0;">검색</button></div>
          </div>
          <div class="form-group" style="flex:1;min-width:0;">
            <label class="form-label">주소 <span class="required">*</span></label>
            <input class="form-input" style="width:100%;" id="sf-addr" value="${s.addr||''}" placeholder="기본주소">
          </div>
        </div>` +
        `<div class="form-row">
          <div class="form-group" style="flex:1;min-width:0;">
            <label class="form-label">상세주소</label>
            <input class="form-input" style="width:100%;" id="sf-addr2" value="${s.addr2||''}" placeholder="상세주소">
          </div>
        </div>` +
        `<div class="form-row" style="align-items:flex-end;">
          <div class="form-group" style="flex:0 0 auto;">
            <label class="form-label" style="white-space:nowrap;">공장 우편번호</label>
            <div style="display:flex;gap:4px;"><input class="form-input" style="width:80px;" id="sf-fzip" placeholder="12345"><button class="btn" style="height:var(--input-height);padding:0 8px;font-size:11px;flex-shrink:0;">검색</button></div>
          </div>
          <div class="form-group" style="flex:1;min-width:0;">
            <label class="form-label">공장주소</label>
            <input class="form-input" style="width:100%;" id="sf-faddr" placeholder="공장 기본주소">
          </div>
        </div>` +
        `<div class="form-row">
          <div class="form-group" style="flex:1;min-width:0;">
            <label class="form-label">공장 상세주소</label>
            <input class="form-input" style="width:100%;" id="sf-faddr2" placeholder="공장 상세주소">
          </div>
        </div>` +
        _row(_fg('form-group-m','국가',false,_sel('sf-country',['KR - South Korea','CN - China','VN - Vietnam','US - USA','기타'],s.country||'KR - South Korea')),
             _fg('form-group-m','지역',false,_sel('sf-region',['수도권','충청','영남','호남','강원','제주','해외'],'수도권')))
      ) +
      _box('파일첨부', _fileRow('사업자등록증','회사소개서'))
    );
  };

  // ── 탭 2: 사업자정보 ──
  window.m01002_tabBizInfo = function(supp) {
    const s = supp || {};
    return (
      _box('사업자 등록 정보',
        _row(_fg('form-group-m','사업자등록번호',true,_inp('sf-bizno',s.bizNo,'000-00-00000')),
             _fg('form-group-m','법인등록번호',false,_inp('sf-corpno',s.corpNo,'-')),
             _fg('form-group-m','종사업장번호',false,_inp('sf-subno','','-'))) +
        _row(_fg('form-group-l','업태',false,_inp('sf-biztype',s.bizType,'예: 제조업')),
             _fg('form-group-l','종목',false,_inp('sf-bizcat',s.bizCategory,'예: 자동차부품'))) +
        _row(_fg('form-group-m','세부업종',false,_sel('sf-bizdetail',['자동차부품','금속가공','수지성형','전자부품','화학','기타'],'자동차부품')),
             _fg('form-group-m','과세유형',false,_sel('sf-taxtype',['일반과세','간이과세','면세','영세'],'일반과세'))) +
        _row(_fg('form-group-m','사업개시일',false,`<input type="date" class="form-input">`),
             _fg('form-group-m','법인설립일',false,`<input type="date" class="form-input" value="${s.founded||''}">`),
             _fg('form-group-m','폐업여부',false,_sel('sf-closedbiz',['정상','휴업','폐업'],'정상')))
      ) +
      _box('기업 규모',
        _row(_fg('form-group-m','기업규모',false,_sel('sf-corpsize',['대기업','중견기업','중소기업','소기업'],'중소기업')),
             _fg('form-group-m','벤처기업여부',false,_sel('sf-venture',['N','Y'],'N')),
             _fg('form-group-m','여성기업여부',false,_sel('sf-women',['N','Y'],'N'))) +
        _row(_fg('form-group-m','장애인기업여부',false,_sel('sf-disabled',['N','Y'],'N')),
             _fg('form-group-m','사회적기업여부',false,_sel('sf-social',['N','Y'],'N')),
             _fg('form-group-m','상장여부',false,_sel('sf-listed',['비상장','상장','코스닥'],'비상장'))) +
        _row(_fg('form-group-m','자본금(백만원)',false,_inp('sf-capital','','')),
             _fg('form-group-m','종업원수(명)',false,_inp('sf-employees','','')),
             _fg('form-group-m','부지면적-대지(평)',false,_inp('sf-land','','')),
             _fg('form-group-m','부지면적-건물(평)',false,_inp('sf-building','','')))
      )
    );
  };

  // ── 탭 3: 담당자정보 ──
  window.m01002_tabContacts = function(supp) {
    const isNew = !supp;
    const rows = isNew
      ? `<tr><td colspan="9" class="center" style="color:var(--text-muted);padding:20px;">등록된 담당자가 없습니다</td></tr>`
      : [['대표','박대표','대표이사','대표','031-123-4567','010-1111-2222','ceo@hankook.co.kr','N','-'],
         ['영업','홍길동','영업팀','과장','031-123-4568','010-1234-5678','hong@hankook.co.kr','Y','-'],
         ['기술','김철수','기술팀','대리','031-123-4569','010-9876-5432','kim@hankook.co.kr','Y','-'],
         ['품질','이품질','품질팀','차장','031-123-4570','010-5555-6666','lee@hankook.co.kr','Y','-']
        ].map(r=>`<tr>${r.map(v=>`<td class="center">${v}</td>`).join('')}</tr>`).join('');
    return _box('담당자 목록',
      _addDel() +
      `<div class="grid-container"><table class="grid-table">
        <thead><tr><th>구분</th><th>담당자명</th><th>부서</th><th>직급</th><th>전화번호</th><th>휴대폰</th><th>이메일</th><th>포털계정</th><th>비고</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`
    );
  };

  // ── 탭 4: 경영정보 ──
  window.m01002_tabFinance = function(supp) {
    const custRows = [
      ['동희산업','매출','2,500','35%','서스펜션 부품'],
      ['HMC 직납','매출','1,800','25%','보수용 부품'],
      ['포스코','매입','3,200','60%','강판 소재']
    ].map(r=>`<tr>${r.map((v,i)=>`<td class="${i>=2?'right':'left'}">${v}</td>`).join('')}</tr>`).join('');
    return (
      _box('재무 현황',
        _row(_fg('form-group-m','기준연도',false,_sel('sf-fiscyr',['2024','2023','2022'],'2024')),
             _fg('form-group-m','결산월',false,_sel('sf-fiscmo',['12월','3월','6월'],'12월'))) +
        _row(_fg('form-group-m','매출액(백만원)',false,_inp('sf-sales','','')),
             _fg('form-group-m','영업이익(백만원)',false,_inp('sf-opincome','','')),
             _fg('form-group-m','당기순이익(백만원)',false,_inp('sf-netincome','',''))) +
        _row(_fg('form-group-m','자산총계(백만원)',false,_inp('sf-assets','','')),
             _fg('form-group-m','부채총계(백만원)',false,_inp('sf-liabilities','','')),
             _fg('form-group-m','자본총계(백만원)',false,_inp('sf-equity','',''))) +
        _row(_fg('form-group-m','부채비율(%)',false,_inp('sf-debtratio','','')),
             _fg('form-group-m','유동비율(%)',false,_inp('sf-currentratio','','')),
             _fg('form-group-m','영업이익률(%)',false,_inp('sf-opmargin','','')))
      ) +
      _box('주요 거래처',
        _addDel() +
        `<div class="grid-container"><table class="grid-table">
          <thead><tr><th>거래처명</th><th>거래유형</th><th>연간거래액(백만원)</th><th>거래비중(%)</th><th>비고</th></tr></thead>
          <tbody>${custRows}</tbody>
        </table></div>`
      )
    );
  };

  // ── 탭 5: 영업현황 ──
  window.m01002_tabSales = function(supp) {
    const salesRows = [
      ['2024','12,500','1,250','980','185','-'],
      ['2023','11,800','1,100','850','178','-'],
      ['2022','10,200','950','720','165','-']
    ].map(r=>`<tr><td class="center">${r[0]}</td>${r.slice(1).map(v=>`<td class="right">${v}</td>`).join('')}</tr>`).join('');
    const dhRows = [
      ['2024','NX5 SUV','로어 암 브라켓','850','98.5%','12','A'],
      ['2024','소형 SUV','스태빌라이저','620','97.2%','18','B'],
      ['2023','RV 플랫폼','코일 스프링 시트','480','99.1%','8','A']
    ].map(r=>`<tr>${r.map((v,i)=>i===0||i===6?`<td class="center">${v}</td>`:`<td class="${i===3?'right':'left'}">${v}</td>`).join('')}</tr>`).join('');
    return (
      _box('연도별 매출 실적',
        _addDel() +
        `<div class="grid-container"><table class="grid-table">
          <thead><tr><th>연도</th><th>매출액(백만원)</th><th>영업이익(백만원)</th><th>순이익(백만원)</th><th>종업원수(명)</th><th>비고</th></tr></thead>
          <tbody>${salesRows}</tbody>
        </table></div>`
      ) +
      _box('동희산업 거래 실적',
        `<div class="grid-container"><table class="grid-table">
          <thead><tr><th>연도</th><th>프로젝트</th><th>납품품목</th><th>거래액(백만)</th><th>납기준수율</th><th>품질불량률(ppm)</th><th>종합평가</th></tr></thead>
          <tbody>${dhRows}</tbody>
        </table></div>`
      )
    );
  };

  // ── 탭 6: 품질·인증정보 ──
  window.m01002_tabQuality = function(supp) {
    const today = new Date();
    const certs = [
      { cat:'품질', name:'ISO 9001:2015', org:'KR인증원', no:'Q-2022-1234', get:'2022-03-01', exp:'2025-03-01', status:'유효' },
      { cat:'자동차', name:'IATF 16949:2016', org:'TÜV', no:'A-2023-5678', get:'2023-06-01', exp:'2026-06-01', status:'유효' },
      { cat:'환경', name:'ISO 14001:2015', org:'KR인증원', no:'E-2021-9012', get:'2021-09-01', exp:'2024-09-01', status:'만료' },
      { cat:'안전', name:'ISO 45001:2018', org:'BSI', no:'S-2023-3456', get:'2023-01-15', exp:'2026-01-15', status:'유효' },
      { cat:'소재', name:'IMDS 등록', org:'IMDS', no:'IMDS-78901', get:'2024-01-01', exp:'-', status:'유효' }
    ].map(c => {
      const diff = c.exp === '-' ? 9999 : (new Date(c.exp) - today) / 86400000;
      const ec = diff < 0 ? 'color:var(--danger);font-weight:500;' : diff < 30 ? 'color:var(--danger);' : diff < 90 ? 'color:var(--warning);' : '';
      const sc = c.status === '만료' ? 'color:var(--danger);font-weight:500;' : 'color:var(--success);font-weight:500;';
      return `<tr><td class="center">${c.cat}</td><td class="left">${c.name}</td><td class="center">${c.org}</td><td class="center">${c.no}</td><td class="center">${c.get}</td><td class="center" style="${ec}">${c.exp}</td><td class="center" style="${sc}">${c.status}</td></tr>`;
    }).join('');
    return (
      _box('품질 인증 현황',
        _addDel() +
        `<div class="grid-container"><table class="grid-table">
          <thead><tr><th>인증구분</th><th>인증서명</th><th>인증기관</th><th>인증번호</th><th>취득일</th><th>만료일</th><th>상태</th></tr></thead>
          <tbody>${certs}</tbody>
        </table></div>`
      ) +
      _box('품질 성과',
        _row(_fg('form-group-m','최근 불량률(ppm)',false,_inp('',`12`,'',true)),
             _fg('form-group-m','클레임건수(최근1년)',false,_inp('','2건','',true)),
             _fg('form-group-m','시정조치 이행률(%)',false,_inp('','96%','',true))) +
        _row(_fg('form-group-m','PPAP 승인현황',false,_inp('','레벨3 승인','',true)),
             _fg('form-group-m','공정능력지수(Cpk)',false,_inp('','1.42','',true)),
             _fg('form-group-m','검사성적서 유효여부',false,_inp('','유효','',true)))
      ) +
      _box('파일첨부', _fileRow('인증서 사본','검사성적서'))
    );
  };

  // ── 탭 7: 공급역량 ──
  window.m01002_tabCapacity = function(supp) {
    const matRows = [
      { g:'강판', n:'SPFC440', ks:'KS D3530', p:'프레스·단조', l:'Y', qty:'500 ton', lt:'14', note:'포스코 직납' },
      { g:'강판', n:'SCM440',  ks:'KS D3711', p:'열간단조',    l:'Y', qty:'200 ton', lt:'21', note:'수입강 병행' },
      { g:'수지',  n:'HDPE',   ks:'-',        p:'블로우성형',  l:'N', qty:'100 ton', lt:'10', note:'한화솔루션' },
      { g:'알루미늄', n:'Al5052', ks:'KS D6759', p:'다이캐스팅', l:'Y', qty:'80 ton', lt:'18', note:'수입' }
    ].map(m=>`<tr><td class="center">${m.g}</td><td class="center">${m.n}</td><td class="center">${m.ks}</td><td class="center">${m.p}</td><td class="center" style="color:${m.l==='Y'?'var(--success)':'var(--text-muted)'};font-weight:500;">${m.l}</td><td class="right">${m.qty}</td><td class="center">${m.lt}</td><td class="left">${m.note}</td></tr>`).join('');
    const eqRows = [
      ['서보프레스','아이다','300','5','2020','85%','24시간 가동'],
      ['서보프레스','코마츠','800','2','2022','78%','-'],
      ['CNC 5축','화낙','-','3','2021','72%','정밀가공 전용']
    ].map(r=>`<tr>${r.map((v,i)=>`<td class="${i>=2&&i<=4?'center':'left'}">${v}</td>`).join('')}</tr>`).join('');
    return (
      _box('공급 가능 소재',
        _addDel() +
        `<div class="grid-container"><table class="grid-table grid-table-wide">
          <thead><tr><th>소재구분</th><th>소재명</th><th>KS규격</th><th>주요공정</th><th>LME연동</th><th>월공급가능량</th><th>리드타임(일)</th><th>비고</th></tr></thead>
          <tbody>${matRows}</tbody>
        </table></div>`
      ) +
      _box('보유 설비',
        _addDel() +
        `<div class="grid-container"><table class="grid-table">
          <thead><tr><th>설비명</th><th>제조사</th><th>용량(톤)</th><th>수량(대)</th><th>설치년도</th><th>가동률(%)</th><th>비고</th></tr></thead>
          <tbody>${eqRows}</tbody>
        </table></div>`
      ) +
      _box('생산 능력',
        _row(_fg('form-group-m','월 최대 생산량',false,_inp('','','')),
             _fg('form-group-m','현재 가동률(%)',false,_inp('','82%','')),
             _fg('form-group-m','잔여 Capa(%)',false,_inp('','18%',''))) +
        _row(_fg('form-group-m','교대제',false,_sel('sf-shift',['1교대','2교대','3교대'],'2교대')),
             _fg('form-group-m','일 가동시간(h)',false,_inp('','16','')),
             _fg('form-group-m','월 가동일수(일)',false,_inp('','25',''))) +
        _row(_fg('form-group-l','주요 납품 OEM',false,_inp('','HMC · 기아 · GM','')),
             _fg('form-group-l','동종업계 경쟁사',false,_inp('','','')))
      )
    );
  };

  // ── 탭 8: 신용평가정보 ──
  window.m01002_tabCredit = function(supp) {
    const s = supp || {};
    const histRows = [
      ['2024','A','87','NICE','2024-03-15','-'],
      ['2023','B+','76','NICE','2023-03-10','부채비율 개선'],
      ['2022','B','71','NICE','2022-03-12','매출 감소']
    ].map(r=>{
      const gc = r[1].startsWith('A')?'var(--success)':r[1].startsWith('B')?'var(--primary)':'var(--warning)';
      return `<tr><td class="center">${r[0]}</td><td class="center" style="color:${gc};font-weight:500;">${r[1]}</td><td class="center">${r[2]}</td><td class="center">${r[3]}</td><td class="center">${r[4]}</td><td class="left">${r[5]}</td></tr>`;
    }).join('');
    return (
      _box('최신 신용평가',
        _row(_fg('form-group-m','신용등급',false,_inp('sf-creditgrade',s.creditGrade,'')),
             _fg('form-group-m','평가기관',false,_sel('sf-creditorg',['NICE','한국기업데이터','이크레더블'],'NICE')),
             _fg('form-group-m','평가일',false,`<input type="date" class="form-input">`),
             _fg('form-group-m','유효기간',false,`<input type="date" class="form-input">`)) +
        _row(_fg('form-group-m','종합점수(점)',false,_inp('sf-creditscore','','')),
             _fg('form-group-m','재무건전성',false,_sel('sf-financial',['양호','보통','취약'],'양호')),
             _fg('form-group-m','기업존속 전망',false,_sel('sf-outlook',['양호','보통','주의'],'양호'))) +
        _row(_fg('form-group-m','현금흐름등급',false,_inp('sf-cashflow',s.cashFlowGrade,'')),
             _fg('form-group-m','외치등급',false,_inp('sf-riskgrade',s.riskGrade,'')),
             _fg('form-group-m','Watch여부',false,_sel('sf-watch',['N','Y-주의','Y-경고'],'N')))
      ) +
      _box('신용평가 이력',
        `<div class="grid-container"><table class="grid-table">
          <thead><tr><th>평가연도</th><th>등급</th><th>점수</th><th>평가기관</th><th>평가일</th><th>특이사항</th></tr></thead>
          <tbody>${histRows}</tbody>
        </table></div>`
      ) +
      _box('파일첨부', _fileRow('신용평가서','재무제표'))
    );
  };

  window.m01002_save = function() {
    const name = (document.getElementById('sf-name')||{}).value;
    if (!name || !name.trim()) { Common.showToast('업체명을 입력해주세요', 'error'); return; }
    if (detailMode === 'new') {
      const item = {
        id: 'SUP-' + String(Date.now()).slice(-3),
        name: name.trim(),
        bizNo: (document.getElementById('sf-bizno')||{}).value || '',
        tier: (document.getElementById('sf-tier')||{}).value || 'Tier2',
        grade: (document.getElementById('sf-grade')||{}).value || 'B',
        managed: 'N', contract: 'N',
        manager: ''
      };
      MockData.save('suppliers', item);
    } else {
      const s = MockData.getById('suppliers', selectedSuppId);
      if (s) {
        s.name  = name.trim();
        s.bizNo = (document.getElementById('sf-bizno')||{}).value || s.bizNo;
        s.tier  = (document.getElementById('sf-tier')||{}).value || s.tier;
        s.grade = (document.getElementById('sf-grade')||{}).value || s.grade;
        MockData.save('suppliers', s);
      }
    }
    Common.showToast('저장되었습니다', 'success');
    m01002_backToList();
  };

  window.m01002_delete = function() {
    if (!selectedSuppId) { Common.showToast('삭제할 항목을 선택해주세요', 'error'); return; }
    if (confirm('선택된 협력사를 삭제하시겠습니까?')) {
      MockData.remove('suppliers', selectedSuppId);
      selectedSuppId = null;
      Common.showToast('삭제되었습니다', 'success');
      m01002_renderGrid();
    }
  };

  window.m01002_backToList = function() {
    document.getElementById('m01002-list').classList.remove('hidden');
    document.getElementById('m01002-detail').classList.add('hidden');
    m01002_renderGrid();
  };

  // 모든 함수 정의 완료 후 초기 렌더
  window.m01002_renderGrid();
};


/* ────────────────────────────────────────
   M01-004  소재·원자재 코드 관리
   ──────────────────────────────────────── */
window.render_M01_004 = function(container) {
  container.style.padding = '0';

  let mats = MockData.getAll('materials');
  if (mats.length === 0) { MockData.reset(); mats = MockData.getAll('materials'); }

  let selectedMatId = null;
  let searchText = '';
  let activeTab = '기본정보';
  let detailMode = 'new';

  const LME_KEY = { 'LME-STEEL-HRC':'steel','LME-AL':'al','LME-CU':'cu','LME-NICKEL':'ni','CRUDE-OIL':'oil' };

  // ── 헬퍼 ──
  const i4  = (id,v,ph,ro) => `<input class="form-input" id="${id}" value="${v||''}" placeholder="${ph||''}" ${ro?'readonly':''}>`;
  const s4  = (id,opts,cur) => `<select class="form-input form-select" id="${id}">${opts.map(o=>`<option ${o===cur?'selected':''}>${o}</option>`).join('')}</select>`;
  const fg4 = (lbl,req,html) => `<div class="form-group"><label class="form-label">${lbl}${req?' <span class="required">*</span>':''}</label>${html}</div>`;
  const row4 = (...f) => `<div class="form-row">${f.join('')}</div>`;
  const fgFull4 = (lbl,html) => `<div class="form-group" style="flex:0 0 100%"><label class="form-label">${lbl}</label>${html}</div>`;
  const box4 = (t,c) => `<div class="section-box"><div class="section-box-title">${t}</div>${c}</div>`;
  const fb4  = (lbl) => `<div style="flex:1;"><div style="font-size:var(--font-s);font-weight:500;margin-bottom:8px;">${lbl}</div><div style="border:1px solid var(--border);border-radius:var(--radius);padding:8px;"><button class="btn" style="font-size:11px;margin-bottom:8px;"><i data-lucide="download"></i> AllDownLoad</button><div style="border:1px solid #E5E7EB;border-radius:var(--radius);background:#FAFBFC;min-height:100px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:var(--font-xs);">파일을 드래그하거나<br>클릭하여 업로드</div></div></div>`;
  const fr4  = (l1,l2) => `<div style="display:flex;gap:24px;">${fb4(l1)}${fb4(l2)}</div>`;

  // ── HTML 골격 ──
  container.innerHTML = `<div class="screen-wrapper" style="display:flex;flex-direction:column;height:100%;padding:12px 16px;box-sizing:border-box;">
    <!-- 리스트 뷰 -->
    <div id="m01004-list">
      <div class="filter-bar">
        <div class="filter-search">
          <input type="text" id="m01004-search" placeholder="Search" oninput="m01004_onSearch(this.value)">
          <i data-lucide="search"></i>
        </div>
        <button class="filter-btn" onclick="Common.showToast('필터 기능은 준비 중입니다','info')"><i data-lucide="filter" class="icon-red"></i> 필터</button>
        <button class="filter-btn" onclick="Common.showToast('상태 필터는 준비 중입니다','info')"><i data-lucide="bar-chart-2" class="icon-blue"></i> 상태</button>
        <div class="filter-date-range">
          <input type="text" value="2025/01/01" readonly>
          <span class="date-separator">~</span>
          <input type="text" value="2027/12/31" readonly>
          <i data-lucide="calendar" class="icon-red"></i>
        </div>
        <div class="filter-right">
          <button class="btn btn-outline-blue" onclick="m01004_showDetail('new')"><i data-lucide="plus"></i> 신규</button>
        </div>
      </div>
      <div id="m01004-grid"></div>
    </div>
    <!-- 상세 뷰 -->
    <div id="m01004-detail" class="hidden" style="flex:1;display:flex;flex-direction:column;height:100%;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;margin-bottom:16px;border-bottom:1px solid var(--border);">
        <span id="m01004-detail-title" style="font-size:var(--font-xl);font-weight:700;"></span>
        <div id="m01004-detail-btns" style="display:flex;gap:6px;"></div>
      </div>
      <div class="detail-layout" style="flex:1;overflow:hidden;">
        <div class="detail-left" style="width:140px;">
          <div id="m01004-vtabs"></div>
        </div>
        <div class="detail-right" id="m01004-tab-content"></div>
      </div>
    </div>
  </div>`;

  const TABS4 = ['기본정보','물성정보','LME 연동','시세 이력','적용 품목'];

  // ── 리스트 그리드 ──
  window.m01004_onSearch = function(val) { searchText = val; m01004_renderGrid(); };

  window.m01004_renderGrid = function() {
    let data = MockData.getAll('materials');
    if (searchText) {
      const q = searchText.toLowerCase();
      data = data.filter(d => (d.name||'').toLowerCase().includes(q) || (d.id||'').toLowerCase().includes(q) || (d.spec||'').toLowerCase().includes(q));
    }
    const yc = v => v==='Y'?'var(--success)':'var(--text-muted)';
    const fmt = n => Number(n||0).toLocaleString('ko-KR');

    const rows = data.map(d => {
      const sel = d.id === selectedMatId ? 'selected' : '';
      return `<tr class="${sel}" onclick="m01004_selectRow('${d.id}')" style="cursor:pointer;">
        <td class="center"><input type="checkbox" ${d.id===selectedMatId?'checked':''} onclick="event.stopPropagation();m01004_selectRow('${d.id}')"></td>
        <td class="center"><span class="code-link" onclick="event.stopPropagation();m01004_showDetail('edit','${d.id}')">${d.id}</span></td>
        <td class="left">${d.name}</td>
        <td class="center">${d.group||'-'}</td>
        <td class="left">${d.spec||'-'}</td>
        <td class="center">${d.unit||'-'}</td>
        <td class="center" style="color:${yc(d.lme)};font-weight:500;">${d.lme||'-'}</td>
        <td class="left">${d.lmeCode||'-'}</td>
        <td class="right">${fmt(d.basePrice)}</td>
        <td class="center">${d.currency||'-'}</td>
        <td class="center" style="color:${yc(d.active)};font-weight:500;">${d.active||'-'}</td>
      </tr>`;
    }).join('');

    document.getElementById('m01004-grid').innerHTML = `
      <div class="grid-container" style="height:calc(100vh - 40px - 36px - 56px - 32px - 5px);">
        <table class="grid-table" style="min-width:1200px;">
          <colgroup>
            <col style="width:40px"><col style="width:90px"><col style="width:120px"><col style="width:80px">
            <col style="width:100px"><col style="width:60px"><col style="width:70px">
            <col style="width:120px"><col style="width:100px"><col style="width:60px"><col style="width:70px">
          </colgroup>
          <thead><tr>
            <th><input type="checkbox"></th>
            <th>소재코드</th><th>소재명</th><th>소재구분</th><th>규격</th>
            <th>단위</th><th>LME연동</th><th>LME코드</th>
            <th>기준단가</th><th>통화</th><th>사용여부</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  window.m01004_selectRow = function(id) {
    selectedMatId = selectedMatId === id ? null : id;
    m01004_renderGrid();
  };

  // ── 상세 화면 ──
  window.m01004_showDetail = function(mode, overrideId) {
    detailMode = mode;
    if (overrideId) selectedMatId = overrideId;
    const mat = mode === 'edit'
      ? MockData.getById('materials', selectedMatId)
      : MockData.getAll('materials')[0];
    document.getElementById('m01004-list').classList.add('hidden');
    document.getElementById('m01004-detail').classList.remove('hidden');
    document.getElementById('m01004-detail-title').textContent = mat ? mat.name : '';

    const btns = document.getElementById('m01004-detail-btns');
    if (mode === 'edit') {
      btns.innerHTML = `<button class="btn" onclick="Common.showToast('수정 모드로 전환합니다','info')"><i data-lucide="pencil"></i> 수정</button>
                        <button class="btn" onclick="m01004_backToList()"><i data-lucide="x"></i> 닫기</button>`;
    } else {
      btns.innerHTML = `<button class="btn btn-primary" onclick="m01004_save()"><i data-lucide="save"></i> 저장</button>
                        <button class="btn" onclick="m01004_backToList()"><i data-lucide="x"></i> 닫기</button>`;
    }
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);

    activeTab = '기본정보';
    m01004_renderVtabs();
    m01004_renderTabContent(activeTab, mat);
  };

  window.m01004_renderVtabs = function() {
    document.getElementById('m01004-vtabs').innerHTML = TABS4.map(t =>
      `<div class="detail-tab ${t===activeTab?'active':''}" onclick="m01004_switchTab('${t}')">${t}</div>`
    ).join('');
  };

  window.m01004_switchTab = function(tab) {
    activeTab = tab;
    const mat = detailMode === 'edit' ? MockData.getById('materials', selectedMatId) : null;
    m01004_renderVtabs();
    m01004_renderTabContent(tab, mat);
  };

  window.m01004_renderTabContent = function(tab, mat) {
    const el = document.getElementById('m01004-tab-content');
    const map = {
      '기본정보':  () => m01004_tabBasic(mat),
      '물성정보':  () => m01004_tabPhysics(mat),
      'LME 연동': () => m01004_tabLme(mat),
      '시세 이력': () => m01004_tabHistory(mat),
      '적용 품목': () => m01004_tabItems(mat),
    };
    el.innerHTML = (map[tab] || (() => ''))();
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  // ── 탭 1: 기본정보 ──
  window.m01004_tabBasic = function(mat) {
    const d = mat || {};
    return (
      box4('소재 기본정보',
        row4(fg4('소재코드',false,i4('mt-code',d.id||'자동발급','',true)),
             fg4('소재명',true,i4('mt-name',d.name,'')),
             fg4('소재구분',true,s4('mt-group',['강판','수지','비철금속','고무','기타'],d.group||'강판'))) +
        row4(fg4('규격',false,i4('mt-spec',d.spec,'')),
             fg4('KS규격',false,i4('mt-ks','','')),
             fg4('ASTM규격',false,i4('mt-astm','','')),
             fg4('JIS규격',false,i4('mt-jis','',' '))) +
        row4(fg4('단위',true,s4('mt-unit',['ton','kg','m²','EA'],d.unit||'ton')),
             fg4('통화',false,s4('mt-currency',['KRW','USD','EUR'],d.currency||'USD')),
             fg4('사용여부',false,s4('mt-active',['Y','N'],d.active||'Y'))) +
        row4(fgFull4('비고',`<textarea class="form-textarea" style="width:100%;min-height:60px;" placeholder="비고"></textarea>`))
      ) +
      box4('파일첨부', fr4('규격서','기타 첨부'))
    );
  };

  // ── 탭 2: 물성정보 ──
  window.m01004_tabPhysics = function(mat) {
    return (
      box4('물리적 특성',
        row4(fg4('비중',false,i4('','','')),
             fg4('밀도(g/cm³)',false,i4('','','')),
             fg4('열전도율(W/m·K)',false,i4('','',''))) +
        row4(fg4('인장강도(MPa)',false,i4('','','')),
             fg4('항복강도(MPa)',false,i4('','','')),
             fg4('연신율(%)',false,i4('','',''))) +
        row4(fg4('경도(HB)',false,i4('','','')),
             fg4('열팽창계수',false,i4('','','')),
             fg4('용융점(°C)',false,i4('','','')))
      ) +
      box4('화학 성분',
        row4(fg4('C(%)',false,i4('','','')),
             fg4('Si(%)',false,i4('','','')),
             fg4('Mn(%)',false,i4('','','')),
             fg4('P(%)',false,i4('','','')),
             fg4('S(%)',false,i4('','',''))) +
        row4(fg4('Cr(%)',false,i4('','','')),
             fg4('Ni(%)',false,i4('','','')),
             fg4('Mo(%)',false,i4('','','')),
             fg4('기타성분',false,i4('','','')))
      )
    );
  };

  // ── 탭 3: LME 연동 ──
  window.m01004_tabLme = function(mat) {
    const d = mat || {};
    return (
      box4('LME 연동 설정',
        row4(fg4('LME연동여부',true,s4('mt-lme',['Y','N'],d.lme||'Y')),
             fg4('LME코드',true,s4('mt-lmecode',['LME-STEEL-HRC','LME-AL','LME-CU','LME-NICKEL','CRUDE-OIL'],d.lmeCode||'LME-STEEL-HRC'))) +
        row4(fg4('포스코연동여부',false,s4('mt-posco',['Y','N'],'N')),
             fg4('포스코코드',false,i4('','',''))) +
        row4(fg4('할증률(%)',false,i4('mt-surcharge','12','')),
             fg4('환율적용기준',false,s4('mt-fxbasis',['당일','전월평균','전분기평균'],'전월평균'))) +
        row4(fg4('기준단가(원)',false,i4('mt-baseprice',Number(d.basePrice||0).toLocaleString('ko-KR'),'',true)),
             fg4('최종수신시세',false,i4('','$'+String(d.basePrice||0).slice(0,3)+'/ton','',true)),
             fg4('최종수신일시',false,i4('','2025-12-01 09:00','',true)))
      ) +
      box4('이상치 알림 설정',
        row4(fg4('알림기준(±%)',false,i4('','10','')),
             fg4('알림대상(이메일)',false,i4('','kim@donghee.co.kr','')),
             fg4('알림활성여부',false,s4('mt-alertyn',['Y','N'],'Y')))
      )
    );
  };

  // ── 탭 4: 시세 이력 ──
  window.m01004_tabHistory = function(mat) {
    const d = mat || {};
    const lmeData = MockData.getAll('lmePrice');
    const lmeKey = LME_KEY[d.lmeCode] || 'steel';
    const vals = lmeData.map(r => r[lmeKey] || 0);
    const maxVal = Math.max(...vals);
    const minVal = Math.min(...vals);

    const barRows = lmeData.map((row, i) => {
      const v = row[lmeKey] || 0;
      const pct = maxVal > 0 ? Math.round(v / maxVal * 100) : 0;
      const bg = v === maxVal ? 'var(--danger)' : v === minVal ? 'var(--success)' : 'var(--primary)';
      return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <div style="width:70px;font-size:var(--font-xs);color:var(--text-secondary);text-align:right;">${row.date}</div>
        <div style="flex:1;background:#f1f5f9;border-radius:2px;height:24px;">
          <div style="width:${pct}%;height:100%;background:${bg};border-radius:2px;transition:width 0.3s;"></div>
        </div>
        <div style="width:80px;font-size:var(--font-xs);font-weight:500;color:${bg};">$${v}/ton</div>
      </div>`;
    }).join('');

    const histRows = lmeData.map((row, i) => {
      const v = row[lmeKey] || 0;
      const prev = i < lmeData.length-1 ? (lmeData[i+1][lmeKey] || 0) : v;
      const diff = prev > 0 ? Math.round((v - prev) / prev * 100 * 10) / 10 : 0;
      const krw = Math.round(v * row.usdKrw).toLocaleString('ko-KR');
      const dc = diff > 0 ? 'color:var(--danger)' : diff < 0 ? 'color:var(--success)' : 'color:var(--text-muted)';
      const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '-';
      return `<tr>
        <td class="center">${row.date}</td>
        <td class="right">$${v}</td>
        <td class="right">${row.usdKrw.toLocaleString('ko-KR')}</td>
        <td class="right">₩${krw}</td>
        <td class="center" style="${dc};font-weight:500;">${arrow}${Math.abs(diff)}%</td>
      </tr>`;
    }).join('');

    return (
      box4('시세 추이 차트', `<div style="padding:4px 0;">${barRows}</div>`) +
      box4('시세 상세 이력',
        `<div class="grid-container"><table class="grid-table">
          <thead><tr><th>기준월</th><th>시세($/ton)</th><th>환율(KRW/USD)</th><th>원화환산가(원)</th><th>전월대비(%)</th></tr></thead>
          <tbody>${histRows}</tbody>
        </table></div>`
      )
    );
  };

  // ── 탭 5: 적용 품목 ──
  window.m01004_tabItems = function(mat) {
    const d = mat || {};
    const items = MockData.getAll('items').filter(it => (it.material||'') === (d.name||''));
    const fmt = n => Number(n||0).toLocaleString('ko-KR');
    const yc = v => v==='Y'?'color:var(--success)':'color:var(--text-muted)';
    const rows = items.length
      ? items.map(it => `<tr>
          <td class="center">${it.id}</td><td class="center">${it.drawNo||'-'}</td>
          <td class="left">${it.name}</td><td class="right">${fmt(it.weight)}</td>
          <td class="right">₩${fmt(it.basePrice)}</td>
          <td class="center" style="${yc(it.active)};font-weight:500;">${it.active||'-'}</td>
        </tr>`).join('')
      : `<tr><td colspan="6" class="center" style="color:var(--text-muted);padding:20px;">이 소재를 사용하는 품목이 없습니다</td></tr>`;
    return box4(`이 소재를 사용하는 품목 (${items.length}건)`,
      `<div class="grid-container"><table class="grid-table">
        <thead><tr><th>품목코드</th><th>도면번호</th><th>품명</th><th>중량(g)</th><th>기준단가</th><th>사용여부</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`
    );
  };

  window.m01004_save = function() {
    const name = (document.getElementById('mt-name')||{}).value;
    if (!name || !name.trim()) { Common.showToast('소재명을 입력해주세요', 'error'); return; }
    const item = {
      id: 'MAT-' + String(Date.now()).slice(-3),
      name: name.trim(),
      group: (document.getElementById('mt-group')||{}).value || '강판',
      spec: (document.getElementById('mt-spec')||{}).value || '',
      unit: (document.getElementById('mt-unit')||{}).value || 'ton',
      lme: (document.getElementById('mt-lme')||{}).value || 'N',
      lmeCode: (document.getElementById('mt-lmecode')||{}).value || '',
      basePrice: Number(((document.getElementById('mt-baseprice')||{}).value||'0').replace(/,/g,'')) || 0,
      currency: (document.getElementById('mt-currency')||{}).value || 'KRW',
      active: 'Y'
    };
    MockData.save('materials', item);
    Common.showToast('저장되었습니다', 'success');
    m01004_backToList();
  };

  window.m01004_backToList = function() {
    document.getElementById('m01004-list').classList.remove('hidden');
    document.getElementById('m01004-detail').classList.add('hidden');
    m01004_renderGrid();
  };

  // 초기 렌더
  window.m01004_renderGrid();
};


/* ────────────────────────────────────────
   M01-005  공정·가공비 표준 코드
   ──────────────────────────────────────── */
window.render_M01_005 = function(container) {
  container.style.padding = '0';

  let procs = MockData.getAll('processes');
  if (procs.length === 0) { MockData.reset(); procs = MockData.getAll('processes'); }

  let selectedProcId = null;
  let searchText = '';
  let activeTab = '기본정보';
  let detailMode = 'new';

  // ── 헬퍼 ──
  const i5   = (id,v,ph,ro) => `<input class="form-input" id="${id}" value="${v||''}" placeholder="${ph||''}" ${ro?'readonly':''}>`;
  const s5   = (id,opts,cur) => `<select class="form-input form-select" id="${id}">${opts.map(o=>`<option ${o===cur?'selected':''}>${o}</option>`).join('')}</select>`;
  const fg5  = (lbl,req,html) => `<div class="form-group"><label class="form-label">${lbl}${req?' <span class="required">*</span>':''}</label>${html}</div>`;
  const row5 = (...f) => `<div class="form-row">${f.join('')}</div>`;
  const fgFull5 = (lbl,html) => `<div class="form-group" style="flex:0 0 100%"><label class="form-label">${lbl}</label>${html}</div>`;
  const box5 = (t,c) => `<div class="section-box"><div class="section-box-title">${t}</div>${c}</div>`;
  const fmt5 = n => Number(n||0).toLocaleString('ko-KR');

  // ── HTML 골격 ──
  container.innerHTML = `<div class="screen-wrapper" style="display:flex;flex-direction:column;height:100%;padding:12px 16px;box-sizing:border-box;">
    <div id="m01005-list">
      <div class="filter-bar">
        <div class="filter-search">
          <input type="text" id="m01005-search" placeholder="Search" oninput="m01005_onSearch(this.value)">
          <i data-lucide="search"></i>
        </div>
        <button class="filter-btn" onclick="Common.showToast('필터 기능은 준비 중입니다','info')"><i data-lucide="filter" class="icon-red"></i> 필터</button>
        <button class="filter-btn" onclick="Common.showToast('상태 필터는 준비 중입니다','info')"><i data-lucide="bar-chart-2" class="icon-blue"></i> 상태</button>
        <div class="filter-date-range">
          <input type="text" value="2025/01/01" readonly>
          <span class="date-separator">~</span>
          <input type="text" value="2027/12/31" readonly>
          <i data-lucide="calendar" class="icon-red"></i>
        </div>
        <div class="filter-right">
          <button class="btn btn-outline-blue" onclick="m01005_showDetail('new')"><i data-lucide="plus"></i> 신규</button>
        </div>
      </div>
      <div id="m01005-grid"></div>
    </div>
    <div id="m01005-detail" class="hidden" style="flex:1;display:flex;flex-direction:column;height:100%;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;margin-bottom:16px;border-bottom:1px solid var(--border);">
        <span id="m01005-detail-title" style="font-size:var(--font-xl);font-weight:700;"></span>
        <div id="m01005-detail-btns" style="display:flex;gap:6px;"></div>
      </div>
      <div class="detail-layout" style="flex:1;overflow:hidden;">
        <div class="detail-left" style="width:140px;">
          <div id="m01005-vtabs"></div>
        </div>
        <div class="detail-right" id="m01005-tab-content"></div>
      </div>
    </div>
  </div>`;

  const TABS5 = ['기본정보','설비·인력','단가 이력','적용 품목'];

  // ── 리스트 ──
  window.m01005_onSearch = function(val) { searchText = val; m01005_renderGrid(); };

  window.m01005_renderGrid = function() {
    let data = MockData.getAll('processes');
    if (searchText) {
      const q = searchText.toLowerCase();
      data = data.filter(d =>
        (d.name||'').toLowerCase().includes(q) ||
        (d.id||'').toLowerCase().includes(q) ||
        (d.group||'').toLowerCase().includes(q)
      );
    }
    const yc = v => v==='Y' ? 'color:var(--success)' : 'color:var(--text-muted)';

    const rows = data.map(d => {
      const sel = d.id === selectedProcId ? 'selected' : '';
      return `<tr class="${sel}" onclick="m01005_selectRow('${d.id}')" style="cursor:pointer;">
        <td class="center"><input type="checkbox" ${d.id===selectedProcId?'checked':''} onclick="event.stopPropagation();m01005_selectRow('${d.id}')"></td>
        <td class="center"><span class="code-link" onclick="event.stopPropagation();m01005_showDetail('edit','${d.id}')">${d.id}</span></td>
        <td class="left">${d.name}</td>
        <td class="center">${d.group||'-'}</td>
        <td class="center">${d.sub||'-'}</td>
        <td class="right">${fmt5(d.cost)}</td>
        <td class="center">${d.unit||'-'}</td>
        <td class="right">${fmt5(d.hourRate)}</td>
        <td class="center">${d.indirectRate||'-'}%</td>
        <td class="center" style="${yc(d.active||'Y')};font-weight:500;">${d.active||'Y'}</td>
      </tr>`;
    }).join('');

    document.getElementById('m01005-grid').innerHTML = `
      <div class="grid-container" style="height:calc(100vh - 40px - 36px - 56px - 32px - 5px);">
        <table class="grid-table">
          <colgroup>
            <col style="width:40px"><col style="width:90px"><col style="width:140px">
            <col style="width:80px"><col style="width:80px"><col style="width:100px">
            <col style="width:60px"><col style="width:100px"><col style="width:80px"><col style="width:70px">
          </colgroup>
          <thead><tr>
            <th><input type="checkbox"></th>
            <th>공정코드</th><th>공정명</th><th>대분류</th><th>중분류</th>
            <th>표준가공비(원)</th><th>단위</th><th>시급(원/시간)</th>
            <th>간접비율(%)</th><th>사용여부</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  window.m01005_selectRow = function(id) {
    selectedProcId = selectedProcId === id ? null : id;
    m01005_renderGrid();
  };

  // ── 상세 ──
  window.m01005_showDetail = function(mode, overrideId) {
    detailMode = mode;
    if (overrideId) selectedProcId = overrideId;
    const proc = mode === 'edit'
      ? MockData.getById('processes', selectedProcId)
      : MockData.getAll('processes')[0];
    document.getElementById('m01005-list').classList.add('hidden');
    document.getElementById('m01005-detail').classList.remove('hidden');
    document.getElementById('m01005-detail-title').textContent = proc ? proc.name : '';

    const btns = document.getElementById('m01005-detail-btns');
    if (mode === 'edit') {
      btns.innerHTML = `<button class="btn" onclick="Common.showToast('수정 모드로 전환합니다','info')"><i data-lucide="pencil"></i> 수정</button>
                        <button class="btn" onclick="m01005_backToList()"><i data-lucide="x"></i> 닫기</button>`;
    } else {
      btns.innerHTML = `<button class="btn btn-primary" onclick="m01005_save()"><i data-lucide="save"></i> 저장</button>
                        <button class="btn" onclick="m01005_backToList()"><i data-lucide="x"></i> 닫기</button>`;
    }
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);

    activeTab = '기본정보';
    m01005_renderVtabs();
    m01005_renderTabContent(activeTab, proc);
  };

  window.m01005_renderVtabs = function() {
    document.getElementById('m01005-vtabs').innerHTML = TABS5.map(t =>
      `<div class="detail-tab ${t===activeTab?'active':''}" onclick="m01005_switchTab('${t}')">${t}</div>`
    ).join('');
  };

  window.m01005_switchTab = function(tab) {
    activeTab = tab;
    const proc = detailMode === 'edit' ? MockData.getById('processes', selectedProcId) : null;
    m01005_renderVtabs();
    m01005_renderTabContent(tab, proc);
  };

  window.m01005_renderTabContent = function(tab, proc) {
    const el = document.getElementById('m01005-tab-content');
    const map = {
      '기본정보':  () => m01005_tabBasic(proc),
      '설비·인력': () => m01005_tabEquip(proc),
      '단가 이력': () => m01005_tabHistory(),
      '적용 품목': () => m01005_tabItems(),
    };
    el.innerHTML = (map[tab] || (() => ''))();
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  // ── 탭 1: 기본정보 ──
  window.m01005_tabBasic = function(proc) {
    const d = proc || {};
    const groups = ['성형','사출성형','가공','표면처리','접합','조립','열처리'];
    const units  = ['shot','EA','시간','m²','점'];
    return (
      box5('공정 기본정보',
        row5(fg5('공정코드',false,i5('pc-code',d.id||'자동발급','',true)),
             fg5('공정명',true,i5('pc-name',d.name,'')),
             fg5('대분류',true,s5('pc-group',groups,d.group||'성형'))) +
        row5(fg5('중분류',false,i5('pc-sub',d.sub,'')),
             fg5('표준가공비(원)',true,i5('pc-cost',fmt5(d.cost),'')),
             fg5('단위',true,s5('pc-unit',units,d.unit||'shot'))) +
        row5(fg5('간접비율(%)',false,i5('pc-indirect',d.indirectRate||'','')),
             fg5('사용여부',false,s5('pc-active',['Y','N'],d.active||'Y')),
             fg5('적용시작일',false,i5('pc-startdate','2025/01/01',''))) +
        row5(fgFull5('비고',`<textarea class="form-textarea" style="width:100%;min-height:60px;" placeholder="비고"></textarea>`))
      )
    );
  };

  // ── 탭 2: 설비·인력 ──
  window.m01005_tabEquip = function(proc) {
    const d = proc || {};
    return (
      box5('설비 정보',
        row5(fg5('표준설비명',false,i5('','','')),
             fg5('설비제조사',false,i5('','','')),
             fg5('설비용량(톤)',false,i5('','',''))) +
        row5(fg5('시간당생산량(EA)',false,i5('','','')),
             fg5('가동률(%)',false,i5('','','')),
             fg5('사이클타임(초)',false,i5('','',' ')))
      ) +
      box5('인력 정보',
        row5(fg5('시급(원/시간)',false,i5('pc-hourrate',fmt5(d.hourRate),'')),
             fg5('작업자수(명)',false,i5('','1','')),
             fg5('교대제',false,s5('',['1교대','2교대','3교대'],'2교대'))) +
        row5(fg5('일가동시간(시간)',false,i5('','16','')),
             fg5('월가동일수(일)',false,i5('','25','')))
      )
    );
  };

  // ── 탭 3: 단가 이력 ──
  window.m01005_tabHistory = function() {
    const rows = [
      ['2025/01/01','1,200','45,000','15%','연간 단가 갱신','김구매'],
      ['2024/07/01','1,150','43,000','15%','하반기 조정','김구매'],
      ['2024/01/01','1,100','42,000','14%','연간 단가 갱신','박원가'],
      ['2023/01/01','1,050','40,000','14%','초기 등록','박원가'],
    ].map(r => `<tr>
      <td class="center">${r[0]}</td>
      <td class="right">${r[1]}</td>
      <td class="right">${r[2]}</td>
      <td class="center">${r[3]}</td>
      <td class="left">${r[4]}</td>
      <td class="center">${r[5]}</td>
    </tr>`).join('');
    return box5('가공비 변동 이력',
      `<div class="grid-container"><table class="grid-table">
        <thead><tr><th>적용시작일</th><th>표준가공비(원)</th><th>시급(원/시간)</th><th>간접비율(%)</th><th>변경사유</th><th>등록자</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`
    );
  };

  // ── 탭 4: 적용 품목 ──
  window.m01005_tabItems = function() {
    const rows = [
      ['ITM-001','DWG-S101','로어 암 브라켓','SPFC440','2,840','7,050'],
      ['ITM-002','DWG-S102','스태빌라이저 링크','SPFC440','1,560','5,340'],
      ['ITM-005','DWG-P301','브레이크 페달 암','SCM440','980','3,080'],
    ].map(r => `<tr>
      <td class="center">${r[0]}</td><td class="center">${r[1]}</td>
      <td class="left">${r[2]}</td><td class="center">${r[3]}</td>
      <td class="right">${r[4]}</td><td class="right">₩${r[5]}</td>
    </tr>`).join('');
    return box5('이 공정을 사용하는 품목',
      `<div class="grid-container"><table class="grid-table">
        <thead><tr><th>품목코드</th><th>도면번호</th><th>품명</th><th>소재</th><th>중량(g)</th><th>기준단가</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`
    );
  };

  window.m01005_save = function() {
    const name = (document.getElementById('pc-name')||{}).value;
    if (!name || !name.trim()) { Common.showToast('공정명을 입력해주세요', 'error'); return; }
    const item = {
      id: 'PRC-' + String(Date.now()).slice(-3),
      name: name.trim(),
      group: (document.getElementById('pc-group')||{}).value || '성형',
      sub: (document.getElementById('pc-sub')||{}).value || '',
      cost: Number(((document.getElementById('pc-cost')||{}).value||'0').replace(/,/g,'')) || 0,
      unit: (document.getElementById('pc-unit')||{}).value || 'EA',
      hourRate: Number(((document.getElementById('pc-hourrate')||{}).value||'0').replace(/,/g,'')) || 0,
      indirectRate: Number((document.getElementById('pc-indirect')||{}).value) || 0,
      active: 'Y'
    };
    MockData.save('processes', item);
    Common.showToast('저장되었습니다', 'success');
    m01005_backToList();
  };

  window.m01005_backToList = function() {
    document.getElementById('m01005-list').classList.remove('hidden');
    document.getElementById('m01005-detail').classList.add('hidden');
    m01005_renderGrid();
  };

  // 초기 렌더
  window.m01005_renderGrid();
};


/* ────────────────────────────────────────
   M01-003  품목(Item) 마스터 관리
   ──────────────────────────────────────── */
window.render_M01_003 = function(container) {
  container.style.padding = '0';

  let items = MockData.getAll('items');
  if (items.length === 0) { MockData.reset(); items = MockData.getAll('items'); }
  console.log('M01-003 render, items:', items.length);

  let selectedItemId = null;
  let searchText = '';
  let activeTab = '기본정보';
  let detailMode = 'new';

  // ── HTML 골격 ──
  container.innerHTML = `<div class="screen-wrapper" style="display:flex;flex-direction:column;height:100%;padding:12px 16px;box-sizing:border-box;">

    <!-- 리스트 뷰 -->
    <div id="m01003-list">
      <div class="filter-bar">
        <div class="filter-search">
          <input type="text" id="m01003-search" placeholder="Search" oninput="m01003_onSearch(this.value)">
          <i data-lucide="search"></i>
        </div>
        <button class="filter-btn" onclick="Common.showToast('필터 기능은 준비 중입니다','info')"><i data-lucide="filter" class="icon-red"></i> 필터</button>
        <button class="filter-btn" onclick="Common.showToast('상태 필터는 준비 중입니다','info')"><i data-lucide="bar-chart-2" class="icon-blue"></i> 상태</button>
        <div class="filter-date-range">
          <input type="text" value="2025/01/01" readonly>
          <span class="date-separator">~</span>
          <input type="text" value="2027/12/31" readonly>
          <i data-lucide="calendar" class="icon-red"></i>
        </div>
        <div class="filter-right">
          <button class="btn btn-outline-blue" onclick="m01003_showDetail('new')"><i data-lucide="plus"></i> 신규</button>
        </div>
      </div>
      <div id="m01003-grid"></div>
    </div>

    <!-- 상세 뷰 -->
    <div id="m01003-detail" class="hidden" style="flex:1;display:flex;flex-direction:column;height:100%;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;margin-bottom:16px;border-bottom:1px solid var(--border);">
        <span id="m01003-detail-title" style="font-size:var(--font-xl);font-weight:700;"></span>
        <div id="m01003-detail-btns" style="display:flex;gap:6px;"></div>
      </div>
      <div class="detail-layout" style="flex:1;overflow:hidden;">
        <div class="detail-left" style="width:140px;">
          <div id="m01003-vtabs"></div>
        </div>
        <div class="detail-right" id="m01003-tab-content"></div>
      </div>
    </div>
  </div>`;

  const TABS3 = ['기본정보','물성정보','공정정보','단가·LME','적용 프로젝트','도면·사양서'];

  // ── 헬퍼 (M01-002 공유 헬퍼 재사용, 로컬 alias) ──
  const i3 = (id, v, ph, ro) => `<input class="form-input" id="${id}" value="${v||''}" placeholder="${ph||''}" ${ro?'readonly':''}>`;
  const s3 = (id, opts, cur) => `<select class="form-input form-select" id="${id}">${opts.map(o=>`<option ${o===cur?'selected':''}>${o}</option>`).join('')}</select>`;
  const fg3 = (lbl, req, html) => `<div class="form-group"><label class="form-label">${lbl}${req?' <span class="required">*</span>':''}</label>${html}</div>`;
  const row3 = (...f) => `<div class="form-row">${f.join('')}</div>`;
  const fgFull = (lbl, req, html) => `<div class="form-group" style="flex:0 0 100%"><label class="form-label">${lbl}${req?' <span class="required">*</span>':''}</label>${html}</div>`;
  const box3 = (t, c) => `<div class="section-box"><div class="section-box-title">${t}</div>${c}</div>`;

  // ── 리스트 그리드 ──
  window.m01003_onSearch = function(val) { searchText = val; m01003_renderGrid(); };

  window.m01003_renderGrid = function() {
    let data = MockData.getAll('items');
    if (searchText) {
      const q = searchText.toLowerCase();
      data = data.filter(d =>
        (d.name||'').toLowerCase().includes(q) ||
        (d.drawNo||'').toLowerCase().includes(q)
      );
    }
    const lmeColor = v => v === 'Y' ? 'var(--success)' : 'var(--text-muted)';
    const fmt = n => Number(n||0).toLocaleString('ko-KR');

    const rows = data.map(d => {
      const sel = d.id === selectedItemId ? 'selected' : '';
      return `<tr class="${sel}" onclick="m01003_selectRow('${d.id}')" style="cursor:pointer;">
        <td class="center"><input type="checkbox" ${d.id===selectedItemId?'checked':''} onclick="event.stopPropagation();m01003_selectRow('${d.id}')"></td>
        <td class="center"><span class="code-link" onclick="event.stopPropagation();m01003_showDetail('edit','${d.id}')">${d.id}</span></td>
        <td class="center">${d.drawNo||'-'}</td>
        <td class="left">${d.name}</td>
        <td class="center">${d.cat1||'-'}</td>
        <td class="center">${d.cat2||'-'}</td>
        <td class="center">${d.cat3||'-'}</td>
        <td class="center">${d.material||'-'}</td>
        <td class="right">${fmt(d.weight)}</td>
        <td class="center">${d.unit||'-'}</td>
        <td class="center" style="color:${lmeColor(d.lme)};font-weight:500;">${d.lme||'-'}</td>
        <td class="right">${fmt(d.basePrice)}</td>
        <td class="center" style="color:${lmeColor(d.active)};font-weight:500;">${d.active||'-'}</td>
      </tr>`;
    }).join('');

    document.getElementById('m01003-grid').innerHTML = `
      <div class="grid-container" style="height:calc(100vh - 40px - 36px - 56px - 32px - 5px);">
        <table class="grid-table grid-table-wide" style="min-width:1200px;">
          <colgroup>
            <col style="width:40px"><col style="width:90px"><col style="width:100px"><col style="width:180px">
            <col style="width:80px"><col style="width:80px"><col style="width:90px">
            <col style="width:80px"><col style="width:70px"><col style="width:50px">
            <col style="width:70px"><col style="width:90px"><col style="width:70px">
          </colgroup>
          <thead><tr>
            <th><input type="checkbox"></th>
            <th>품목코드</th><th>도면번호</th><th>품명</th>
            <th>대분류</th><th>중분류</th><th>소분류</th>
            <th>소재</th><th>중량(g)</th><th>단위</th>
            <th>LME연동</th><th>기준단가</th><th>사용여부</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  };

  window.m01003_selectRow = function(id) {
    selectedItemId = selectedItemId === id ? null : id;
    m01003_renderGrid();
  };

  // ── 상세 화면 ──
  window.m01003_showDetail = function(mode, overrideId) {
    detailMode = mode;
    if (overrideId) selectedItemId = overrideId;
    const item = mode === 'edit'
      ? MockData.getById('items', selectedItemId)
      : MockData.getAll('items')[0];
    document.getElementById('m01003-list').classList.add('hidden');
    document.getElementById('m01003-detail').classList.remove('hidden');
    document.getElementById('m01003-detail-title').textContent = item ? item.name : '';

    const btns = document.getElementById('m01003-detail-btns');
    if (mode === 'edit') {
      btns.innerHTML = `<button class="btn" onclick="Common.showToast('수정 모드로 전환합니다','info')"><i data-lucide="edit-2"></i> 수정</button>
                        <button class="btn" onclick="m01003_backToList()"><i data-lucide="x"></i> 닫기</button>`;
    } else {
      btns.innerHTML = `<button class="btn btn-primary" onclick="m01003_save()"><i data-lucide="save"></i> 저장</button>
                        <button class="btn" onclick="m01003_backToList()"><i data-lucide="x"></i> 닫기</button>`;
    }
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);

    activeTab = '기본정보';
    m01003_renderVtabs();
    m01003_renderTabContent(activeTab, item);
  };

  window.m01003_renderVtabs = function() {
    document.getElementById('m01003-vtabs').innerHTML = TABS3.map(t =>
      `<div class="detail-tab ${t===activeTab?'active':''}" onclick="m01003_switchTab('${t}')">${t}</div>`
    ).join('');
  };

  window.m01003_switchTab = function(tab) {
    activeTab = tab;
    const item = detailMode === 'edit' ? MockData.getById('items', selectedItemId) : null;
    m01003_renderVtabs();
    m01003_renderTabContent(tab, item);
  };

  window.m01003_renderTabContent = function(tab, item) {
    const el = document.getElementById('m01003-tab-content');
    const map = {
      '기본정보':     () => m01003_tabBasic(item),
      '물성정보':     () => m01003_tabPhysics(item),
      '공정정보':     () => m01003_tabProcess(item),
      '단가·LME':    () => m01003_tabPrice(item),
      '적용 프로젝트': () => m01003_tabProjects(item),
      '도면·사양서':  () => m01003_tabDrawing(item),
    };
    el.innerHTML = (map[tab] || (() => ''))();
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
  };

  // ── 탭 1: 기본정보 ──
  window.m01003_tabBasic = function(item) {
    const d = item || {};
    return (
      box3('품목 기본정보',
        row3(fg3('품목코드',false,i3('it-code',d.id||'자동발급','',true)),
             fg3('도면번호',true,i3('it-drawno',d.drawNo,'')),
             fg3('품목유형',false,s3('it-type',['원자재','반제품','완제품'],'반제품'))) +
        row3(fgFull('품명(국문)',true,i3('it-name',d.name,''))) +
        row3(fgFull('품명(영문)',false,i3('it-nameen','',''))) +
        row3(fg3('대분류',true,s3('it-cat1',['원자재','가공품','구매품','외주품'],d.cat1||'가공품')),
             fg3('중분류',true,i3('it-cat2',d.cat2,'')),
             fg3('소분류',false,i3('it-cat3',d.cat3,''))) +
        row3(fg3('단위',false,s3('it-unit',['EA','kg','m','ton'],d.unit||'EA')),
             fg3('사용여부',false,s3('it-active',['Y','N'],d.active||'Y')),
             fg3('라이프사이클',false,s3('it-lc',['사용중','EOL예고','단종'],'사용중')))
      ) +
      box3('대체·호환 정보',
        row3(
          `<div class="form-group"><label class="form-label">대체품목</label><div style="display:flex;gap:4px;">${i3('it-alt','','품목명 검색')}<button class="btn" style="flex-shrink:0;">검색</button></div></div>`,
          `<div class="form-group"><label class="form-label">호환품목</label><div style="display:flex;gap:4px;">${i3('it-compat','','품목명 검색')}<button class="btn" style="flex-shrink:0;">검색</button></div></div>`
        ) +
        row3(fgFull('비고',false,`<textarea class="form-textarea" style="width:100%;min-height:60px;" placeholder="비고"></textarea>`))
      )
    );
  };

  // ── 탭 2: 물성정보 ──
  window.m01003_tabPhysics = function(item) {
    const d = item || {};
    return box3('소재 물성',
      row3(fg3('소재',true,i3('it-mat',d.material,'')),
           fg3('소재규격',false,i3('it-matspec','','')),
           fg3('KS규격',false,i3('it-ks','',''))) +
      row3(fg3('중량(g)',true,i3('it-weight',d.weight,'')),
           fg3('비중',false,i3('it-density','','예: 7.85')),
           fg3('밀도(g/cm³)',false,i3('it-density2','',''))) +
      row3(fg3('인장강도(MPa)',false,i3('it-ts','','')),
           fg3('항복강도(MPa)',false,i3('it-ys','','')),
           fg3('연신율(%)',false,i3('it-el','',''))) +
      row3(fg3('경도(HB)',false,i3('it-hb','','')),
           fg3('색상',false,i3('it-color','','')),
           fg3('표면처리',false,i3('it-surface','','')))
    );
  };

  // ── 탭 3: 공정정보 ──
  window.m01003_tabProcess = function(item) {
    const procs = MockData.getAll('processes');
    const opts = procs.map(p => p.name);
    const procRows = procs.slice(0,2).map(p => `<tr>
      <td class="center">${p.id}</td><td class="left">${p.name}</td>
      <td class="right">${Number(p.cost).toLocaleString('ko-KR')}</td>
      <td class="center">${p.indirectRate}%</td>
      <td class="right">${Math.round(p.cost*(1+p.indirectRate/100)).toLocaleString('ko-KR')}</td>
    </tr>`).join('');
    return (
      box3('적용 공정',
        row3(fg3('주공정',true,s3('it-proc1',opts,opts[0])),
             fg3('부공정',false,s3('it-proc2',['없음',...opts],'없음'))) +
        row3(fg3('열처리여부',false,s3('it-ht',['N','Y'],'N')),
             fg3('열처리종류',false,s3('it-httype',['해당없음','담금질','풀림','침탄','질화'],'해당없음'))) +
        row3(fg3('표면처리공정',false,s3('it-surf',['해당없음','도장','도금','양극산화','PVD'],'해당없음')),
             fg3('도장사양',false,i3('it-paintspec','','색상/두께')))
      ) +
      box3('공정별 가공비',
        `<div class="grid-container"><table class="grid-table">
          <thead><tr><th>공정코드</th><th>공정명</th><th>표준가공비(원)</th><th>간접비율(%)</th><th>적용가공비(원)</th></tr></thead>
          <tbody>${procRows}</tbody>
        </table></div>`
      )
    );
  };

  // ── 탭 4: 단가·LME ──
  window.m01003_tabPrice = function(item) {
    const d = item || {};
    const lmePrices = MockData.getAll('lmePrice');
    const latest = lmePrices[0] || {};
    const histRows = [
      ['2025-12-01', '$621/ton', '1,342', '12%', '₩7,050', 'LME갱신', '시스템'],
      ['2025-11-01', '$608/ton', '1,338', '12%', '₩6,920', 'LME갱신', '시스템'],
      ['2025-10-01', '$595/ton', '1,325', '12%', '₩6,780', '초기등록', '김구매'],
    ].map(r => `<tr>${r.map((v,i)=>`<td class="${i>=2&&i<=4?'right':'center'}">${v}</td>`).join('')}</tr>`).join('');
    return (
      box3('단가 정보',
        row3(fg3('기준단가(원)',false,i3('it-baseprice',d.basePrice,'')),
             fg3('통화',false,s3('it-currency',['KRW','USD'],'KRW')),
             fg3('환율적용기준',false,s3('it-fxbasis',['당일','전월평균'],'전월평균'))) +
        row3(fg3('LME연동여부',false,s3('it-lme',['Y','N'],d.lme||'Y')),
             fg3('LME코드',false,s3('it-lmecode',['LME-STEEL-HRC','LME-AL','LME-CU','LME-NICKEL','CRUDE-OIL','해당없음'],'LME-STEEL-HRC'))) +
        row3(fg3('할증률(%)',false,i3('it-surcharge','12','')),
             fg3('최종적용단가',false,i3('it-finalprice',`₩${Number(d.basePrice||0).toLocaleString('ko-KR')}`, '',true)))
      ) +
      box3('단가 변동 이력',
        `<div class="grid-container"><table class="grid-table">
          <thead><tr><th>기준일</th><th>LME시세</th><th>환율</th><th>할증률</th><th>적용단가</th><th>변동사유</th><th>등록자</th></tr></thead>
          <tbody>${histRows}</tbody>
        </table></div>`
      )
    );
  };

  // ── 탭 5: 적용 프로젝트 ──
  window.m01003_tabProjects = function(item) {
    const projRows = [
      ['PRJ-2025-001','NX5 SUV','서스펜션 어셈블리','P-S101','₩7,200','₩7,050','₩7,050','확정'],
      ['PRJ-2025-004','수소 SUV','서스펜션 어셈블리','P-H101','₩7,500','-','-','미확정'],
    ].map(r => {
      const stColor = r[7]==='확정' ? 'color:var(--success);font-weight:500;' : 'color:var(--text-muted);font-weight:500;';
      return `<tr>
        <td class="center">${r[0]}</td><td class="left">${r[1]}</td><td class="left">${r[2]}</td>
        <td class="center">${r[3]}</td><td class="right">${r[4]}</td>
        <td class="right">${r[5]}</td><td class="right">${r[6]}</td>
        <td class="center" style="${stColor}">${r[7]}</td>
      </tr>`;
    }).join('');
    return box3('적용 중인 프로젝트·BOM',
      `<div class="grid-container"><table class="grid-table grid-table-wide">
        <thead><tr><th>프로젝트ID</th><th>프로젝트명</th><th>어셈블리</th><th>Part No.</th><th>목표단가</th><th>산출단가</th><th>확정단가</th><th>상태</th></tr></thead>
        <tbody>${projRows}</tbody>
      </table></div>`
    );
  };

  // ── 탭 6: 도면·사양서 ──
  window.m01003_tabDrawing = function(item) {
    const d = item || {};
    const drawRows = [
      ['R03','DWG-S101-R03','2025-11-15','ECN-2025-0891 반영','김설계'],
      ['R02','DWG-S101-R02','2025-09-01','형상 변경','김설계'],
      ['R01','DWG-S101-R01','2025-06-10','초기 등록','김설계'],
    ].map(r => `<tr><td class="center">${r[0]}</td><td class="center">${r[1]}</td><td class="center">${r[2]}</td><td class="left">${r[3]}</td><td class="center">${r[4]}</td></tr>`).join('');
    return (
      box3('도면 첨부', _fileRow('도면 파일','사양서')) +
      box3('도면 이력',
        `<div class="grid-container"><table class="grid-table">
          <thead><tr><th>Rev</th><th>도면번호</th><th>변경일</th><th>변경사유</th><th>등록자</th></tr></thead>
          <tbody>${drawRows}</tbody>
        </table></div>`
      )
    );
  };

  window.m01003_save = function() {
    const name = (document.getElementById('it-name')||{}).value;
    if (!name || !name.trim()) { Common.showToast('품명을 입력해주세요', 'error'); return; }
    const item = {
      id: 'ITM-' + String(Date.now()).slice(-3),
      drawNo: (document.getElementById('it-drawno')||{}).value || '',
      name: name.trim(),
      cat1: (document.getElementById('it-cat1')||{}).value || '가공품',
      cat2: (document.getElementById('it-cat2')||{}).value || '',
      cat3: (document.getElementById('it-cat3')||{}).value || '',
      material: (document.getElementById('it-mat')||{}).value || '',
      weight: Number((document.getElementById('it-weight')||{}).value) || 0,
      unit: (document.getElementById('it-unit')||{}).value || 'EA',
      lme: (document.getElementById('it-lme')||{}).value || 'N',
      basePrice: Number((document.getElementById('it-baseprice')||{}).value) || 0,
      active: 'Y'
    };
    MockData.save('items', item);
    Common.showToast('저장되었습니다', 'success');
    m01003_backToList();
  };

  window.m01003_backToList = function() {
    document.getElementById('m01003-list').classList.remove('hidden');
    document.getElementById('m01003-detail').classList.add('hidden');
    m01003_renderGrid();
  };

  // 초기 렌더
  window.m01003_renderGrid();
};
