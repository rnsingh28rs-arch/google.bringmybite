/**
 * Frontend Security & Defensive Safeguards
 * 
 * NOTE: Client-side event interception is a modest deterrent against accidental right-clicks
 * and common inspection hotkeys. It does NOT make client-side source code or DOM inaccessible,
 * as all browser-delivered assets are inherently public to the client environment.
 * 
 * Real application security is enforced strictly server-side:
 * 1. Cryptographic HMAC session verification on all administrative endpoints (/api/admin/*).
 * 2. Sensitive credentials (GEMINI_API_KEY, RESEND_API_KEY, ADMIN_PASSWORD_HASH, etc.)
 *    are stored exclusively in server environment variables and serverless functions.
 * 3. Scrypt password hashing with constant-time equality checks and IP-based rate limiting.
 * 4. Whitelisted domain routing to prevent open redirects (/api/track-click).
 * 
 * This deterrent is engineered to:
 * - NEVER break accessibility, text selection, screen readers, or standard navigation.
 * - NEVER disable right-click or keyboard actions inside <input>, <textarea>, or editable fields.
 * - NEVER block right-click on links (open in new tab/window).
 * - Display a professional Self-XSS protective advisory in the browser console.
 */

export function setupSecurityDeterrent(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  // 1. Output a standard protective Self-XSS console advisory
  try {
    const titleStyle = 'color: #ea4335; font-size: 22px; font-weight: bold;';
    const bodyStyle = 'color: #334155; font-size: 13px; font-weight: 500;';
    const warningStyle = 'color: #b91c1c; font-size: 12px; font-weight: 600;';
    
    console.log('%c⚠️ STOP!', titleStyle);
    console.log(
      '%cThis is a browser feature intended for developers. Pasting code here can compromise your account or session (Self-XSS).',
      bodyStyle
    );
    console.log(
      '%cGoogle Tool Finder security notice: Never share credentials, passwords, or session tokens.',
      warningStyle
    );
  } catch {
    // Non-fatal if console is restricted
  }

  // Helper to determine if target is an editable form element
  const isEditableElement = (target: EventTarget | null): boolean => {
    if (!target || !(target instanceof HTMLElement)) return false;
    const tagName = target.tagName.toLowerCase();
    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      target.isContentEditable ||
      target.getAttribute('role') === 'textbox'
    );
  };

  // 2. Modest deterrent against accidental right-click on non-interactive background elements
  const handleContextMenu = (e: MouseEvent) => {
    // Preserve normal right-click inside form inputs, text areas, and editable elements
    if (isEditableElement(e.target)) {
      return;
    }

    // Preserve standard context menu on links so users can open in new tab/window
    const target = e.target as HTMLElement | null;
    if (target?.closest('a')) {
      return;
    }

    // Deter accidental right-click on general backgrounds/body
    e.preventDefault();
  };

  // 3. Modest deterrent against common Inspect keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // Never intercept keyboard actions inside form inputs
    if (isEditableElement(e.target)) {
      return;
    }

    const key = e.key;
    const isCtrlOrMeta = e.ctrlKey || e.metaKey;

    // F12 (DevTools toggle)
    if (key === 'F12') {
      e.preventDefault();
      return;
    }

    // Ctrl+Shift+I / Cmd+Option+I (Inspect Element)
    // Ctrl+Shift+J / Cmd+Option+J (Console)
    // Ctrl+Shift+C / Cmd+Option+C (Inspect DOM element)
    if (isCtrlOrMeta && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(key)) {
      e.preventDefault();
      return;
    }

    // Ctrl+U / Cmd+Option+U (View Source)
    if (isCtrlOrMeta && (key === 'U' || key === 'u')) {
      e.preventDefault();
      return;
    }
  };

  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('keydown', handleKeyDown);
  };
}
