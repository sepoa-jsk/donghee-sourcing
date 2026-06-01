const Common = {

  renderGNB(options = {}) {
    const isPortal = options.portal || false;
    const gnb = document.getElementById('gnb');
    if (!gnb) return;
    gnb.innerHTML = `
      <span class="gnb-icon" onclick="Common.toggleSidebar()" style="cursor:pointer;margin-right:8px;">☰</span>
      <span class="gnb-logo">${isPortal ? '동희산업 협력사 포털' : '동희산업'}</span>
      <span class="gnb-divider">|</span>
      <span class="gnb-system">${isPortal ? 'Supplier Portal' : '개발구매 솔루션'}</span>
      <span class="gnb-right">
        <span>English</span>
        <span class="gnb-icon">❓</span>
        <span>${isPortal ? '(주)한국정밀 / 홍길동' : '개발구매팀 / 김구매'}</span>
        <span class="gnb-icon" title="로그아웃">⎋</span>
      </span>
    `;
    if (isPortal) document.body.classList.add('portal-mode');
    else document.body.classList.remove('portal-mode');
  },

  renderSidebar(activeMenu) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const menuStructure = [
      { group: "기본정보 관리", items: [
        { id: "M01-001", label: "프로젝트 관리" },
        { id: "M01-002", label: "협력사 관리" },
        { id: "M01-003", label: "품목 마스터" },
        { id: "M01-004", label: "소재·원자재 관리" },
        { id: "M01-005", label: "공정·가공비 관리" }
      ]},
      { group: "BOM 관리", items: [
        { id: "M02-001", label: "통합 BOM 관리" },
        { id: "M02-002", label: "Part List" },
        { id: "M02-003", label: "BOM 변경이력(ECN)" },
        { id: "M02-004", label: "BOM Import/Export" },
        { id: "M02-005", label: "그룹사 이전가격 BOM" }
      ]},
      { group: "원가·재료비 관리", items: [
        { id: "M03-001", label: "재료비 산출" },
        { id: "M03-002", label: "LME·시세 관리" },
        { id: "M03-003", label: "단가 이력 관리" },
        { id: "M03-004", label: "그룹사 이전가격" }
      ]},
      { group: "목표가 관리", items: [
        { id: "M04-001", label: "목표가 설정" },
        { id: "M04-002", label: "Vs Target 모니터링" },
        { id: "M04-003", label: "CR 과제 관리" }
      ]},
      { group: "RFQ·견적 관리", items: [
        { id: "M05-001", label: "RFQ 발송" },
        { id: "M05-002", label: "견적 접수 현황" },
        { id: "M05-003", label: "견적 비교 분석" },
        { id: "M05-004", label: "협상 Round 관리" }
      ]},
      { group: "결재·승인", items: [
        { id: "M07-001", label: "목표가 결재" },
        { id: "M07-002", label: "공급사 선정 결재" },
        { id: "M07-003", label: "단가 확정 결재" },
        { id: "M07-004", label: "BOM Freeze 결재" },
        { id: "M07-005", label: "내 결재 현황" }
      ]},
      { group: "연동 관리", items: [
        { id: "M08-001", label: "VAATZ E-BOM 현황" },
        { id: "M08-002", label: "ERP 반영 현황" },
        { id: "M08-003", label: "연동 오류 관리" }
      ]},
      { group: "레포트", items: [
        { id: "M09-001", label: "대시보드" },
        { id: "M09-002", label: "원가 분석" },
        { id: "M09-003", label: "Vs Target Gap" },
        { id: "M09-004", label: "LME 동향" },
        { id: "M09-005", label: "견적 이력" }
      ]}
    ];

    let html = '';
    menuStructure.forEach(group => {
      html += `<div class="sidebar-group">`;
      html += `<div class="sidebar-group-title">${group.group}</div>`;
      group.items.forEach(item => {
        const active = item.id === activeMenu ? 'active' : '';
        html += `<div class="sidebar-item ${active}" onclick="App.navigate('${item.id}')">${item.label}</div>`;
      });
      html += `</div>`;
    });
    sidebar.innerHTML = html;
  },

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('open');
  },

  renderTitleBar(title, breadcrumb) {
    const el = document.getElementById('titlebar');
    if (!el) return;
    el.innerHTML = `
      <span class="titlebar-text">${title}</span>
      <span class="titlebar-breadcrumb">${breadcrumb}</span>
    `;
  },

  tabs: [],

  renderBottomTabs() {
    const el = document.getElementById('bottom-tabs');
    if (!el) return;
    let html = `<div class="bottom-tab" onclick="App.navigate('M09-001')">SUMMARY</div>`;
    this.tabs.forEach(tab => {
      const active = tab.id === App.currentScreen ? 'active' : '';
      html += `<div class="bottom-tab ${active}" onclick="App.navigate('${tab.id}')">
        ${tab.label}
        <span class="bottom-tab-close" onclick="event.stopPropagation(); Common.closeTab('${tab.id}')">✕</span>
      </div>`;
    });
    el.innerHTML = html;
  },

  addTab(id, label) {
    if (!this.tabs.find(t => t.id === id)) {
      this.tabs.push({ id, label });
    }
    this.renderBottomTabs();
  },

  closeTab(id) {
    this.tabs = this.tabs.filter(t => t.id !== id);
    this.renderBottomTabs();
    if (App.currentScreen === id) {
      const last = this.tabs[this.tabs.length - 1];
      App.navigate(last ? last.id : 'M09-001');
    }
  },

  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },

  openModal(title, contentHtml, buttons = []) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';
    const btnHtml = buttons.map(b =>
      `<button class="btn ${b.class || ''}" onclick="${b.onclick}">${b.label}</button>`
    ).join('');
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <span>${title}</span>
          <span style="cursor:pointer" onclick="Common.closeModal()">✕</span>
        </div>
        <div class="modal-body">${contentHtml}</div>
        <div class="modal-footer">${btnHtml}</div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) Common.closeModal();
    });
  },

  closeModal() {
    const el = document.getElementById('modal-overlay');
    if (el) el.remove();
  },

  // columns: [{key, label, width, align, render}]
  // options: { checkbox, onRowClick, selectedId }
  renderGrid(containerId, columns, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '<div class="grid-container"><table class="grid-table"><colgroup>';
    if (options.checkbox) html += '<col style="width:40px">';
    columns.forEach(c => { html += `<col style="width:${c.width || 'auto'}">`; });
    html += '</colgroup><thead><tr>';
    if (options.checkbox) html += '<th><input type="checkbox"></th>';
    columns.forEach(c => { html += `<th>${c.label}</th>`; });
    html += '</tr></thead><tbody>';

    data.forEach(row => {
      const selected = options.selectedId && row.id === options.selectedId ? 'selected' : '';
      const clickHandler = options.onRowClick ? `onclick="${options.onRowClick}('${row.id}')"` : '';
      html += `<tr class="${selected}" ${clickHandler} style="cursor:pointer">`;
      if (options.checkbox) html += `<td class="center"><input type="checkbox"></td>`;
      columns.forEach(c => {
        const align = c.align || 'left';
        const val = c.render ? c.render(row[c.key], row) : (row[c.key] != null ? row[c.key] : '');
        const cls = align === 'center' ? 'center' : align === 'right' ? 'right' : '';
        html += `<td class="${cls}">${val}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
  }
};
