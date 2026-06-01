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
        <!-- 좌측 세로탭 (140px, 파일첨부 없음) -->
        <div class="detail-left" style="width:140px;">
          <div class="detail-left-tabs" id="m01002-vtabs"></div>
        </div>
        <!-- 우측 콘텐츠 -->
        <div class="detail-right" id="m01002-tab-content"></div>
      </div>
    </div>
  </div>`;

  const TABS = ['일반정보', '추가정보'];

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
    const supp = mode === 'edit' ? MockData.getById('suppliers', selectedSuppId) : null;
    document.getElementById('m01002-list').classList.add('hidden');
    document.getElementById('m01002-detail').classList.remove('hidden');
    document.getElementById('m01002-detail-title').textContent = supp ? supp.name : '(신규 등록)';

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
    if (tab === '일반정보') el.innerHTML = m01002_tabGeneral(supp);
    else                    el.innerHTML = m01002_tabExtra(supp);
  };

  window.m01002_tabGeneral = function(supp) {
    const s = supp || {};
    const inp = (id, val, ph, ro) =>
      `<input class="form-input" id="${id}" value="${val||''}" placeholder="${ph||''}" ${ro?'readonly':''}>`;
    const sel = (id, opts, cur) =>
      `<select class="form-input form-select" id="${id}">${opts.map(o=>`<option ${o===cur?'selected':''}>${o}</option>`).join('')}</select>`;
    return `
      <!-- 섹션1: 기본정보 -->
      <div class="section-box">
        <div class="section-box-title">기본정보</div>
        <div class="form-row">
          <div class="form-group form-group-m">
            <label class="form-label">업체코드</label>
            ${inp('sf-code', s.code||'자동발급', '', true)}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">업체구분</label>
            ${sel('sf-type', ['등록업체','잠재업체'], s.type||'등록업체')}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">언어</label>
            ${sel('sf-lang', ['한국어','English'], '한국어')}
          </div>
          <div class="form-group form-group-l">
            <label class="form-label">국가 <span class="required">*</span></label>
            ${sel('sf-country', ['KR - South Korea','US - United States','JP - Japan','CN - China'], s.country||'KR - South Korea')}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">도시</label>
            ${sel('sf-city', ['서울','인천','경기','부산','대구','광주','대전'], '')}
          </div>
        </div>
        <div class="form-row">
          <div class="form-group form-group-m">
            <label class="form-label">추천인</label>
            ${inp('sf-referrer', s.referrer, '추천인명')}
          </div>
        </div>
      </div>

      <!-- 섹션2: 사업자 정보 -->
      <div class="section-box">
        <div class="section-box-title">사업자 정보</div>
        <div class="form-row">
          <div class="form-group form-group-m">
            <label class="form-label">법인/개인</label>
            ${sel('sf-corptype', ['법인','개인'], '법인')}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">사업자등록번호 <span class="required">*</span></label>
            ${inp('sf-bizno', s.bizNo, '000-00-00000')}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">법인등록번호</label>
            ${inp('sf-corpno', s.corpNo, '-')}
          </div>
        </div>
        <div class="form-row">
          <div class="form-group form-group-full">
            <label class="form-label">회사명 <span class="required">*</span></label>
            ${inp('sf-name', s.name, '회사명 입력')}
          </div>
        </div>
        <div class="form-row">
          <div class="form-group form-group-full">
            <label class="form-label">회사명(영문)</label>
            ${inp('sf-nameEn', s.nameEn, 'Company Name')}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">대표자명 <span class="required">*</span></label>
            ${inp('sf-ceo', s.ceo, '대표자명')}
          </div>
        </div>
        <div class="form-row">
          <div class="form-group form-group-m">
            <label class="form-label">설립일자</label>
            <input type="date" class="form-input" id="sf-founded" value="${s.founded||''}">
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">대표이메일</label>
            ${inp('sf-email', s.email, 'email@company.com')}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">대표전화번호</label>
            ${inp('sf-tel', s.tel, '000-0000-0000')}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">업태</label>
            ${inp('sf-biztype', s.bizType, '예: 제조')}
          </div>
        </div>
        <div class="form-row">
          <div class="form-group form-group-l">
            <label class="form-label">업종</label>
            ${inp('sf-bizcat', s.bizCategory, '예: 자동차부품')}
          </div>
          <div class="form-group form-group-l">
            <label class="form-label">세부업종</label>
            ${inp('sf-bizdetail', s.bizDetail, '세부 업종 입력')}
          </div>
        </div>
        <div class="form-row" style="align-items:flex-end;">
          <div class="form-group form-group-s">
            <label class="form-label">우편번호</label>
            ${inp('sf-zip', s.zip, '12345')}
          </div>
          <button class="btn" style="margin-bottom:0;flex-shrink:0;">검색</button>
          <div class="form-group form-group-full">
            <label class="form-label">주소 <span class="required">*</span></label>
            ${inp('sf-addr', s.addr, '기본주소 입력')}
          </div>
        </div>
        <div class="form-row">
          <div class="form-group form-group-full">
            <label class="form-label">상세주소</label>
            ${inp('sf-addr2', s.addr2, '상세주소 입력')}
          </div>
        </div>
        <div class="form-row">
          <div class="form-group form-group-m">
            <label class="form-label">기업규모</label>
            ${sel('sf-corpsize', ['대기업','중견기업','중소기업','소기업'], '')}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">회사상장여부</label>
            ${sel('sf-listed', ['비상장','유가증권','코스닥'], '')}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">부지현황-대지(㎡)</label>
            ${inp('sf-land', '', '숫자 입력')}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">부지현황-건물(㎡)</label>
            ${inp('sf-building', '', '숫자 입력')}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">전체사업장(개소)</label>
            ${inp('sf-plants', '', '숫자 입력')}
          </div>
        </div>
      </div>

      <!-- 섹션3: 구매정보 -->
      <div class="section-box">
        <div class="section-box-title">구매정보</div>
        <div class="form-row">
          <div class="form-group form-group-m">
            <label class="form-label">기업규모</label>
            ${sel('sf-purchsize', ['대기업','중견기업','중소기업','소기업'], '')}
          </div>
          <div class="form-group form-group-m">
            <label class="form-label">과세여부</label>
            ${sel('sf-tax', ['과세','면세','영세율'], '')}
          </div>
          <div class="form-group form-group-l">
            <label class="form-label">주요품목</label>
            ${inp('sf-mainitems', s.bizCategory, '주요 공급 품목 입력')}
          </div>
        </div>
      </div>

      <!-- 섹션4: 파일첨부 -->
      <div class="section-box">
        <div class="section-box-title">파일첨부</div>
        <div class="file-attach-row" style="gap:24px;">
          <div class="file-attach-box">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <label style="margin:0;">사업자등록증</label>
              <button class="btn btn-gray-lite" style="height:24px;padding:0 8px;font-size:11px;">+ AllDownload</button>
            </div>
            <div class="file-drop-area" style="min-height:140px;">파일을 드래그하거나<br>클릭하여 업로드</div>
          </div>
          <div class="file-attach-box">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <label style="margin:0;">첨부파일</label>
              <button class="btn btn-gray-lite" style="height:24px;padding:0 8px;font-size:11px;">+ AllDownload</button>
            </div>
            <div class="file-drop-area" style="min-height:140px;">파일을 드래그하거나<br>클릭하여 업로드</div>
          </div>
        </div>
      </div>`;
  };

  window.m01002_tabExtra = function(supp) {
    const isNew = !supp;
    const today = new Date();

    // 담당자 그리드
    const contactRows = isNew
      ? `<tr><td colspan="7" class="center" style="color:var(--text-muted);padding:20px;">등록된 담당자가 없습니다</td></tr>`
      : `<tr><td class="center">구매담당</td><td class="center">홍길동</td><td class="center">영업팀</td><td class="center">과장</td><td class="center">010-1234-5678</td><td class="center">hong@korea.co.kr</td><td class="center">-</td></tr>
         <tr><td class="center">기술담당</td><td class="center">김철수</td><td class="center">기술팀</td><td class="center">대리</td><td class="center">010-9876-5432</td><td class="center">kim@korea.co.kr</td><td class="center">-</td></tr>`;

    // 인증정보 그리드
    const certRows = [
      { name:'ISO 9001',   org:'KR인증원', get:'2022-03-01', exp:'2025-03-01', status:'유효' },
      { name:'IATF 16949', org:'TÜV',     get:'2023-06-01', exp:'2026-06-01', status:'유효' },
      { name:'ISO 14001',  org:'KR인증원', get:'2021-09-01', exp:'2024-09-01', status:'만료' }
    ].map(c => {
      const diff = (new Date(c.exp) - today) / 86400000;
      const ec = diff < 0 ? 'color:var(--danger);font-weight:500;' : diff < 30 ? 'color:var(--danger);' : '';
      const sc = c.status === '만료' ? 'color:var(--danger);font-weight:500;' : 'color:var(--success);font-weight:500;';
      return `<tr><td class="center">${c.name}</td><td class="center">${c.org}</td><td class="center">${c.get}</td><td class="center" style="${ec}">${c.exp}</td><td class="center" style="${sc}">${c.status}</td></tr>`;
    }).join('');

    // 소재·품목 그리드
    const matRows = [
      { g:'강판', n:'SPFC440', p:'프레스·단조', l:'Y' },
      { g:'수지', n:'HDPE', p:'블로우성형', l:'N' },
      { g:'알루미늄', n:'Al5052', p:'다이캐스팅', l:'Y' }
    ].map(m => `<tr><td class="center">${m.g}</td><td class="center">${m.n}</td><td class="center">${m.p}</td><td class="center" style="color:${m.l==='Y'?'var(--success)':'var(--text-muted)'};font-weight:500;">${m.l}</td></tr>`).join('');

    const addDelBtns = `<div style="display:flex;gap:6px;margin-bottom:10px;"><button class="btn btn-outline-blue">+ 추가</button><button class="btn btn-outline-red">삭제</button></div>`;

    return `
      <div class="section-box">
        <div class="section-box-title">담당자정보</div>
        ${addDelBtns}
        <div class="grid-container"><table class="grid-table">
          <thead><tr><th>구분</th><th>담당자명</th><th>부서</th><th>직급</th><th>연락처</th><th>이메일</th><th>비고</th></tr></thead>
          <tbody>${contactRows}</tbody>
        </table></div>
      </div>
      <div class="section-box">
        <div class="section-box-title">거래조건</div>
        <div class="form-row">
          <div class="form-group form-group-m"><label class="form-label">결제조건</label><select class="form-input form-select"><option>현금</option><option>어음</option><option>외상</option></select></div>
          <div class="form-group form-group-m"><label class="form-label">결제주기</label><input class="form-input" placeholder="예: 월 1회"></div>
          <div class="form-group form-group-m"><label class="form-label">납기리드타임(일)</label><input type="number" class="form-input" placeholder="14"></div>
        </div>
        <div class="form-row">
          <div class="form-group form-group-m"><label class="form-label">최소발주수량</label><input type="number" class="form-input" placeholder="100"></div>
          <div class="form-group form-group-m"><label class="form-label">계약시작일</label><input type="date" class="form-input"></div>
          <div class="form-group form-group-m"><label class="form-label">계약종료일</label><input type="date" class="form-input"></div>
        </div>
        <div class="form-row">
          <div class="form-group form-group-m"><label class="form-label">거래상태</label><select class="form-input form-select"><option>거래중</option><option>거래중단</option><option>신규검토</option></select></div>
        </div>
      </div>
      <div class="section-box">
        <div class="section-box-title">인증정보</div>
        ${addDelBtns}
        <div class="grid-container"><table class="grid-table">
          <thead><tr><th>인증서명</th><th>인증기관</th><th>취득일</th><th>만료일</th><th>상태</th></tr></thead>
          <tbody>${certRows}</tbody>
        </table></div>
      </div>
      <div class="section-box">
        <div class="section-box-title">소재·품목</div>
        ${addDelBtns}
        <div class="grid-container"><table class="grid-table">
          <thead><tr><th>소재구분</th><th>소재명</th><th>주요공정</th><th>LME연동여부</th></tr></thead>
          <tbody>${matRows}</tbody>
        </table></div>
      </div>`;
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
