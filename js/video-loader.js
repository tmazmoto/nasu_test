/**
 * Video Loader
 * Vimeo動画の読み込み状態を管理し、静止画からのスムーズな遷移を実現
 */

(function() {
  'use strict';

  // 設定
  const CONFIG = {
    FALLBACK_TIMEOUT: 5000,        // フォールバック用タイムアウト（5秒）
    MIN_DISPLAY_TIME: 1500,        // 最低表示時間（暗い画面を十分に見せる）
    DEBUG: false                   // デバッグモード
  };

  // 状態管理
  let player = null;
  let videoLoadStartTime = null;
  let isVideoReady = false;
  let fallbackTimer = null;

  /**
   * Vimeo Player APIの初期化
   */
  function initVimeoPlayer() {
    const iframe = document.querySelector('.hero__video');
    const container = document.querySelector('.hero__video-container');

    if (!iframe || !container) {
      console.warn('Video elements not found');
      return;
    }

    videoLoadStartTime = Date.now();

    // Vimeo Player API読み込み確認
    if (typeof Vimeo === 'undefined' || typeof Vimeo.Player === 'undefined') {
      console.warn('Vimeo Player API not loaded, using fallback');
      useFallbackMethod(container);
      return;
    }

    try {
      // Playerインスタンス作成
      player = new Vimeo.Player(iframe);

      // イベントリスナー設定
      setupEventListeners(player, container);

      // フォールバック設定（念のため）
      setupFallbackTimeout(container);

    } catch (error) {
      console.error('Failed to initialize Vimeo Player:', error);
      useFallbackMethod(container);
    }
  }

  /**
   * Vimeoプレイヤーのイベントリスナー設定
   */
  function setupEventListeners(player, container) {
    // 動画準備完了イベント
    player.ready().then(function() {
      // 再生開始を待つ
      player.on('play', function() {
        handleVideoReady(container);
      });

      // バッファリング完了を待つ
      player.on('bufferend', function() {
        handleVideoReady(container);
      });

      // timeupdate（再生が実際に始まったことを確認）
      player.on('timeupdate', function(data) {
        if (data.seconds > 0.5 && !isVideoReady) {
          handleVideoReady(container);
        }
      });

    }).catch(function(error) {
      console.error('Player ready error:', error);
      useFallbackMethod(container);
    });

    // エラーハンドリング
    player.on('error', function(error) {
      console.error('Vimeo player error:', error);
      useFallbackMethod(container);
    });
  }

  /**
   * 動画準備完了時の処理
   */
  function handleVideoReady(container) {
    if (isVideoReady) return; // 二重実行防止

    const loadTime = Date.now() - videoLoadStartTime;

    // 最低表示時間の確保（暗い画面を十分に見せる）
    const minDisplayTime = Math.max(0, CONFIG.MIN_DISPLAY_TIME - loadTime);

    setTimeout(() => {
      isVideoReady = true;
      brightenAndFadeOut(container);
      clearFallbackTimeout();
    }, minDisplayTime);
  }

  /**
   * 画面を明るくしてから静止画をフェードアウト
   */
  function brightenAndFadeOut(container) {
    // video-loadedクラスを追加
    // → オーバーレイがフェードアウト（画面が明るくなる）
    // → 静止画が2秒後にフェードアウト開始
    container.classList.add('video-loaded');

    // アニメーション完了後、疑似要素を完全に削除
    // オーバーレイ: 3.5秒、静止画: 3秒 + 2秒ディレイ = 5秒
    setTimeout(() => {
      container.classList.add('video-fully-loaded');
    }, 5500); // 全体のアニメーション時間に合わせる
  }

  /**
   * フォールバックタイマー設定
   */
  function setupFallbackTimeout(container) {
    fallbackTimer = setTimeout(() => {
      if (!isVideoReady) {
        console.warn('Video load timeout, using fallback');
        handleVideoReady(container);
      }
    }, CONFIG.FALLBACK_TIMEOUT);
  }

  /**
   * フォールバックタイマークリア
   */
  function clearFallbackTimeout() {
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
  }

  /**
   * フォールバック方式（タイマーベース）
   */
  function useFallbackMethod(container) {
    setTimeout(() => {
      if (!isVideoReady) {
        handleVideoReady(container);
      }
    }, 3000); // 3秒後に強制フェードアウト
  }

  /**
   * ユーザー設定の確認（prefers-reduced-motion）
   */
  function checkUserPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // アニメーションを無効化したユーザーには即座に遷移
      const container = document.querySelector('.hero__video-container');
      if (container) {
        container.classList.add('video-loaded');
      }
      return false;
    }

    return true;
  }

  /**
   * ページ可視性変更の処理
   */
  function handleVisibilityChange() {
    if (document.hidden && player) {
      player.pause().catch(() => {});
    } else if (!document.hidden && player && isVideoReady) {
      player.play().catch(() => {});
    }
  }

  /**
   * 初期化
   */
  function init() {
    // ユーザー設定確認
    if (!checkUserPreferences()) {
      return;
    }

    // DOM読み込み待機
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initVimeoPlayer);
    } else {
      initVimeoPlayer();
    }

    // ページ可視性変更の監視
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  // 初期化実行
  init();

})();
