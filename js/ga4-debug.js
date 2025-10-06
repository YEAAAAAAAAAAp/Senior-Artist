/* GA4 디버깅 도구 */
console.log('%c🔍 GA4 디버깅 모드 시작', 'background: #4285f4; color: white; padding: 5px; border-radius: 3px;');

// GA4 실시간 상태 모니터링
function checkGA4Status() {
    const status = {
        gtagLoaded: typeof gtag !== 'undefined',
        dataLayerExists: !!window.dataLayer,
        dataLayerLength: window.dataLayer ? window.dataLayer.length : 0,
        trackCTAExists: typeof trackCTA !== 'undefined',
        measurementId: 'G-DE2ZNKWV2W',
        currentPage: window.location.pathname,
        timestamp: new Date().toISOString()
    };
    
    console.table(status);
    
    if (status.gtagLoaded && status.trackCTAExists) {
        console.log('%c✅ GA4 및 trackCTA 모두 정상 작동 중', 'color: green; font-weight: bold;');
    } else {
        if (!status.gtagLoaded) console.log('%c❌ GA4 로드 실패', 'color: red; font-weight: bold;');
        if (!status.trackCTAExists) console.log('%c❌ trackCTA 함수 누락', 'color: red; font-weight: bold;');
    }
    
    return status;
}

// 브라우저 콘솔에서 수동으로 GA4 상태 확인 가능
window.checkGA4 = checkGA4Status;

// 수동 이벤트 전송 테스트 함수
window.testGA4Event = function(eventName, parameters) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName || 'manual_test', parameters || {
            test: true,
            timestamp: new Date().toISOString(),
            manual: true
        });
        console.log('%c📊 테스트 이벤트 전송됨:', 'color: blue;', eventName);
    } else {
        console.error('GA4가 로드되지 않았습니다.');
    }
};

// CTA 추적 테스트 함수
window.testCTA = function(actionName, location, text) {
    if (typeof trackCTA !== 'undefined') {
        trackCTA(actionName || 'test_cta', location || 'console', text || 'Test Button');
        console.log('%c🎯 CTA 테스트 이벤트 전송됨:', 'color: green;', actionName);
    } else {
        console.error('trackCTA 함수가 정의되지 않았습니다.');
    }
};

// 페이지의 모든 CTA 버튼 분석
window.analyzeCTAs = function() {
    const ctaElements = document.querySelectorAll('[onclick*="trackCTA"], [onclick*="gtag"]');
    const analysis = {
        totalCTAs: ctaElements.length,
        trackCTAUsage: 0,
        directGtagUsage: 0,
        elements: []
    };
    
    ctaElements.forEach((element, index) => {
        const onclick = element.getAttribute('onclick');
        const isTrackCTA = onclick.includes('trackCTA');
        const isDirectGtag = onclick.includes('gtag') && !onclick.includes('trackCTA');
        
        if (isTrackCTA) analysis.trackCTAUsage++;
        if (isDirectGtag) analysis.directGtagUsage++;
        
        analysis.elements.push({
            index: index + 1,
            element: element.tagName,
            text: element.textContent?.substring(0, 30) || 'No text',
            usesTrackCTA: isTrackCTA,
            usesDirectGtag: isDirectGtag,
            onclick: onclick.substring(0, 100) + (onclick.length > 100 ? '...' : '')
        });
    });
    
    console.log('%c🎯 CTA 분석 결과:', 'color: purple; font-weight: bold;');
    console.table(analysis.elements);
    console.log(`총 CTA: ${analysis.totalCTAs}, trackCTA 사용: ${analysis.trackCTAUsage}, 직접 gtag 사용: ${analysis.directGtagUsage}`);
    
    if (analysis.directGtagUsage > 0) {
        console.warn('%c⚠️ 일부 CTA가 직접 gtag를 사용하고 있습니다. trackCTA로 변경을 권장합니다.', 'color: orange;');
    }
    
    return analysis;
};

console.log('%c사용법:', 'color: #666; font-style: italic;');
console.log('• checkGA4() - GA4 상태 확인');
console.log('• testGA4Event("이벤트명") - 수동 이벤트 테스트');
console.log('• testCTA("액션명", "위치", "텍스트") - CTA 추적 테스트');
console.log('• analyzeCTAs() - 페이지의 모든 CTA 분석');