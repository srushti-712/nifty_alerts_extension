import { ACTIVE_TRIGGERS } from "../triggers/registry.js";

let creatingOffscreen = null;

async function playAlertSound(alertText) {
  const offscreenUrl = chrome.runtime.getURL("src/offscreen/offscreen.html");
  const existing = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [offscreenUrl]
  });

  if (existing.length === 0) {
    if (!creatingOffscreen) {
      creatingOffscreen = chrome.offscreen.createDocument({
        url: offscreenUrl,
        reasons: ["AUDIO_PLAYBACK"],
        justification: "Play chime when a Nifty 50 trigger fires"
      });
    }
    await creatingOffscreen;
    creatingOffscreen = null;
  }

  const signal = alertText.includes("PUT") ? "PUT" : "CALL";
  chrome.runtime.sendMessage({ type: "PLAY_ALERT_SOUND", signal });
}

async function processTick(tick) {
  if (!tick || tick.close == null) return;

  const state = await chrome.storage.session.get(null);
  let mergedUpdates = {};

  for (const trigger of ACTIVE_TRIGGERS) {
    const { alert, newState } = await trigger.evaluate(tick, { ...state, ...mergedUpdates });
    if (newState) mergedUpdates = { ...mergedUpdates, ...newState };
    if (alert) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon.png"),
        title: `Nifty Alert: ${trigger.name}`,
        message: alert,
        priority: 2
      });
      await playAlertSound(alert);
    }
  }

  if (Object.keys(mergedUpdates).length > 0) {
    await chrome.storage.session.set(mergedUpdates);
  }
}

globalThis.simulateTick = processTick;
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "MARKET_TICK" || msg.type === "TV_TICK") {
    processTick(msg.payload);
  }
});
