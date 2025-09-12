import React, { useState } from "react";
import { PurchaseIntentCredentialModal } from "./PurchaseIntentCredentialModal";
import { useBtAi } from "@basis-theory-ai/react";
import { usePurchaseIntents } from "../../hooks/usePurchaseIntents";

interface PurchaseIntentListProps {
  jwt?: string;
  purchaseIntents: any[];
  onRefresh?: () => void;
  loading?: boolean;
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "verify":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "expired":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-[#71717b]/10 text-[#e4e4e7] border-[#71717b]/20";
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-lg border ${getStatusColor(
        status
      )}`}
    >
      {status.toUpperCase()}
    </span>
  );
}

// Credential type badge
function CredentialTypeBadge({ type }: { type: string }) {
  return (
    <span className="px-2 py-1 text-xs font-mono bg-white/5 text-[#e4e4e7] rounded-lg border border-white/10">
      {type}
    </span>
  );
}

export function PurchaseIntentList({
  jwt,
  purchaseIntents,
  onRefresh,
  loading,
}: PurchaseIntentListProps) {
  // credential modal state
  const [credentialModalOpen, setCredentialModalOpen] = useState(false);
  const [verifyingIntent, setVerifyingIntent] = useState(false);
  const [fetchingIntent, setFetchingIntent] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<any>(null);

  const { verifyPurchaseIntent } = useBtAi();
  const { fetchPurchaseIntent } = usePurchaseIntents(jwt);

  const handleVerifyIntent = async (intent: any) => {
    setVerifyingIntent(true);

    try {
      const result = await verifyPurchaseIntent(
        process.env.NEXT_PUBLIC_PROJECT_ID || "",
        intent.id
      );

      setVerifyingIntent(false);

      // refresh list to reflect new verified status
      onRefresh?.();
    } catch (error) {
      console.error(error);
    } finally {
      setVerifyingIntent(false);
    }
  };

  const handleGetPurchaseIntent = async (intent: any) => {
    setFetchingIntent(true);

    try {
      const result = await fetchPurchaseIntent(intent.id);

      setSelectedIntent(result);
      setFetchingIntent(false);
      setCredentialModalOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingIntent(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 text-[#a1a1aa]">
          <div className="w-5 h-5 border-2 border-[#a1a1aa] border-t-[#B5F200] rounded-full animate-spin"></div>
          <span className="text-sm">Loading Purchase Intents...</span>
        </div>
      </div>
    );
  }

  if (purchaseIntents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-[#a1a1aa] text-sm mb-3">
          No Purchase Intents found
        </div>
        <button
          onClick={onRefresh}
          className="px-3 h-8 bg-white/10 text-[#e4e4e7] text-sm font-medium font-sans rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 flex items-center"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {purchaseIntents.map((intent) => (
        <div
          key={intent.id}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            {/* Left side - Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="font-mono text-sm text-[#f4f4f5]">
                  {intent.id}
                </div>
                <CredentialTypeBadge type={intent.credentialType} />
                <StatusBadge status={intent.status} />
              </div>

              <div className="flex items-center gap-4 text-xs text-[#a1a1aa]">
                <div className="flex items-center gap-1">
                  <span>Payment Method:</span>
                  <span className="font-mono text-[#bff660]">
                    {intent.paymentMethodId}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2 ml-4">
              {intent.status === "verify" && (
                <button
                  onClick={() => handleVerifyIntent(intent)}
                  disabled={verifyingIntent}
                  className={
                    "bg-yellow-500 px-3 h-8 text-sm font-medium font-sans rounded-lg transition-all duration-200 flex items-center gap-1 bg-[#B5F200] text-[#131316] hover:bg-[#A3E600] hover:-translate-y-0.5"
                  }
                >
                  <span>Verify Intent</span>
                </button>
              )}

              {intent.status === "active" && (
                <button
                  onClick={() => handleGetPurchaseIntent(intent)}
                  disabled={fetchingIntent}
                  className="px-3 h-8 bg-[#B5F200] text-[#131316] text-sm font-medium font-sans rounded-lg hover:bg-[#A3E600] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-1"
                >
                  <span>
                    {fetchingIntent ? "Loading..." : "Get Credential"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Card Details Modal */}
      <PurchaseIntentCredentialModal
        isOpen={credentialModalOpen}
        onClose={() => {
          setCredentialModalOpen(false);
          setSelectedIntent(null);
        }}
        intent={selectedIntent}
      />
    </div>
  );
}
