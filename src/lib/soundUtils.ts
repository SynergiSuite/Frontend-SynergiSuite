"use client";

let audioContext: AudioContext | null = null;
let isAudioUnlocked = false;

if (typeof window !== "undefined") {
  const unlock = () => {
    if (isAudioUnlocked) return;
    isAudioUnlocked = true;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
        if (audioContext.state === "suspended") {
          void audioContext.resume();
        }
      }
    } catch {
      // AudioContext fallback
    }

    try {
      const audio = new Audio("/sounds/sound.wav");
      audio.volume = 0.5;
      audio.muted = true;
      void audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      }).catch(() => {});
    } catch {
      // Audio fallback
    }

    window.removeEventListener("click", unlock);
    window.removeEventListener("touchstart", unlock);
    window.removeEventListener("keydown", unlock);
  };

  window.addEventListener("click", unlock, { once: true });
  window.addEventListener("touchstart", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

export function playNotificationSound() {
  if (typeof window === "undefined") return;

  let played = false;

  try {
    const audio = new Audio("/sounds/sound.wav");
    audio.volume = 0.7;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          played = true;
        })
        .catch(() => {
          synthesizeChime();
        });
    }
  } catch {
    synthesizeChime();
  }

  // Backup Web Audio API synthesized chime if audio file fails
  setTimeout(() => {
    if (!played) {
      synthesizeChime();
    }
  }, 100);
}

function synthesizeChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = audioContext || new AudioCtx();
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now); // A5 note
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6 note

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch {
    // Ignore audio failures
  }
}
