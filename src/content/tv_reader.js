function parseVal(str) {
  if (!str) return null;
  const n = parseFloat(str.replace(/−/g, "-").replace(/,/g, "").trim());
  return isNaN(n) ? null : n;
}

function scrapeLegend() {
  const items = Array.from(document.querySelectorAll('[data-name="legend-source-item"]')).map(el => el.innerText);
  if (!items.length) return null;

  const main = items[0];
  const o = main.match(/O\s*([0-9.,−-]+)/);
  const h = main.match(/H\s*([0-9.,−-]+)/);
  const l = main.match(/L\s*([0-9.,−-]+)/);
  const c = main.match(/C\s*([0-9.,−-]+)/);
  if (!o || !h || !l || !c) return null;

  let ema9 = null, ema21 = null;
  for (const text of items.slice(1)) {
    const nums = text.match(/([0-9]{4,6}\.[0-9]+)/g);
    if (!nums) continue;
    if (text.includes("EMA") && text.includes("9")) ema9 = parseVal(nums[nums.length - 1]);
    if (text.includes("EMA") && text.includes("21")) ema21 = parseVal(nums[nums.length - 1]);
  }

  return {
    open: parseVal(o[1]), high: parseVal(h[1]), low: parseVal(l[1]), close: parseVal(c[1]),
    ema9, ema21,
    istTime: new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }),
    istDate: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
  };
}

window.scrapeLegend = scrapeLegend; // Exposed for manual console verification
setInterval(() => {
  const tick = scrapeLegend();
  if (tick && tick.close !== null) chrome.runtime.sendMessage({ type: "TV_TICK", payload: tick });
}, 3000);
console.log("[Nifty Alerts] TradingView reader active.");
