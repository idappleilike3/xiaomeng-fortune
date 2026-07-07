// lib/pet-master-draw.js
// 萌寵小夢神殿抽牌邏輯
// 從 22 張萌寵神諭卡中,不重複抽取 10 張(第一神殿 5 + 第二神殿 5)

import { PET_TAROT_CARDS } from "./pet-reading-data.js";

/**
 * 洗牌(Fisher-Yates)
 */
export function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 抽取萌寵神殿 10 張牌
 * @returns {Array<{position: number, cardId: string, name: string, pet: string}>}
 */
export function drawPetMasterTen(allCards = PET_TAROT_CARDS) {
  const shuffled = shuffleArray(allCards);
  return shuffled.slice(0, 10).map((card, idx) => ({
    position: idx + 1,
    cardId: card.id,
    name: card.name,
    pet: card.pet,
    num: card.num,
    energy: card.energy,
    imagePath: `assets/${card.id}.png`
  }));
}

/**
 * 分離第一神殿(前 5)與第二神殿(後 5)
 */
export function splitTemples(tenCards) {
  return {
    firstTemple: tenCards.slice(0, 5),
    secondTemple: tenCards.slice(5, 10)
  };
}

/**
 * 根據寵物名字 + 身份 + 問題類型 計算 session hash(用於冪等性)
 */
export function buildSessionSignature(lineUserId, petName, identity, questionType) {
  const raw = `${lineUserId}|${petName}|${identity}|${questionType}|${Date.now()}`;
  // 簡單 hash(不需加密強度,只是避免重複)
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return `pet_${Math.abs(hash).toString(36)}_${Date.now().toString(36)}`;
}

export const PET_MASTER_DRAW_CONFIG = {
  totalCards: 10,
  firstTempleCount: 5,
  secondTempleCount: 5
};