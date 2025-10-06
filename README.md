# 🎨 시니어 아티스트 플랫폼

시니어 예술가와 콜렉터를 연결하는 작품 스토리 마켓플레이스입니다. 작품의 깊은 이야기를 공유하고 직접 소통할 수 있는 플랫폼을 제공합니다.

## 🚀 배포 정보

- **Live URL**: `https://yeaaaaaaaaaap.github.io/Senior-Artist/`
- **배포 방식**: GitHub Pages (Deploy from branch)
- **브랜치**: main
- **Analytics**: Google Analytics 4 (G-DE2ZNKWV2W) 직접 구현 (각 CTA별 개별 onclick 이벤트)

## 📂 파일 구조

```
Senior-Artist/
├── index.html          # 메인 랜딩 페이지
├── artist.html         # 예술가 전용 페이지
├── collector.html      # 콜렉터 전용 페이지
├── README.md           # 프로젝트 문서
└── .gitignore          # Git 무시 파일
```

## 🌟 주요 기능

### 📊 Google Analytics 4 직접 구현
- **페이지 추적**: 모든 페이지 조회 자동 측정
- **이벤트 추적**: 각 CTA에 개별 onclick 이벤트로 직접 gtag 호출
- **사용자 여정**: 사용자 경로 및 전환 추적
- **실시간 분석**: 실시간 사용자 행동 모니터링

## 📊 GA4 CTA 트래킹 시스템

각 CTA 요소에 직접 `onclick` 이벤트로 `gtag('event', 'cta_click', {...})` 호출을 구현했습니다. 
이 방식은 외부 스크립트 파일 없이 각 CTA의 클릭을 개별적으로 측정할 수 있습니다.

### 구현 특징
- **직접 구현**: 각 CTA 요소에 onclick 이벤트로 gtag 직접 호출
- **단순성**: 복잡한 이벤트 바인딩 로직 없이 HTML에서 직접 정의
- **신뢰성**: 외부 스크립트 의존성 없이 GA4와 직접 통신
- **디버깅 용이**: 브라우저 개발자 도구에서 각 CTA 클릭 즉시 확인 가능

### 이벤트 구조
모든 CTA 클릭은 다음과 같은 구조로 GA4에 전송됩니다:

```javascript
gtag('event', 'cta_click', {
    'cta_name': 'CTA_식별자',
    'cta_type': 'primary|secondary|navigation|action',
    'cta_location': '위치_정보'
});
```

### 주요 CTA 요소

#### index.html (메인 페이지)
- **네비게이션**: nav_artist, nav_collector, nav_about, mobile_menu_toggle
- **메인 액션**: artist_start, collector_start
- **갤러리**: gallery_view_more
- **모달**: about_modal_close, modal_artist_start, modal_collector_start
- **문의**: contact_form_close, contact_form_submit

#### artist.html (예술가 페이지)
- **네비게이션**: nav_artist, nav_collector, nav_about, back_to_main, mobile_menu_toggle
- **메인 액션**: portfolio_create
- **기능**: portfolio_feature_btn, transaction_feature_btn, customer_feature_btn
- **등록**: registration_close, artist_registration_submit

#### collector.html (콜렉터 페이지)
- **네비게이션**: nav_artist, nav_collector, nav_about, back_to_main, mobile_menu_toggle
- **메인 액션**: interest_register
- **기능**: taste_analysis_btn, transaction_guarantee_btn, artist_communication_btn
- **관심 등록**: interest_form_close, collector_interest_submit

## 🎨 UI/UX 특징

### 📱 반응형 디자인
- **데스크톱**: 1200px+ 최적화
- **태블릿**: 768px-1199px 적응형 레이아웃
- **모바일**: 767px 이하 최적화
- **모바일 네비게이션**: 햄버거 메뉴로 공간 효율성 극대화

### 🎨 디자인 시스템
- **타이포그래피**: SF Pro Display, Inter 기반 통일성
- **컬러 팔레트**: 
  - Primary: #8b5cf6 ~ #06b6d4 (그라데이션)
  - Neutral: #0f172a, #475569, #64748b
  - Accent: #10b981, #f59e0b
- **인터랙션**: 매끄러운 호버 효과와 마이크로 애니메이션

## 🎯 주요 기능

### 시니어 예술가를 위한 기능
1. **🎨 포트폴리오 최적화** - 작품 큐레이션·스토리텔링, SEO 최적화
2. **💳 거래 관리** - 가격·일정·견적 체계, 결제·배송 자동화  
3. **👥 고객 관계 관리** - 컬렉터 DB·취향 분석, 맞춤 추천·소통

### 콜렉터를 위한 기능  
1. **📖 스토리 기반 탐색** - 작가 서사 중심 피드, 취향 필터·추천
2. **🛡️ 안심 거래** - 에스크로·표준계약, 작가 검증/리뷰
3. **💬 즉시 소통·견적** - 1:1 채팅, 맞춤 견적/예약

## 📊 GA4 구현 방법

### 기본 설정
모든 HTML 페이지에 다음 코드가 포함되어 있습니다:

```html
<!-- Google Analytics 4 (GA4) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DE2ZNKWV2W"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-DE2ZNKWV2W');
</script>
```

### 이벤트 트래킹
각 CTA 요소에 직접 onclick 이벤트로 gtag 호출을 구현했습니다:

```html
<!-- 예시: 네비게이션 링크 -->
<a href="artist.html" onclick="gtag('event', 'cta_click', {'cta_name': 'nav_artist', 'cta_type': 'navigation', 'cta_location': 'header'});">예술가용</a>

<!-- 예시: 메인 CTA 버튼 -->
<button onclick="gtag('event', 'cta_click', {'cta_name': 'portfolio_create', 'cta_type': 'primary', 'cta_location': 'main_section'}); openRegistration();">포트폴리오 만들기</button>
```

### 구현 특징

1. **직접 구현**: 각 CTA에 onclick 이벤트로 gtag 직접 호출
2. **단순성**: 복잡한 외부 스크립트 없이 HTML에서 직접 정의
3. **신뢰성**: 외부 의존성 최소화로 안정적인 추적
4. **디버깅 용이**: 브라우저 개발자 도구에서 즉시 확인 가능

### 테스트 방법

브라우저 개발자 도구의 네트워크 탭에서 CTA 클릭 시 GA4로 전송되는 이벤트를 확인할 수 있습니다:

1. 개발자 도구 열기 (F12)
2. 네트워크 탭 선택
3. CTA 버튼 클릭
4. `collect?` 요청 확인하여 이벤트 전송 여부 검증

## 📱 반응형 지원

- **데스크톱**: 1400px 이상
- **태블릿**: 768px - 1399px
- **모바일**: 767px 이하

## 🔧 커스터마이징

주요 색상과 폰트는 CSS 변수로 관리되어 쉽게 수정 가능합니다.

```css
:root {
  --primary-color: #0f172a;
  --background-color: #fafafa;
  --text-color: #1a1a1a;
  --primary-font: 'SF Pro Display', -apple-system, BlinkMacSystemFont;
}
```

## � 측정되는 모든 CTA 목록

모든 CTA 클릭은 `cta_click` 이벤트로 GA4에 전송되며, 다음 매개변수로 구분됩니다:

- **cta_name**: CTA 고유 식별자
- **cta_type**: primary(주요), secondary(보조), navigation(네비게이션), action(액션)  
- **cta_location**: header, main_section, feature_section, modal 등

### 주요 CTA 이벤트

**네비게이션 (모든 페이지 공통)**
- nav_artist, nav_collector, nav_about, mobile_menu_toggle, back_to_main

**메인 액션**
- artist_start, collector_start (index.html)
- portfolio_create (artist.html)  
- interest_register (collector.html)

**기능 버튼**
- gallery_view_more (index.html)
- portfolio_feature_btn, transaction_feature_btn, customer_feature_btn (artist.html)
- taste_analysis_btn, transaction_guarantee_btn, artist_communication_btn (collector.html)

**모달 및 폼**
- about_modal_close, modal_artist_start, modal_collector_start (index.html)
- registration_close, artist_registration_submit (artist.html)
- interest_form_close, collector_interest_submit (collector.html)
- contact_form_close, contact_form_submit (index.html)

## 📈 GA4 보고서 확인 방법

1. **Google Analytics** → 속성 **G-DE2ZNKWV2W** 선택
2. **실시간** → 현재 발생하는 이벤트 확인
3. **이벤트** → **cta_click** 이벤트 상세 분석
4. **탐색** → 사용자 지정 보고서로 CTA별 성과 분석

---

*최종 업데이트: 2025년 10월 7일*
