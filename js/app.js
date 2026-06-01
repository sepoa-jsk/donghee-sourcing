/* ============================================================
   app.js — SPA 라우터
   ============================================================ */

const App = {
  currentId: null,
  openTabs: [],   // { id, label }

  /* ── 스크린 맵 (화면ID → 모듈 파일) ── */
  screenMap: {
    'M01-001': { label: '신차 프로젝트 등록·조회',   src: 'screens/M01_기본정보/M01-001.html' },
    'M01-002': { label: '공급사 기본정보',            src: 'screens/M01_기본정보/M01-002.html' },
    'M02-001': { label: '통합 BOM 관리',              src: 'screens/M02_BOM관리/M02-001.html' },
    'M03-001': { label: '소재별 재료비 산출',         src: 'screens/M03_원가관리/M03-001.html' },
    'M04-002': { label: 'Vs Target 모니터링',         src: 'screens/M04_목표가관리/M04-002.html' },
    'M05-003': { label: '견적 비교 분석',             src: 'screens/M05_RFQ내부/M05-003.html' },
    'M06-003': { label: '견적서 작성·제출',           src: 'screens/M06_Tier포털/M06-003.html' },
  },

  /* ── 초기화 ── */
  init() {
    renderGNB();
    renderSidebar(null);
    renderBottomTabs(this.openTabs, null);

    // SUMMARY 탭 클릭 시 홈 복귀
    const summaryEl = document.querySelector('.bottom-tab');
    if (summaryEl) summaryEl.onclick = () => this.navigate(null);
  },

  /* ── 화면 전환 ── */
  navigate(screenId) {
    // 사이드바 닫기
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');

    if (!screenId) {
      this.currentId = null;
      this._renderHome();
      renderSidebar(null);
      renderBottomTabs(this.openTabs, null);
      document.getElementById('titlebar-text').textContent = '동희산업 개발구매 솔루션';
      document.getElementById('titlebar-breadcrumb').textContent = '';
      return;
    }

    const screen = this.screenMap[screenId];

    // 탭에 없으면 추가
    if (!this.openTabs.find(t => t.id === screenId)) {
      const label = screen ? screen.label : screenId;
      this.openTabs.push({ id: screenId, label });
    }

    this.currentId = screenId;

    // 타이틀바 업데이트
    if (screen) {
      document.getElementById('titlebar-text').textContent = screen.label;
      document.getElementById('titlebar-breadcrumb').textContent = screenId;
    }

    renderSidebar(screenId);
    renderBottomTabs(this.openTabs, screenId);
    this._loadScreen(screenId);
  },

  /* ── 탭 닫기 ── */
  closeTab(screenId) {
    this.openTabs = this.openTabs.filter(t => t.id !== screenId);

    if (this.currentId === screenId) {
      const last = this.openTabs[this.openTabs.length - 1];
      this.navigate(last ? last.id : null);
    } else {
      renderBottomTabs(this.openTabs, this.currentId);
    }
  },

  /* ── 화면 로드 ── */
  _loadScreen(screenId) {
    const content = document.getElementById('main-content');
    const screen = this.screenMap[screenId];

    if (!screen) {
      content.innerHTML = `
        <div class="empty-state" style="margin-top:120px;">
          <div class="empty-state-icon">🚧</div>
          <div><strong>${screenId}</strong> 화면은 준비 중입니다.</div>
        </div>`;
      return;
    }

    // iframe으로 기존 화면 로드
    content.style.padding = '0';
    content.innerHTML = `
      <iframe src="${screen.src}"
              style="width:100%;height:100%;border:none;display:block;"
              title="${screen.label}">
      </iframe>`;
  },

  /* ── 홈(SUMMARY) 화면 ── */
  _renderHome() {
    const content = document.getElementById('main-content');
    content.style.padding = '12px 16px';

    const done = Object.keys(this.screenMap).length;
    const total = 43;

    content.innerHTML = `
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-card-title">전체 화면</div>
          <div class="summary-card-value">${total} <span>개</span></div>
        </div>
        <div class="summary-card">
          <div class="summary-card-title">완료 화면</div>
          <div class="summary-card-value">${done} <span>개</span></div>
        </div>
        <div class="summary-card">
          <div class="summary-card-title">진행률</div>
          <div class="summary-card-value">${Math.round(done/total*100)} <span>%</span></div>
        </div>
        <div class="summary-card">
          <div class="summary-card-title">잔여</div>
          <div class="summary-card-value danger">${total - done} <span>개</span></div>
        </div>
      </div>

      <div class="grid-container">
        <table class="grid-table">
          <thead>
            <tr>
              <th style="width:100px">화면 ID</th>
              <th>화면명</th>
              <th style="width:80px">상태</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(this.screenMap).map(([id, s]) => `
              <tr style="cursor:pointer" onclick="App.navigate('${id}')">
                <td class="center ss-col-blue">${id}</td>
                <td class="left">${s.label}</td>
                <td class="center st-p2">완료</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  },
};

/* ── 앱 부트스트랩 ── */
document.addEventListener('DOMContentLoaded', () => App.init());
