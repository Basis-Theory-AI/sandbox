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
  static async generateJWT(
    entityId: string,
    role: "public" | "private"
  ): Promise<string> {
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
   * Create payment method
   *
   * @param jwt - The JWT token for authentication
   * @param cardData - The card data for the payment method
   * @returns The created payment method
   */
  static async createPaymentMethod(jwt: string, cardData: {
    cardNumber: string;
    expirationMonth: string;
    expirationYear: string;
    cvc: string;
  }): Promise<any> {
    const response = await fetch("/api/payment-methods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        cardNumber: cardData.cardNumber.replace(/\s/g, ""),
        expirationMonth: cardData.expirationMonth,
        expirationYear: cardData.expirationYear,
        cvc: cardData.cvc,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create payment method");
    }

    return data;
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

  /**
   * Create purchase intent
   *
   * @param jwt - The JWT token for authentication
   * @param paymentMethodId - The payment method ID to create the intent for
   * @returns The created purchase intent
   */
  static async createPurchaseIntent(
    jwt: string,
    paymentMethodId: string,
    mandates: any[]
  ): Promise<any> {
    const response = await fetch("/api/purchase-intents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        paymentMethodId,
        mandates,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create purchase intent");
    }

    return data;
  }

  /**
   * Fetch a purchase intent
   * @param intentId The ID of the purchase intent to fetch
   * @returns The fetched purchase intent
   */
  static async fetchPurchaseIntent(jwt: string, intentId: string): Promise<any> {
    const response = await fetch(`/api/purchase-intents/${intentId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch purchase intent");
    }

    return data;
  }
}
