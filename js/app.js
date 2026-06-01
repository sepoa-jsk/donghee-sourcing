const App = {
  currentScreen: null,
  history: [],
  isPortalMode: false,

  screenMap: {
    'M01-001': { module: 'M01', label: '프로젝트 관리', title: '신차 프로젝트 등록·조회', breadcrumb: '기본정보 관리 > 프로젝트 관리' },
    'M01-002': { module: 'M01', label: '협력사 관리', title: '공급사 기본정보', breadcrumb: '기본정보 관리 > 협력사 관리' },
    'M01-003': { module: 'M01', label: '품목 마스터', title: '품목(Item) 마스터 관리', breadcrumb: '기본정보 관리 > 품목 마스터' },
    'M01-004': { module: 'M01', label: '소재 관리', title: '소재·원자재 코드 관리', breadcrumb: '기본정보 관리 > 소재 관리' },
    'M01-005': { module: 'M01', label: '공정 관리', title: '공정·가공비 표준 코드', breadcrumb: '기본정보 관리 > 공정 관리' },
    'M02-001': { module: 'M02', label: '통합 BOM', title: '프로젝트별 통합 BOM 관리', breadcrumb: 'BOM 관리 > 통합 BOM' },
    'M02-002': { module: 'M02', label: 'Part List', title: 'Part List 관리', breadcrumb: 'BOM 관리 > Part List' },
    'M02-003': { module: 'M02', label: 'ECN 이력', title: 'BOM 변경이력(ECN)', breadcrumb: 'BOM 관리 > ECN' },
    'M02-004': { module: 'M02', label: 'Import/Export', title: 'BOM Import/Export', breadcrumb: 'BOM 관리 > Import/Export' },
    'M02-005': { module: 'M02', label: '이전가격 BOM', title: '그룹사 이전가격 BOM', breadcrumb: 'BOM 관리 > 이전가격' },
    'M03-001': { module: 'M03', label: '재료비 산출', title: '소재별 재료비 산출', breadcrumb: '원가관리 > 재료비 산출' },
    'M03-002': { module: 'M03', label: 'LME 시세', title: 'LME·시세 관리', breadcrumb: '원가관리 > LME 시세' },
    'M03-003': { module: 'M03', label: '단가 이력', title: '단가 이력 관리', breadcrumb: '원가관리 > 단가 이력' },
    'M03-004': { module: 'M03', label: '이전가격', title: '그룹사 이전가격 산출', breadcrumb: '원가관리 > 이전가격' },
    'M04-001': { module: 'M04', label: '목표가 설정', title: '목표가 설정·버전 관리', breadcrumb: '목표가 > 설정' },
    'M04-002': { module: 'M04', label: 'Vs Target', title: 'Vs Target 모니터링', breadcrumb: '목표가 > Vs Target' },
    'M04-003': { module: 'M04', label: 'CR 관리', title: '원가절감 과제(CR) 관리', breadcrumb: '목표가 > CR 관리' },
    'M05-001': { module: 'M05', label: 'RFQ 발송', title: 'RFQ 발송 관리', breadcrumb: 'RFQ > 발송' },
    'M05-002': { module: 'M05', label: '견적 접수', title: '견적 접수 현황', breadcrumb: 'RFQ > 접수 현황' },
    'M05-003': { module: 'M05', label: '견적 비교', title: '견적 비교 분석', breadcrumb: 'RFQ > 비교 분석' },
    'M05-004': { module: 'M05', label: '협상 관리', title: '협상 Round 관리', breadcrumb: 'RFQ > 협상' },
    'M06-001': { module: 'M06', label: '포털 로그인', title: '포털 로그인', breadcrumb: '협력사 포털 > 로그인', portal: true },
    'M06-002': { module: 'M06', label: 'RFQ 목록', title: 'RFQ 수신 목록', breadcrumb: '협력사 포털 > RFQ 목록', portal: true },
    'M06-003': { module: 'M06', label: '견적 작성', title: '견적서 작성·제출', breadcrumb: '협력사 포털 > 견적 작성', portal: true },
    'M06-004': { module: 'M06', label: '견적 이력', title: '견적 제출 이력', breadcrumb: '협력사 포털 > 이력', portal: true },
    'M06-005': { module: 'M06', label: '협상 회신', title: '협상 Round 회신', breadcrumb: '협력사 포털 > 협상', portal: true },
    'M06-006': { module: 'M06', label: '선정 결과', title: '선정 결과 확인', breadcrumb: '협력사 포털 > 선정결과', portal: true },
    'M06-007': { module: 'M06', label: '확정 단가', title: '공급 단가 확정 내역', breadcrumb: '협력사 포털 > 확정단가', portal: true },
    'M06-008': { module: 'M06', label: '업체 정보', title: '업체 기본정보', breadcrumb: '협력사 포털 > 업체정보', portal: true },
    'M07-001': { module: 'M07', label: '목표가 결재', title: '목표가 승인 결재', breadcrumb: '결재 > 목표가' },
    'M07-002': { module: 'M07', label: '선정 결재', title: '공급사 선정 결재', breadcrumb: '결재 > 공급사 선정' },
    'M07-003': { module: 'M07', label: '단가 결재', title: '단가 확정 결재', breadcrumb: '결재 > 단가 확정' },
    'M07-004': { module: 'M07', label: 'BOM Freeze', title: 'BOM Freeze 결재', breadcrumb: '결재 > BOM Freeze' },
    'M07-005': { module: 'M07', label: '내 결재', title: '내 결재 현황', breadcrumb: '결재 > 내 결재' },
    'M08-001': { module: 'M08', label: 'VAATZ', title: 'VAATZ E-BOM 수신 현황', breadcrumb: '연동 > VAATZ' },
    'M08-002': { module: 'M08', label: 'ERP 반영', title: 'ERP 단가 반영 현황', breadcrumb: '연동 > ERP' },
    'M08-003': { module: 'M08', label: '오류 관리', title: '연동 오류 관리', breadcrumb: '연동 > 오류' },
    'M09-001': { module: 'M09', label: '대시보드', title: '개발구매 현황 대시보드', breadcrumb: '레포트 > 대시보드' },
    'M09-002': { module: 'M09', label: '원가 분석', title: '원가 분석 리포트', breadcrumb: '레포트 > 원가 분석' },
    'M09-003': { module: 'M09', label: 'Gap 리포트', title: 'Vs Target Gap 리포트', breadcrumb: '레포트 > Gap' },
    'M09-004': { module: 'M09', label: 'LME 동향', title: 'LME 원자재 동향', breadcrumb: '레포트 > LME' },
    'M09-005': { module: 'M09', label: '견적 이력', title: '공급사 견적 이력', breadcrumb: '레포트 > 견적 이력' }
  },

  navigate(screenId) {
    const screen = this.screenMap[screenId];
    if (!screen) { console.error('Unknown screen:', screenId); return; }

    this.currentScreen = screenId;
    this.history.push(screenId);

    const isPortal = screen.portal || false;
    Common.renderGNB({ portal: isPortal });
    Common.renderSidebar(screenId);
    Common.renderTitleBar(screen.title, screen.breadcrumb);
    Common.addTab(screenId, screen.label);

    document.getElementById('sidebar').classList.remove('open');

    const main = document.getElementById('main-content');
    main.innerHTML = '<p style="text-align:center;color:#97A0AF;margin-top:200px;">화면 준비 중...</p>';

    // 모듈별 렌더 함수: render_M01_001 형식
    const fnName = 'render_' + screenId.replace('-', '_');
    if (typeof window[fnName] === 'function') {
      window[fnName](main);
    } else {
      main.innerHTML = `
        <div style="text-align:center;margin-top:150px;">
          <div style="font-size:48px;margin-bottom:16px;">🚧</div>
          <div style="font-size:18px;font-weight:600;color:var(--text-primary);margin-bottom:8px;">${screen.title}</div>
          <div style="font-size:13px;color:#97A0AF;">화면 ID: ${screenId} · 개발 예정</div>
        </div>
      `;
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  togglePortal() {
    this.isPortalMode = !this.isPortalMode;
    const btn = document.getElementById('portal-switch');
    if (btn) {
      if (this.isPortalMode) {
        btn.textContent = '🔙 내부 시스템 전환';
        btn.style.background = 'var(--primary)';
      } else {
        btn.textContent = '🔄 협력사 포털 전환';
        btn.style.background = '#085041';
      }
    }
    this.navigate(this.isPortalMode ? 'M06-002' : 'M05-002');
  },

  back() {
    if (this.history.length > 1) {
      this.history.pop();
      this.navigate(this.history.pop());
    }
  },

  init() {
    Common.renderGNB();
    Common.renderSidebar(null);
    Common.renderBottomTabs();
    this.navigate('M09-001');
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());

document.addEventListener('keydown', (e) => {
  const keyMap = {
    'F1': 'M09-001', 'F2': 'M02-001', 'F3': 'M03-001',
    'F4': 'M04-002', 'F6': 'M05-003', 'F7': 'M06-003',
    'F8': 'M07-005'
  };
  if (keyMap[e.key]) { e.preventDefault(); App.navigate(keyMap[e.key]); }
  if (e.key === 'Escape') { document.getElementById('sidebar').classList.remove('open'); }
});
