/* ============================================================
   common.js — 공통 컴포넌트 (GNB, 사이드바, 탭바, 토스트)
   ============================================================ */

/* ── GNB 렌더링 ── */
function renderGNB() {
  const el = document.getElementById('gnb');
  if (!el) return;
  el.innerHTML = `
    <span class="gnb-logo">동희산업</span>
    <span class="gnb-divider">|</span>
    <span class="gnb-system">개발구매 솔루션</span>
    <div class="gnb-right">
      <span>English</span>
      <span class="gnb-icon" title="도움말">?</span>
      <span>개발구매팀 / 홍길동</span>
      <span class="gnb-icon" title="로그아웃" onclick="alert('로그아웃')">⏻</span>
      <span class="gnb-icon" title="메뉴" id="gnb-menu-btn" onclick="toggleSidebar()">☰</span>
    </div>`;
}

/* ── 사이드바 메뉴 정의 ── */
const MENU = [
  { group: 'M01 기본정보', items: [
    { id: 'M01-001', label: '신차 프로젝트 등록·조회' },
    { id: 'M01-002', label: '공급사 기본정보' },
    { id: 'M01-003', label: '소재·원자재 코드' },
    { id: 'M01-004', label: '공정·가공비 표준 코드' },
    { id: 'M01-005', label: '사용자·권한 관리' },
  ]},
  { group: 'M02 BOM 관리', items: [
    { id: 'M02-001', label: '통합 BOM 관리' },
    { id: 'M02-002', label: 'Part List 등록·조회' },
    { id: 'M02-003', label: 'BOM 변경 이력(ECN)' },
    { id: 'M02-004', label: 'BOM Import/Export' },
    { id: 'M02-005', label: '그룹사 이전가격 BOM' },
  ]},
  { group: 'M03 원가·재료비', items: [
    { id: 'M03-001', label: '소재별 재료비 산출' },
    { id: 'M03-002', label: 'LME·시세 관리' },
    { id: 'M03-003', label: '단가 이력 관리' },
    { id: 'M03-004', label: '그룹사 이전가격 산출' },
  ]},
  { group: 'M04 목표가', items: [
    { id: 'M04-001', label: '목표가 설정·버전 관리' },
    { id: 'M04-002', label: 'Vs Target 모니터링' },
    { id: 'M04-003', label: '원가절감 과제(CR)' },
  ]},
  { group: 'M05 RFQ·견적 (내부)', items: [
    { id: 'M05-001', label: 'RFQ 발송 관리' },
    { id: 'M05-002', label: '견적 접수 현황' },
    { id: 'M05-003', label: '견적 비교 분석' },
    { id: 'M05-004', label: '협상 Round 관리' },
  ]},
  { group: 'M06 Tier 2·3 포털', items: [
    { id: 'M06-001', label: '포털 로그인·업체 인증' },
    { id: 'M06-002', label: 'RFQ 수신·목록 조회' },
    { id: 'M06-003', label: '견적서 작성·제출' },
    { id: 'M06-004', label: '견적 제출 이력 조회' },
    { id: 'M06-005', label: '협상 Round 회신' },
    { id: 'M06-006', label: '선정 결과 통보 확인' },
    { id: 'M06-007', label: '공급 단가 확정 내역' },
    { id: 'M06-008', label: '업체 기본정보 관리' },
  ]},
  { group: 'M07 결재·승인', items: [
    { id: 'M07-001', label: '목표가 승인 결재' },
    { id: 'M07-002', label: '공급사 선정 품의 결재' },
    { id: 'M07-003', label: '단가 확정 결재' },
    { id: 'M07-004', label: 'BOM Freeze·해제 결재' },
    { id: 'M07-005', label: '내 결재 현황 대시보드' },
  ]},
  { group: 'M08 ERP·VAATZ 연동', items: [
    { id: 'M08-001', label: 'VAATZ E-BOM 수신 현황' },
    { id: 'M08-002', label: 'ERP 단가 반영 현황' },
    { id: 'M08-003', label: '연동 오류 관리' },
  ]},
  { group: 'M09 레포트·대시보드', items: [
    { id: 'M09-001', label: '개발구매 현황 대시보드' },
    { id: 'M09-002', label: '원가 분석 리포트' },
    { id: 'M09-003', label: 'Vs Target Gap 리포트' },
    { id: 'M09-004', label: 'LME·원자재 동향 리포트' },
    { id: 'M09-005', label: '공급사 견적 이력 리포트' },
  ]},
];

/* ── 사이드바 렌더링 ── */
function renderSidebar(activeId) {
  const el = document.getElementById('sidebar');
  if (!el) return;

  el.innerHTML = MENU.map(group => `
    <div class="sidebar-group">
      <div class="sidebar-group-title">${group.group}</div>
      ${group.items.map(item => `
        <div class="sidebar-item${item.id === activeId ? ' active' : ''}"
             onclick="App.navigate('${item.id}')">
          ${item.label}
        </div>`).join('')}
    </div>`).join('');
}

/* ── 하단 탭바 렌더링 ── */
function renderBottomTabs(tabs, activeId) {
  const el = document.getElementById('bottom-tabs');
  if (!el) return;

  const summaryTab = `<div class="bottom-tab${!activeId ? ' active' : ''}" onclick="App.navigate(null)">SUMMARY</div>`;
  const openTabs = tabs.map(t => `
    <div class="bottom-tab${t.id === activeId ? ' active' : ''}" onclick="App.navigate('${t.id}')">
      ${t.label}
      <span class="bottom-tab-close" onclick="event.stopPropagation();App.closeTab('${t.id}')">✕</span>
    </div>`).join('');

  el.innerHTML = summaryTab + openTabs;
}

/* ── 사이드바 토글 ── */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

/* ── 토스트 알림 ── */
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── 모달 유틸 ── */
function openModal(html) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = html;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  return overlay;
}

function closeModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) overlay.remove();
}

/* ── 숫자 포맷 ── */
function numFmt(n, decimals = 0) {
  if (n == null || isNaN(n)) return '-';
  return Number(n).toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
