// GA4 로딩 및 CTA 추적 실시간 진단 스크립트
// 브라우저 콘솔에서 실행하여 실제 배포 환경 문제 진단

console.log('🔍 GA4 실제 배포 환경 진단 시작...');
console.log('='.repeat(50));

// 1. 기본 환경 체크
function checkEnvironment() {
    console.log('🌐 1. 환경 체크');
    console.log('현재 URL:', window.location.href);
    console.log('User Agent:', navigator.userAgent);
    console.log('쿠키 허용:', navigator.cookieEnabled);
    console.log('로컬 스토리지 사용 가능:', typeof(Storage) !== "undefined");
}

// 2. GA4 스크립트 로딩 상태 체크
function checkGA4Loading() {
    console.log('\n📡 2. GA4 스크립트 로딩 상태');
    
    // gtag 스크립트 태그 확인
    const gtagScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    if (gtagScript) {
        console.log('✅ gtag 스크립트 태그 발견:', gtagScript.src);
        console.log('   - async 속성:', gtagScript.async);
        console.log('   - 로딩 상태:', gtagScript.readyState || '확인 불가');
    } else {
        console.error('❌ gtag 스크립트 태그를 찾을 수 없음');
    }
    
    // gtag 함수 존재 여부
    if (typeof gtag === 'function') {
        console.log('✅ gtag 함수 로드됨');
    } else {
        console.error('❌ gtag 함수 로드되지 않음');
        console.log('💡 네트워크 문제 또는 스크립트 차단 가능성');
    }
    
    // dataLayer 상태 확인
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
        console.log('✅ dataLayer 초기화됨:', window.dataLayer.length, '개 항목');
        console.log('   dataLayer 내용:', window.dataLayer);
    } else {
        console.error('❌ dataLayer 초기화되지 않음');
    }
}

// 3. 네트워크 연결 및 외부 스크립트 로딩 체크
function checkNetworkAndBlocking() {
    console.log('\n🌐 3. 네트워크 및 차단 상태 체크');
    
    // Google Analytics 도메인 접근 테스트
    fetch('https://www.googletagmanager.com/gtag/js?id=G-DE2ZNKWV2W', { 
        method: 'HEAD', 
        mode: 'no-cors' 
    })
    .then(() => {
        console.log('✅ Google Analytics 서버 접근 가능');
    })
    .catch(error => {
        console.error('❌ Google Analytics 서버 접근 실패:', error);
        console.log('💡 방화벽, Ad Blocker, CORS 정책 확인 필요');
    });
    
    // Ad Blocker 감지
    const testDiv = document.createElement('div');
    testDiv.innerHTML = '&nbsp;';
    testDiv.className = 'adsbox';
    testDiv.style.position = 'absolute';
    testDiv.style.left = '-9999px';
    document.body.appendChild(testDiv);
    
    setTimeout(() => {
        if (testDiv.offsetHeight === 0) {
            console.warn('⚠️  Ad Blocker 감지됨 - GA4 차단 가능성');
        } else {
            console.log('✅ Ad Blocker 미감지');
        }
        document.body.removeChild(testDiv);
    }, 100);
}

// 4. CTA 버튼 실제 작동 테스트
function testActualCTAButtons() {
    console.log('\n🎯 4. 실제 CTA 버튼 테스트');
    
    // 페이지에서 CTA 버튼 찾기
    const ctaButtons = [
        { selector: '.choice-btn[href="artist.html"]', name: '예술가 시작하기' },
        { selector: '.choice-btn[href="collector.html"]', name: '콜렉터 시작하기' },
        { selector: '.cta-button', name: '메인 CTA 버튼' },
        { selector: '.nav-link[href="artist.html"]', name: '예술가용 네비' },
        { selector: '.nav-link[href="collector.html"]', name: '콜렉터용 네비' }
    ];
    
    ctaButtons.forEach(button => {
        const element = document.querySelector(button.selector);
        if (element) {
            console.log(`✅ "${button.name}" 버튼 발견`);
            console.log(`   onclick 속성:`, element.getAttribute('onclick') || '없음');
            
            // onclick 속성에서 gtag 호출 확인
            const onclick = element.getAttribute('onclick');
            if (onclick && onclick.includes('gtag')) {
                console.log(`   ✅ gtag 호출 포함됨`);
            } else {
                console.warn(`   ⚠️  gtag 호출 없음`);
            }
        } else {
            console.warn(`⚠️  "${button.name}" 버튼을 찾을 수 없음`);
        }
    });
}

// 5. 실제 이벤트 전송 테스트
function testEventSending() {
    console.log('\n📊 5. 실제 이벤트 전송 테스트');
    
    if (typeof gtag === 'function') {
        // 이벤트 전송 전 dataLayer 크기
        const beforeCount = window.dataLayer ? window.dataLayer.length : 0;
        
        // 테스트 이벤트 전송
        gtag('event', 'diagnosis_test', {
            'event_category': 'diagnosis', 
            'event_label': 'deployment_test',
            'custom_parameter': 'test_value'
        });
        
        // 전송 후 dataLayer 크기 확인
        setTimeout(() => {
            const afterCount = window.dataLayer ? window.dataLayer.length : 0;
            if (afterCount > beforeCount) {
                console.log('✅ 이벤트 전송 성공 - dataLayer에 추가됨');
                console.log(`   전송 전: ${beforeCount}, 전송 후: ${afterCount}`);
            } else {
                console.error('❌ 이벤트 전송 실패 - dataLayer 변화 없음');
            }
        }, 500);
        
    } else {
        console.error('❌ gtag 함수가 없어 이벤트 전송 불가');
    }
}

// 6. 일반적인 배포 환경 문제 체크
function checkCommonDeploymentIssues() {
    console.log('\n🚨 6. 일반적인 배포 환경 문제 체크');
    
    // HTTPS 체크
    if (window.location.protocol === 'https:') {
        console.log('✅ HTTPS 연결');
    } else {
        console.warn('⚠️  HTTP 연결 - GA4는 HTTPS에서 최적 작동');
    }
    
    // 측정 ID 형식 체크
    const measurementIdPattern = /G-[A-Z0-9]{10}/;
    const scriptSrc = document.querySelector('script[src*="gtag/js"]')?.src;
    if (scriptSrc) {
        const idMatch = scriptSrc.match(/id=([^&]+)/);
        if (idMatch && measurementIdPattern.test(idMatch[1])) {
            console.log('✅ 올바른 GA4 측정 ID 형식:', idMatch[1]);
        } else {
            console.error('❌ 잘못된 측정 ID 형식');
        }
    }
    
    // CSP (Content Security Policy) 체크
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (cspMeta) {
        console.log('⚠️  CSP 감지됨:', cspMeta.content);
        if (!cspMeta.content.includes('googletagmanager.com')) {
            console.warn('⚠️  CSP에서 Google Analytics 허용하지 않을 수 있음');
        }
    } else {
        console.log('✅ CSP 제한 없음');
    }
}

// 7. 종합 진단 결과
function showDiagnosisResult() {
    setTimeout(() => {
        console.log('\n' + '='.repeat(50));
        console.log('📋 종합 진단 결과');
        console.log('='.repeat(50));
        
        const issues = [];
        
        if (typeof gtag !== 'function') {
            issues.push('❌ gtag 함수 로드되지 않음');
        }
        
        if (!window.dataLayer || !Array.isArray(window.dataLayer)) {
            issues.push('❌ dataLayer 초기화되지 않음');
        }
        
        if (window.location.protocol !== 'https:') {
            issues.push('⚠️  HTTPS 연결 권장');
        }
        
        if (issues.length === 0) {
            console.log('✅ 모든 체크 통과 - GA4 정상 작동 중');
            console.log('💡 만약 여전히 데이터가 수집되지 않는다면:');
            console.log('   1. GA4 대시보드에서 실시간 보고서 확인');
            console.log('   2. 24-48시간 후 데이터 축적 확인');
            console.log('   3. GA4 디버그 뷰 사용');
        } else {
            console.log('🚨 발견된 문제들:');
            issues.forEach(issue => console.log('   ' + issue));
            console.log('\n💡 해결 방안:');
            console.log('   1. 네트워크 연결 확인');
            console.log('   2. Ad Blocker 비활성화');
            console.log('   3. 브라우저 새로고침');
            console.log('   4. 개발자 도구 Network 탭에서 gtag 요청 확인');
        }
    }, 2000);
}

// 전체 진단 실행
function runFullDiagnosis() {
    checkEnvironment();
    checkGA4Loading();
    checkNetworkAndBlocking();
    testActualCTAButtons();
    testEventSending();
    checkCommonDeploymentIssues();
    showDiagnosisResult();
}

// 자동 실행
console.log('🚀 자동 진단 시작...');
runFullDiagnosis();

// 수동 실행 방법 안내
console.log('\n📖 수동 실행 명령어:');
console.log('runFullDiagnosis() - 전체 진단 재실행');