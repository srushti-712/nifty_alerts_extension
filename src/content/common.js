window.NiftyReaderCommon = {
  parseNum(val) {
    if (val == null) return null;
    const cleaned = String(val)
      .replace(/[₹,−–-]/g, (m) => (m === "−" || m === "–" ? "-" : m === "," || m === "₹" ? "" : m))
      .trim();
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
  },
  nowIST() {
    const d = new Date();
    return {
      istTime: d.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }),
      istDate: d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
    };
  },
  emitTick(source, raw) {
    const { istTime, istDate } = this.nowIST();
    const tick = {
      source,
      open: this.parseNum(raw.open),
      high: this.parseNum(raw.high),
      low: this.parseNum(raw.low),
      close: this.parseNum(raw.close),
      ema9: this.parseNum(raw.ema9),
      ema21: this.parseNum(raw.ema21),
      istTime,
      istDate
    };
    if (tick.close !== null) {
      chrome.runtime.sendMessage({ type: "MARKET_TICK", payload: tick });
    }
    return tick;
  }
};
