/**
 * GTM 전용 CTA 추적 시스템
 * GA4 직접 호출 없이 GTM dataLayer만 사용
 */

(function() {
    'use strict';

    // GTM 설정
    const GTM_CONFIG = {
        gtmId: window.__GTM_ID__ || 'GTM-594SVWKB',
        debug: true,
        maxRetries: 3,
        retryInterval: 1000
    };

    // CTA 셀렉터 정의 (단순화)
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

    let initRetryCount = 0;
    const MAX_INIT_RETRIES = 5;

    /**
     * GTM dataLayer 이벤트 전송 (단일 함수)
     */
    function sendGTMEvent(eventName, eventData) {
        try {
            // dataLayer 확인
            if (!window.dataLayer) {
                console.warn('[GTM] dataLayer not found, initializing...');
                window.dataLayer = [];
            }

            // 이벤트 데이터 구성
            const gtmEventData = {
                event: eventName,
                timestamp: Date.now(),
                page_url: window.location.href,
                page_path: window.location.pathname,
                page_title: document.title,
                ...eventData
            };

            // GTM으로 이벤트 전송
            window.dataLayer.push(gtmEventData);

            if (GTM_CONFIG.debug) {
                console.log('[GTM] 📤 Event sent:', gtmEventData);
            }

            return true;
        } catch (error) {
            console.error('[GTM] ❌ Event send failed:', error);
            return false;
        }
    }

    /**
     * CTA 클릭 이벤트 처리 (단순화)
     */
    function handleCtaClick(element, event) {
        // 중복 클릭 방지
        if (element.hasAttribute('data-processing')) {
            return;
        }

        element.setAttribute('data-processing', 'true');
        setTimeout(() => element.removeAttribute('data-processing'), 1000);

        // CTA 정보 추출
        const ctaData = {
            cta_name: element.getAttribute('data-cta-name') || 'unknown',
            cta_type: element.getAttribute('data-cta-type') || 'unknown',
            cta_location: element.getAttribute('data-cta-location') || 'unknown',
            cta_text: (element.textContent || '').trim().substring(0, 100),
            element_type: element.tagName.toLowerCase(),
            element_class: element.className || 'no-class'
        };

        // 링크 정보 (있는 경우)
        if (element.href) {
            ctaData.link_url = element.href;
        }

        // GTM으로 단일 이벤트 전송
        const success = sendGTMEvent('cta_click', ctaData);

        // 디버그 피드백
        if (GTM_CONFIG.debug) {
            console.log('[GTM] 🎯 CTA CLICKED:', ctaData);
            
            // 시각적 피드백
            element.style.outline = '2px solid #00ff00';
            setTimeout(() => element.style.outline = '', 1000);
        }

        return success;
    }

    /**
     * CTA 요소 바인딩 (단순화)
     */
    function bindCtaElements() {
        let boundCount = 0;
        const allElements = new Set();

        CTA_SELECTORS.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector + ':not([data-gtm-bound])');
                
                elements.forEach(element => {
                    // 중복 바인딩 방지
                    if (allElements.has(element)) {
                        return;
                    }

                    allElements.add(element);

                    // 단일 클릭 이벤트만 바인딩
                    element.addEventListener('click', function(event) {
                        handleCtaClick(element, event);
                    }, { once: false, passive: true });

                    // 바인딩 표시
                    element.setAttribute('data-gtm-bound', 'true');
                    boundCount++;

                    if (GTM_CONFIG.debug) {
                        console.log('[GTM] ✅ Bound:', selector, element);
                    }
                });
            } catch (error) {
                console.warn('[GTM] Selector error:', selector, error);
            }
        });

        console.log(`[GTM] 🎯 Total bound elements: ${boundCount}`);
        return boundCount;
    }

    /**
     * 페이지뷰 이벤트 전송
     */
    function sendPageView() {
        sendGTMEvent('page_view', {
            page_type: document.body.className || 'default'
        });
    }

    /**
     * GTM 초기화
     */
    function initGTM() {
        initRetryCount++;
        
        console.log(`[GTM] 🚀 Initializing attempt ${initRetryCount}/${MAX_INIT_RETRIES}`);

        // GTM 로드 확인
        if (!window.dataLayer) {
            if (initRetryCount < MAX_INIT_RETRIES) {
                setTimeout(initGTM, GTM_CONFIG.retryInterval);
                return;
            } else {
                console.warn('[GTM] ⚠️ GTM not loaded, creating minimal dataLayer');
                window.dataLayer = [];
            }
        }

        // 페이지뷰 전송
        sendPageView();

        // CTA 바인딩
        const boundCount = bindCtaElements();

        // 바인딩 재시도 (필요시)
        if (boundCount < 5 && initRetryCount < MAX_INIT_RETRIES) {
            setTimeout(() => {
                const retryCount = bindCtaElements();
                console.log(`[GTM] 🔄 Retry binding: ${retryCount} additional elements`);
            }, 2000);
        }

        console.log('[GTM] ✅ GTM initialization complete');
    }

    // DOM 준비 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGTM);
    } else {
        initGTM();
    }

    // 전역 노출 (디버깅용)
    window.GTMTracker = {
        sendEvent: sendGTMEvent,
        bindElements: bindCtaElements,
        config: GTM_CONFIG
    };

})();