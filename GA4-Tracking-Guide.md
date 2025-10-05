# Google Analytics 4 (GA4) 추적 가이드

## 📊 GA4 설정 정보
- **측정 ID**: `G-DE2ZNKWV2W`
- **구현 방식**: gtag.js
- **추적 범위**: 모든 CTA 버튼, 네비게이션 링크, 모달 상호작용

## 🎯 CTA 추적 시스템

### trackCTA() 함수
모든 CTA 추적을 위한 표준화된 함수입니다.

```javascript
function trackCTA(actionName, ctaLocation, ctaText) {
    gtag('event', 'cta_click', {
        'cta_action': actionName,
        'cta_location': ctaLocation,
        'cta_text': ctaText,
        'page_title': document.title,
        'page_url': window.location.href
    });
    
    console.log('CTA 추적:', {
        action: actionName,
        location: ctaLocation,
        text: ctaText
    });
}
```

### 매개변수 설명
- **actionName**: 액션의 고유 식별자 (예: 'artist_signup', 'collector_signup')
- **ctaLocation**: CTA가 위치한 섹션 (예: 'hero_section', 'navigation', 'about_modal')
- **ctaText**: 실제 버튼/링크 텍스트 (예: '예술가로 시작하기')

## 📍 추적되는 요소들

### 1. 히어로 섹션 CTA 버튼
```javascript
// 예술가 회원가입 버튼
trackCTA('artist_signup', 'hero_section', '예술가로 시작하기')

// 콜렉터 회원가입 버튼  
trackCTA('collector_signup', 'hero_section', '콜렉터로 시작하기')
```

### 2. 네비게이션 링크
```javascript
// 네비게이션 메뉴 클릭
trackCTA('nav_artist', 'navigation', '예술가')
trackCTA('nav_collector', 'navigation', '콜렉터') 
trackCTA('nav_about', 'navigation', '서비스 소개')
```

### 3. 모달 상호작용
```javascript
// 모달 열기/닫기
trackCTA('modal_open', 'navigation', '서비스 소개')
trackCTA('modal_close', 'about_modal', '서비스 소개 모달 닫기')

// 모달 내 CTA 버튼
trackCTA('modal_artist_start', 'about_modal_footer', '예술가로 시작하기')
trackCTA('modal_collector_start', 'about_modal_footer', '콜렉터로 시작하기')
```

## 🔍 디버깅 및 확인 방법

### 1. 브라우저 콘솔 확인
모든 CTA 클릭 시 콘솔에 다음과 같은 로그가 출력됩니다:
```
CTA 추적: {action: "artist_signup", location: "hero_section", text: "예술가로 시작하기"}
```

### 2. GA4 실시간 보고서 확인
1. [Google Analytics 4](https://analytics.google.com/) 접속
2. 해당 속성 (G-DE2ZNKWV2W) 선택
3. 보고서 > 실시간 보고서에서 이벤트 확인

### 3. GA4 이벤트 구조
각 CTA 클릭은 다음 구조로 전송됩니다:
```
이벤트명: cta_click
매개변수:
- cta_action: 액션 식별자
- cta_location: 위치 정보
- cta_text: 버튼/링크 텍스트
- page_title: 페이지 제목
- page_url: 페이지 URL
```

## 📈 데이터 분석 활용

### 주요 측정 지표
1. **CTA 클릭률**: 각 버튼별 클릭 수 비교
2. **위치별 성과**: 히어로 섹션 vs 모달 vs 네비게이션
3. **사용자 경로**: 어떤 CTA에서 어떤 페이지로 이동하는지
4. **모달 효과성**: 모달 열기 대비 모달 내 CTA 클릭률

### GA4에서 확인할 수 있는 보고서
- **이벤트**: 보고서 > 참여도 > 이벤트
- **전환**: 전환 이벤트로 설정하여 전환율 측정
- **사용자 경로**: 탐색 분석으로 사용자 여정 추적

## 🚀 추가 개선 사항

### 1. 전환 이벤트 설정
GA4에서 주요 CTA를 전환 이벤트로 설정:
- `artist_signup` 이벤트를 전환으로 설정
- `collector_signup` 이벤트를 전환으로 설정

### 2. 맞춤 측정기준 생성
- CTA 위치별 성과 분석을 위한 맞춤 측정기준
- 사용자 유형별 행동 패턴 분석

### 3. 목표 설정
- 월별 CTA 클릭 목표 설정
- 페이지별 참여도 목표 설정

## 📝 유지보수 가이드

### 새로운 CTA 추가 시
1. `trackCTA()` 함수 호출 추가
2. 고유한 `actionName` 사용
3. 적절한 `ctaLocation` 지정
4. 실제 버튼 텍스트를 `ctaText`에 입력

### 문제 해결
1. 콘솔 로그 확인
2. 네트워크 탭에서 GA4 요청 확인
3. GA4 실시간 보고서에서 이벤트 수신 확인

## 📞 지원 정보
- **GA4 측정 ID**: G-DE2ZNKWV2W
- **구현 일자**: 2024년 12월
- **추적 범위**: 모든 주요 CTA 및 사용자 상호작용

---
*이 가이드는 Senior Artist 랜딩페이지의 GA4 추적 시스템에 대한 완전한 문서입니다.*