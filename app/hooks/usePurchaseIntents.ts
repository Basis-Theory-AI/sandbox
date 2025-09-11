import { useState, useEffect } from "react";
import { APIService } from "../services/apiService";

export function usePurchaseIntents(jwt: string | null) {
  const [purchaseIntents, setPurchaseIntents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseIntents = async () => {
    if (!jwt) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await APIService.fetchPurchaseIntents(jwt);
      setPurchaseIntents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when jwt changes
  useEffect(() => {
    if (jwt) {
      fetchPurchaseIntents();
    }
  }, [jwt]);

  return {
    purchaseIntents,
    loading,
    error,
    refresh: fetchPurchaseIntents,
  };
}
