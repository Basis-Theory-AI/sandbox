/**
 * Service for handling Next.js API operations
 */
export class APIService {
    /**
   * Generate a new JWT token for specific entity and role
   * 
   * @param entityId - The ID of the entity to generate the JWT for
   * @param role - The role of the entity to generate the JWT for (public/private)
   * @returns The generated JWT token
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
   * Fetch payment methods
   * 
   * @param jwt - The JWT token for authentication
   * @returns The list of payment methods
   */
  static async fetchPaymentMethods(jwt: string): Promise<any[]> {
    const response = await fetch("/api/payment-methods", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch payment methods");
    }

    return data;
  }

  /**
   * Fetch purchase intents
   * 
   * @param jwt - The JWT token for authentication
   * @returns The list of purchase intents
   */
  static async fetchPurchaseIntents(jwt: string): Promise<any[]> {
    const response = await fetch("/api/purchase-intents", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch purchase intents");
    }

    return data;
  }
}
