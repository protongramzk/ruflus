// Web Feedback Utility for Cassava UI
// Implements synchronized visual, haptic, and audio feedback for interactions.

// Haptic feedback using the standard Web Vibration API
export const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(12); // Light 12ms haptic tick
    } catch (e) {
      // Ignore security constraints or lack of permission
    }
  }
};

// Audio feedback synthesizing non-obtrusive functional sound cues via Web Audio API
let audioCtx: AudioContext | null = null;

export const triggerAudio = (type: 'success' | 'click' | 'error' = 'click') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    // Resume AudioContext if suspended (browser auto-play safety)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'success') {
      // Cheerful double beep (sine wave)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.22);
    } else if (type === 'error') {
      // Warning low flat buzz
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } else {
      // Clean short functional click/tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    }
  } catch (e) {
    // Ignore errors from browser restrictions
  }
};

/**
 * Trigger dynamic multi-modal user feedback
 */
export const triggerFeedback = (type: 'success' | 'click' | 'error' = 'click') => {
  triggerHaptic();
  triggerAudio(type);
};
