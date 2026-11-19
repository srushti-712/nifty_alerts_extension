export default {
  id: "orb_15m",
  name: "15m ORB Breakout",
  async evaluate(tick, state) {
    if (tick.istTime >= "09:15" && tick.istTime < "09:30") {
      const high = state.orbDate === tick.istDate ? Math.max(state.orbHigh, tick.high) : tick.high;
      const low = state.orbDate === tick.istDate ? Math.min(state.orbLow, tick.low) : tick.low;
      return {
        alert: null,
        newState: { orbHigh: high, orbLow: low, orbDate: tick.istDate, orbFired: null }
      };
    }
    if (state.orbDate === tick.istDate && state.orbFired !== tick.istDate) {
      if (tick.close > state.orbHigh) {
        return {
          alert: `ORB CALL: Price (${tick.close}) broke above 15m High (${state.orbHigh})`,
          newState: { orbFired: tick.istDate }
        };
      }
      if (tick.close < state.orbLow) {
        return {
          alert: `ORB PUT: Price (${tick.close}) broke below 15m Low (${state.orbLow})`,
          newState: { orbFired: tick.istDate }
        };
      }
    }
    return { alert: null, newState: {} };
  }
};
