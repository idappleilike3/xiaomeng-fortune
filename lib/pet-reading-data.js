// lib/pet-reading-data.js
// 22 張萌寵神諭卡 + 5 個位置(今生顯化篇)的短版解讀資料
// 本次 Sprint 1.5 MVP:每張卡每個位置生成一個 60-80 字的短版解讀
// 完整 110 種深度文案 → FUTURE_ROADMAP.md §3.1(本次不實作)

export const PET_TAROT_CARDS = [
  { id: "pet-00-ragdoll-fool", name: "愚者", pet: "布偶貓", num: 0,
    energy: "新旅程", base: "純真探索,毛孩正踏上一段新的靈魂冒險。", action: "給予自由與安全的小空間" },
  { id: "pet-01-snow-leopard-magician", name: "魔術師", pet: "雪豹", num: 1,
    energy: "主動顯化", base: "毛孩擁有創造力,正主動塑造環境。", action: "提供可探索的玩具或場景" },
  { id: "pet-02-persian-priestess", name: "女祭司", pet: "波斯貓", num: 2,
    energy: "直覺靜默", base: "毛孩正在觀察與感受,內在有話要說。", action: "留心他/她安靜時的位置" },
  { id: "pet-03-rabbit-empress", name: "皇后", pet: "兔子", num: 3,
    energy: "滋養豐盛", base: "毛孩正在給予或接受無條件的愛。", action: "給予擁抱與溫柔話語" },
  { id: "pet-04-lion-emperor", name: "皇帝", pet: "獅子", num: 4,
    energy: "結構權威", base: "毛孩正在建立自己的界線與秩序。", action: "尊重他/她的領域,不打擾" },
  { id: "pet-05-fox-hierophant", name: "教皇", pet: "狐狸", num: 5,
    energy: "傳統智慧", base: "毛孩循著本能與族群記憶行動。", action: "觀察他/她的習慣與偏愛" },
  { id: "pet-06-swans-lovers", name: "戀人", pet: "天鵝", num: 6,
    energy: "靈魂契合", base: "毛孩正經歷一段深刻的連結時刻。", action: "陪伴、輕聲說話、共享時間" },
  { id: "pet-07-horse-chariot", name: "戰車", pet: "馬", num: 7,
    energy: "前進推進", base: "毛孩正在快速前進或尋求突破。", action: "陪伴散步或運動消耗精力" },
  { id: "pet-08-tiger-strength", name: "力量", pet: "虎", num: 8,
    energy: "溫柔韌性", base: "毛孩以柔克剛,內在有安靜的力量。", action: "用耐心取代強硬指令" },
  { id: "pet-09-owl-hermit", name: "隱者", pet: "貓頭鷹", num: 9,
    energy: "內省獨處", base: "毛孩需要獨處與沉靜的時光。", action: "提供隱密的休息角落" },
  { id: "pet-10-chameleon-wheel", name: "命運之輪", pet: "變色龍", num: 10,
    energy: "循環轉變", base: "毛孩正經歷週期性的能量變化。", action: "順應他/她的節奏,不強求" },
  { id: "pet-11-bat-hanged-man", name: "吊人", pet: "蝙蝠", num: 11,
    energy: "暫停視角", base: "毛孩正在用自己的方式看待世界。", action: "換個角度理解他/她的行為" },
  { id: "pet-12-snake-death", name: "死神", pet: "蛇", num: 12,
    energy: "蛻變結束", base: "毛孩正結束一個舊習慣或階段。", action: "支持他/她的過渡,不強留" },
  { id: "pet-13-goldfish-temperance", name: "節制", pet: "金魚", num: 13,
    energy: "和諧整合", base: "毛孩正在平衡身心,尋找內在節奏。", action: "規律餵食與作息" },
  { id: "pet-14-blackcat-devil", name: "惡魔", pet: "黑貓", num: 14,
    energy: "執著依附", base: "毛孩可能有過度依賴或固著之處。", action: "給予安全感,但保留獨立空間" },
  { id: "pet-15-rooster-tower", name: "高塔", pet: "雞", num: 15,
    energy: "突發變化", base: "毛孩正經歷突然的改變或衝擊。", action: "穩定環境、降低噪音" },
  { id: "pet-16-phoenix-star", name: "星星", pet: "鳳凰", num: 16,
    energy: "希望療癒", base: "毛孩正處於希望與新生的能量。", action: "陪伴他/她探索新事物" },
  { id: "pet-17-wolf-moon", name: "月亮", pet: "狼", num: 17,
    energy: "潛意識夢境", base: "毛孩的情緒或夢境在傳遞訊息。", action: "留意夜間行為與情緒波動" },
  { id: "pet-18-butterfly-sun", name: "太陽", pet: "蝴蝶", num: 18,
    energy: "喜悅活力", base: "毛孩充滿快樂與活力。", action: "享受當下,一起曬太陽" },
  { id: "pet-19-stag-judgement", name: "審判", pet: "鹿", num: 19,
    energy: "覺醒召喚", base: "毛孩正經歷重要的內在覺醒。", action: "回應他/她的呼喚與眼神" },
  { id: "pet-20-whale-aeon", name: "世界", pet: "鯨魚", num: 20,
    energy: "圓滿祝福", base: "毛孩完成一個靈魂週期,正在整合。", action: "慶祝他/她的存在,給予感謝", isWorld: true }
];

// 第一神殿 5 個位置(今生顯化篇)
export const PET_FIRST_TEMPLE_POSITIONS = [
  { position: 1, theme: "毛孩目前能量", opening: "此刻毛孩的能量像", closing: "請留心他/她的呼吸節奏。" },
  { position: 2, theme: "毛孩真正情緒", opening: "毛孩表面或許平靜,但內在的情緒是", closing: "用溫柔的方式回應他/她。" },
  { position: 3, theme: "與主人的靈魂連結", opening: "你們之間的靈魂連結強度是", closing: "感謝這份相遇。" },
  { position: 4, theme: "目前需要改善的課題", opening: "目前最該正視的課題是", closing: "這是雙方成長的契機。" },
  { position: 5, theme: "最近的重要提醒", opening: "近期宇宙透過毛孩提醒你", closing: "留意接下來 7 天的訊息。" }
];

// 第二神殿 5 個位置(靈魂神殿篇 — 本次只存規格,顯示為「上鎖」)
export const PET_SECOND_TEMPLE_POSITIONS = [
  { position: 6, theme: "前世契約", opening: "你與毛孩的前世契約記載著", closing: "這是超越時間的羈絆。" },
  { position: 7, theme: "靈魂使命", opening: "毛孩此生的靈魂使命是", closing: "支持他/她走完這段旅程。" },
  { position: 8, theme: "未完成因果", opening: "需化解的業力課題是", closing: "寬恕是化解的鑰匙。" },
  { position: 9, theme: "未來祝福", opening: "未來 1-3 年的祝福方向是", closing: "願光一直照耀你們。" },
  { position: 10, theme: "動物神諭最終祝福", opening: "來自動物神諭的最高祝福是", closing: "願你們生生世世相伴。" }
];

// 短版解讀生成(60-80 字)
export function getShortReading(cardId, position) {
  const card = PET_TAROT_CARDS.find(c => c.id === cardId);
  if (!card) return null;

  // 第一神殿 5 個位置
  if (position >= 1 && position <= 5) {
    const pos = PET_FIRST_TEMPLE_POSITIONS[position - 1];
    return `${pos.opening}【${card.energy}】的氣場,${card.pet}的靈魂正在${card.base} ${pos.closing} 建議:${card.action}。`;
  }

  // 第二神殿 5 個位置(本次只顯示為「上鎖」,不生成解讀)
  return null;
}

// 第二神殿解讀(預留介面,本次不實作)
export function getSecondTempleReading(cardId, position) {
  const card = PET_TAROT_CARDS.find(c => c.id === cardId);
  if (!card) return null;
  const pos = PET_SECOND_TEMPLE_POSITIONS[position - 6];
  if (!pos) return null;
  // 本次回傳 null,等 Sprint 2+ 啟用金流後補上深度文案
  return `${pos.opening}【${card.energy}】的印記,${card.pet}的靈魂訊息待解鎖。${pos.closing}`;
}

// 取得第一神殿 5 張牌的完整解讀陣列
export function getFirstTempleReadings(cardIds) {
  return cardIds.slice(0, 5).map((cardId, idx) => ({
    position: idx + 1,
    cardId,
    reading: getShortReading(cardId, idx + 1),
    isUnlocked: true
  }));
}

// 取得第二神殿 5 張牌的狀態(全部上鎖)
export function getSecondTempleStatus(cardIds) {
  return cardIds.slice(5, 10).map((cardId, idx) => ({
    position: idx + 6,
    cardId,
    reading: null,  // 上鎖,不解讀
    isUnlocked: false
  }));
}

export const PET_MASTER_CONFIG = {
  totalCards: 10,
  firstTempleCount: 5,
  secondTempleCount: 5,
  spreadType: "pet_master_10",
  isFirstTempleFree: true
};