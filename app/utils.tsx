/**
 * Copy to clipboard utility
 * @param text - The text to copy to the clipboard
 */
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}