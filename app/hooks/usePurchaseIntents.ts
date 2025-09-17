import { useState, useEffect } from "react";
import { APIService, PaginationInfo, PaginatedResponse } from "../services/apiService";

/**
 * Use Purchase Intents Hook
 */
export function usePurchaseIntents(jwt: string | undefined) {
  const [purchaseIntents, setPurchaseIntents] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /**
   * Fetch purchase intents
   * @returns List of purchase intents
   */
  const fetchPurchaseIntents = async () => {
    if (!jwt) return;

    setFetching(true);
    setError(null);

    try {
      const offset = (currentPage - 1) * pageSize;
      const result = await APIService.fetchPurchaseIntentsPaginated(jwt, pageSize, offset);
      setPurchaseIntents(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching purchase intents"
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
   * Create a purchase intent
   *
   * @param paymentMethod The payment method to create the purchase intent for
   * @param mandates The purchase intent mandates
   * @returns The created purchase intent
   */
  const createPurchaseIntent = async (
    paymentMethod: any,
    mandates: any[] = []
  ) => {
    if (!jwt) return;

    setCreating(true);
    setError(null);

    try {
      const data = await APIService.createPurchaseIntent(
        jwt,
        paymentMethod.id,
        mandates
      );

      // refresh the list to show the new purchase intent
      await fetchPurchaseIntents();

      return data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while creating purchase intent"
      );
      throw err;
    } finally {
      setCreating(false);
    }
  };

  /**
   * Fetch a purchase intent
   * @param intentId The ID of the purchase intent to fetch
   * @returns The fetched purchase intent
   */
  const fetchPurchaseIntent = async (intentId: string) => {
    if (!jwt) return;

    setFetching(true);
    setError(null);

    try {
      const data = await APIService.fetchPurchaseIntent(jwt, intentId);
      return data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching purchase intent"
      );
      throw err;
    } finally {
      setFetching(false);
    }
  };

  // auto-fetch when jwt, currentPage, or pageSize changes
  useEffect(() => {
    if (jwt) {
      fetchPurchaseIntents();
    }
  }, [jwt, currentPage, pageSize]);

  return {
    createPurchaseIntent,
    fetchPurchaseIntents,
    fetchPurchaseIntent,
    purchaseIntents,
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
