import { useState, useEffect } from "react";
import { APIService, PaginationInfo, PaginatedResponse } from "../services/apiService";

/**
 * Use Payment Methods Hook
 */
export function usePaymentMethods(jwt: string | undefined) {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /**
   * Fetch payment methods
   * @returns List of payment methods
   */
  const fetchPaymentMethods = async () => {
    if (!jwt) return;

    setFetching(true);
    setError(null);

    try {
      const offset = (currentPage - 1) * pageSize;
      const result = await APIService.fetchPaymentMethodsPaginated(jwt, pageSize, offset);
      setPaymentMethods(result.data);
      setPagination(result.pagination);
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
   * Change page
   */
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  /**
   * Change page size
   */
  const changePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
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

  // auto-fetch when jwt, currentPage, or pageSize changes
  useEffect(() => {
    if (jwt) {
      fetchPaymentMethods();
    }
  }, [jwt, currentPage, pageSize]);

  return {
    createPaymentMethod,
    fetchPaymentMethods,
    paymentMethods,
    fetching,
    creating,
    error,
    pagination,
    currentPage,
    pageSize,
    goToPage,
    changePageSize,
  };
}
