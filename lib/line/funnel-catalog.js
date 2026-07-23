/**
 * Conversation Growth funnel catalog (Phase A+B).
 * Aligned with emotion-bridge CONVERSATION_GROWTH_AND_COMMERCE_SPEC + L2 pricing shelf.
 * `amount` mirrors erosee-l2-pricing.html (TWD) for NewebPay MPG checkout.
 */

/** @typedef {{ id: string, label: string, hint: string }} Topic */
/** @typedef {{ id: string, label: string, hint: string }} Problem */
/** @typedef {{ id: string, label: string, hint: string }} Need */
/** @typedef {{ id: string, title: string, blurb: string, pricingRoute: string, amount: number, needIds: string[], topicIds: string[] }} RecommendProduct */

/** @type {Topic[]} */
export const TOPICS = [
  { id: "love", label: "❤️ 感情關係", hint: "看懂對方態度、關係變化與下一步" },
  { id: "pet", label: "🐾 萌寵心語", hint: "了解毛孩心情、行為與你們的連結" },
  { id: "work", label: "💼 工作事業", hint: "看見盲點、機會與最值得投入的方向" },
  { id: "wealth", label: "💰 財富金流", hint: "看清金錢流動、機會與風險" },
  { id: "growth", label: "🌱 自我成長", hint: "釐清最近最在意的事與節奏" },
  { id: "life", label: "🧭 生活指引", hint: "想找一個方向時，慢慢理出頭緒" },
  { id: "other", label: "🌌 其他困擾", hint: "還沒整理好的事，也可以從這裡開始" },
];

/** @type {Record<string, { prompt: string, problems: Problem[] }>} */
export const PROBLEMS_BY_TOPIC = {
  love: {
    prompt: "感情裡，現在最讓你放不下的是哪一件事呢？",
    problems: [
      { id: "no_reply", label: "💬 已讀不回", hint: "對方看過訊息，卻遲遲沒有回覆" },
      { id: "sudden_coldness", label: "❄️ 突然冷淡", hint: "原本互動正常，最近態度明顯改變" },
      { id: "situationship", label: "💞 曖昧不明", hint: "有互動，卻不知道對方是否認真" },
      { id: "breakup_recovery", label: "💔 分手挽回", hint: "想知道還有沒有重新開始的可能" },
      { id: "conflict_repair", label: "⚡ 爭吵修復", hint: "衝突後不知道該主動還是先冷靜" },
      { id: "partner_intentions", label: "🔍 對方真實想法", hint: "想了解對方現在如何看待這段關係" },
      { id: "third_party", label: "👤 第三者疑慮", hint: "擔心關係受到干擾" },
      { id: "relationship_other", label: "🌙 其他感情問題", hint: "我的情況不在上面的選項裡" },
    ],
  },
  pet: {
    prompt: "關於你的毛孩，現在最想了解的是哪一件事呢？",
    problems: [
      { id: "pet_emotion", label: "🐶 毛孩現在的心情", hint: "想知道牠最近開不開心或有沒有壓力" },
      { id: "pet_connection", label: "💞 我和毛孩的連結", hint: "想了解你們之間的情感連結" },
      { id: "pet_behavior_change", label: "🐾 行為突然改變", hint: "變得黏人、躲起來或不吃東西" },
      { id: "pet_adaptation", label: "🏠 新環境與適應", hint: "搬家、新成員或寄宿後的適應" },
      { id: "pet_care_support", label: "🩺 生病與照護陪伴", hint: "生病、治療或年老時的陪伴" },
      { id: "pet_loss", label: "🌈 離世毛孩與思念", hint: "整理思念、遺憾與告別" },
      { id: "multiple_pets", label: "🐕 多寵相處問題", hint: "兩隻以上毛孩的相處狀態" },
      { id: "pet_other", label: "🌙 其他萌寵問題", hint: "想直接描述毛孩最近的狀況" },
    ],
  },
  work: {
    prompt: "最近在工作上，哪一件事最讓你困擾呢？",
    problems: [
      { id: "work_stress", label: "😣 工作壓力", hint: "工作量、責任或情緒壓力很重" },
      { id: "work_relationship", label: "👥 職場人際", hint: "與主管、同事或客戶出現摩擦" },
      { id: "job_change", label: "🔄 是否轉職", hint: "不確定該留下還是找新機會" },
      { id: "work_blockage", label: "📉 工作不順", hint: "努力很久卻卡住" },
      { id: "promotion", label: "📈 升遷與加薪", hint: "想了解被看見或升遷機會" },
      { id: "career_direction", label: "🧭 職涯方向", hint: "不確定下一步該往哪裡走" },
      { id: "work_other", label: "🌙 其他工作問題", hint: "我的情況不在上面的選項裡" },
    ],
  },
  wealth: {
    prompt: "你現在最想了解哪一方面的金錢問題呢？",
    problems: [
      { id: "income_instability", label: "💸 收入不穩", hint: "收入忽高忽低，缺乏安全感" },
      { id: "financial_pressure", label: "🧾 金錢壓力", hint: "支出、債務或生活負擔焦慮" },
      { id: "money_outlook", label: "💵 近期財運", hint: "想了解最近金錢流動與機會" },
      { id: "investment_decision", label: "📊 投資選擇", hint: "面對投資或資金配置猶豫" },
      { id: "spending_saving", label: "🛍️ 消費與存錢", hint: "想改善花錢習慣" },
      { id: "financial_cooperation", label: "🤝 金錢合作", hint: "借貸、合夥關係讓你猶豫" },
      { id: "finance_other", label: "🌙 其他財務問題", hint: "我的情況不在上面的選項裡" },
    ],
  },
  growth: {
    prompt: "最近的你，最想整理的是哪一部分呢？",
    problems: [
      { id: "emotional_distress", label: "😔 情緒低落", hint: "容易難過、焦慮或提不起精神" },
      { id: "self_worth", label: "🪞 自我價值", hint: "容易懷疑自己或過度在意看法" },
      { id: "repeating_pattern", label: "🔁 反覆卡關", hint: "總在相似的人事裡受傷" },
      { id: "life_direction", label: "🧭 人生方向", hint: "對未來感到迷惘" },
      { id: "healing", label: "🌿 放下與療癒", hint: "想走出一段經歷" },
      { id: "self_discovery", label: "🧠 內在探索", hint: "想更了解自己的需求與模式" },
      { id: "growth_other", label: "🌙 其他成長問題", hint: "我的情況不在上面的選項裡" },
    ],
  },
  life: {
    prompt: "生活裡，現在最想先看清楚的是哪一件？",
    problems: [
      { id: "life_choice", label: "⚖️ 重要選擇", hint: "兩個方向之間不知道怎麼選" },
      { id: "life_rhythm", label: "🕰️ 節奏重整", hint: "想把生活節奏重新調回來" },
      { id: "life_relationship", label: "👥 人際界線", hint: "家人朋友之間的界線與距離" },
      { id: "life_other", label: "🌙 其他生活問題", hint: "想直接描述現在的狀況" },
    ],
  },
  other: {
    prompt: "",
    problems: [],
  },
};

/** @type {Need[]} */
export const NEEDS = [
  {
    id: "solve_now",
    label: "① 解決目前問題",
    hint: "想知道現在該怎麼做，才能改善狀況",
  },
  {
    id: "full_arc",
    label: "② 看完整關係發展",
    hint: "想看完整解析、真實想法與關鍵時間點",
  },
  {
    id: "companion",
    label: "③ 希望持續有人陪伴",
    hint: "情緒與關係反覆，希望有人陪著整理",
  },
];

/**
 * Recommend products aligned with L2 shelf sections (erosee-l2-pricing.html).
 * @type {RecommendProduct[]}
 */
export const PRODUCTS = [
  {
    id: "emotion_depth",
    title: "情感深度分析",
    blurb: "看清對方態度、卡住原因，以及你下一步怎麼走",
    pricingRoute: "/pricing/emotion",
    amount: 899,
    needIds: ["solve_now", "full_arc"],
    topicIds: ["love", "growth", "life", "other"],
  },
  {
    id: "emotion_line",
    title: "LINE 對話解析",
    blurb: "整理對話裡的訊號，釐清對方真實態度",
    pricingRoute: "/pricing/emotion",
    amount: 1299,
    needIds: ["solve_now"],
    topicIds: ["love"],
  },
  {
    id: "emotion_relation",
    title: "關係健檢",
    blurb: "把關係全貌攤開，看投入、信任與發展空間",
    pricingRoute: "/pricing/emotion",
    amount: 1999,
    needIds: ["full_arc"],
    topicIds: ["love", "growth"],
  },
  {
    id: "emotion_tarot5",
    title: "五張塔羅（凱爾特十字）",
    blurb: "議題複雜時看全局，適合想看完整牌陣的你",
    pricingRoute: "/pricing/emotion",
    amount: 699,
    needIds: ["full_arc", "solve_now"],
    topicIds: ["love", "work", "wealth", "growth", "life", "other"],
  },
  {
    id: "pet_bond",
    title: "我們的陪伴關係",
    blurb: "看清你與毛孩之間更深一層的連結",
    pricingRoute: "/pricing/pet",
    amount: 3600,
    needIds: ["solve_now", "full_arc", "companion"],
    topicIds: ["pet"],
  },
  {
    id: "pet_triple",
    title: "萌寵三張牌指引",
    blurb: "用三張牌整理毛孩現況與你們的互動",
    pricingRoute: "/pricing/pet",
    amount: 399,
    needIds: ["solve_now"],
    topicIds: ["pet"],
  },
  {
    id: "career_fork",
    title: "職涯十字路",
    blurb: "適合轉職、升遷與方向選擇卡住時",
    pricingRoute: "/pricing/career",
    amount: 699,
    needIds: ["solve_now", "full_arc"],
    topicIds: ["work"],
  },
  {
    id: "wealth_celtic",
    title: "財運五張塔羅",
    blurb: "金錢議題複雜時，用全局視角整理機會與風險",
    pricingRoute: "/pricing/wealth",
    amount: 699,
    needIds: ["solve_now", "full_arc"],
    topicIds: ["wealth"],
  },
  {
    id: "subscribe_resonance",
    title: "共鳴會員陪伴",
    blurb: "適合想持續有人陪你整理情緒與關係的你",
    pricingRoute: "/pricing/subscribe",
    amount: 990,
    needIds: ["companion"],
    topicIds: ["love", "pet", "work", "wealth", "growth", "life", "other"],
  },
  {
    id: "heal_organize",
    title: "情緒整理",
    blurb: "先把混亂情緒安放好，再談下一步",
    pricingRoute: "/pricing/heal",
    amount: 299,
    needIds: ["solve_now", "companion"],
    topicIds: ["growth", "life", "other", "love"],
  },
];

export const CARD_POSITIONS = [
  { key: "past", label: "第一張｜現況" },
  { key: "present", label: "第二張｜關鍵" },
  { key: "future", label: "第三張｜走向" },
];

/**
 * Free 3-card funnel deck — Major Arcana only (all have public PNG faces).
 * Prefer tarot-new-* (served via PUBLIC_BASE_URL on Render HTTPS).
 * Copy: Taiwanese spoken, no sentence-ending 「。」, no AI / 小夢 branding.
 *
 * @typedef {{
 *   id: string,
 *   name: string,
 *   imagePath: string,
 *   imagePathFallback: string,
 *   meaningShort: string,
 *   spoken: string,
 *   spokenCliff: string
 * }} FreeTarotCard
 */

/** @type {FreeTarotCard[]} */
export const FREE_TAROT_CARDS = [
  {
    id: "00",
    name: "愚者",
    imagePath: "assets/tarot-new-00-fool.png",
    imagePathFallback: "assets/tarot-00-the-fool.png",
    meaningShort: "心其實已經想往前了 只是還在門口猶豫",
    spoken:
      "抽到愚者耶 我覺得你現在不是不懂 比較像站在門口 腳已經抬起來了 卻還在想要不要真的跨出去\n這種感覺很正常啦 新的開始本來就會有點虛 但牌面在說的是——你心裡那股想動的感覺 其實比你嘴上承認的還清楚",
    spokenCliff:
      "愚者出現在走向這格 代表後面有一段全新的路要開始 可是有個關鍵轉折我還不能一次講完",
  },
  {
    id: "01",
    name: "魔術師",
    imagePath: "assets/tarot-new-01-magician.png",
    imagePathFallback: "assets/tarot-01-the-magician.png",
    meaningShort: "牌面不是叫你等 是提醒你手上其實有牌",
    spoken:
      "魔術師跑出來了 說真的 我不太覺得你現在缺資源 比較像是你自己還沒把桌上的東西認出來\n你其實會的比你想的多 只是最近有點把自己看扁了 這張牌比較像在拍你肩膀：先動一小步 場就會跟著活起來",
    spokenCliff:
      "魔術師落在走向 代表後面真的有主動權可以拿回來 但怎麼出招 還有一段我先留著",
  },
  {
    id: "02",
    name: "女祭司",
    imagePath: "assets/tarot-new-02-priestess.png",
    imagePathFallback: "assets/tarot-02-the-high-priestess.png",
    meaningShort: "別急著逼答案 你身體其實早就有感覺了",
    spoken:
      "女祭司耶……這張很安靜 可是很準 我覺得你心裡其實隱隱約約有答案了 只是還不太敢承認\n現在比較適合先感覺、先觀察 不要硬逼自己或對方給一個乾淨結論 你內在那條線 比外面吵鬧的訊息更接近真相",
    spokenCliff:
      "女祭司在走向這格 後面還藏著一個還沒掀開的真相 我先讓你看牌面 完整的部分稍後再說",
  },
  {
    id: "03",
    name: "皇后",
    imagePath: "assets/tarot-new-03-empress.png",
    imagePathFallback: "assets/tarot-03-the-empress.png",
    meaningShort: "這題需要溫度 硬撐反而會更乾",
    spoken:
      "皇后出現 感覺比較像在提醒你：這件事不能只靠意志力硬撐\n你最近是不是把自己照顧得太少了？關係、心情、甚至身體 都需要一點被滋養的空間 溫柔不是軟弱喔 有時候溫柔才是真的能讓事情長出來的方式",
    spokenCliff:
      "皇后落在走向 後面其實有一條比較柔、也比較穩的路 但完整怎麼走 我先不一次攤完",
  },
  {
    id: "04",
    name: "皇帝",
    imagePath: "assets/tarot-new-04-emperor.png",
    imagePathFallback: "assets/tarot-04-the-emperor.png",
    meaningShort: "界線一清楚 很多混亂會自己退開",
    spoken:
      "皇帝出來了 這張有點直球 它在講的是秩序跟界線\n你最近是不是被別人的節奏牽著跑？或是自己一直沒講清楚底線 牌面比較像在說：把規則抓回來 事情才會有方向 不是要你變兇 是要你對自己負責一點",
    spokenCliff:
      "皇帝在走向這格 代表後面需要你把主導權拿穩 可是怎麼拿 還有一個關鍵點我先留白",
  },
  {
    id: "05",
    name: "教皇",
    imagePath: "assets/tarot-new-05-hierophant.png",
    imagePathFallback: "assets/tarot-05-the-hierophant.png",
    meaningShort: "這次不一定要硬闖 有人走過的路可以參考",
    spoken:
      "教皇出現 我覺得你現在不一定要一個人硬扛到底\n有時候找一個懂的人聊聊、問前輩、或照一個比較穩的方法走 反而比較不耗 這張不是叫你盲從 是提醒你：不用每次都從零發明答案",
    spokenCliff:
      "教皇落在走向 後面有一個「被引導」或「被認可」的訊號 細節我先留到解鎖再說",
  },
  {
    id: "06",
    name: "戀人",
    imagePath: "assets/tarot-new-06-lovers.png",
    imagePathFallback: "assets/tarot-06-the-lovers.png",
    meaningShort: "心動很重要 可是選擇也得對得起自己",
    spoken:
      "戀人耶……這張一出來 空氣就不太一樣了 你面前很明顯有選擇 不一定是兩個人 也可能是兩種關係模式、兩種態度\n心動當然要聽 但這張也在問你：你選的那個 能不能同時對得起感覺跟現實 不要只選當下舒服的那一面",
    spokenCliff:
      "戀人在走向這格 後面有一個很關鍵的選擇點 我先讓你看到牌 完整怎麼選 先賣個關子",
  },
  {
    id: "07",
    name: "戰車",
    imagePath: "assets/tarot-new-07-chariot.png",
    imagePathFallback: "assets/tarot-07-the-chariot.png",
    meaningShort: "方向對了就推 別讓分心把速度吃掉",
    spoken:
      "戰車衝出來了 感覺你其實已經有目標了 只是路上雜訊有點多\n這張比較像在幫你打氣：把視線收回來 一次抓一件最重要的事往前推 你不是沒力 是力散掉了 收斂之後 進度會比你想的快",
    spokenCliff:
      "戰車落在走向 代表後面真的有推進的動能 但要往哪衝最划算 還有一段我先不講破",
  },
  {
    id: "08",
    name: "力量",
    imagePath: "assets/tarot-new-08-strength.png",
    imagePathFallback: "assets/tarot-08-strength.png",
    meaningShort: "硬碰硬未必贏 柔一點反而更能穩住",
    spoken:
      "力量這張很漂亮欸 它不是叫你咬牙死撐 比較像在說：你其實有能力把情緒安住\n最近如果一直想用強硬去換安全感 可能會更累 溫柔地對待自己 或柔一點跟對方說話 反而比較有機會把局面轉過來",
    spokenCliff:
      "力量出現在走向 後面有一股很穩的內在動能 可是怎麼用 還有一個轉折點我先留著",
  },
  {
    id: "09",
    name: "隱者",
    imagePath: "assets/tarot-new-09-hermit.png",
    imagePathFallback: "assets/tarot-09-the-hermit.png",
    meaningShort: "先安靜一下 答案比較容易自己浮出來",
    spoken:
      "隱者……這張很適合你現在這種狀態 不是叫你逃避 是提醒你可以先退一步整理\n外面聲音太多的時候 你越急越容易選錯 給自己一點獨處或放空的空間 很多本來糾在一起的線 會慢慢變清楚",
    spokenCliff:
      "隱者在走向這格 代表後面需要一段沉澱 但沉澱之後會看到什麼 我先不一次說完",
  },
  {
    id: "10",
    name: "命運之輪",
    imagePath: "assets/tarot-new-10-wheel.png",
    imagePathFallback: "assets/tarot-10-wheel-of-fortune.png",
    meaningShort: "局勢正在轉 抓得太死反而容易痛",
    spoken:
      "命運之輪轉起來了 我覺得你最近會感覺到「怎麼忽然不一樣了」那種感覺\n有些東西不是你做得不夠好 是時機本身在動 越硬抓舊節奏 越容易卡住 順著調一點角度 反而比較不會被甩出去",
    spokenCliff:
      "命運之輪落在走向 後面真的有轉折 轉完會往哪邊 還有一個關鍵我先留白",
  },
  {
    id: "11",
    name: "正義",
    imagePath: "assets/tarot-new-11-justice.png",
    imagePathFallback: "assets/tarot-11-justice.png",
    meaningShort: "把事實攤開看 比一直猜心更有用",
    spoken:
      "正義出現 這張很清醒 它在提醒你：少一點腦補 多一點事實\n你最近是不是一直在猜對方怎麼想、事情會不會怎樣 牌面比較像在說 把標準抓清楚 該講的講 該分的分 心才會比較穩",
    spokenCliff:
      "正義在走向這格 後面會碰到需要「說清楚、算清楚」的時刻 細節我先不完全掀開",
  },
  {
    id: "12",
    name: "吊人",
    imagePath: "assets/tarot-new-12-hanged.png",
    imagePathFallback: "assets/tarot-12-the-hanged-man.png",
    meaningShort: "暫停不是失敗 換角度看才有出口",
    spoken:
      "吊人耶 很多人看到會慌 但其實這張常常在說：你不是沒路 是舊看法走不通了\n先停一下沒關係 甚至可以故意慢一點 換個角度重看這件事 很多卡關的地方 會突然鬆開一角",
    spokenCliff:
      "吊人落在走向 代表後面還要先經過一段「先放下執念」的過程 完整出口我先留著",
  },
  {
    id: "13",
    name: "死神",
    imagePath: "assets/tarot-new-13-death.png",
    imagePathFallback: "assets/tarot-13-death.png",
    meaningShort: "舊的階段在收尾 不是世界末日",
    spoken:
      "先別被牌名嚇到喔 死神在塔羅裡常常是「告一段落」 不是字面那種可怕\n有些東西真的走到尾聲了 你越挽留越痛 允許結束 才會空出位置給下一步 我知道放下很難 但牌面在陪你承認這件事",
    spokenCliff:
      "死神出現在走向 代表後面有明確的結束與重生 結束之後會接到什麼 我先不完全說破",
  },
  {
    id: "14",
    name: "節制",
    imagePath: "assets/tarot-new-14-temperance.png",
    imagePathFallback: "assets/tarot-14-temperance.png",
    meaningShort: "別走極端 調一調比例事情就順很多",
    spoken:
      "節制出來了 感覺你最近要嘛太衝 要嘛太收 比較少站在中間\n這張很溫柔地提醒：兩邊調一點點就好 情緒、節奏、對人的距離 都不用一次到位 慢慢混出一個你能長久待的狀態",
    spokenCliff:
      "節制落在走向 後面其實有一條比較平衡的路 可是調配關鍵我先留到後面",
  },
  {
    id: "15",
    name: "惡魔",
    imagePath: "assets/tarot-new-15-devil.png",
    imagePathFallback: "assets/tarot-15-the-devil.png",
    meaningShort: "先看見自己在執著什麼 才有機會鬆開",
    spoken:
      "惡魔這張有點刺 但很誠實 它常在講執著、恐懼、或那種「明明不舒服卻還黏著」的感覺\n你現在卡住的 未必是外面那個人或那件事 也可能是你內心不肯放手的那個想像 先看見繩子在哪 才有機會自己解開",
    spokenCliff:
      "惡魔在走向這格 後面還有一個需要被拆穿的黏著點 我先讓你看到牌面 細節稍後再說",
  },
  {
    id: "16",
    name: "高塔",
    imagePath: "assets/tarot-new-16-tower.png",
    imagePathFallback: "assets/tarot-16-the-tower.png",
    meaningShort: "假的結構在晃 震完才看得到真的",
    spoken:
      "高塔一出 確實會有點震撼感 它常常對應「突然變化」或原本以為穩的東西鬆動了\n我懂這種時候很煩 但牌面也在說：被拆掉的不一定是你真正需要的 震完之後 比較真實、比較能長久的東西會留下來",
    spokenCliff:
      "高塔落在走向 後面真的有一波衝擊或翻轉 翻完之後站得住的是什麼 我先留一個懸念",
  },
  {
    id: "17",
    name: "星星",
    imagePath: "assets/tarot-new-17-star.png",
    imagePathFallback: "assets/tarot-17-the-star.png",
    meaningShort: "希望正在回來 你值得再相信一次自己",
    spoken:
      "星星耶……這張好溫暖 感覺你最近可能累過、傷過 但其實心裡那點光沒有滅掉\n現在適合慢慢療 不要急著逼自己變強壯 允許自己重新相信一件好事 也重新相信自己 這張很像在說：你還沒完 你還在路上",
    spokenCliff:
      "星星出現在走向 後面有很漂亮的回溫訊號 可是怎麼接住那道光 還有一段我先不講完",
  },
  {
    id: "18",
    name: "月亮",
    imagePath: "assets/tarot-new-18-moon.png",
    imagePathFallback: "assets/tarot-18-the-moon.png",
    meaningShort: "霧還沒散 先別急著下死結論",
    spoken:
      "月亮出來了 這張最常講的就是「看不清」 你最近會不會一直焦慮地猜來猜去？\n現在資訊可能不完整 或情緒把畫面放大了 先別急著認定最壞的那個版本 等霧薄一點再判斷 會準很多 也比較不折磨自己",
    spokenCliff:
      "月亮落在走向 後面還有一段看不清的路 霧散之後會露出什麼 我先不完全揭曉",
  },
  {
    id: "19",
    name: "太陽",
    imagePath: "assets/tarot-new-19-sun.png",
    imagePathFallback: "assets/tarot-19-the-sun.png",
    meaningShort: "能量在變亮 適合把真心話說出來",
    spoken:
      "太陽欸 這張一出來整個氣場都不一樣了 感覺你後面有機會比較開朗、也比較敢表達\n如果最近一直把話吞回去 太陽會推你一把：可以說清楚一點 也可以讓自己開心一點 不用一直縮著 光明的感覺是你應得的",
    spokenCliff:
      "太陽在走向這格 後面真的有轉亮的可能 可是亮在哪個點上 我先留一點給後面",
  },
  {
    id: "20",
    name: "審判",
    imagePath: "assets/tarot-new-20-judgement.png",
    imagePathFallback: "assets/tarot-20-judgement.png",
    meaningShort: "有個覺醒正在敲門 值得認真回應自己",
    spoken:
      "審判出現 這張很像心裡忽然「啊 我懂了」的那一下\n你可能正在重新評價一段關係、一個決定 或是過去的自己 不要把這種醒悟關掉 它在叫你回應內在真正想走的方向 不是別人期待的那個",
    spokenCliff:
      "審判落在走向 後面有一個很重要的覺醒或召喚 完整內容我先不完全攤開",
  },
  {
    id: "21",
    name: "世界",
    imagePath: "assets/tarot-new-21-world.png",
    imagePathFallback: "assets/tarot-21-the-world.png",
    meaningShort: "一個循環快收完了 你其實準備好下一段",
    spoken:
      "世界耶 這張很大 感覺有一段旅程真的快走到一個完整的句點了\n不一定是結束關係 也可能是某個心態、某個階段告一段落 你可以開始想像下一個章節長什麼樣子 你比自己以為的更準備好了",
    spokenCliff:
      "世界出現在走向 代表後面有完成與開啟的雙重訊號 怎麼接下一章 我先留到解鎖再說",
  },
];

/**
 * Build HTTPS URL for a card face (Render-reachable via PUBLIC_BASE_URL).
 * @param {string} publicBaseUrl
 * @param {string} imagePath e.g. assets/tarot-new-00-fool.png
 */
export function resolveTarotImageUrl(publicBaseUrl, imagePath) {
  const base = String(publicBaseUrl || "").replace(/\/$/, "");
  const path = String(imagePath || "").replace(/^\//, "");
  if (!base || !path) return "";
  return `${base}/${path}`;
}

/**
 * @param {string} name
 * @returns {FreeTarotCard|null}
 */
export function getFreeTarotCard(name) {
  return FREE_TAROT_CARDS.find((c) => c.name === name) || null;
}

/**
 * Pick primary + up to 2 alternatives for need/topic.
 * @param {string} needId
 * @param {string} topicId
 */
export function pickRecommendations(needId, topicId) {
  const scored = PRODUCTS.map((p) => {
    let score = 0;
    if (p.needIds.includes(needId)) score += 2;
    if (p.topicIds.includes(topicId)) score += 2;
    if (needId === "companion" && p.id === "subscribe_resonance") score += 3;
    if (needId === "full_arc" && (p.id === "emotion_relation" || p.id === "emotion_tarot5")) score += 1;
    return { product: p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const unique = [];
  const seen = new Set();
  for (const row of scored) {
    if (seen.has(row.product.id)) continue;
    seen.add(row.product.id);
    unique.push(row.product);
    if (unique.length >= 3) break;
  }

  if (!unique.length) {
    return PRODUCTS.filter((p) => p.id === "emotion_depth" || p.id === "subscribe_resonance").slice(0, 2);
  }
  return unique;
}

export function getTopic(topicId) {
  return TOPICS.find((t) => t.id === topicId) || null;
}

export function getProblem(topicId, problemId) {
  const pack = PROBLEMS_BY_TOPIC[topicId];
  if (!pack) return null;
  return pack.problems.find((p) => p.id === problemId) || null;
}

export function getNeed(needId) {
  return NEEDS.find((n) => n.id === needId) || null;
}

export function getProduct(productId) {
  return PRODUCTS.find((p) => p.id === productId) || null;
}
