/**
 * GA4 초기화 스크립트
 * DOM 준비 후 CTA 이벤트 바인딩 및 페이지뷰 전송
 */

(function() {
    'use strict';

    // CTA 셀렉터 정의 (지시문에서 제공된 파라미터 기반)
    const CTA_SELECTORS = [
        '.cta-button',
        '.choice-btn', 
        '.btn-primary',
        '.feature-btn',
        '.submit-btn',
        '.modal-btn',
        '.nav-link',
        '.back-btn',
        'a[href*="artist.html"]',
        'a[href*="collector.html"]',
        'button[onclick*="trackCTA"]',
        'button[onclick*="openRegistration"]',
        'button[onclick*="openInterestForm"]',
        'button[onclick*="openAboutModal"]',
        'button[data-cta-name]',
        'a[data-cta-name]'
    ];

    // MPA 여부 (현재 프로젝트는 MPA)
    const IS_SPA = false;

    /**
     * DOM이 준비된 후 실행할 초기화 함수
     */
    function initializeGA4() {
        // GA4Utils가 로드되었는지 확인
        if (typeof window.GA4Utils === 'undefined') {
            console.error('[GA4] GA4Utils not loaded. Make sure ga-lite.js is loaded first.');
            return;
        }

        // GA4 연결 상태 확인
        if (!window.GA4Utils.isGtagAvailable()) {
            console.warn('[GA4] gtag not available yet, retrying in 500ms...');
            setTimeout(initializeGA4, 500);
            return;
        }

        console.log('[GA4] Initializing GA4 tracking...');

        // CTA 이벤트 바인딩
        window.GA4Utils.bindCtaEvents(CTA_SELECTORS);

        // MPA인 경우에만 페이지뷰 전송 (GA4 config에서 이미 전송되므로 불필요)
        // if (!IS_SPA) {
        //     window.GA4Utils.sendPageView();
        // }

        console.log('[GA4] GA4 tracking initialized successfully');

        // 디버그 모드 (개발 중에만 활성화)
        // window.GA4Utils.setDebugMode(true);
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

    // DOM 준비 후 초기화 실행
    domReady(function() {
        // GA4Utils 로드 대기 (ga-lite.js가 먼저 로드되어야 함)
        if (typeof window.GA4Utils !== 'undefined') {
            initializeGA4();
        } else {
            // GA4Utils가 아직 로드되지 않은 경우 잠시 대기
            let attempts = 0;
            const maxAttempts = 10;
            
            const waitForGA4Utils = function() {
                attempts++;
                if (typeof window.GA4Utils !== 'undefined') {
                    initializeGA4();
                } else if (attempts < maxAttempts) {
                    setTimeout(waitForGA4Utils, 100);
                } else {
                    console.error('[GA4] GA4Utils failed to load after maximum attempts');
                }
            };
            
            setTimeout(waitForGA4Utils, 100);
        }
    });

    // 전역 함수로 노출 (필요시 수동 초기화 가능)
    window.initGA4 = initializeGA4;

})();