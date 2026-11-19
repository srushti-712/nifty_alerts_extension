export default {
  id: "ema_cross",
  name: "9/21 EMA Cross",
  async evaluate(tick, state) {
    if (tick.ema9 == null || tick.ema21 == null) return { alert: null, newState: {} };
    const currDiff = tick.ema9 - tick.ema21;
    const prevDiff = state.prevEmaDiff;
    const bucket = `${tick.istDate}_${tick.istTime.slice(0, 3)}${Math.floor(parseInt(tick.istTime.slice(3)) / 15) * 15}`;

    if (prevDiff == null || state.lastEmaBucket === bucket) {
      return { alert: null, newState: { prevEmaDiff: currDiff } };
    }
    if (prevDiff <= 0 && currDiff > 0) {
      return {
        alert: `EMA CALL: 9 EMA (${tick.ema9}) crossed ABOVE 21 EMA (${tick.ema21})`,
        newState: { prevEmaDiff: currDiff, lastEmaBucket: bucket }
      };
    }
    if (prevDiff >= 0 && currDiff < 0) {
      return {
        alert: `EMA PUT: 9 EMA (${tick.ema9}) crossed BELOW 21 EMA (${tick.ema21})`,
        newState: { prevEmaDiff: currDiff, lastEmaBucket: bucket }
      };
    }
    return { alert: null, newState: { prevEmaDiff: currDiff } };
  }
};
