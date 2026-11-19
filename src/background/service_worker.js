import { ACTIVE_TRIGGERS } from "../triggers/registry.js";

async function processTick(tick) {
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
    }
  }
  if (Object.keys(mergedUpdates).length > 0) {
    await chrome.storage.session.set(mergedUpdates);
  }
}

globalThis.simulateTick = processTick; // Exposed for instant testing
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TV_TICK") processTick(msg.payload);
});
