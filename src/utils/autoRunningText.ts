/**
 * Global utility to ensure ANY text that doesn't fit its container in this app
 * automatically becomes running text, dynamically adapting to screen resizing,
 * orientation changes, and dynamic content changes.
 */

export function initAutoRunningText(): () => void {
  if (typeof window === 'undefined') return () => {};

  let scheduled = false;

  const checkElements = () => {
    scheduled = false;
    // Find all elements that might be constrained and have overflowing single-line text
    const elements = document.querySelectorAll<HTMLElement>(
      '.truncate, [data-auto-run], [class*="overflow-hidden"]'
    );

    elements.forEach((el) => {
      // Skip if managed by RunningText or is input/canvas/etc.
      if (
        el.closest('[data-running-text]') ||
        el.tagName === 'INPUT' ||
        el.tagName === 'TEXTAREA' ||
        el.tagName === 'CANVAS' ||
        el.tagName === 'SVG' ||
        el.tagName === 'BUTTON' && el.childElementCount > 1
      ) {
        return;
      }

      // Check if text exceeds container
      const isOverflowing = el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0;

      if (isOverflowing) {
        const overflow = el.scrollWidth - el.clientWidth;
        const duration = Math.max(5, Math.round(overflow / 20) + 4);
        el.style.setProperty('--overflow-amount', `${overflow}px`);
        el.style.setProperty('--auto-duration', `${duration}s`);
        if (!el.classList.contains('auto-running-text')) {
          el.classList.add('auto-running-text');
        }
      } else if (el.classList.contains('auto-running-text')) {
        el.classList.remove('auto-running-text');
        el.style.removeProperty('--overflow-amount');
        el.style.removeProperty('--auto-duration');
      }
    });
  };

  const scheduleCheck = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(checkElements);
    }
  };

  // Run on start
  scheduleCheck();

  // Run when fonts load
  if (document.fonts?.ready) {
    document.fonts.ready.then(scheduleCheck);
  }

  // Observe DOM additions and attribute changes
  const mutationObserver = new MutationObserver(() => {
    scheduleCheck();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // Observe window resize
  window.addEventListener('resize', scheduleCheck, { passive: true });

  return () => {
    mutationObserver.disconnect();
    window.removeEventListener('resize', scheduleCheck);
  };
}
