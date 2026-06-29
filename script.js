const tarotDeck = [
  ["愚者", "新的旅程正在展開，先讓心保持開放，別急著替未知下定論。"],
  ["魔術師", "你手上已有資源，適合主動出擊，把想法變成具體行動。"],
  ["女祭司", "答案藏在直覺裡，先觀察，不急著公開你的判斷。"],
  ["皇后", "滋養與創造力正在變強，適合照顧自己，也適合經營關係。"],
  ["皇帝", "需要建立界線與秩序，事情會因你的穩定而更有方向。"],
  ["教皇", "適合尋求前輩、老師或制度的協助，別一個人硬撐。"],
  ["戀人", "你面前有重要選擇，請同時看見心動與現實。"],
  ["戰車", "只要目標明確，就能推進；分心才是目前最大的阻力。"],
  ["力量", "溫柔比強硬更有力量，先穩住情緒，再處理局面。"],
  ["隱者", "你需要安靜整理答案，暫時慢下來反而會看得更清楚。"],
  ["命運之輪", "局勢正在轉動，順勢調整比強求原計畫更重要。"],
  ["正義", "公平與真相會浮現，請用清楚的標準做決定。"],
  ["吊人", "暫停不是失敗，換個角度會找到新的出口。"],
  ["死神", "某個階段正在結束，放下舊模式才有空間迎接新局。"],
  ["節制", "整合、協調、慢慢來，是現在最有效的策略。"],
  ["惡魔", "看見執著與慾望，別讓恐懼牽著你走。"],
  ["高塔", "突發變化會打破假象，但也會讓真正穩固的留下來。"],
  ["星星", "希望正在回來，適合療癒、許願與重新相信自己。"],
  ["月亮", "狀況還不明朗，先別急著下結論，直覺正在提醒你。"],
  ["太陽", "能量明亮，適合公開表達、主動邀約與開始新計畫。"],
  ["審判", "重要的醒悟正在發生，請回應內在真正的召喚。"],
  ["世界", "一個循環接近完成，你準備進入更成熟的新階段。"],
  ["權杖王牌", "新的熱情點燃了，適合開始創作、行動與嘗試。"],
  ["權杖二", "你正在規劃下一步，視野放大後選擇會更清楚。"],
  ["權杖三", "等待成果擴展，合作與遠方機會值得留意。"],
  ["權杖四", "穩定與慶祝的能量，適合建立關係安全感。"],
  ["權杖五", "競爭或摩擦增加，請把衝突轉成有效溝通。"],
  ["權杖六", "你會被看見，適合展現成果與爭取支持。"],
  ["權杖七", "守住立場，但別讓防衛心阻礙真正的交流。"],
  ["權杖八", "消息、進展與速度變快，請準備好即時回應。"],
  ["權杖九", "雖然疲憊，但你比想像中更接近突破。"],
  ["權杖十", "責任太重，需要分工，別把所有事都扛在身上。"],
  ["權杖侍者", "新鮮靈感出現，適合探索、學習與試水溫。"],
  ["權杖騎士", "行動力強，但要避免衝動決策。"],
  ["權杖皇后", "魅力與自信上升，適合主動吸引資源。"],
  ["權杖國王", "領導力成熟，請用願景帶動身邊的人。"],
  ["聖杯王牌", "新的情感開始，心正在打開。"],
  ["聖杯二", "關係有互相靠近的機會，真誠對話很重要。"],
  ["聖杯三", "友情、社群與支持能量增加，適合聚會或合作。"],
  ["聖杯四", "你可能有些麻木，先看見已經在身邊的好意。"],
  ["聖杯五", "失落感需要被承認，但不要忽略仍然留下的可能。"],
  ["聖杯六", "舊人舊事浮現，溫柔回顧，但別困在過去。"],
  ["聖杯七", "選項很多，請分辨幻想與真正可行的路。"],
  ["聖杯八", "你正在離開不再滋養你的狀態，這是勇敢的選擇。"],
  ["聖杯九", "願望有機會實現，請允許自己享受成果。"],
  ["聖杯十", "關係和諧、家庭感與歸屬感正在增強。"],
  ["聖杯侍者", "溫柔訊息到來，也可能是新的心動或創作靈感。"],
  ["聖杯騎士", "浪漫與邀約出現，但承諾仍需要觀察。"],
  ["聖杯皇后", "情感細膩，請相信你的同理心與直覺。"],
  ["聖杯國王", "成熟地處理情緒，是現在的關鍵。"],
  ["寶劍王牌", "真相與清楚判斷出現，適合說清楚、寫下來。"],
  ["寶劍二", "你正在猶豫，真正卡住的是不願看見的資訊。"],
  ["寶劍三", "心痛需要時間整理，誠實面對比假裝沒事更快復原。"],
  ["寶劍四", "休息是必要的，先恢復再決定下一步。"],
  ["寶劍五", "爭贏不一定是勝利，請確認代價是否值得。"],
  ["寶劍六", "你正在離開混亂，往更平靜的地方前進。"],
  ["寶劍七", "有隱藏資訊，請保護自己並留意細節。"],
  ["寶劍八", "限制感很強，但出口其實比你想像中近。"],
  ["寶劍九", "焦慮放大了問題，請把擔心拆成可處理的小事。"],
  ["寶劍十", "某件事已到盡頭，結束後才會真正鬆一口氣。"],
  ["寶劍侍者", "觀察與學習期，訊息很多但要查證。"],
  ["寶劍騎士", "速度很快，說話與決策都要避免太尖銳。"],
  ["寶劍皇后", "清醒、獨立、精準，請用理性保護界線。"],
  ["寶劍國王", "適合做策略判斷，客觀會帶來掌控感。"],
  ["錢幣王牌", "新的實際機會出現，可能與工作、金錢或健康有關。"],
  ["錢幣二", "你正在平衡多件事，時間與金錢管理是重點。"],
  ["錢幣三", "合作、專業與技術累積會帶來好成果。"],
  ["錢幣四", "安全感很重要，但過度緊抓會讓流動停住。"],
  ["錢幣五", "資源感不足時，請主動尋求協助，不必獨自承受。"],
  ["錢幣六", "給予與接受需要平衡，貴人或資源可能出現。"],
  ["錢幣七", "成果需要時間，現在適合檢查投入是否值得。"],
  ["錢幣八", "專注練習會累積實力，慢工能出細活。"],
  ["錢幣九", "獨立與品味提升，適合投資自己。"],
  ["錢幣十", "長期穩定、家族資源與財務規劃是重點。"],
  ["錢幣侍者", "新的學習或賺錢機會出現，先從基礎做起。"],
  ["錢幣騎士", "穩定推進最可靠，別小看每天一點點的累積。"],
  ["錢幣皇后", "照顧生活品質，也照顧實際資源。"],
  ["錢幣國王", "成熟的物質掌控力，適合談合作、財務與長期計畫。"],
];

const oraclePoems = [
  "心定則路明，事緩則局開。",
  "雲散月自現，貴人近身來。",
  "先守後可進，勿急自有成。",
  "一念轉方向，舊局生新光。",
  "話到七分止，緣分十分留。",
];

const menuTargets = {
  chart: "#profile",
  tarot: "#demo",
  oracle: "#demo",
  number: "#demo",
  market: "#market",
};

const automationTemplates = {
  daily:
    "早安，我是小夢老師。今天想知道感情、工作還是財運？回覆「抽牌」，我替你抽今日一張牌。免費看方向，完整解析可看今日行動建議。",
  weekly:
    "本週運勢已更新。設定生日的人可以看本週流年提醒。回覆「週運」查看免費摘要，想看感情、事業、財運完整解析可再解鎖。",
  profile:
    "你還差一點資料就能完成命盤。補上出生時間與出生地後，小夢老師就能幫你看八字時辰、紫微命宮與合盤方向。若不知道時間，也可以先選「不確定」。",
  premium:
    "你今天的牌面有明顯提醒。免費版先給你方向；如果想知道對方想法、未來 14 天走勢與下一步行動，可以解鎖完整解析。",
};

document.querySelectorAll("[data-card]").forEach((button) => {
  button.addEventListener("click", () => {
    const selected = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    const result = document.querySelector("#tarotResult");
    result.textContent = `${selected[0]}：${selected[1]} 想看完整感情、事業、財運與行動建議，可解鎖完整解析。`;
  });
});

document.querySelector("#drawOracle").addEventListener("click", () => {
  const poem = oraclePoems[Math.floor(Math.random() * oraclePoems.length)];
  document.querySelector("#oraclePoem").textContent = poem;
});

document.querySelector("#calcNumber").addEventListener("click", () => {
  const birthday = document.querySelector("#birthday").value;
  const digits = birthday.replace(/\D/g, "").split("").map(Number);
  let total = digits.reduce((sum, number) => sum + number, 0);

  while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = String(total)
      .split("")
      .map(Number)
      .reduce((sum, number) => sum + number, 0);
  }

  document.querySelector("#numberResult").textContent =
    `你的生命靈數是 ${total}。免費版先看核心性格，完整版可延伸感情、事業、流年與開運建議。`;
});

document.querySelector("#saveBirthProfile")?.addEventListener("click", () => {
  const profile = {
    name: document.querySelector("#profileName").value.trim(),
    gender: document.querySelector("#profileGender").value,
    birthDate: document.querySelector("#profileBirthDate").value,
    birthTime: document.querySelector("#profileBirthTime").value,
    birthPlace: document.querySelector("#profileBirthPlace").value.trim(),
    reminder: document.querySelector("#profileReminder").value,
  };

  localStorage.setItem("birthProfile", JSON.stringify(profile));
  document.querySelector("#profileResult").textContent =
    `已暫存出生資料，提醒頻率：${profile.reminder}。正式串接會員系統後，會自動帶入八字、紫微斗數、生命靈數與合盤功能。`;
});

document.querySelectorAll("[data-template]").forEach((button) => {
  button.addEventListener("click", () => {
    const template = automationTemplates[button.dataset.template];
    document.querySelector("#automationPreview").textContent = template;
  });
});

document.querySelectorAll("[data-menu]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = menuTargets[button.dataset.menu];
    document.querySelector(target).scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const target = action === "market" ? "#market" : action === "chart" ? "#profile" : "#demo";
    document.querySelector(target).scrollIntoView({ behavior: "smooth" });
  });
});
