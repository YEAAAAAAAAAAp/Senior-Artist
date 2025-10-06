/**
 * GA4 직접 구현 CTA 추적 시스템
 * GTM 대체용 순수 GA4 구현
 */

(function() {
    'use strict';

    // CTA 셀렉터 정의
    const CTA_SELECTORS = [
        '[data-cta-name]',
        '[data-cta-type]',
        '.cta-button',
        '.choice-btn', 
        '.submit-btn',
        '.modal-btn',
        '.feature-btn',
        '.nav-link',
        '.back-btn',
        '.mobile-toggle',
        '.close-btn'
    ];
    
    // 페이지별 액션 함수 매핑
    const ACTION_HANDLERS = {
        // artist.html
        openRegistration: function() {
            const overlay = document.getElementById('registrationOverlay');
            if (overlay) overlay.style.display = 'flex';
        },
        closeRegistration: function() {
            const overlay = document.getElementById('registrationOverlay');
            if (overlay) overlay.style.display = 'none';
        },
        
        // collector.html
        openInterestForm: function() {
            const overlay = document.getElementById('interestOverlay');
            if (overlay) overlay.style.display = 'flex';
        },
        closeInterestForm: function() {
            const overlay = document.getElementById('interestOverlay');
            if (overlay) overlay.style.display = 'none';
        },
        
        // index.html
        openAboutModal: function() {
            const modal = document.getElementById('aboutModal');
            if (modal) modal.style.display = 'block';
        },
        closeAboutModal: function() {
            const modal = document.getElementById('aboutModal');
            if (modal) modal.style.display = 'none';
        },
        closeForm: function() {
            const form = document.getElementById('contactForm');
            if (form) form.style.display = 'none';
        },
        selectRadio: function(event) {
            const value = event.currentTarget.getAttribute('data-radio-value');
            const radioId = value === 'artist' ? 'artist' : 'collector';
            document.getElementById(radioId).checked = true;
        }
    };

    /**
     * CTA 클릭 이벤트를 GA4로 전송
     */
    function trackCTAClick(element, event) {
        // CTA 정보 추출
        const ctaName = element.getAttribute('data-cta-name') || 'unknown';
        const ctaType = element.getAttribute('data-cta-type') || 'unknown';
        const ctaLocation = element.getAttribute('data-cta-location') || getElementLocation(element);
        const ctaText = (element.textContent || '').trim().substring(0, 100);
        
        // GA4 이벤트 전송
        gtag('event', 'cta_click', {
            'cta_name': ctaName,
            'cta_type': ctaType,
            'cta_location': ctaLocation,
            'cta_text': ctaText,
            'element_type': element.tagName.toLowerCase()
        });
        
        console.log('[GA4] 🔘 CTA Click:', {
            name: ctaName,
            type: ctaType,
            location: ctaLocation,
            text: ctaText
        });
        
        // data-action 속성이 있으면 해당 액션 실행
        const actionName = element.getAttribute('data-action');
        if (actionName && ACTION_HANDLERS[actionName]) {
            ACTION_HANDLERS[actionName](event);
        }
        
        // data-href 속성이 있으면 해당 URL로 이동
        const href = element.getAttribute('data-href');
        if (href) {
            setTimeout(function() {
                window.location.href = href;
            }, 100); // 이벤트가 전송될 시간을 조금 주기 위해 지연
        }
    }

    /**
     * 요소의 위치 정보를 문자열로 반환
     */
    function getElementLocation(element) {
        // 요소의 위치 정보 추출
        const parentId = element.parentElement?.id || '';
        const parentClass = element.parentElement?.className || '';
        
        let location = 'unknown';
        
        if (parentId) {
            location = parentId;
        } else if (parentClass) {
            location = parentClass.split(' ')[0];
        } else if (element.id) {
            location = `near_${element.id}`;
        }
        
        return location;
    }

    /**
     * CTA 요소에 클릭 이벤트 리스너 추가
     */
    function bindCTAElements() {
        let boundCount = 0;
        const selector = CTA_SELECTORS.join(', ');
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            // 이미 바인딩된 요소 건너뛰기
            if (!element.hasAttribute('data-ga-bound')) {
                element.addEventListener('click', function(event) {
                    trackCTAClick(this, event);
                });
                element.setAttribute('data-ga-bound', 'true');
                boundCount++;
            }
        });
        
        return boundCount;
    }

    /**
     * 페이지 로드 후 초기화
     */
    function initGATracking() {
        console.log('[GA4] 🚀 Initializing GA4 direct tracking');
        
        // CTA 바인딩
        const boundCount = bindCTAElements();
        
        // 완료 로그
        console.log(`[GA4] ✅ GA4 CTA tracking ready - ${boundCount} elements bound`);
    }

    // DOM 준비 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGATracking);
    } else {
        setTimeout(initGATracking, 100);
    }

    // 테스트 도구 (콘솔에서 사용)
    window.testCTA = function(selector) {
        const element = document.querySelector(selector || '.cta-button');
        if (element) {
            console.log('[GA4] 🧪 Testing CTA click on:', element);
            trackCTAClick(element);
            return true;
        } else {
            console.error('❌ CTA element not found');
            return false;
        }
    };

})();