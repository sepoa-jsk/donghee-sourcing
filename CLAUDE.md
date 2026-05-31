# 동희산업 개발구매 솔루션

## 화면 생성 시 참조 순서 (반드시 이 순서로 읽기)

1. **SKILL.md — `## 개발구매 솔루션 표준 규칙` 섹션만 읽기**
   - 파일: `D:\Project\sepoa-ux-agent\.claude\skills\singlesuite-style\SKILL.md`
   - **전체 읽기 금지** — offset=1649 부터 파일 끝까지만 읽을 것
   - 금지 규칙(조회버튼 제거·FAB 금지·뱃지 금지 등) 확인 목적
   - 나머지 §1~§9 전체 스펙은 아래 `singlesuite-style 핵심 스펙 요약` 으로 대체

2. **LayoutGuide.html — 해당 패턴 섹션만 읽기**
   - 파일: `D:\Project\sepoa-ux-agent\references\LayoutGuide.html`
   - 생성할 화면의 패턴 번호(1~6)에 해당하는 섹션만 읽을 것
   - 색상·컴포넌트는 singlesuite-style 기준으로 덮어씀

3. **CLAUDE.md — 동희산업 특화 규칙 및 핵심 스펙 요약 (현재 파일)**
   - 이미 컨텍스트에 로드되어 있으므로 별도 Read 불필요

## 스킬 적용 우선순위
singlesuite-style > LayoutGuide.html > CLAUDE.md 동희 특화 규칙
충돌 시 singlesuite-style 기준을 따름

---

## singlesuite-style 핵심 스펙 요약 (적용 기준)

### 공통 프레임 (모든 화면 동일)
- GNB (.ss-gnb): height 56px / background **#ffffff** (흰색) / border-bottom 1px solid #e5e7eb
  - 좌측 순서 고정: [로고 sepoasoft] → [홈 아이콘] → [햄버거 ≡]
  - 우측 순서 고정: [English] → [도움말 ?] → [부서명/사용자명] → [로그아웃]
- 페이지 타이틀바 (.ss-page-title): height 48px / background #ffffff / font 17px bold
- 하단 탭바 (.ss-bottom-tab-bar): height 32px / background #f8fafc / SUMMARY 탭 좌측 고정
  - 활성 탭 배경: #3f4e65 / 비활성 탭 텍스트: #94a3b8
- border-radius: 4px 전역 적용 (버튼·인풋·팝업 모두)
- 아이콘 라이브러리: lucide 전용 (bootstrap-icons 사용 금지)

### 색상 토큰 (singlesuite-style 기준)
```css
--brand-primary:     #1746a3;   /* 메인 brand */
--brand-primary-alt: #0747a6;   /* 솔리드 블루 버튼·팝업 헤더 */
--brand-primary-dark:#003380;   /* 솔리드 블루 hover */
--success-green:     #16a34a;
--error-red:         #e11d48;
--required-red:      #ef4444;   /* 필수 마커 * */
--accent-red:        #D22C36;   /* 필터·검색 아이콘 전용 */
--text-primary:      #1f2937;
--text-label:        #222222;   /* 폼 라벨 전용 */
--bg-soft:           #f8fafc;   /* 그리드 헤더·탭바 */
--border-default:    #e5e7eb;
--border-input:      #d1d5db;
```

### 버튼 9종 (§3 사용 기준 강제)
| 액션 | 클래스 |
|------|--------|
| 조회 / 저장 / 접수 | `.btn-solid-blue` (#0747a6) |
| 신규 | `.btn-outline-blue` |
| 파일첨부 / 특이사항 / 템플릿 | `.btn-soft-blue` |
| 승인 | `.btn-soft-green` |
| 반려 | `.btn-soft-red` |
| 삭제 | `.btn-outline-red` |
| 취소 / 엑셀 / 행추가 / 행삭제 | `.btn-white` |
| 그리드 내 아이콘 버튼 | `.btn-gray-lite` |
| 이관 / 기타 보조 | `.btn-default` |

### 그리드 규칙 (§4 기준)
- 헤더: background **#f8fafc**, font-size 12px, height 40px
- 행 높이: 32px / border: 1px solid #e5e7eb
- 열 색상 5종만 (행마다 다른 색상 금지):
  - `.ss-col-default` #1f2937 / `.ss-col-blue` #0747a6 / `.ss-col-green` #16a34a
  - `.ss-col-red` #e11d48 / `.ss-col-link` #0747a6 + underline
- 열 정렬: `.ss-col-left` / `.ss-col-center` / `.ss-col-right` 중 하나 필수

### 필터 바 규칙 (§2-4, 5요소 순서 고정)
1. Search 입력창 (검색 아이콘 **#D22C36**)
2. 필터 토글 버튼 (Filter 아이콘 **#D22C36**)
3. 상태 토글 버튼 (BarChart2 아이콘 **#0747a6** — 단 하나 파랑)
4. 날짜 유형 드롭다운 (다중 날짜 컬럼 화면에만 선택 포함)
5. 날짜 범위 입력 (Calendar 아이콘 **#D22C36**, 형식 YYYY/MM/DD)
- 필터 바와 액션 버튼은 같은 행 (행 분리 금지)
- 필터 바에 `<label>` 텍스트 라벨 금지

---

## 레이아웃 패턴 (LayoutGuide.html 기준 구조, 컴포넌트는 singlesuite-style 적용)
| 패턴 | 구조 | 주요 적용 화면 |
|------|------|--------------|
| 패턴 1 | 필터 + 그리드 | 단순 조회·목록 화면 |
| 패턴 2 | 필터 + 요약카드 + 그리드 | 현황 요약 화면 |
| 패턴 3 | 상단 폼 + 하단 그리드 | 등록·입력 화면 |
| 패턴 4 | 폼 + 그리드 + 다중 버튼 | 복합 처리 화면 |
| 패턴 5-A | 좌 리스트 + 우 폼 | 상세 조회·편집 |
| 패턴 5-B | 좌 리스트 + 우 그리드 | 항목별 목록 |
| 패턴 5-C | 좌 그리드 + 우 폼 | BOM·원가 관리 |
| 패턴 5-D | 좌 그리드 + 우 그리드 | 비교 분석 |
| 패턴 6 | 대시보드 종합 | KPI + 차트 + 목록 |

---

## 동희산업 특화 규칙 (singlesuite-style 위반 없는 범위에서 적용)

### 브랜딩
- 로고 텍스트: "동희산업" (singlesuite의 "sepoasoft" 위치에 대체)
- OEM 표기: HMC (Hyundai Motor Company) — HMG 표기 사용 금지

### 배너 (화면 상단 GNB 바로 아래 추가)
- VAATZ 연동 배너: E-BOM 수신 상태 표시 (BOM 관련 화면)
  - background #E6F3EF, border-bottom 1px solid #A8D5C5
- LME 시세 배너: 강판·HDPE·Al 실시간 시세 (원가 관련 화면)
  - background #FFF8EC, border-bottom 1px solid #F0C060

### 소재 구분 태그
- SPFC / SPFH / HDPE / Al / CFRP
- 각 소재별 색상 배지 형태로 표시

### BOM 상태
- BOM Freeze 상태: 잠금 아이콘 표시 + 모든 편집 버튼 비활성화
- ECN 변경 Part: 행 배경 #FFF3E0 (연한 주황) + 변경 아이콘

### 계열사·이전가격
- 계열사 공급 Part: [계열사] 태그 + 이전가격 별도 컬럼 표시

### Tier 2·3 포털 (M06 전용)
- GNB 배경: **#085041** (singlesuite 흰색 GNB 예외 적용)
- Primary 색상: #0F6E56
- 내부 화면과 완전 분리

---

## 화면 생성 완료 시 필수 처리
1. screens/[모듈폴더]/[화면ID].html 로 저장
2. index.html 해당 카드 `pending` → `done` 변경
3. SCREEN_LIST.md 상태 `대기` → `완료` 변경
4. 파일 상단 주석에 화면ID·화면명·패턴·생성일 기록
