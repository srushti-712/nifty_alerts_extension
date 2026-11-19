function playChime(signal = "CALL") {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const notes = signal === "PUT" ? [523.25, 392.0] : [587.33, 880.0];

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + i * 0.16);

    gain.gain.setValueAtTime(0.001, now + i * 0.16);
    gain.gain.exponentialRampToValueAtTime(0.25, now + i * 0.16 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.16 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.16);
    osc.stop(now + i * 0.16 + 0.26);
  });

  setTimeout(() => ctx.close(), 700);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "PLAY_ALERT_SOUND") {
    playChime(msg.signal);
  }
});
