/**
 * lib/spread-library.js
 * 三套占卜系統的牌陣 / 設定檔 / 元資料集中處
 * 對應 spec:
 *   - 塔羅 A-I 共 9 大分類 + 完整牌陣
 *   - 毛孩 7 大情境 + 健康警語
 *   - 神諭 3 種模式(今日訊息/宇宙提醒/心靈祝福)
 *
 * 命名:「深度解析排版工具」,絕不出現 AI / 演算法
 */

(function (global) {
  'use strict';

  // === 難度等級中文化對照表 ===
  const DIFFICULTY_ZH = {
    easy:     { label: '【新手・初窺】', tier: 1 },
    medium:   { label: '【進階・調頻】', tier: 2 },
    advanced: { label: '【專家・解碼】', tier: 3 },
    master:   { label: '【大師・終極】', tier: 4 }
  };

  // === 會員等級對照表 ===
  const ACCESS_LEVEL_ZH = {
    free:       { label: '免費試聽',     badge: '🎁' },
    premium:    { label: '尊榮會員',     badge: '🔒' },
    master:     { label: '殿堂大師',     badge: '🔐' }
  };

  // === 解鎖方式 ===
  const UNLOCK_METHODS = {
    firstFree:    { label: '首次免費',        icon: '🆕' },
    cash599:      { label: '599 元折抵',      icon: '💎' },
    pointRedeem:  { label: '靈性積分兌換',    icon: '✨' },
    memberTier:   { label: '會員等級解鎖',    icon: '🪪' }
  };

  // === 三大系統元資料 ===
  const SYSTEMS = {
    tarot: {
      code: 'tarot',
      name: 'Tarot System 塔羅探索',
      subtitle: '經典高奢歐風・22 大阿爾克那',
      cardBack: 'assets/tarot-card-back.png',
      cardSet: 'tarot',
      flipEffect: 'gold-sparkles',
      ambientSound: 'tarot-parchment-crystal',
      shareImg: 'assets/tarot-01-the-magician.png'
    },
    pet: {
      code: 'pet',
      name: 'Pet Divination 毛孩心語',
      subtitle: '溫暖療癒萌寵風・22 動物大師牌',
      cardBack: 'assets/pet-card-back.png',
      cardSet: 'pet',
      flipEffect: 'pink-hearts-paws',
      ambientSound: 'pet-musicbox-purring',
      shareImg: 'assets/pet-00-ragdoll-fool.png',
      disclaimer: '⚠️ 本解析僅提供能量指引,不能取代專業獸醫診斷與醫療。'
    },
    oracle: {
      code: 'oracle',
      name: 'Oracle Cards 今日神諭',
      subtitle: '極簡宇宙幾何風・神聖光之卡',
      cardBack: 'assets/oracle-card-back.png',
      cardSet: 'oracle',
      flipEffect: 'white-light-rays',
      ambientSound: 'oracle-singing-bowl-wind',
      shareImg: 'assets/oracle-card-face-today.png'
    }
  };

  // === 塔羅 9 大分類 + 完整牌陣 ===
  const TAROT_CATEGORIES = [
    {
      code: 'popular',
      label: '熱門推薦',
      icon: '🔥',
      difficulty: 'easy',
      accessLevel: 'free',
      unlockMethods: ['firstFree'],
      spreads: [
        { id: 'tarot-single',     name: '單張牌陣',      cardCount: 1, estimatedMinutes: 2, tags: ['入門','快速','每日指引'] },
        { id: 'tarot-three',      name: '三張時序',      cardCount: 3, estimatedMinutes: 5, tags: ['過去-現在-未來','經典'] },
        { id: 'tarot-five',       name: '五張十字',      cardCount: 5, estimatedMinutes: 8, tags: ['完整脈絡','綜合分析'] }
      ]
    },
    {
      code: 'love',
      label: '感情關係',
      icon: '💞',
      difficulty: 'medium',
      accessLevel: 'free',
      unlockMethods: ['firstFree'],
      spreads: [
        { id: 'love-ambiguous',   name: '曖昧發展',      cardCount: 5, estimatedMinutes: 8, tags: ['曖昧','單戀','觀察期'] },
        { id: 'love-reunion',     name: '復合分析',      cardCount: 7, estimatedMinutes: 12, tags: ['分手','復合','緣分'] },
        { id: 'love-soulmate',    name: '靈魂伴侶透視',  cardCount: 6, estimatedMinutes: 10, tags: ['真命天子','深層契合'] }
      ]
    },
    {
      code: 'career',
      label: '事業工作',
      icon: '🏛️',
      difficulty: 'medium',
      accessLevel: 'free',
      unlockMethods: ['firstFree'],
      spreads: [
        { id: 'career-decision',  name: '職涯十字路口',  cardCount: 5, estimatedMinutes: 8, tags: ['轉職','創業','方向'] },
        { id: 'career-interview', name: '面試能量',      cardCount: 3, estimatedMinutes: 5, tags: ['求職','面試','能量場'] }
      ]
    },
    {
      code: 'wealth',
      label: '財富豐盛',
      icon: '💰',
      difficulty: 'medium',
      accessLevel: 'free',
      unlockMethods: ['firstFree'],
      spreads: [
        { id: 'wealth-monthly',   name: '本月財運',      cardCount: 3, estimatedMinutes: 5, tags: ['月度','收支','機會'] },
        { id: 'wealth-invest',    name: '投資指南',      cardCount: 5, estimatedMinutes: 8, tags: ['標的','風險','時機'] }
      ]
    },
    {
      code: 'self',
      label: '自我探索',
      icon: '🪞',
      difficulty: 'advanced',
      accessLevel: 'premium',
      unlockMethods: ['cash599', 'pointRedeem'],
      spreads: [
        { id: 'self-shadow',      name: '陰影整合',      cardCount: 7, estimatedMinutes: 12, tags: ['潛意識','自我整合'] }
      ]
    },
    {
      code: 'spiritual',
      label: '靈性成長',
      icon: '🌌',
      difficulty: 'advanced',
      accessLevel: 'premium',
      unlockMethods: ['cash599', 'pointRedeem'],
      spreads: [
        { id: 'spiritual-path',   name: '靈魂藍圖',      cardCount: 7, estimatedMinutes: 15, tags: ['使命','天賦','靈魂契約'] }
      ]
    },
    {
      code: 'timeline',
      label: '流年時間',
      icon: '⏳',
      difficulty: 'advanced',
      accessLevel: 'premium',
      unlockMethods: ['cash599', 'pointRedeem'],
      spreads: [
        { id: 'timeline-year',    name: '流年 12 月',    cardCount: 12, estimatedMinutes: 25, tags: ['年度','月度指引'] }
      ]
    },
    {
      code: 'decision',
      label: '決策指引',
      icon: '⚖️',
      difficulty: 'advanced',
      accessLevel: 'premium',
      unlockMethods: ['cash599', 'pointRedeem'],
      spreads: [
        { id: 'decision-procon',  name: '二選一透視',    cardCount: 6, estimatedMinutes: 10, tags: ['A/B 抉擇','利弊'] }
      ]
    },
    {
      code: 'classic',
      label: '經典牌陣',
      icon: '📜',
      difficulty: 'master',
      accessLevel: 'master',
      unlockMethods: ['memberTier'],
      spreads: [
        { id: 'classic-celtic',   name: '凱爾特十字',    cardCount: 10, estimatedMinutes: 30, tags: ['大師','完整','深度'] },
        { id: 'classic-tree',     name: '生命之樹',      cardCount: 10, estimatedMinutes: 30, tags: ['卡巴拉','深層能量'] }
      ]
    }
  ];

  // === 毛孩心語 7 大情境 ===
  const PET_CATEGORIES = [
    { code: 'pet-daily',       label: '日常陪伴',     difficulty: 'easy',     accessLevel: 'free',    unlockMethods: ['firstFree'], cardCount: 1, estimatedMinutes: 2, tags: ['陪伴','日常能量'] },
    { code: 'pet-relation',    label: '關係探索',     difficulty: 'medium',   accessLevel: 'free',    unlockMethods: ['firstFree'], cardCount: 3, estimatedMinutes: 5, tags: ['人寵關係','默契'] },
    { code: 'pet-health',      label: '健康能量',     difficulty: 'medium',   accessLevel: 'free',    unlockMethods: ['firstFree'], cardCount: 3, estimatedMinutes: 5, tags: ['健康','能量場'],
      disclaimer: '⚠️ 本解析僅提供能量指引,不能取代專業獸醫診斷與醫療。' },
    { code: 'pet-behavior',    label: '行為理解',     difficulty: 'medium',   accessLevel: 'free',    unlockMethods: ['firstFree'], cardCount: 3, estimatedMinutes: 5, tags: ['行為','情緒','心理'] },
    { code: 'pet-new',         label: '新毛孩',       difficulty: 'easy',     accessLevel: 'free',    unlockMethods: ['firstFree'], cardCount: 1, estimatedMinutes: 2, tags: ['新成員','磨合期'] },
    { code: 'pet-passing',     label: '離世陪伴',     difficulty: 'advanced', accessLevel: 'premium', unlockMethods: ['cash599'],         cardCount: 5, estimatedMinutes: 12, tags: ['離世','哀悼','靈魂祝福'],
      disclaimer: '⚠️ 本解析僅提供能量指引,不能取代專業獸醫診斷與醫療。' },
    { code: 'pet-finding',     label: '找回毛孩',     difficulty: 'advanced', accessLevel: 'premium', unlockMethods: ['cash599'],         cardCount: 5, estimatedMinutes: 12, tags: ['走失','重逢','指引'] }
  ];

  // === 今日神諭 3 種模式 ===
  const ORACLE_MODES = [
    { code: 'oracle-daily',    label: '今日訊息',     icon: '☀️', difficulty: 'easy',  accessLevel: 'free', fields: { title: true, message: true, guidance: true, theme: true } },
    { code: 'oracle-universe', label: '宇宙提醒',     icon: '🌌', difficulty: 'easy',  accessLevel: 'free', fields: { title: true, message: true, guidance: true, theme: true } },
    { code: 'oracle-bless',    label: '心靈祝福',     icon: '🕊️', difficulty: 'easy',  accessLevel: 'free', fields: { title: true, message: true, guidance: true, theme: true } }
  ];

  // === 對外 API ===
  global.SPREAD_LIBRARY = {
    DIFFICULTY_ZH,
    ACCESS_LEVEL_ZH,
    UNLOCK_METHODS,
    SYSTEMS,
    TAROT_CATEGORIES,
    PET_CATEGORIES,
    ORACLE_MODES,
    getCategories(system) {
      if (system === 'tarot')  return TAROT_CATEGORIES;
      if (system === 'pet')    return PET_CATEGORIES;
      if (system === 'oracle') return ORACLE_MODES;
      return [];
    },
    getSystem(system) { return SYSTEMS[system] || null; },
    zhDifficulty(level) {
      const k = String(level || '').toLowerCase();
      return (DIFFICULTY_ZH[k] && DIFFICULTY_ZH[k].label) || level;
    },
    zhAccess(level) {
      const k = String(level || '').toLowerCase();
      const v = ACCESS_LEVEL_ZH[k];
      return v ? `${v.badge} ${v.label}` : level;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);