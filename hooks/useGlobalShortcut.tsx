import { useEffect } from "react";

/*
 * Runs a callback when a specific key is pressed globally,
 * unless the user is typing in an input, textarea, or contenteditable element.
 *
 * @param key - The key to listen for (e.g., 'g')
 * @param callback - The function to run when the key is pressed
 */
export function useGlobalShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const isTyping =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable);

      if (!isTyping && (e.key === key || e.key === key.toUpperCase())) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback]);
}
