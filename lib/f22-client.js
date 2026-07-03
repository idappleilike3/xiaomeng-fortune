/**
 * lib/f22-client.js
 * F22 神殿舞台客戶端邏輯(2026-07-04 07:42 新增)
 *
 * 功能:
 *   1. 流式接收 /api/divination/stream(SSE)
 *   2. 4 段打字機效果渲染
 *   3. 收藏命運紀錄按鈕
 *   4. 分享今日祝福按鈕(LINE shareTargetPicker)
 */

(function f22Client() {
  "use strict";

  // ===== 1. F22 狀態機(5 個狀態,純前端) =====
  const F22State = {
    INPUT: "input",       // 輸入問題 + 抽牌方式
    SHUFFLE: "shuffle",   // 洗牌(自動)
    CUT: "cut",           // 切牌(用戶點擊)
    SPREAD: "spread",     // 展牌(扇形展開)
    SELECT: "select",     // 選牌(用戶挑選)
    FLIP: "flip",         // 翻牌 + 深度解讀
  };

  let currentState = F22State.INPUT;
  let currentCard = null;
  let readingBuffer = { coreMessage: "", currentSituation: "", suggestion: "", blessing: "" };

  function setState(newState) {
    console.log("[F22] 狀態切換:", currentState, "→", newState);
    currentState = newState;
    document.body.dataset.f22State = newState;
  }

  // ===== 2. 4 段打字機渲染 =====
  function showF22Reading() {
    const wrap = document.getElementById("f22Reading");
    if (wrap) wrap.hidden = false;
  }

  function appendChar(sectionType, char) {
    readingBuffer[sectionType] += char;
    const el = document.getElementById("f22" + sectionType.charAt(0).toUpperCase() + sectionType.slice(1));
    if (el) {
      // 處理換行顯示
      el.textContent = readingBuffer[sectionType].replace(/\\n/g, "\n");
      // 自動捲動
      try { el.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (_) {}
    }
  }

  function resetF22Reading() {
    readingBuffer = { coreMessage: "", currentSituation: "", suggestion: "", blessing: "" };
    ["f22CoreMessage", "f22CurrentSituation", "f22Suggestion", "f22Blessing"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = "";
    });
  }

  // ===== 3. 流式接收 /api/divination/stream(SSE via fetch) =====
  async function streamF22Reading(card, theme = "love", question = "") {
    resetF22Reading();
    showF22Reading();
    setState(F22State.FLIP);

    try {
      const resp = await fetch("/api/divination/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card, theme, question }),
      });

      if (!resp.ok) throw new Error("HTTP " + resp.status);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE 訊息以 \n\n 分隔
        const events = buffer.split("\n\n");
        buffer = events.pop() || ""; // 最後一個可能不完整

        for (const evt of events) {
          if (!evt.trim()) continue;
          const lines = evt.split("\n");
          let eventName = "message";
          let data = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) eventName = line.slice(7).trim();
            else if (line.startsWith("data: ")) data = line.slice(6).trim();
          }
          if (!data) continue;
          try {
            const payload = JSON.parse(data);
            handleSSEEvent(eventName, payload);
          } catch (_) {}
        }
      }

      // 顯示儀式完成按鈕
      const complete = document.getElementById("f22RitualComplete");
      if (complete) complete.hidden = false;
    } catch (e) {
      console.error("[F22] stream error:", e);
      // 失敗時改用本地 fallback
      const fallback = window.__f22Reading;
      if (fallback) {
        const reading = fallback.generateF22Reading(card, theme, question);
        resetF22Reading();
        showF22Reading();
        appendChar("coreMessage", reading.coreMessage);
        appendChar("currentSituation", reading.currentSituation);
        appendChar("suggestion", reading.suggestion);
        appendChar("blessing", reading.blessing);
        const complete = document.getElementById("f22RitualComplete");
        if (complete) complete.hidden = false;
      }
    }
  }

  function handleSSEEvent(name, payload) {
    if (name === "start") {
      console.log("[F22] 開始解讀:", payload);
    } else if (name === "section-start") {
      console.log("[F22] 段落開始:", payload.label);
    } else if (name === "char") {
      appendChar(payload.type, payload.char);
    } else if (name === "section-end") {
      console.log("[F22] 段落結束:", payload.type);
    } else if (name === "done") {
      console.log("[F22] 解讀完成");
    } else if (name === "error") {
      console.error("[F22] SSE error:", payload);
    }
  }

  // ===== 4. 收藏命運紀錄 =====
  async function favoriteReading() {
    if (!currentCard) {
      setStatus("尚未抽取牌組,無法收藏");
      return;
    }
    try {
      const resp = await fetch("/api/divination/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: getUserId(),
          cardName: currentCard.name || "",
          cardImage: currentCard.image || "",
          question: currentCard.question || "",
          reading: readingBuffer,
        }),
      });
      const data = await resp.json();
      if (data.ok) {
        setStatus("✨ 已收藏到命運紀錄");
      } else {
        setStatus("收藏失敗:" + (data.error || "未知錯誤"));
      }
    } catch (e) {
      setStatus("收藏失敗,請稍後再試");
    }
  }

  // ===== 5. 分享今日祝福(LINE shareTargetPicker 或 navigator.share) =====
  async function shareReading() {
    if (!currentCard) {
      setStatus("尚未抽取牌組,無法分享");
      return;
    }
    const blessing = readingBuffer.blessing || "願星光指引你每一日。";
    const shareText = `✨ ${currentCard.name || "今晚指引"}\n\n${blessing}\n\n#小夢神殿 #塔羅`;

    // 嘗試用 LINE shareTargetPicker(LIFF 環境)
    try {
      if (window.liff && window.liff.isInClient && window.liff.isInClient() && window.liff.shareTargetPicker) {
        await window.liff.shareTargetPicker([
          {
            type: "text",
            text: shareText,
          },
        ]);
        setStatus("✨ 已透過 LINE 分享");
        return;
      }
    } catch (_) {}

    // 退而求其次:navigator.share 或複製連結
    try {
      if (navigator.share) {
        await navigator.share({ title: "小夢神殿 · 今日祝福", text: shareText });
        setStatus("✨ 已分享");
        return;
      }
    } catch (_) {}

    // 最後:複製到剪貼簿
    try {
      await navigator.clipboard.writeText(shareText);
      setStatus("📋 已複製祝福文字到剪貼簿");
    } catch (_) {
      setStatus("請手動複製:" + shareText.slice(0, 50));
    }
  }

  function setStatus(msg) {
    const el = document.getElementById("f22RitualStatus");
    if (el) {
      el.textContent = msg;
      el.hidden = false;
      setTimeout(() => { el.hidden = true; }, 3000);
    }
  }

  function getUserId() {
    try {
      const m = JSON.parse(localStorage.getItem("xiaomengUser") || "{}");
      return m.id || "demo-member-001";
    } catch (_) {
      return "demo-member-001";
    }
  }

  // ===== 6. 全域掛載 =====
  window.__f22 = {
    F22State,
    setState,
    streamF22Reading,
    favoriteReading,
    shareReading,
    setCurrentCard(card) {
      currentCard = card;
      // 隱藏舊 reading 區(下次抽牌時重新顯示)
      const wrap = document.getElementById("f22Reading");
      if (wrap) wrap.hidden = true;
      const complete = document.getElementById("f22RitualComplete");
      if (complete) complete.hidden = true;
    },
    getCurrentCard() { return currentCard; },
  };

  // ===== 7. 自動綁定按鈕(若 DOM 已存在) =====
  document.addEventListener("DOMContentLoaded", () => {
    const favBtn = document.getElementById("f22FavoriteBtn");
    if (favBtn) favBtn.addEventListener("click", favoriteReading);
    const shareBtn = document.getElementById("f22ShareBtn");
    if (shareBtn) shareBtn.addEventListener("click", shareReading);
  });

  console.log("[F22] 客戶端已初始化");
})();