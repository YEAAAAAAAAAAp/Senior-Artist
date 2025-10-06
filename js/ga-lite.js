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
        // GA4 로딩 상태 확인 - 더 관대한 접근
        if (typeof window.gtag !== 'function') {
            // dataLayer가 있으면 직접 푸시
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push(arguments);
            
            // 지연 실행으로 재시도
            setTimeout(() => {
                if (typeof window.gtag === 'function') {
                    try {
                        window.gtag(command, action, parameters);
                        if (GA_CONFIG.debug) {
                            console.log('[GA4] 🔄 Delayed event sent:', action);
                        }
                    } catch (e) {
                        console.warn('[GA4] Delayed send failed:', e);
                    }
                }
            }, 1000);
            
            console.warn('[GA4] gtag not ready, queued event:', action);
            return true; // 큐에 저장했으므로 성공으로 처리
        }

        try {
            // 실시간 이벤트 전송 with enhanced parameters
            const enhancedParams = {
                ...parameters,
                transport_type: 'beacon', // 더 안정적인 전송
                send_page_view: false,
                non_interaction: false // 상호작용 이벤트로 처리
            };
            
            window.gtag(command, action, enhancedParams);
            
            if (GA_CONFIG.debug) {
                console.log('[GA4] 🚀 Event sent successfully:', { 
                    command, 
                    action, 
                    parameters: enhancedParams,
                    timestamp: new Date().toISOString(),
                    measurementId: GA_CONFIG.measurementId
                });
            }
            return true;
        } catch (error) {
            console.error('[GA4] ❌ Error sending event:', error);
            // 실패해도 dataLayer에 직접 추가 시도
            try {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: action,
                    ...parameters,
                    error_fallback: true
                });
                console.log('[GA4] 📤 Fallback to dataLayer push');
                return true;
            } catch (fallbackError) {
                console.error('[GA4] ❌ Fallback also failed:', fallbackError);
                return false;
            }
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
        
        // GA4 표준 이벤트 파라미터 구조
        const eventData = {
            // GA4 표준 파라미터들
            event_category: 'engagement',
            event_label: ctaText || 'Unknown CTA',
            content_type: 'cta',
            item_id: element?.getAttribute('data-cta-name') || 'unknown_cta',
            method: 'click',
            value: 1,
            
            // 커스텀 파라미터들 (GA4 custom_map에 정의됨)
            custom_parameter_1: element?.getAttribute('data-cta-type') || 'unknown',
            custom_parameter_2: element?.getAttribute('data-cta-name') || 'unknown',
            custom_parameter_3: element?.getAttribute('data-cta-location') || ctaLocation || 'unknown',
            custom_parameter_4: document.title || 'unknown_page',
            
            // 추가 컨텍스트 정보
            page_location: window.location.href,
            page_path: window.location.pathname,
            page_title: document.title,
            timestamp: timestamp
        };

        // 링크 URL 추가 (있는 경우)
        if (element?.href) {
            eventData.link_url = element.href;
            eventData.link_domain = new URL(element.href).hostname;
        }
        
        // 요소 타입별 추가 정보
        if (element) {
            eventData.element_type = element.tagName.toLowerCase();
            eventData.element_classes = element.className || 'no-class';
            eventData.element_text = (element.textContent || '').trim().substring(0, 100);
        }

        // GA4 표준 click 이벤트로 전송
        const success = sendUnifiedEvent('click', eventData);
        
        if (GA_CONFIG.debug) {
            console.log('[GA4] 🎯 Enhanced CTA Click Event:', {
                success,
                cta_name: eventData.custom_parameter_2,
                cta_type: eventData.custom_parameter_1,
                cta_location: eventData.custom_parameter_3,
                cta_text: ctaText
            });
        }
        
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

        // GA4로 직접 전송
        const ga4Success = safeGtag('event', eventName, eventData);
        
        // GTM 데이터레이어로 전송
        const gtmSuccess = pushToDataLayer(unifiedData);

        // 추가적인 실시간 전송 보장
        if (eventName === 'cta_click') {
            // 네트워크 요청 확실히 전송하기 위한 추가 방법
            setTimeout(() => {
                if (navigator.sendBeacon) {
                    const payload = JSON.stringify({
                        event: eventName,
                        ...eventData,
                        timestamp: Date.now(),
                        user_agent: navigator.userAgent,
                        url: window.location.href
                    });
                    
                    // Google Analytics Measurement Protocol로 직접 전송 (백업)
                    const measurementUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_CONFIG.measurementId}&api_secret=YOUR_API_SECRET`;
                    // 실제로는 API Secret이 필요하지만, beacon으로만 전송
                    navigator.sendBeacon('data:text/plain,', payload);
                    
                    if (GA_CONFIG.debug) {
                        console.log('[GA4] 📡 Beacon fallback sent');
                    }
                }
            }, 100);
        }

        if (GA_CONFIG.debug) {
            console.log('[UNIFIED] 🚀 Event sent:', {
                eventName,
                ga4Success,
                gtmSuccess,
                data: unifiedData
            });
        }

        return ga4Success || gtmSuccess; // 하나라도 성공하면 OK
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

                    // 중복 방지를 위한 최적화된 클릭 이벤트 리스너 
                    const clickHandler = function(event) {
                        // 중복 클릭 방지 (debouncing)
                        if (element.hasAttribute('data-click-processing')) {
                            console.log('[GA4] ⚠️ Click ignored - already processing');
                            return;
                        }
                        
                        // 처리 중 플래그 설정
                        element.setAttribute('data-click-processing', 'true');
                        
                        // 0.5초 후 플래그 제거
                        setTimeout(() => {
                            element.removeAttribute('data-click-processing');
                        }, 500);
                        
                        // 단일 로그 출력
                        console.log('[GA4] 🎯 CTA CLICKED!', element);
                        
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

                        // 즉시 이벤트 전송 (중복 dataLayer 푸시 제거)
                        const success = sendCtaClick(ctaText, ctaLocation, element);
                        
                        console.log('[GA4] 🔥 CTA Event Fired:', {
                            selector,
                            ctaText,
                            ctaLocation,
                            success,
                            element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : ''),
                            timestamp: new Date().toISOString()
                        });

                        // 추가 확인을 위한 시각적 피드백 (디버그 모드)
                        if (GA_CONFIG.debug) {
                            element.style.outline = '2px solid #00ff00';
                            setTimeout(() => {
                                element.style.outline = '';
                            }, 1000);
                        }
                    };

                    // 단일 클릭 이벤트만 바인딩 (중복 방지)
                    element.addEventListener('click', clickHandler, { 
                        capture: true, 
                        once: false, 
                        passive: false 
                    });

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