import { useState, useEffect } from "react";
import { APIService } from "../services/apiService";

/**
 * Use Payment Methods Hook
 */
export function usePaymentMethods(jwt: string | undefined) {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch payment methods
   * @returns List of payment methods
   */
  const fetchPaymentMethods = async () => {
    if (!jwt) return;

    setFetching(true);
    setError(null);

    try {
      const data = await APIService.fetchPaymentMethods(jwt);
      setPaymentMethods(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching payment methods"
      );
    } finally {
      setFetching(false);
    }
  };

  /**
   * Create a payment method
   *
   * @param cardData The card data to create the payment method with
   * @returns The created payment method
   */
  const createPaymentMethod = async (cardData: {
    cardNumber: string;
    expirationMonth: string;
    expirationYear: string;
    cvc: string;
  }) => {
    if (!jwt) return;
    
    setCreating(true);
    setError(null);
    
    try {
      const data = await APIService.createPaymentMethod(jwt, cardData);

      // Refresh the list to show the new payment method
      await fetchPaymentMethods();
      
      return data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while creating payment method"
      );
      throw err;
    } finally {
      setCreating(false);
    }
  };

  // auto-fetch when jwt changes
  useEffect(() => {
    if (jwt) {
      fetchPaymentMethods();
    }
  }, [jwt]);

  return {
    createPaymentMethod,
    fetchPaymentMethods,
    paymentMethods,
    fetching,
    creating,
    error,
  };
}
