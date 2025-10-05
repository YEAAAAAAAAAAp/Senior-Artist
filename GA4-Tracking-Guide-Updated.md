# MentorMatch Korea - GA4 CTA 추적 완전 가이드

## 📊 개요
이 문서는 MentorMatch Korea 랜딩페이지의 Google Analytics 4 (GA4) CTA 추적 시스템에 대한 완전한 구현 가이드입니다.

## 🔧 GA4 설정 정보
- **측정 ID**: `G-DE2ZNKWV2W`
- **GTM 연결**: 없음 (직접 GA4 구현)
- **이벤트 방식**: gtag.js 기반 직접 추적

## 📈 구현된 CTA 이벤트 코드 체계

### 1. 네비게이션 메뉴 (navigation)
```javascript
trackCTA('nav_artist', 'navigation', '예술가용')
trackCTA('nav_collector', 'navigation', '콜렉터용') 
trackCTA('nav_about', 'navigation', '소개')
```

### 2. 히어로 섹션 메인 CTA (hero_section)
```javascript
trackCTA('artist_signup', 'hero_section', '작가 기능 체험하기')
trackCTA('collector_signup', 'hero_section', '컬렉션 기능 체험하기')
```

### 3. 갤러리 섹션 (gallery_section)
```javascript
// 개별 작품 조회
trackCTA('artwork_view_urban_solitude', 'gallery_section', '도시의 고독 작품 조회')
trackCTA('artwork_view_memories_garden', 'gallery_section', '추억의 정원 작품 조회')
trackCTA('artwork_view_time_flow', 'gallery_section', '시간의 흐름 작품 조회')
trackCTA('artwork_view_silent_dialogue', 'gallery_section', '무언의 대화 작품 조회')

// 갤러리 CTA 버튼
trackCTA('gallery_view_all_artworks', 'gallery_section', '모든 작품 보기')
```

### 4. 모달 상호작용 (about_modal)
```javascript
// 모달 열기/닫기
trackCTA('modal_open', 'about_modal', '서비스 소개 모달')
trackCTA('modal_close', 'about_modal', '서비스 소개 모달 닫기')

// 모달 내 CTA 버튼
trackCTA('modal_artist_start', 'about_modal_footer', '예술가로 시작하기')
trackCTA('modal_collector_start', 'about_modal_footer', '콜렉터로 시작하기')
```

### 5. 폼 제출 (contact_form)
```javascript
trackCTA('form_submit_lead', 'contact_form', '리드 폼 제출 - ${userType}')
```

### 6. 일반 상호작용 (page_element)
```javascript
trackCTA('general_click_interaction', 'page_element', '클릭된 요소 텍스트')
```

## 🎯 GA4 이벤트 구조

### 메인 이벤트: `cta_click`
모든 CTA 클릭은 표준화된 `cta_click` 이벤트로 전송됩니다.

**매개변수:**
- `event_category`: 'engagement' (고정값)
- `event_label`: 액션명 (예: 'artist_signup')
- `button_text`: 버튼 텍스트 (예: '작가 기능 체험하기')
- `button_location`: 버튼 위치 (예: 'hero_section')
- `button_type`: 'primary' 또는 'secondary'
- `page_path`: 현재 페이지 경로
- `page_title`: 페이지 제목

### 개별 액션 이벤트
각 CTA는 추가로 개별 이벤트도 전송합니다 (세부 분석용).

**매개변수:**
- `event_category`: 'user_action'
- `location`: CTA 위치
- `button_text`: 버튼 텍스트
- `timestamp`: 이벤트 발생 시간

## 🔍 GA4에서 확인 방법

### 1. 실시간 보고서
1. GA4 → 보고서 → 실시간
2. 이벤트 수별 이벤트명 확인
3. `cta_click` 이벤트 실시간 추적

### 2. 이벤트 보고서
1. GA4 → 보고서 → 이벤트
2. 이벤트명별 발생 횟수 확인
3. 이벤트 매개변수 세부 분석

### 3. 사용자 정의 보고서
1. GA4 → 탐색 → 자유 형식
2. 측정기준: `event_name`, `button_location`, `button_text`
3. 측정항목: `이벤트 수`, `사용자 수`

## 📊 전환 퍼널 분석

### 설정된 퍼널 단계
1. **페이지 조회** → `page_view` 이벤트
2. **CTA 관심** → `cta_click` 이벤트
3. **모달 열기** → `modal_open` 액션
4. **폼 시작** → 폼 필드 클릭 (자동 추적)
5. **폼 제출** → `form_submit_lead` 액션

### GA4 퍼널 설정 방법
1. GA4 → 탐색 → 퍼널 탐색
2. 단계 추가:
   - 1단계: `page_view`
   - 2단계: `cta_click`
   - 3단계: `modal_open`
   - 4단계: `form_submit_lead`

## 🎨 사용자 세그먼트

### 권장 세그먼트
1. **예술가 관심군**: `nav_artist` 또는 `artist_signup` 클릭
2. **콜렉터 관심군**: `nav_collector` 또는 `collector_signup` 클릭
3. **갤러리 관심군**: `artwork_view_*` 이벤트 발생
4. **고관여 사용자**: 3개 이상 CTA 클릭

## 🚀 성능 최적화

### 로딩 최적화
- gtag.js 비동기 로딩
- 1초 지연 후 초기 이벤트 전송
- 콘솔 로깅으로 실시간 디버깅

### 데이터 품질
- 모든 이벤트에 타임스탬프 포함
- 표준화된 명명 규칙 적용
- 중복 이벤트 방지 로직

## 🔧 디버깅 가이드

### 브라우저 콘솔 확인
페이지 로드 후 콘솔에서 다음 메시지 확인:
```
🚀 GA4 초기화 완료 - 측정 ID: G-DE2ZNKWV2W
🌍 현재 URL: [현재 URL]
🏷️ 페이지 제목: [페이지 제목]
🧪 테스트 이벤트 전송 완료
📄 페이지 진입 이벤트 전송 완료
```

### CTA 클릭 시 로그
CTA 버튼 클릭 시 다음 형태로 로그 출력:
```
📈 GA4 CTA 추적: {
  event: 'cta_click',
  action: 'artist_signup',
  location: 'hero_section', 
  text: '작가 기능 체험하기'
}
```

## 📋 일일 모니터링 체크리스트

### 매일 확인사항
- [ ] GA4 실시간 이벤트 수신 확인
- [ ] 주요 CTA 클릭율 확인 (`artist_signup`, `collector_signup`)
- [ ] 오류 이벤트 발생 여부 확인
- [ ] 페이지뷰 대비 CTA 클릭율 계산

### 주간 분석사항
- [ ] CTA별 성과 비교 분석
- [ ] 모바일 vs 데스크톱 행동 패턴
- [ ] 유입 경로별 전환율 분석
- [ ] A/B 테스트 결과 분석 (필요시)

## 🎯 목표 설정 권장사항

### GA4 전환 이벤트 설정
1. **주요 전환**: `form_submit_lead`
2. **마이크로 전환**: `cta_click`
3. **참여 지표**: `modal_open`

### KPI 목표값
- CTA 클릭율: 15% 이상
- 모달 열기율: 8% 이상  
- 폼 제출율: 3% 이상
- 페이지 체류시간: 60초 이상

---

**최종 업데이트**: 2025년 10월 6일  
**측정 ID**: G-DE2ZNKWV2W  
**구현 상태**: ✅ 완료