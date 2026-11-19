(() => {
  const { parseNum, emitTick } = window.NiftyReaderCommon;

  function readTradingView() {
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
      if (text.includes("EMA") && text.includes("9")) ema9 = parseNum(nums[nums.length - 1]);
      if (text.includes("EMA") && text.includes("21")) ema21 = parseNum(nums[nums.length - 1]);
    }

    return emitTick("tradingview", {
      open: o[1], high: h[1], low: l[1], close: c[1], ema9, ema21
    });
  }

  window.readSourceTick = readTradingView;
  setInterval(readTradingView, 3000);
})();
