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
      <div class="filter-bar" style="display:flex;align-items:center;gap:8px;padding-bottom:12px;">
        <div class="filter-search">
          <input type="text" id="m01001-search" placeholder="프로젝트명 검색" oninput="m01001_onSearch(this.value)">
          <span class="filter-search-icon">🔍</span>
        </div>
        <button class="filter-btn" onclick="m01001_toggleFilter()">☰ 필터</button>
        <input type="date" id="m01001-date-from" class="form-input" style="width:130px;" onchange="m01001_renderGrid()">
        <span style="font-size:12px;color:var(--text-muted);">~</span>
        <input type="date" id="m01001-date-to" class="form-input" style="width:130px;" onchange="m01001_renderGrid()">
        <div class="filter-right" style="margin-left:auto;display:flex;gap:6px;">
          <button class="btn btn-outline-blue" onclick="m01001_showForm('new')">+ 신규등록</button>
          <button class="btn" onclick="m01001_showForm('edit')">수정</button>
          <button class="btn btn-outline-red" onclick="m01001_delete()">삭제</button>
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
          <button class="btn btn-primary" onclick="m01001_save()">저장</button>
          <button class="btn" onclick="m01001_backToList()">취소</button>
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
      <div class="filter-bar" style="display:flex;align-items:center;gap:8px;padding-bottom:12px;">
        <div class="filter-search" style="width:450px;">
          <input type="text" id="m01002-search" placeholder="Search" oninput="m01002_onSearch(this.value)" style="width:100%;">
          <span class="filter-search-icon">🔍</span>
        </div>
        <button class="filter-btn" onclick="m01002_toggleFilter()">☰ 필터</button>
        <button class="filter-btn" onclick="m01002_toggleBizType()">≡ 업체구분</button>
        <div class="filter-right" style="margin-left:auto;display:flex;gap:6px;">
          <button class="btn" onclick="Common.showToast('협력사 초대메일 기능은 준비 중입니다','info')">✉ 협력사 초대메일</button>
          <button class="btn btn-primary" onclick="m01002_showDetail('new')">+ 신규</button>
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
        <button class="btn btn-outline-red" onclick="Common.showToast('거래정지 처리되었습니다','success')">거래정지</button>
        <button class="btn" onclick="Common.showToast('수정 모드로 전환합니다','info')">수정</button>
        <button class="btn" onclick="m01002_backToList()">닫기</button>`;
    } else {
      btns.innerHTML = `
        <button class="btn btn-primary" onclick="m01002_save()">저장</button>
        <button class="btn" onclick="m01002_backToList()">닫기</button>`;
    }

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
    return `<div style="display:flex;gap:6px;margin-bottom:10px;"><button class="btn btn-outline-blue">+ 추가</button><button class="btn btn-outline-red">삭제</button></div>`;
  }
  function _fileBox(label) {
    return `<div class="file-attach-box"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;"><label style="margin:0;">${label}</label><button class="btn btn-gray-lite" style="height:24px;padding:0 8px;font-size:11px;">+ AllDownload</button></div><div class="file-drop-area" style="min-height:120px;">파일을 드래그하거나<br>클릭하여 업로드</div></div>`;
  }
  function _fileRow(l1, l2) {
    return `<div class="file-attach-row" style="gap:24px;">${_fileBox(l1)}${_fileBox(l2)}</div>`;
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
        `<div class="form-row" style="align-items:flex-end;">${_fg('form-group-s','우편번호',false,_inp('sf-zip',s.zip,'12345'))}<button class="btn" style="flex-shrink:0;">검색</button>${_fg('form-group-full','주소',true,_inp('sf-addr',s.addr,'기본주소'))}</div>` +
        _row(_fg('form-group-full','상세주소',false,_inp('sf-addr2',s.addr2,'상세주소'))) +
        `<div class="form-row" style="align-items:flex-end;">${_fg('form-group-s','공장 우편번호',false,_inp('sf-fzip','','12345'))}<button class="btn" style="flex-shrink:0;">검색</button>${_fg('form-group-full','공장주소',false,_inp('sf-faddr','','공장 기본주소'))}</div>` +
        _row(_fg('form-group-full','공장 상세주소',false,_inp('sf-faddr2','','공장 상세주소'))) +
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
