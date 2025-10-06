# 🎨 시니어 아티스트 플랫폼

시니어 예술가와 콜렉터를 연결하는 작품 스토리 마켓플레이스입니다. 작품의 깊은 이야기를 공유하고 직접 소통할 수 있는 플랫폼을 제공합니다.

## 🚀 배포 정보

- **Live URL**: `https://yeaaaaaaaaaap.github.io/Senior-Artist/`
- **배포 방식**: GitHub Pages (Deploy from branch)
- **브랜치**: main
- **Analytics**: Google Analytics 4 (G-DE2ZNKWV2W) 직접 구현

## 📂 파일 구조

```
Senior-Artist/
├── index.html          # 메인 랜딩 페이지
├── artist.html         # 예술가 전용 페이지
├── collector.html      # 콜렉터 전용 페이지
├── README.md           # 프로젝트 문서
├── .gitignore          # Git 무시 파일
└── js/
    └── ga4-tracking.js # GA4 이벤트 추적 스크립트
```

## 🌟 주요 기능

### 📊 Google Analytics 4 직접 구현
- **페이지 추적**: 모든 페이지 조회 자동 측정
- **이벤트 추적**: 모든 CTA 클릭 이벤트 자동 수집
- **사용자 여정**: 사용자 경로 및 전환 추적
- **실시간 분석**: 실시간 사용자 행동 모니터링

## 📊 GA4 CTA 트래킹 시스템

GA4 직접 구현 방식으로 모든 사용자 상호작용을 추적합니다. 코드는 Google Tag Manager에 의존하지 않고 순수 JavaScript로 구현되었습니다.

### 이벤트 추적 방식
모든 CTA 요소에는 다음 데이터 속성이 부여되어 있습니다:
- `data-cta-name`: CTA 식별자 (예: nav_artist, portfolio_create)
- `data-cta-type`: CTA 유형 (primary, secondary, navigation, action)
- `data-cta-location`: CTA 위치 (hero_section, feature_section 등)
- `data-action`: 특정 액션 실행을 위한 식별자

### 주요 CTA 요소

#### index.html (메인 페이지)
- **예술가/콜렉터 시작 버튼**: 메인 페이지 주요 전환 지점
- **네비게이션 메뉴**: 페이지 이동 및 모달 열기
- **갤러리 섹션 버튼**: 컨텐츠 더 보기
- **소개 모달 컨트롤**: 모달 열기/닫기 액션

#### artist.html (예술가 페이지)
- **포트폴리오 생성 버튼**: 주요 전환 지점
- **기능 섹션 버튼**: 포트폴리오, 거래, 고객 관리
- **등록 모달 컨트롤**: 양식 제출 및 모달 닫기

#### collector.html (콜렉터 페이지)
- **관심 등록 버튼**: 주요 전환 지점
- **기능 섹션 버튼**: 취향 분석, 거래 보장, 작가 대화
- **관심 등록 모달 컨트롤**: 양식 제출 및 모달 닫기

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
`ga4-tracking.js` 파일에서 모든 CTA 클릭 이벤트를 처리하고 GA4로 전송합니다:

```javascript
// GA4 이벤트 전송 예시
gtag('event', 'cta_click', {
    'cta_name': ctaName,
    'cta_type': ctaType,
    'cta_location': ctaLocation,
    'cta_text': ctaText,
    'element_type': element.tagName.toLowerCase()
});
```

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

## 📈 GA4 보고서 확인 방법

1. Google Analytics 계정에 로그인합니다.
2. 속성 G-DE2ZNKWV2W를 선택합니다.
3. 실시간 보고서에서 현재 발생하는 이벤트를 확인합니다.
4. 이벤트 보고서에서 cta_click 이벤트를 확인하여 상세 데이터를 분석합니다.
5. 탐색 메뉴에서 사용자 지정 보고서를 만들어 필요한 분석을 수행합니다.

---

*최종 업데이트: 2025년 10월 7일*
