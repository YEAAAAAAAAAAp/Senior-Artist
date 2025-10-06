# GA4 CTA 추적 완전 가이드

## 📊 **전체 CTA 이벤트 목록 (총 22개)**

### 🏠 **index.html (메인 페이지) - 12개 CTA**

| 번호 | 이벤트명 | 위치 | 버튼 텍스트 | GA4에서 확인할 이벤트 | 분류 |
|------|----------|------|-------------|---------------------|------|
| 1 | `nav_artist` | header | 예술가용 | `cta_click` + `nav_artist` | 네비게이션 |
| 2 | `nav_collector` | header | 콜렉터용 | `cta_click` + `nav_collector` | 네비게이션 |
| 3 | `nav_about` | header | 소개 | `cta_click` + `nav_about` | 네비게이션 |
| 4 | `mobile_menu_toggle` | header | 모바일 메뉴 | `cta_click` + `mobile_menu_toggle` | 네비게이션 |
| 5 | `artist_start_primary` | hero_section | 예술가로 시작하기 | `cta_click` + `artist_start_primary` | 주요 CTA |
| 6 | `collector_start_primary` | hero_section | 콜렉터로 시작하기 | `cta_click` + `collector_start_primary` | 주요 CTA |
| 7 | `gallery_view_more` | gallery_section | 더 많은 작품 보기 | `cta_click` + `gallery_view_more` | 보조 CTA |
| 8 | `contact_form_close` | contact_modal | 폼 닫기 | `cta_click` + `contact_form_close` | 모달 액션 |
| 9 | `contact_form_submit_primary` | contact_modal | 등록하기 | `cta_click` + `contact_form_submit_primary` | 폼 제출 |
| 10 | `about_modal_close` | about_modal | 모달 닫기 | `cta_click` + `about_modal_close` | 모달 액션 |
| 11 | `modal_artist_start_primary` | about_modal | 예술가로 시작하기 | `cta_click` + `modal_artist_start_primary` | 모달 CTA |
| 12 | `modal_collector_start_secondary` | about_modal | 콜렉터로 시작하기 | `cta_click` + `modal_collector_start_secondary` | 모달 CTA |

### 🎨 **artist.html (작가 페이지) - 6개 CTA**

| 번호 | 이벤트명 | 위치 | 버튼 텍스트 | GA4에서 확인할 이벤트 | 분류 |
|------|----------|------|-------------|---------------------|------|
| 1 | `artist_registration_signup` | hero_section | 작가 등록하기 | `cta_click` + `artist_registration_signup` | 주요 CTA |
| 2 | `portfolio_optimization` | artist_features | 포트폴리오 최적화 | `cta_click` + `portfolio_optimization` | 기능 탐색 |
| 3 | `transaction_management` | artist_features | 거래 관리 | `cta_click` + `transaction_management` | 기능 탐색 |
| 4 | `customer_management` | artist_features | 고객 관리 | `cta_click` + `customer_management` | 기능 탐색 |
| 5 | `artist_form_close` | registration_form | 폼 닫기 | `cta_click` + `artist_form_close` | 폼 액션 |
| 6 | `artist_registration_completed` | registration_form | 등록 완료 | `cta_click` + `artist_registration_completed` | 폼 제출 |

### 🖼️ **collector.html (콜렉터 페이지) - 6개 CTA**

| 번호 | 이벤트명 | 위치 | 버튼 텍스트 | GA4에서 확인할 이벤트 | 분류 |
|------|----------|------|-------------|---------------------|------|
| 1 | `collector_interest_signup` | hero_section | 관심 등록하기 | `cta_click` + `collector_interest_signup` | 주요 CTA |
| 2 | `ai_story_exploration` | collector_features | AI 스토리 탐색 | `cta_click` + `ai_story_exploration` | 기능 탐색 |
| 3 | `secure_transaction` | collector_features | 안전한 거래 | `cta_click` + `secure_transaction` | 기능 탐색 |
| 4 | `instant_communication` | collector_features | 즉석 소통 | `cta_click` + `instant_communication` | 기능 탐색 |
| 5 | `collector_form_close` | interest_form | 폼 닫기 | `cta_click` + `collector_form_close` | 폼 액션 |
| 6 | `collector_interest_submitted` | interest_form | 관심 등록 완료 | `cta_click` + `collector_interest_submitted` | 폼 제출 |

---

## 🎯 **GA4에서 추적할 수 있는 이벤트 구조**

### **1. 통합 CTA 이벤트: `cta_click`**
모든 CTA 클릭이 하나의 이벤트로 집계됩니다.

**파라미터:**
- `event_category`: 'engagement'
- `event_label`: 고유 액션명 (예: 'artist_start_primary')
- `button_text`: 실제 버튼 텍스트 (예: '예술가로 시작하기')
- `button_location`: 페이지 내 위치 (예: 'hero_section')
- `button_type`: 'primary' 또는 'secondary'
- `page_path`: 페이지 경로
- `page_title`: 페이지 제목

### **2. 개별 액션 이벤트**
각 CTA마다 고유한 이벤트명으로 세부 추적이 가능합니다.

**파라미터:**
- `event_category`: 'user_action'
- `location`: 페이지 내 위치
- `button_text`: 버튼 텍스트
- `timestamp`: ISO 형식 시간
- `user_type`: 'main_visitor', 'artist', 'collector'

---

## 📈 **GA4 대시보드에서 확인하는 방법**

### **1. 실시간 보고서**
- **경로:** GA4 → 보고서 → 실시간
- **확인 항목:** 
  - 활성 사용자
  - 실시간 이벤트에서 `cta_click` 및 개별 이벤트 확인

### **2. 이벤트 보고서**
- **경로:** GA4 → 보고서 → 참여도 → 이벤트
- **주요 확인 이벤트:**
  - `cta_click` (모든 CTA 통합)
  - `artist_start_primary` (주요 전환 포인트)
  - `collector_start_primary` (주요 전환 포인트)
  - `artist_registration_completed` (작가 등록 완료)
  - `collector_interest_submitted` (콜렉터 관심 등록)

### **3. 맞춤 탐색**
- **경로:** GA4 → 탐색 → 빈 탐색 생성
- **설정:**
  - 측정기준: `Event name`, `button_location`, `button_type`
  - 측정항목: `Event count`, `Active users`
  - 필터: `Event name = cta_click`

### **4. 전환 설정 (권장)**
주요 CTA를 전환으로 설정:
1. `artist_registration_completed`
2. `collector_interest_submitted`
3. `artist_start_primary`
4. `collector_start_primary`

**설정 방법:**
- GA4 → 관리 → 전환 → 새 전환 이벤트 생성

---

## 🔧 **디버깅 및 테스트 도구**

### **브라우저 콘솔 명령어**
```javascript
// GA4 상태 확인
checkGA4()

// 모든 CTA 분석
analyzeCTAs()

// 수동 CTA 테스트
testCTA('test_action', 'console', 'Test Button')
```

### **자동 검증 시스템**
페이지 로드 후 3초 뒤 자동으로 실행되는 검증:
- ✅ trackCTA 함수 존재 확인
- ✅ gtag 함수 로드 확인
- ✅ 모든 CTA 형식 검증
- ✅ 자동 테스트 이벤트 전송

---

## ⚠️ **주의사항 및 모범 사례**

### **1. 이벤트명 명명 규칙**
- 소문자와 언더스코어(_) 사용
- 명확하고 일관된 접두사 (페이지별)
- 액션의 중요도 표시 (`_primary`, `_secondary`)

### **2. GA4 제한사항**
- 이벤트명: 최대 40자
- 파라미터명: 최대 40자
- 파라미터 값: 최대 100자
- 커스텀 측정기준: 속성당 최대 50개

### **3. 성능 최적화**
- 중복 이벤트 방지
- 에러 처리 구현
- 재시도 로직 포함

---

## 🎉 **결론**

**총 22개의 CTA**가 모두 **표준화된 trackCTA 함수**를 통해 **GA4로 안정적으로 전송**됩니다.

- ✅ **이중 추적**: `cta_click` (통합) + 개별 이벤트 (세부 분석)
- ✅ **에러 방지**: gtag 로드 실패 시 자동 재시도
- ✅ **실시간 디버깅**: 브라우저 콘솔에서 즉시 확인 가능
- ✅ **자동 검증**: 페이지 로드 시 CTA 설정 자동 점검
- ✅ **GA4 표준 준수**: Google Analytics 4 권장 방식 완전 적용

**GA4 대시보드에서 곧바로 모든 CTA 데이터를 확인할 수 있습니다!**