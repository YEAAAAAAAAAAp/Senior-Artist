/**
 * GA4 안전 래퍼 및 CTA 바인딩 유틸리티
 * 버전: 1.0.0
 */

(function() {
    'use strict';

    // 전역 설정
    const GA_CONFIG = {
        measurementId: window.__GA_MEASUREMENT_ID__ || 'G-DE2ZNKWV2W',
        gtmId: window.__GTM_ID__ || 'GTM-594SVWKB',
        debug: true // 실시간 디버깅을 위해 활성화
    };

    /**
     * 안전한 gtag 래퍼
     * @param {string} command - gtag 명령
     * @param {string} action - 액션명
     * @param {object} parameters - 파라미터 객체
     */
    function safeGtag(command, action, parameters) {
        // GA4 로딩 상태 확인
        if (typeof window.gtag !== 'function') {
            console.warn('[GA4] gtag function not available - GA4 not loaded yet');
            // GA4가 로드될 때까지 이벤트를 큐에 저장
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push(arguments);
            return false;
        }

        // dataLayer 확인
        if (!window.dataLayer) {
            console.error('[GA4] dataLayer not available');
            return false;
        }

        try {
            // 실시간 이벤트 전송
            window.gtag(command, action, parameters);
            
            // 강제 전송 보장
            if (command === 'event') {
                window.gtag('config', GA_CONFIG.measurementId, {
                    'transport_type': 'beacon',
                    'send_page_view': false
                });
            }
            
            if (GA_CONFIG.debug) {
                console.log('[GA4] ✅ Event sent successfully:', { 
                    command, 
                    action, 
                    parameters,
                    timestamp: new Date().toISOString(),
                    measurementId: GA_CONFIG.measurementId
                });
            }
            return true;
        } catch (error) {
            console.error('[GA4] ❌ Error sending event:', error);
            return false;
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
        const timestamp = Date.now();
        const eventData = {
            event_category: 'engagement',
            event_label: 'cta_click',
            cta_text: ctaText || 'Unknown CTA',
            cta_location: ctaLocation || 'unknown_location',
            value: 1,
            timestamp: timestamp,
            page_url: window.location.href,
            page_title: document.title
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
            
            // 요소 클래스 정보
            if (element.className) {
                eventData.element_classes = element.className;
            }
        }

        // 통합 이벤트 전송 (GA4 + GTM)
        const success = sendUnifiedEvent('cta_click', eventData);
        
        if (GA_CONFIG.debug) {
            console.log('[GA4] 🎯 CTA Click Event:', {
                success,
                eventData,
                element: element?.outerHTML?.substring(0, 100) + '...'
            });
        }
        
        // 추가적인 실시간 추적 이벤트
        safeGtag('event', 'user_engagement', {
            engagement_time_msec: 100
        });
        
        return success;
    }

    /**
     * GTM 데이터레이어 푸시 (GTM과 호환)
     * @param {object} eventData - 이벤트 데이터
     */
    function pushToDataLayer(eventData) {
        try {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push(eventData);
            
            if (GA_CONFIG.debug) {
                console.log('[GTM] 📤 DataLayer push:', eventData);
            }
            return true;
        } catch (error) {
            console.error('[GTM] ❌ DataLayer push failed:', error);
            return false;
        }
    }

    /**
     * 통합 이벤트 전송 (GA4 + GTM)
     * @param {string} eventName - 이벤트명
     * @param {object} eventData - 이벤트 데이터
     */
    function sendUnifiedEvent(eventName, eventData) {
        const timestamp = Date.now();
        const unifiedData = {
            event: eventName,
            ...eventData,
            timestamp: timestamp,
            gtm_id: GA_CONFIG.gtmId,
            ga4_measurement_id: GA_CONFIG.measurementId
        };

        // GA4로 전송
        const ga4Success = safeGtag('event', eventName, eventData);
        
        // GTM 데이터레이어로 전송
        const gtmSuccess = pushToDataLayer(unifiedData);

        if (GA_CONFIG.debug) {
            console.log('[UNIFIED] 🚀 Event sent:', {
                eventName,
                ga4Success,
                gtmSuccess,
                data: unifiedData
            });
        }

        return ga4Success && gtmSuccess;
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

                    // 클릭 이벤트 리스너 추가
                    element.addEventListener('click', function(event) {
                        const ctaText = element.textContent.trim() || 
                                       element.getAttribute('aria-label') || 
                                       element.getAttribute('title') || 
                                       element.getAttribute('data-cta-name') ||
                                       'Unknown CTA';
                        
                        const ctaLocation = element.getAttribute('data-cta-location') ||
                                           element.closest('[data-section]')?.getAttribute('data-section') || 
                                           element.closest('section')?.className || 
                                           element.closest('.hero-content, .choice-section, .gallery-section')?.className?.split(' ')[0] ||
                                           'unknown_section';

                        // 즉시 이벤트 전송
                        const success = sendCtaClick(ctaText, ctaLocation, element);
                        
                        if (GA_CONFIG.debug) {
                            console.log('[GA4] 🔥 Immediate CTA Event Fired:', {
                                selector,
                                ctaText,
                                ctaLocation,
                                success,
                                element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : '')
                            });
                        }
                    }, { capture: true }); // capture 모드로 더 빠른 캐치

                    // 바인딩 완료 표시
                    element.setAttribute('data-ga-bound', 'true');
                    
                    if (GA_CONFIG.debug) {
                        console.log(`[GA4] ✅ Bound element:`, {
                            selector,
                            element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : ''),
                            text: element.textContent.trim().substring(0, 50)
                        });
                    }
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
        isGtagAvailable: isGtagAvailable,
        pushToDataLayer: pushToDataLayer,
        sendUnifiedEvent: sendUnifiedEvent
    };

    if (GA_CONFIG.debug) {
        console.log('[GA4] GA4Utils initialized with GTM support');
    }

})();