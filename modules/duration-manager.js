/**
 * Duration Manager
 * PINNED ANTI-BAN RULE:
 * Same duration posted consecutively is a confirmed bot signal to Meta's algorithm.
 * The scheduler must rotate: 30s -> 15s -> 60s -> 30s -> 15s -> 60s...
 */

const DURATION_SEQUENCE = [30, 15, 60, 30, 15, 60, 30, 15, 60, 30]; // 10 reels per week

/**
 * Returns scheduled duration (in seconds) for a weekly slot (0 to 9)
 * @param {number} slotIndex
 * @returns {number} 15, 30, or 60
 */
function getDurationForSlot(slotIndex) {
  const index = Math.abs(Number(slotIndex) || 0) % DURATION_SEQUENCE.length;
  return DURATION_SEQUENCE[index];
}

module.exports = {
  DURATION_SEQUENCE,
  getDurationForSlot,
};
