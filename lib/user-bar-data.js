/**
 * 頂部會員中心資料串接
 * 對齊 Storyboard §11 + Business v2 §4.5
 *
 * 規則:
 * - localStorage 已有就用(已有 session)
 * - 沒有就呼叫 /api/member/session
 * - 沒登入就顯示「會員登入」按鈕
 * - 登入就顯示 👑 等級 + SP
 */
(function() {
  'use strict';

  const TIER_LABELS = {
    free:   { zh: '初心旅人', moon: '🌑' },
    plus:   { zh: '星光旅人', moon: '🌒' },
    pro:    { zh: '命運探索者', moon: '🌓' },
    master: { zh: '靈魂解讀者', moon: '🌔' },
  };

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function renderLoggedOut() {
    const bar = document.querySelector('.user-bar');
    if (!bar) return;
    bar.dataset.tier = 'free';
    bar.dataset.state = 'guest';
    setText('userBarTier', '會員登入');
    setText('userBarSp', '0 SP');
  }

  function renderMember(member) {
    const bar = document.querySelector('.user-bar');
    if (!bar) return;
    const tierKey = member.tier || 'free';
    const tier = TIER_LABELS[tierKey] || TIER_LABELS.free;
    bar.dataset.tier = tierKey;
    bar.dataset.state = 'member';
    setText('userBarTier', `${tier.zh} ${tier.moon}`);
    setText('userBarSp', `${member.pointsBalance || member.points || 0} SP`);
  }

  function loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem('xm_member_session');
      if (raw) {
        const m = JSON.parse(raw);
        if (m && (m.nickname || m.pointsBalance !== undefined)) {
          renderMember(m);
          return true;
        }
      }
    } catch (e) {
      /* silent */
    }
    return false;
  }

  function saveToLocalStorage(member) {
    try {
      localStorage.setItem('xm_member_session', JSON.stringify(member));
    } catch (e) {
      /* silent */
    }
  }

  async function fetchSession() {
    if (!window.__xiaomengApi?.getSession) {
      // 沒有真 API,走 localStorage / guest 預設
      if (!loadFromLocalStorage()) renderLoggedOut();
      return;
    }
    try {
      const member = await window.__xiaomengApi.getSession();
      if (member && member.isLoggedIn) {
        saveToLocalStorage(member.member || member);
        renderMember(member.member || member);
      } else {
        renderLoggedOut();
      }
    } catch (e) {
      // API 失敗 → fallback
      if (!loadFromLocalStorage()) renderLoggedOut();
    }
  }

  // 開發示範:有 URL ?demo=1 自動塞假會員資料
  function ensureDemoMember() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('demo') === '1' && !localStorage.getItem('xm_member_session')) {
        const demo = {
          nickname: '示範會員',
          tier: 'plus',
          level: 2,
          pointsBalance: 520,
        };
        saveToLocalStorage(demo);
      }
    } catch (e) {
      /* silent */
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureDemoMember();
    fetchSession();
  });
})();
