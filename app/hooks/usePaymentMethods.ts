import { useState, useEffect } from "react";
import { APIService } from "../services/apiService";

export function usePaymentMethods(jwt: string | null) {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    if (!jwt) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await APIService.fetchPaymentMethods(jwt);
      setPaymentMethods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when jwt changes
  useEffect(() => {
    if (jwt) {
      fetchPaymentMethods();
    }
  }, [jwt]);

  return {
    paymentMethods,
    loading,
    error,
    refresh: fetchPaymentMethods,
  };
}
