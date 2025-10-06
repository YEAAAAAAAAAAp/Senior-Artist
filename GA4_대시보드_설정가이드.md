# GA4 CTA 측정 대시보드 설정 가이드

## 📊 GA4 관리자 패널 설정

### 1. 전환 이벤트 설정 (필수)
**경로**: GA4 > 관리 > 전환

다음 이벤트들을 전환으로 표시:
```
artist_registration_completed
collector_interest_completed
artist_start_click
collector_start_click
```

**설정 방법**:
1. "새 전환 이벤트 만들기" 클릭
2. 이벤트 이름 정확히 입력
3. "저장" 클릭

### 2. 커스텀 측정기준 생성
**경로**: GA4 > 관리 > 속성 > 커스텀 정의 > 커스텀 측정기준

#### 설정할 측정기준들:
1. **사용자 유형**
   - 측정기준 이름: `user_type`
   - 범위: 이벤트
   - 이벤트 매개변수: `user_type`

2. **페이지 구분**
   - 측정기준 이름: `page_section`
   - 범위: 이벤트
   - 이벤트 매개변수: `page`

3. **기능 구분**
   - 측정기준 이름: `feature_type`
   - 범위: 이벤트
   - 이벤트 매개변수: `feature`

4. **위치 구분**
   - 측정기준 이름: `click_location`
   - 범위: 이벤트
   - 이벤트 매개변수: `location`

## 🎯 권장 GA4 보고서 설정

### 1. CTA 성과 개요 보고서

**보고서 유형**: 자유 형식 보고서

**측정기준**:
- 이벤트 이름
- 페이지 구분 (page_section)
- 위치 구분 (click_location)

**측정항목**:
- 이벤트 수
- 총 사용자 수
- 이벤트별 사용자 수
- 전환율

### 2. 사용자 여정 분석 보고서

**보고서 유형**: 경로 탐색

**설정**:
- 시작점: `artist_start_click` 또는 `collector_start_click`
- 다음 단계: `artist_registration_click` 또는 `collector_interest_click`
- 최종 단계: `artist_registration_completed` 또는 `collector_interest_completed`

### 3. 기능별 관심도 비교 보고서

**보고서 유형**: 자유 형식 보고서

**필터**: 이벤트 이름에 "feature"가 포함된 이벤트만

**측정기준**:
- 기능 구분 (feature_type)
- 사용자 유형 (user_type)

**측정항목**:
- 이벤트 수
- 고유 사용자 수
- 평균 참여 시간

## 📈 실시간 모니터링 대시보드

### GA4 실시간 보고서 활용
**경로**: GA4 > 보고서 > 실시간

#### 확인할 항목들:
1. **실시간 이벤트**
   - 우리가 설정한 CTA 이벤트들이 실시간으로 들어오는지 확인
   - 이벤트 매개변수가 올바르게 전송되는지 확인

2. **실시간 전환**
   - 등록 완료 이벤트들이 전환으로 집계되는지 확인

3. **실시간 사용자**
   - 각 페이지별 현재 사용자 수 확인

### 커스텀 실시간 알림 설정
**경로**: GA4 > 관리 > 속성 > 커스텀 알림

#### 권장 알림들:
1. **일일 전환 목표 달성**
   - 조건: 전환 > 5개/일
   - 빈도: 일일

2. **CTA 클릭률 급감**
   - 조건: 주요 CTA 이벤트 < 평균의 50%
   - 빈도: 시간별

## 🔍 디버깅 및 검증 도구

### 1. GA4 DebugView 사용법
**활성화 방법**:
```javascript
// 브라우저 콘솔에서 실행
gtag('config', 'G-DE2ZNKWV2W', {
    debug_mode: true
});
```

**확인 경로**: GA4 > 관리 > DebugView

### 2. 브라우저 개발자 도구 활용
**Network 탭에서 확인**:
- `collect?` 요청들이 정상적으로 전송되는지
- 이벤트 매개변수들이 올바르게 포함되는지

**Console 탭에서 확인**:
```javascript
// dataLayer 내용 확인
console.log(window.dataLayer);

// gtag 함수 테스트
gtag('event', 'test_event', {'test_param': 'test_value'});
```

### 3. 테스트 스크립트 활용
**파일**: `ga4-cta-test.js` 사용

**브라우저 콘솔에서 실행**:
```javascript
// 전체 테스트 실행
testEvents.runAllTests();

// 개별 페이지 테스트
testEvents.testMainPageEvents();
```

## 📊 주요 KPI 및 측정 지표

### 1차 지표 (전환 관련)
- **작가 등록 완료율**: `artist_registration_completed` / `artist_start_click`
- **콜렉터 관심 등록 완료율**: `collector_interest_completed` / `collector_start_click`
- **전체 전환율**: 전체 전환 / 전체 세션

### 2차 지표 (참여도 관련)
- **기능 탐색률**: feature 클릭 / 페이지 방문
- **네비게이션 클릭률**: nav 클릭 / 페이지 방문
- **모달 참여율**: modal 이벤트 / 모달 노출

### 3차 지표 (사용자 행동)
- **평균 CTA 클릭 수/세션**: 총 CTA 클릭 / 세션 수
- **페이지별 체류 시간**: GA4 기본 측정항목
- **이탈률**: GA4 기본 측정항목

## 🎯 성과 분석 가이드

### 주간 분석 체크리스트
- [ ] 주요 전환 이벤트 발생 건수 확인
- [ ] CTA별 클릭률 비교 분석
- [ ] 사용자 여정 단계별 이탈률 분석
- [ ] 모바일 vs 데스크톱 성과 비교

### 월간 분석 체크리스트
- [ ] 전환율 트렌드 분석
- [ ] 기능별 관심도 변화 추이
- [ ] 사용자 세그먼트별 행동 패턴 분석
- [ ] A/B 테스트 결과 검토 (해당 시)

### 최적화 액션 아이템
1. **성과 낮은 CTA 개선**
   - 위치 변경, 문구 수정, 디자인 개선

2. **사용자 여정 최적화**
   - 이탈률 높은 단계 개선
   - 추가 CTA 배치 검토

3. **기능 우선순위 재조정**
   - 관심도 높은 기능 강화
   - 관심도 낮은 기능 개선 또는 제거

이 가이드를 따라 설정하시면 GA4에서 모든 CTA의 성과를 체계적으로 측정하고 분석할 수 있습니다.