// 통합 CTA 검증 시스템
window.addEventListener('load', function() {
    setTimeout(function() {
        console.log('%c🎯 CTA 추적 검증 시스템 시작', 'background: #16a085; color: white; padding: 5px; border-radius: 3px;');
        
        // 1. trackCTA 함수 존재 확인
        if (typeof trackCTA === 'undefined') {
            console.error('❌ trackCTA 함수가 정의되지 않았습니다!');
            return;
        }
        
        // 2. gtag 함수 존재 확인
        if (typeof gtag === 'undefined') {
            console.error('❌ gtag 함수가 로드되지 않았습니다!');
            return;
        }
        
        // 3. 페이지의 모든 CTA 요소 검증
        const ctaElements = document.querySelectorAll('[onclick*="trackCTA"], [onclick*="gtag"]');
        let trackCTACount = 0;
        let directGtagCount = 0;
        let errorCount = 0;
        
        ctaElements.forEach((element, index) => {
            const onclick = element.getAttribute('onclick');
            
            if (onclick.includes('trackCTA(')) {
                trackCTACount++;
                
                // trackCTA 호출 형식 검증
                const match = onclick.match(/trackCTA\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*['"`]([^'"`]+)['"`]\s*,\s*['"`]([^'"`]+)['"`]\s*\)/);
                if (!match) {
                    console.warn(`⚠️ CTA #${index + 1}: trackCTA 호출 형식이 올바르지 않습니다.`, element);
                    errorCount++;
                } else {
                    console.log(`✅ CTA #${index + 1}: ${match[1]} (${match[2]}) - "${match[3]}"`);
                }
            } else if (onclick.includes('gtag(')) {
                directGtagCount++;
                console.warn(`⚠️ CTA #${index + 1}: 직접 gtag 호출을 사용하고 있습니다. trackCTA로 변경을 권장합니다.`, element);
            }
        });
        
        // 4. 검증 결과 리포트
        console.log('%c📊 CTA 검증 결과:', 'color: purple; font-weight: bold;');
        console.log(`총 CTA 요소: ${ctaElements.length}`);
        console.log(`trackCTA 사용: ${trackCTACount}`);
        console.log(`직접 gtag 사용: ${directGtagCount}`);
        console.log(`오류 발견: ${errorCount}`);
        
        if (errorCount === 0 && directGtagCount === 0) {
            console.log('%c✅ 모든 CTA가 올바르게 설정되었습니다!', 'color: green; font-weight: bold;');
        } else {
            console.log('%c⚠️ 일부 CTA에 문제가 있습니다. 위의 경고를 확인하세요.', 'color: orange; font-weight: bold;');
        }
        
        // 5. 자동 테스트 이벤트 전송
        if (typeof trackCTA !== 'undefined') {
            trackCTA('cta_validation_test', 'auto_validation', 'CTA 검증 테스트');
            console.log('🧪 자동 CTA 테스트 이벤트 전송됨');
        }
        
    }, 3000);
});