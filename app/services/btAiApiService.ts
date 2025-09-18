/**
 * Backend service for making calls to the main BT API
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const PROJECT_ID = process.env.JWT_PROJECT_ID;

export class BtAiApiService {
  /**
   * Create a payment method
   * 
   * @param jwt - The JWT token for authentication
   * @param paymentMethodData - The data for the payment method
   * @returns The created payment method
   */
  static async createPaymentMethod(jwt: string, paymentMethodData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/payment-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(paymentMethodData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create payment method');
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
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/payment-methods?limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch payment methods');
    }

    return data;
  }

  /**
   * Fetch payment methods with pagination
   * 
   * @param jwt - The JWT token for authentication
   * @param limit - Number of items per page
   * @param offset - Number of items to skip
   * @returns The list of payment methods and response with headers
   */
  static async fetchPaymentMethodsPaginated(jwt: string, limit: number = 10, offset: number = 0): Promise<{ data: any[], response: Response }> {
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/payment-methods?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch payment methods');
    }

    return { data, response };
  }

  /**
   * Fetch a specific payment method
   */
  static async fetchPaymentMethod(jwt: string, paymentMethodId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/payment-methods/${paymentMethodId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch payment method');
    }

    return data;
  }

  /**
   * Create a purchase intent
   */
  static async createPurchaseIntent(jwt: string, purchaseIntentData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(purchaseIntentData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create purchase intent');
    }

    return data;
  }

  /**
   * Fetch purchase intents
   */
  static async fetchPurchaseIntents(jwt: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents?limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch purchase intents');
    }

    return data;
  }

  /**
   * Fetch purchase intents with pagination
   */
  static async fetchPurchaseIntentsPaginated(jwt: string, limit: number = 10, offset: number = 0): Promise<{ data: any[], response: Response }> {
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch purchase intents');
    }

    return { data, response };
  }

  /**
   * Fetch purchase intent details
   */
  static async fetchPurchaseIntentDetails(jwt: string, intentId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents/${intentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch purchase intent details');
    }

    return data;
  }

  /**
   * Verify purchase intent
   */
  static async verifyPurchaseIntent(jwt: string, intentId: string, verificationData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents/${intentId}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(verificationData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify purchase intent');
    }

    return data;
  }
}
