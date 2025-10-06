/**
 * GA4 안전 래퍼 및 CTA 바인딩 유틸리티
 * 버전: 1.0.0
 */

(function() {
    'use strict';

    // 전역 설정
    const GA_CONFIG = {
        measurementId: window.__GA_MEASUREMENT_ID__ || 'G-DE2ZNKWV2W',
        debug: false // 배포 시 false로 설정
    };

    /**
     * 안전한 gtag 래퍼
     * @param {string} command - gtag 명령
     * @param {string} action - 액션명
     * @param {object} parameters - 파라미터 객체
     */
    function safeGtag(command, action, parameters) {
        if (typeof window.gtag !== 'function') {
            if (GA_CONFIG.debug) {
                console.warn('[GA4] gtag function not available');
            }
            return;
        }

        try {
            window.gtag(command, action, parameters);
            if (GA_CONFIG.debug) {
                console.log('[GA4] Event sent:', { command, action, parameters });
            }
        } catch (error) {
            console.error('[GA4] Error sending event:', error);
        }
    }

    /**
     * 페이지뷰 전송
     * @param {string} path - 페이지 경로
     * @param {string} title - 페이지 제목
     */
    function sendPageView(path, title) {
        const pageData = {
            page_title: title || document.title,
            page_location: window.location.href
        };

        if (path) {
            pageData.page_path = path;
        }

        safeGtag('event', 'page_view', pageData);
    }

    /**
     * CTA 클릭 이벤트 전송
     * @param {string} ctaText - CTA 텍스트
     * @param {string} ctaLocation - CTA 위치
     * @param {HTMLElement} element - 클릭된 요소
     */
    function sendCtaClick(ctaText, ctaLocation, element) {
        const eventData = {
            event_category: 'engagement',
            event_label: 'cta_click',
            cta_text: ctaText,
            cta_location: ctaLocation,
            value: 1
        };

        // 데이터 속성에서 추가 정보 수집
        if (element) {
            const ctaType = element.getAttribute('data-cta-type');
            const ctaName = element.getAttribute('data-cta-name');
            
            if (ctaType) {
                eventData.cta_type = ctaType;
            }
            
            if (ctaName) {
                eventData.cta_name = ctaName;
            }
            
            // 링크 URL 추가 (있는 경우)
            if (element.href) {
                eventData.link_url = element.href;
            }
        }

        safeGtag('event', 'cta_click', eventData);
    }

    /**
     * CTA 요소들에 이벤트 바인딩
     * @param {Array} selectors - CSS 셀렉터 배열
     */
    function bindCtaEvents(selectors) {
        if (!Array.isArray(selectors)) {
            console.error('[GA4] CTA selectors must be an array');
            return;
        }

        selectors.forEach(function(selector) {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(function(element) {
                    // 이미 바인딩된 요소는 스킵
                    if (element.hasAttribute('data-ga-bound')) {
                        return;
                    }

                    element.addEventListener('click', function(event) {
                        const ctaText = element.textContent.trim() || 
                                       element.getAttribute('aria-label') || 
                                       element.getAttribute('title') || 
                                       'Unknown CTA';
                        
                        const ctaLocation = element.closest('[data-section]')?.getAttribute('data-section') || 
                                           element.closest('section')?.className || 
                                           'unknown_section';

                        sendCtaClick(ctaText, ctaLocation, element);
                    });

                    // 바인딩 완료 표시
                    element.setAttribute('data-ga-bound', 'true');
                });

                if (GA_CONFIG.debug && elements.length > 0) {
                    console.log(`[GA4] Bound ${elements.length} elements for selector: ${selector}`);
                }
            } catch (error) {
                console.error(`[GA4] Error binding selector ${selector}:`, error);
            }
        });
    }

    /**
     * 디버그 모드 설정
     * @param {boolean} enabled - 디버그 모드 활성화 여부
     */
    function setDebugMode(enabled) {
        GA_CONFIG.debug = !!enabled;
        if (enabled) {
            console.log('[GA4] Debug mode enabled');
        }
    }

    /**
     * GA4 연결 상태 확인
     * @returns {boolean} 연결 상태
     */
    function isGtagAvailable() {
        return typeof window.gtag === 'function' && 
               typeof window.dataLayer !== 'undefined';
    }

    // 전역 객체에 유틸리티 함수들 노출
    window.GA4Utils = {
        safeGtag: safeGtag,
        sendPageView: sendPageView,
        sendCtaClick: sendCtaClick,
        bindCtaEvents: bindCtaEvents,
        setDebugMode: setDebugMode,
        isGtagAvailable: isGtagAvailable
    };

    if (GA_CONFIG.debug) {
        console.log('[GA4] GA4Utils initialized');
    }

})();