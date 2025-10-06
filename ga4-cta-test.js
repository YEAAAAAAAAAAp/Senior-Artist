// GA4 CTA 이벤트 테스트 스크립트
// 브라우저 콘솔에서 실행하여 이벤트 전송 테스트

console.log('🔍 GA4 CTA 이벤트 테스트 시작...');

// GA4 설정 확인
if (typeof gtag === 'undefined') {
    console.error('❌ gtag 함수가 로드되지 않았습니다!');
} else {
    console.log('✅ gtag 함수 로드 완료');
}

if (!window.dataLayer) {
    console.error('❌ dataLayer가 초기화되지 않았습니다!');
} else {
    console.log('✅ dataLayer 초기화 완료, 현재 이벤트 수:', window.dataLayer.length);
}

// 테스트 이벤트 전송 함수들
const testEvents = {
    // 메인 페이지 테스트
    testMainPageEvents: function() {
        console.log('📊 메인 페이지 CTA 이벤트 테스트');
        
        gtag('event', 'test_artist_start_click', {
            'page': 'main', 
            'location': 'hero',
            'test_mode': true
        });
        console.log('✅ artist_start_click 테스트 전송');
        
        gtag('event', 'test_collector_start_click', {
            'page': 'main', 
            'location': 'hero',
            'test_mode': true
        });
        console.log('✅ collector_start_click 테스트 전송');
    },
    
    // 작가 페이지 테스트
    testArtistPageEvents: function() {
        console.log('🎨 작가 페이지 CTA 이벤트 테스트');
        
        gtag('event', 'test_artist_registration_click', {
            'page': 'artist', 
            'location': 'hero',
            'test_mode': true
        });
        console.log('✅ artist_registration_click 테스트 전송');
        
        gtag('event', 'test_portfolio_feature_click', {
            'page': 'artist', 
            'feature': 'portfolio',
            'test_mode': true
        });
        console.log('✅ portfolio_feature_click 테스트 전송');
        
        // 전환 이벤트 테스트
        gtag('event', 'test_artist_registration_completed', {
            'page': 'artist', 
            'art_style': 'test_style',
            'test_mode': true
        });
        console.log('✅ artist_registration_completed 테스트 전송');
    },
    
    // 콜렉터 페이지 테스트
    testCollectorPageEvents: function() {
        console.log('🏛️ 콜렉터 페이지 CTA 이벤트 테스트');
        
        gtag('event', 'test_collector_interest_click', {
            'page': 'collector', 
            'location': 'hero',
            'test_mode': true
        });
        console.log('✅ collector_interest_click 테스트 전송');
        
        gtag('event', 'test_ai_story_feature_click', {
            'page': 'collector', 
            'feature': 'ai_story',
            'test_mode': true
        });
        console.log('✅ ai_story_feature_click 테스트 전송');
        
        // 전환 이벤트 테스트
        gtag('event', 'test_collector_interest_completed', {
            'page': 'collector', 
            'interests': 'test_interest',
            'event_category': 'conversion',
            'conversion_type': 'collector_registration',
            'test_mode': true
        });
        console.log('✅ collector_interest_completed 테스트 전송');
    },
    
    // 전체 테스트 실행
    runAllTests: function() {
        console.log('🚀 모든 CTA 이벤트 테스트 시작...');
        this.testMainPageEvents();
        setTimeout(() => this.testArtistPageEvents(), 1000);
        setTimeout(() => this.testCollectorPageEvents(), 2000);
        setTimeout(() => {
            console.log('✅ 모든 테스트 완료!');
            console.log('📊 GA4 실시간 보고서에서 test_ 이벤트들을 확인하세요.');
        }, 3000);
    }
};

// 사용법 출력
console.log(`
🎯 GA4 CTA 이벤트 테스트 방법:

1. 전체 테스트 실행:
   testEvents.runAllTests();

2. 페이지별 개별 테스트:
   testEvents.testMainPageEvents();
   testEvents.testArtistPageEvents();
   testEvents.testCollectorPageEvents();

3. 실시간 확인:
   GA4 > 보고서 > 실시간 > 이벤트에서 'test_' 접두사 이벤트 확인

4. dataLayer 직접 확인:
   console.log(window.dataLayer);
`);

// 자동 테스트 실행 (선택사항)
// testEvents.runAllTests();