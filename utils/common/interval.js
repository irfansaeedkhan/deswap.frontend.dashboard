/**
 * Historically this cleared EVERY interval ID up to the latest,
 * which breaks React/Next timers and causes white screens on navigation.
 * Keep a no-op so call sites stay safe.
 */
module.exports.clearAllInterval = async () => {
  return;
};
