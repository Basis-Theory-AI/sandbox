/**
 * Service for handling API operations
 */
export class APIService {
  /**
   * Fetch payment methods
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
