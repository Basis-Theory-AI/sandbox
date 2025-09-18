/**
 * Pagination metadata from API response headers
 */
export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrevious: boolean;
  currentPage: number;
  totalPages: number;
}

/**
 * Paginated response with data and pagination info
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

/**
 * Service for handling Next.js API operations
 */
export class APIService {
  /**
   * Extract pagination info from response headers
   */
  private static extractPaginationInfo(response: Response): PaginationInfo {
    // Try both case variations for headers (some servers normalize them)
    const getHeader = (name: string): string | null => {
      return response.headers.get(name) || 
             response.headers.get(name.toLowerCase()) || 
             response.headers.get(name.toUpperCase()) || 
             null;
    };

    const totalHeader = getHeader('X-Total-Count');
    const limitHeader = getHeader('X-Limit');
    const offsetHeader = getHeader('X-Offset');
    const hasNextHeader = getHeader('X-Has-Next');
    const hasPreviousHeader = getHeader('X-Has-Previous');

    const total = parseInt(totalHeader || '0');
    const limit = parseInt(limitHeader || '10');
    const offset = parseInt(offsetHeader || '0');
    const hasNext = hasNextHeader === 'true';
    const hasPrevious = hasPreviousHeader === 'true';
    
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    const paginationInfo = {
      total,
      limit,
      offset,
      hasNext,
      hasPrevious,
      currentPage,
      totalPages
    };
    
    return paginationInfo;
  }

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
   * Fetch payment methods with pagination
   *
   * @param jwt - The JWT token for authentication
   * @param limit - Number of items per page (default: 10)
   * @param offset - Number of items to skip (default: 0)
   * @returns Paginated payment methods response
   */
  static async fetchPaymentMethodsPaginated(
    jwt: string, 
    limit: number = 10, 
    offset: number = 0
  ): Promise<PaginatedResponse<any>> {
    const url = `/api/payment-methods?limit=${limit}&offset=${offset}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch payment methods");
    }

    const pagination = this.extractPaginationInfo(response);

    return {
      data,
      pagination
    };
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
   * Fetch purchase intents with pagination
   *
   * @param jwt - The JWT token for authentication
   * @param limit - Number of items per page (default: 10)
   * @param offset - Number of items to skip (default: 0)
   * @returns Paginated purchase intents response
   */
  static async fetchPurchaseIntentsPaginated(
    jwt: string, 
    limit: number = 10, 
    offset: number = 0
  ): Promise<PaginatedResponse<any>> {
    const url = `/api/purchase-intents?limit=${limit}&offset=${offset}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch purchase intents");
    }

    const pagination = this.extractPaginationInfo(response);

    return {
      data,
      pagination
    };
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
