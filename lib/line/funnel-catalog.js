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
      "這張愚者跑出來的時候 我第一個感覺是——你心裡其實已經想動了 只是腳還停在門口\n\n你現在大概不是不懂狀況 比較像知道自己該往前 卻又怕踏出去之後收不回來\n\n這種猶豫很常跟安全感有關 你可能在等一個「保證不會痛」的訊號 可是關係跟選擇很少給那種保證\n\n也有可能你把別人的反應 投射成自己夠不夠好 好像要先被認可 才敢跨那一步\n\n這張牌比較像在輕輕推你一下：先承認自己想要什麼 比先猜別人怎麼看 更重要\n\n你內在那股想開始的感覺 其實比你嘴上承認的還清楚 先讓它被你自己聽見就好",
    spokenCliff:
      "愚者落到走向這格 我覺得後面真的有一段新的路要打開\n\n可是這條路會不會走得順 跟你敢不敢承認自己的需要 綁在一起\n\n有個轉折點我現在先不講破 因為它跟你剛才說的卡點 其實連得很緊\n\n你先把牌面看著 完整怎麼走 以及那個關鍵選擇 我留到後面一次跟你說清楚",
  },
  {
    id: "01",
    name: "魔術師",
    imagePath: "assets/tarot-new-01-magician.png",
    imagePathFallback: "assets/tarot-01-the-magician.png",
    meaningShort: "牌面不是叫你等 是提醒你手上其實有牌",
    spoken:
      "魔術師跑出來了 說真的 我不太覺得你現在缺資源 比較像是你自己還沒把桌上的東西認出來\n\n你其實會的比你想的多 只是最近有點把自己看扁了 好像一定要等「更準備好」才有資格出手\n\n這種自我懷疑 常常來自你對自己要求太高 或是過去被否定過 於是把能力也一起鎖起來\n\n你可能也在等別人先給你方向 但其實主導權有一部分就在你手上 只是你還沒拿穩\n\n這張牌比較像在拍你肩膀：先動一小步 場就會跟著活起來 不用一次完美\n\n你真正缺的不是條件 是允許自己開始用已經有的那些",
    spokenCliff:
      "魔術師落在走向 代表後面真的有主動權可以拿回來\n\n怎麼出招會比較不傷自己 還有一段我先留著\n\n那個關鍵跟你怎麼看待自己的價值 很有關係\n\n你先看著這張牌 完整的走法我稍後一次講清楚",
  },
  {
    id: "02",
    name: "女祭司",
    imagePath: "assets/tarot-new-02-priestess.png",
    imagePathFallback: "assets/tarot-02-the-high-priestess.png",
    meaningShort: "別急著逼答案 你身體其實早就有感覺了",
    spoken:
      "女祭司耶……這張很安靜 可是很準 我覺得你心裡其實隱隱約約有答案了 只是還不太敢承認\n\n你最近是不是一直向外找訊號 對方一句話、一個已讀 都能把你情緒拉走\n\n可是身體常常比腦袋早知道 那種悶、那種不安 其實已經在提醒你什麼\n\n很多人會把直覺關掉 因為怕直覺是真的 怕一承認就要面對分離或改變\n\n這張牌比較像說：先感覺、先觀察 不要硬逼自己或對方給一個乾淨結論\n\n你內在那條線 比外面吵鬧的訊息更接近真相 先信任自己一點點就好",
    spokenCliff:
      "女祭司在走向這格 後面還藏著一個還沒掀開的真相\n\n那個真相跟你不敢承認的感覺 連在一起\n\n我先讓你看牌面 完整會指向哪 稍後再說\n\n你先把這份安靜留著 別急著用猜的把霧填滿",
  },
  {
    id: "03",
    name: "皇后",
    imagePath: "assets/tarot-new-03-empress.png",
    imagePathFallback: "assets/tarot-03-the-empress.png",
    meaningShort: "這題需要溫度 硬撐反而會更乾",
    spoken:
      "皇后出現 感覺比較像在提醒你：這件事不能只靠意志力硬撐\n\n你最近是不是把自己照顧得太少了 關係、心情、甚至身體 都需要一點被滋養的空間\n\n有時候你會用「我可以」把自己推很遠 可是內心其實很渴 想被溫柔對待\n\n這種渴 不一定是黏人 比較像是依附需求沒被好好看見 於是你只能一直給\n\n溫柔不是軟弱喔 有時候溫柔才是真的能讓事情長出來的方式\n\n先把你自己放回畫面裡 你也值得被照顧 不只是一直照顧別人",
    spokenCliff:
      "皇后落在走向 後面其實有一條比較柔、也比較穩的路\n\n可是完整怎麼走 跟你願不願意先補自己 有關\n\n那個轉折我先不一次攤完\n\n你先感覺這張牌的溫度 後面會接到更具體的方向",
  },
  {
    id: "04",
    name: "皇帝",
    imagePath: "assets/tarot-new-04-emperor.png",
    imagePathFallback: "assets/tarot-04-the-emperor.png",
    meaningShort: "界線一清楚 很多混亂會自己退開",
    spoken:
      "皇帝出來了 這張有點直球 它在講的是秩序跟界線\n\n你最近是不是被別人的節奏牽著跑 或是自己一直沒講清楚底線\n\n很多人害怕設界線會被討厭 於是把委屈吞下去 結果內心更亂\n\n其實界線不是要你變兇 是讓你對自己的需要負責 什麼可以 什麼不行\n\n當你一直模糊 對方也會跟著模糊 你就越容易投射、越容易焦慮\n\n把規則抓回來一點 事情才會有方向 心也才站得住",
    spokenCliff:
      "皇帝在走向這格 代表後面需要你把主導權拿穩\n\n可是怎麼拿才不會把自己逼太緊 還有一個關鍵點我先留白\n\n它跟你敢不敢說「不行」 很有關係\n\n你先看著這張牌 完整做法稍後一次跟你說",
  },
  {
    id: "05",
    name: "教皇",
    imagePath: "assets/tarot-new-05-hierophant.png",
    imagePathFallback: "assets/tarot-05-the-hierophant.png",
    meaningShort: "這次不一定要硬闖 有人走過的路可以參考",
    spoken:
      "教皇出現 我覺得你現在不一定要一個人硬扛到底\n\n有時候你會覺得「我應該自己想通」 結果越想越耗 越耗越孤立\n\n這張不是叫你盲從 是提醒你可以借一點別人的經驗 或一個比較穩的方法\n\n你內在可能有個聲音在說：求助等於弱 可是那常常是舊的自我要求 不是真相\n\n被理解、被引導 其實也是一種心理需求 不丟臉\n\n找一個懂的人聊聊、問前輩、照一個比較溫柔的節奏走 反而比較不耗",
    spokenCliff:
      "教皇落在走向 後面有一個「被引導」或「被看懂」的訊號\n\n細節我先留到後面\n\n那個轉折跟你願不願意放下硬撐 很有關\n\n你先把牌面放著 完整怎麼接 我稍後說清楚",
  },
  {
    id: "06",
    name: "戀人",
    imagePath: "assets/tarot-new-06-lovers.png",
    imagePathFallback: "assets/tarot-06-the-lovers.png",
    meaningShort: "心動很重要 可是選擇也得對得起自己",
    spoken:
      "戀人耶……這張一出來 空氣就不太一樣了 你面前很明顯有選擇\n\n不一定是兩個人 也可能是兩種關係模式、兩種態度 甚至是留下或放下\n\n心動當然要聽 可是這張也在問你：你選的那個 能不能同時對得起感覺跟現實\n\n很多人會把投射當成愛 把焦慮當成在乎 結果選了當下舒服 卻委屈了更深的需要\n\n你現在卡住的 常常不是「誰比較好」 而是你不敢承認自己真正要什麼\n\n先把選擇攤開看 不要只選比較不痛的那一面",
    spokenCliff:
      "戀人在走向這格 後面有一個很關鍵的選擇點\n\n我先讓你看到牌 完整怎麼選 先賣個關子\n\n那個選擇會牽動你對依附跟自我的看法\n\n你先感覺一下 後面我會講得更清楚",
  },
  {
    id: "07",
    name: "戰車",
    imagePath: "assets/tarot-new-07-chariot.png",
    imagePathFallback: "assets/tarot-07-the-chariot.png",
    meaningShort: "方向對了就推 別讓分心把速度吃掉",
    spoken:
      "戰車衝出來了 感覺你其實已經有目標了 只是路上雜訊有點多\n\n你不是沒力 是力散掉了 一下顧別人的臉 一下顧自己的怕 一下又想證明什麼\n\n這種分心 常常來自內在衝突：想前進 又怕失去連結 想堅持 又怕被說太衝\n\n牌面比較像在幫你把視線收回來 一次抓一件最重要的事往前推\n\n當你把注意力對準需要 而不是對準焦慮 進度會比你想的快\n\n先選一個你真正在意的方向 讓行動跟需求對齊",
    spokenCliff:
      "戰車落在走向 代表後面真的有推進的動能\n\n但要往哪衝最划算 還有一段我先不講破\n\n那個關鍵跟你怎麼整理內在拉扯 有關\n\n你先看著這股力道 完整路線稍後再說",
  },
  {
    id: "08",
    name: "力量",
    imagePath: "assets/tarot-new-08-strength.png",
    imagePathFallback: "assets/tarot-08-strength.png",
    meaningShort: "硬碰硬未必贏 柔一點反而更能穩住",
    spoken:
      "力量這張很漂亮欸 它不是叫你咬牙死撐 比較像在說：你其實有能力把情緒安住\n\n最近如果一直想用強硬去換安全感 可能會更累 也更容易把對方推遠\n\n真正的力量 常常是你能看見自己的害怕 卻不讓害怕開車\n\n你可能習慣壓抑 或是用生氣蓋住委屈 兩者其實都在講同一件事：你需要被好好對待\n\n溫柔地對待自己 或柔一點跟對方說話 反而比較有機會把局面轉過來\n\n這張牌信任你的內在韌性 只是你可能還沒用在對的地方",
    spokenCliff:
      "力量出現在走向 後面有一股很穩的內在動能\n\n可是怎麼用 還有一個轉折點我先留著\n\n它跟你怎麼處理恐懼跟需求 綁在一起\n\n你先感覺這份穩 完整用法稍後講",
  },
  {
    id: "09",
    name: "隱者",
    imagePath: "assets/tarot-new-09-hermit.png",
    imagePathFallback: "assets/tarot-09-the-hermit.png",
    meaningShort: "先安靜一下 答案比較容易自己浮出來",
    spoken:
      "隱者……這張很適合你現在這種狀態 不是叫你逃避 是提醒你可以先退一步整理\n\n外面聲音太多的時候 你越急越容易選錯 也越容易把別人的情緒當成自己的答案\n\n你可能很怕安靜 因為一安靜 那些不想面對的感覺就會上來\n\n可是答案常常不是追來的 是你坐下來之後 自己浮出來的\n\n給自己一點獨處或放空的空間 很多本來糾在一起的線 會慢慢變清楚\n\n這不是切斷連結 是先把自己找回來 再決定怎麼靠近",
    spokenCliff:
      "隱者在走向這格 代表後面需要一段沉澱\n\n但沉澱之後會看到什麼 我先不一次說完\n\n那個畫面跟你真正的需要 很靠近\n\n你先允許自己慢一點 完整會揭到哪 稍後再說",
  },
  {
    id: "10",
    name: "命運之輪",
    imagePath: "assets/tarot-new-10-wheel.png",
    imagePathFallback: "assets/tarot-10-wheel-of-fortune.png",
    meaningShort: "局勢正在轉 抓得太死反而容易痛",
    spoken:
      "命運之輪轉起來了 我覺得你最近會感覺到「怎麼忽然不一樣了」那種感覺\n\n有些東西不是你做得不夠好 是時機本身在動 關係節奏也在動\n\n你如果還用舊的抓法去抓 很容易痛 也容易覺得自己被丟下\n\n這種痛 有時來自失控感 你習慣用掌控換安全 可是輪子一轉 掌控會失效\n\n順著調一點角度 反而比較不會被甩出去 也比較能看見新的位置\n\n允許變化進來 不等於放棄自己 是換一種比較不硬碰的抓住方式",
    spokenCliff:
      "命運之輪落在走向 後面真的有轉折\n\n轉完會往哪邊 還有一個關鍵我先留白\n\n它跟你放不放得下舊節奏 很有關係\n\n你先看著輪子在轉 完整方向稍後揭曉",
  },
  {
    id: "11",
    name: "正義",
    imagePath: "assets/tarot-new-11-justice.png",
    imagePathFallback: "assets/tarot-11-justice.png",
    meaningShort: "把事實攤開看 比一直猜心更有用",
    spoken:
      "正義出現 這張很清醒 它在提醒你：少一點腦補 多一點事實\n\n你最近是不是一直在猜對方怎麼想、事情會不會怎樣 腦袋停不下來\n\n猜測常常來自不安的依附 你想用「想清楚」換一點掌控感 結果越想越累\n\n牌面比較像在說：把標準抓清楚 該講的講 該分的分 心才會比較穩\n\n你值得被清楚對待 不是一直活在霧裡猜來猜去\n\n先把能確認的確認 不能確認的先放下 比一直投射更保護自己",
    spokenCliff:
      "正義在走向這格 後面會碰到需要「說清楚、算清楚」的時刻\n\n細節我先不完全掀開\n\n那個時刻跟你敢不敢要公平 有關\n\n你先把這份清醒放著 完整怎麼做稍後說",
  },
  {
    id: "12",
    name: "吊人",
    imagePath: "assets/tarot-new-12-hanged.png",
    imagePathFallback: "assets/tarot-12-the-hanged-man.png",
    meaningShort: "暫停不是失敗 換角度看才有出口",
    spoken:
      "吊人耶 很多人看到會慌 但其實這張常常在說：你不是沒路 是舊看法走不通了\n\n你可能一直用力推同一扇門 越推越挫敗 也越覺得自己不夠好\n\n暫停不是失敗 有時候是心理上需要換鏡頭 才看得到出口\n\n你卡住的地方 也許跟執念有關——執著某個結局、某種被愛的方式\n\n先停一下沒關係 甚至可以故意慢一點 換個角度重看這件事\n\n很多卡關會突然鬆開一角 不是因為你更用力 是因為你願意鬆手一點",
    spokenCliff:
      "吊人落在走向 代表後面還要先經過一段「先放下執念」的過程\n\n完整出口我先留著\n\n那個鬆開的點 跟你最放不下的想像 連在一起\n\n你先允許暫停 後面會接到更清楚的路",
  },
  {
    id: "13",
    name: "死神",
    imagePath: "assets/tarot-new-13-death.png",
    imagePathFallback: "assets/tarot-13-death.png",
    meaningShort: "舊的階段在收尾 不是世界末日",
    spoken:
      "先別被牌名嚇到喔 死神在這裡常常是「告一段落」 不是字面那種可怕\n\n有些東西真的走到尾聲了 你越挽留越痛 也越容易把自己耗乾\n\n結束會痛 是因為依附還在 你的心還沒找到新的安置處\n\n允許結束 才會空出位置給下一步 這不是叫你冷血 是叫你誠實\n\n你可能在哀悼一種「本來以為會長久」的想像 那份哀悼值得被看見\n\n牌面在陪你承認這件事：舊的階段可以收了 你還在",
    spokenCliff:
      "死神出現在走向 代表後面有明確的結束與重生\n\n結束之後會接到什麼 我先不完全說破\n\n那個交接點跟你願不願意告別舊模式 很有關\n\n你先把這份收尾放著 完整會通向哪 稍後講",
  },
  {
    id: "14",
    name: "節制",
    imagePath: "assets/tarot-new-14-temperance.png",
    imagePathFallback: "assets/tarot-14-temperance.png",
    meaningShort: "別走極端 調一調比例事情就順很多",
    spoken:
      "節制出來了 感覺你最近要嘛太衝 要嘛太收 比較少站在中間\n\n極端常常來自害怕：一靠近就怕失去自己 一拉開又怕被丟掉\n\n所以你會在黏跟逃之間擺盪 情緒也跟著上上下下\n\n這張很溫柔地提醒：兩邊調一點點就好 情緒、節奏、對人的距離 都不用一次到位\n\n你真正需要的可能是穩定感 不是一次解決所有不安\n\n慢慢混出一個你能長久待的狀態 比一次衝到完美 更保護你",
    spokenCliff:
      "節制落在走向 後面其實有一條比較平衡的路\n\n可是調配關鍵我先留到後面\n\n它跟你怎麼照顧依附焦慮 有關\n\n你先感覺中間那條線 完整怎麼調 稍後說清楚",
  },
  {
    id: "15",
    name: "惡魔",
    imagePath: "assets/tarot-new-15-devil.png",
    imagePathFallback: "assets/tarot-15-the-devil.png",
    meaningShort: "先看見自己在執著什麼 才有機會鬆開",
    spoken:
      "惡魔這張有點刺 但很誠實 它常在講執著、恐懼、或那種「明明不舒服卻還黏著」的感覺\n\n你現在卡住的 未必是外面那個人或那件事 也可能是你內心不肯放手的那個想像\n\n有時候黏的不是愛 是害怕空掉 害怕一放手就證明自己不夠被選\n\n先看見繩子在哪 才有機會自己解開 看見本身就已經是力量\n\n你不用立刻切斷 但可以先誠實：這段連結裡 哪一部分在消耗你\n\n承認消耗 不是背叛 是開始保護自己的邊界",
    spokenCliff:
      "惡魔在走向這格 後面還有一個需要被拆穿的黏著點\n\n我先讓你看到牌面 細節稍後再說\n\n那個點跟你最怕失去的東西 連得很緊\n\n你先別急著怪自己 完整怎麼鬆 我留到後面",
  },
  {
    id: "16",
    name: "高塔",
    imagePath: "assets/tarot-new-16-tower.png",
    imagePathFallback: "assets/tarot-16-the-tower.png",
    meaningShort: "假的結構在晃 震完才看得到真的",
    spoken:
      "高塔一出 確實會有點震撼感 它常常對應「突然變化」或原本以為穩的東西鬆動了\n\n我懂這種時候很煩 也很怕 像地基在抖\n\n可是被拆掉的不一定是你真正需要的 有時是假安定、假和諧、或你硬撐出來的樣子\n\n震的過程會啟動你的防衛 你可能想立刻修好 或立刻逃走\n\n先允許震撼存在 再問：震完之後 什麼還站得住\n\n比較真實、比較能長久的東西 通常會留下來 你也會更清楚自己的底線",
    spokenCliff:
      "高塔落在走向 後面真的有一波衝擊或翻轉\n\n翻完之後站得住的是什麼 我先留一個懸念\n\n那個答案跟你真正的需要 很靠近\n\n你先撐過這股晃 完整會指向哪 稍後揭曉",
  },
  {
    id: "17",
    name: "星星",
    imagePath: "assets/tarot-new-17-star.png",
    imagePathFallback: "assets/tarot-17-the-star.png",
    meaningShort: "希望正在回來 你值得再相信一次自己",
    spoken:
      "星星耶……這張好溫暖 感覺你最近可能累過、傷過 但其實心裡那點光沒有滅掉\n\n你現在適合慢慢療 不要急著逼自己變強壯 也不要急著證明「我好了」\n\n療癒本來就不是直線 有反覆很正常 那不代表你失敗\n\n允許自己重新相信一件好事 也重新相信自己 這本身就是在修復依附創傷\n\n你值得被溫柔對待 包括被你自己溫柔對待\n\n這張很像在說：你還沒完 你還在路上 而且路上有光",
    spokenCliff:
      "星星出現在走向 後面有很漂亮的回溫訊號\n\n可是怎麼接住那道光 還有一段我先不講完\n\n那個接法跟你願不願意再信任自己 有關\n\n你先把這份亮放在心上 完整怎麼走稍後說",
  },
  {
    id: "18",
    name: "月亮",
    imagePath: "assets/tarot-new-18-moon.png",
    imagePathFallback: "assets/tarot-18-the-moon.png",
    meaningShort: "霧還沒散 先別急著下死結論",
    spoken:
      "月亮出來了 這張最常講的就是「看不清」 你最近會不會一直焦慮地猜來猜去\n\n現在資訊可能不完整 或情緒把畫面放大了 恐懼很會化妝成「直覺」\n\n你內在可能有舊的不安被勾起來 於是把最壞的版本當成唯一真相\n\n先別急著認定最壞的那個版本 等霧薄一點再判斷 會準很多 也比較不折磨自己\n\n你可以先安住身體 再處理關係 焦慮降一點 視野才會回來\n\n看不清的時候 保護自己的方式是慢 不是更用力猜",
    spokenCliff:
      "月亮落在走向 後面還有一段看不清的路\n\n霧散之後會露出什麼 我先不完全揭曉\n\n那個露出的東西 跟你不敢直視的感覺 有關\n\n你先別用猜的把霧填滿 完整畫面稍後給你",
  },
  {
    id: "19",
    name: "太陽",
    imagePath: "assets/tarot-new-19-sun.png",
    imagePathFallback: "assets/tarot-19-the-sun.png",
    meaningShort: "能量在變亮 適合把真心話說出來",
    spoken:
      "太陽欸 這張一出來整個氣場都不一樣了 感覺你後面有機會比較開朗、也比較敢表達\n\n如果最近一直把話吞回去 太陽會推你一把：可以說清楚一點 也可以讓自己開心一點\n\n很多人把開心當成奢侈 好像要先處理完痛苦 才有資格亮\n\n可是表達真實感受 本身就是在照顧需要 也是在劃健康的界線\n\n不用一直縮著 光明的感覺是你應得的 不是你要來的\n\n先練習對自己誠實 再說出口 會比你想的有力量",
    spokenCliff:
      "太陽在走向這格 後面真的有轉亮的可能\n\n可是亮在哪個點上 我先留一點給後面\n\n那個點跟你敢不敢說真心話 綁在一起\n\n你先感覺這份暖 完整怎麼接稍後講",
  },
  {
    id: "20",
    name: "審判",
    imagePath: "assets/tarot-new-20-judgement.png",
    imagePathFallback: "assets/tarot-20-judgement.png",
    meaningShort: "有個覺醒正在敲門 值得認真回應自己",
    spoken:
      "審判出現 這張很像心裡忽然「啊 我懂了」的那一下\n\n你可能正在重新評價一段關係、一個決定 或是過去的自己\n\n這種醒悟一來 會有點刺 因為舊故事要改寫了\n\n不要把這種醒悟關掉 它在叫你回應內在真正想走的方向 不是別人期待的那個\n\n你過去可能為了被愛 一直配合角色 現在那個角色開始不合身了\n\n回應自己 不是自私 是停止繼續背叛自己的需要",
    spokenCliff:
      "審判落在走向 後面有一個很重要的覺醒或召喚\n\n完整內容我先不完全攤開\n\n它跟你願不願意改寫舊劇本 很有關係\n\n你先聽見這聲敲門 後面我會講得更清楚",
  },
  {
    id: "21",
    name: "世界",
    imagePath: "assets/tarot-new-21-world.png",
    imagePathFallback: "assets/tarot-21-the-world.png",
    meaningShort: "一個循環快收完了 你其實準備好下一段",
    spoken:
      "世界耶 這張很大 感覺有一段旅程真的快走到一個完整的句點了\n\n不一定是結束關係 也可能是某個心態、某個階段告一段落\n\n你可能還不太敢相信「我準備好了」 因為習慣活在未完成的焦慮裡\n\n可是牌面在說：你可以開始想像下一個章節長什麼樣子\n\n把舊循環收好 不是切斷過去 是帶著學到的界線與需要往前\n\n你比自己以為的更準備好了 只是信任還差臨門一腳",
    spokenCliff:
      "世界出現在走向 代表後面有完成與開啟的雙重訊號\n\n怎麼接下一章 我先留到解鎖再說\n\n那個接法跟你怎麼安置告一段落的情緒 有關\n\n你先感覺這份完成 完整下一步稍後一次說清楚",
  }
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
