export interface JWTCreateRequest {
  userId: string;
  roles: string[];
}

export interface JWTResponse {
  jwt: string;
}

/**
 * Service for handling JWT operations
 */
export class JWTService {
  /**
   * Create a new JWT token
   */
  static async createJWT(request: JWTCreateRequest): Promise<string> {
    const response = await fetch("/api/auth/jwt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create JWT");
    }

    return data.jwt;
  }

  /**
   * Get the backend JWT (private role)
   */
  static async getBackendJWT(): Promise<string> {
    const response = await fetch("/api/auth/backend-jwt");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch backend JWT");
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
