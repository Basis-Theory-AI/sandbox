/**
 * Service for handling JWT operations
 */
export class JWTService {
  /**
   * Generate a new JWT token for specific user and role
   */
  static async generateJWT(entityId: string, role: 'public' | 'private'): Promise<string> {
    const response = await fetch("/api/auth/generate-jwt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityId, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate JWT");
    }

    return data.jwt;
  }

  /**
   * Decode a JWT token to extract its payload
   */
  static decodeJWT(jwt: string): any {
    try {
      const payload = jwt.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  /**
   * Copy text to clipboard
   */
  static async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  }
}
