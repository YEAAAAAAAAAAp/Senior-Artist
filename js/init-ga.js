/**
 * GA4 초기화 스크립트
 * DOM 준비 후 CTA 이벤트 바인딩 및 페이지뷰 전송
 */

(function() {
    'use strict';

    // CTA 셀렉터 정의 - 완벽한 포괄적 선택자 (우선순위 기반)
    const CTA_SELECTORS = [
        // 최고 우선순위: 명시적 CTA 속성이 있는 모든 요소
        '[data-cta-name]',
        '[data-cta-type]',
        
        // 높은 우선순위: 주요 CTA 클래스들 
        '.cta-button',
        '.choice-btn', 
        '.submit-btn',
        '.modal-btn',
        
        // 중간 우선순위: 보조 CTA 클래스들
        '.feature-btn',
        '.btn-primary',
        '.nav-link',
        '.back-btn',
        '.mobile-toggle',
        '.close-btn',
        
        // 낮은 우선순위: 일반 버튼들
        '.btn',
        'button.primary',
        'button.secondary',
        
        // 링크 기반 CTA들
        'a[href*="artist.html"]',
        'a[href*="collector.html"]',
        
        // 이벤트 핸들러 기반 요소들
        'button[onclick]', // 모든 onclick 이벤트가 있는 버튼
        
        // 폼 관련 요소들
        'button[type="submit"]',
        'input[type="submit"]',
        
        // 포괄적 백업 선택자
        'button:not([type="button"]):not([class*="ignore-tracking"])',
        'a[href]:not([class*="ignore-tracking"])'
    ];

    // MPA 여부 (현재 프로젝트는 MPA)
    const IS_SPA = false;

    // 재시도 카운터
    let initRetryCount = 0;
    const MAX_INIT_RETRIES = 30; // 15초까지 재시도

    /**
     * DOM이 준비된 후 실행할 초기화 함수
     */
    function initializeGA4() {
        initRetryCount++;
        
        console.log(`[GA4] 🔄 Initialize attempt ${initRetryCount}/${MAX_INIT_RETRIES}`);

        // 최대 재시도 횟수 초과시 강제 실행
        if (initRetryCount > MAX_INIT_RETRIES) {
            console.warn('[GA4] ⚠ Max retries reached, forcing initialization...');
            forceInitialize();
            return;
        }

        // 기본적인 DOM 요소 확인
        if (!document.body) {
            console.warn('[GA4] DOM not ready, retrying...');
            setTimeout(initializeGA4, 100);
            return;
        }

        // GA4Utils가 로드되었는지 확인
        if (typeof window.GA4Utils === 'undefined') {
            console.warn(`[GA4] GA4Utils not loaded yet (attempt ${initRetryCount}), retrying...`);
            setTimeout(initializeGA4, 500);
            return;
        }

        // GA4 연결 상태 확인 - 더 관대한 접근
        const gtagAvailable = typeof window.gtag === 'function';
        const dataLayerAvailable = Array.isArray(window.dataLayer);
        
        if (!gtagAvailable && !dataLayerAvailable) {
            console.warn(`[GA4] Neither gtag nor dataLayer available (attempt ${initRetryCount}), retrying...`);
            setTimeout(initializeGA4, 500);
            return;
        }

        console.log('[GA4] 🚀 Initializing GA4 tracking...');
        console.log('[GA4] 📋 Available:', { 
            gtag: gtagAvailable, 
            dataLayer: dataLayerAvailable,
            GA4Utils: typeof window.GA4Utils !== 'undefined'
        });

        // 디버그 모드 활성화
        if (window.GA4Utils.setDebugMode) {
            window.GA4Utils.setDebugMode(true);
        }

        // CTA 이벤트 바인딩
        if (window.GA4Utils.bindCtaEvents) {
            window.GA4Utils.bindCtaEvents(CTA_SELECTORS);
        } else {
            console.error('[GA4] bindCtaEvents method not available');
        }

        // 즉시 테스트 이벤트 전송
        if (window.GA4Utils.sendUnifiedEvent) {
            window.GA4Utils.sendUnifiedEvent('ga4_initialized', {
                event_category: 'system',
                event_label: 'tracking_ready',
                page_url: window.location.href,
                timestamp: Date.now(),
                gtm_ready: typeof window.dataLayer !== 'undefined',
                init_attempt: initRetryCount
            });
        }

        console.log('[GA4] ✅ GA4 tracking initialized successfully');
        console.log('[GA4] 📊 Tracking selectors:', CTA_SELECTORS);
        
        // 실시간 CTA 요소 카운트
        const totalElements = CTA_SELECTORS.reduce((count, selector) => {
            try {
                return count + document.querySelectorAll(selector).length;
            } catch (e) {
                console.warn('[GA4] Error counting elements for selector:', selector, e);
                return count;
            }
        }, 0);
        
        console.log(`[GA4] 🎯 Total CTA elements found: ${totalElements}`);

        // 1초 후 스마트 검증 (재시도 최소화)
        setTimeout(() => {
            const boundElements = document.querySelectorAll('[data-ga-bound]').length;
            const bindingRate = totalElements > 0 ? (boundElements / totalElements) : 1;
            
            console.log(`[GA4] ✅ Bound elements: ${boundElements}/${totalElements} (${Math.round(bindingRate * 100)}%)`);
            
            // 바인딩률이 85% 미만이고 첫 번째 재시도일 때만 실행
            if (bindingRate < 0.85 && initRetryCount <= 1) {
                console.warn('[GA4] 🔄 Low binding rate, smart retry once...');
                
                // 바인딩되지 않은 요소들만 타겟팅
                const unboundSelectors = CTA_SELECTORS.filter(selector => {
                    try {
                        const elements = document.querySelectorAll(selector + ':not([data-ga-bound])');
                        return elements.length > 0;
                    } catch (e) {
                        return false;
                    }
                });
                
                if (unboundSelectors.length > 0 && window.GA4Utils.bindCtaEvents) {
                    console.log('[GA4] 🎯 Retrying for unbound selectors:', unboundSelectors.length);
                    window.GA4Utils.bindCtaEvents(unboundSelectors);
                    
                    // 재시도 후 최종 상태 확인
                    setTimeout(() => {
                        const finalBound = document.querySelectorAll('[data-ga-bound]').length;
                        const finalRate = totalElements > 0 ? (finalBound / totalElements) : 1;
                        console.log(`[GA4] 🎯 Final binding: ${finalBound}/${totalElements} (${Math.round(finalRate * 100)}%)`);
                    }, 1000);
                }
            }
        }, 1000);
    }

    /**
     * 강제 초기화 (fallback)
     */
    function forceInitialize() {
        console.warn('[GA4] 🆘 Force initializing with minimal setup...');
        
        // 기본 CTA 바인딩만 실행
        CTA_SELECTORS.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (!element.hasAttribute('data-ga-bound')) {
                        element.addEventListener('click', function() {
                            // 단순한 dataLayer 푸시
                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({
                                event: 'cta_click',
                                cta_text: element.textContent.trim() || 'Unknown CTA',
                                cta_name: element.getAttribute('data-cta-name') || 'unknown',
                                timestamp: Date.now()
                            });
                            console.log('[GA4] 🎯 Fallback CTA click:', element.textContent.trim());
                        });
                        element.setAttribute('data-ga-bound', 'fallback');
                    }
                });
            } catch (e) {
                console.error('[GA4] Error in force binding:', e);
            }
        });
        
        console.log('[GA4] 🆘 Fallback initialization completed');
    }

    /**
     * DOM 준비 상태 확인 및 초기화 실행
     */
    function domReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    // 다중 초기화 방법 (안정성 보장)
    function startInitializing() {
        console.log('[GA4] 🎬 Starting GA4 initialization process...');
        
        // 즉시 실행 시도
        if (typeof window.GA4Utils !== 'undefined') {
            console.log('[GA4] GA4Utils already available, initializing immediately');
            initializeGA4();
        } else {
            console.log('[GA4] GA4Utils not ready, waiting...');
            setTimeout(initializeGA4, 100);
        }
    }

    // DOM 준비 후 초기화 실행
    domReady(startInitializing);

    // 추가 백업 초기화 방법들
    window.addEventListener('load', function() {
        console.log('[GA4] 🎬 Window fully loaded');
        // 아직 초기화되지 않았다면 재시도
        if (initRetryCount === 0) {
            console.log('[GA4] No previous init attempts, starting now');
            setTimeout(startInitializing, 500);
        } else if (initRetryCount < 5) {
            console.log('[GA4] Previous attempts failed, retrying');
            setTimeout(startInitializing, 1000);
        }
    });

    // 타이머 기반 백업 초기화
    setTimeout(() => {
        if (initRetryCount === 0) {
            console.warn('[GA4] ⏰ Timer-based initialization fallback');
            forceInitialize();
        }
    }, 5000);

    // 전역 함수로 노출 (필요시 수동 초기화 가능)
    window.initGA4 = initializeGA4;
    window.forceInitGA4 = forceInitialize;

})();