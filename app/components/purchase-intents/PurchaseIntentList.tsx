import React, { useState } from "react";
import { PurchaseIntentCredentialModal } from "./PurchaseIntentCredentialModal";
import { useBtAi } from "@basis-theory-ai/react";
import { usePurchaseIntents } from "../../hooks/usePurchaseIntents";
import { KeyIcon } from "../shared/icons/KeyIcon";
import { CreditCardIcon } from "../shared/icons/CreditCardIcon";

interface PurchaseIntentListProps {
  jwt?: string;
  purchaseIntents: any[];
  onRefresh?: () => void;
  loading?: boolean;
}

// status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "verify":
        return {
          backgroundColor: "rgba(249, 115, 22, 0.1)",
          color: "rgba(253, 186, 116, 1)",
        };
      case "active":
        return {
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          color: "rgba(110, 231, 183, 1)",
        };
      case "expired":
        return {
          backgroundColor: "rgba(244, 63, 94, 0.1)",
          color: "rgba(253, 164, 175, 1)",
        };
      default:
        return {
          backgroundColor: "#212124",
          color: "#A1A1A9",
        };
    }
  };

  const style = getStatusStyle(status);

  return (
    <span
      className="px-3 h-6 text-sm font-medium rounded-xl flex items-center w-fit"
      style={style}
    >
      {status.toUpperCase()}
    </span>
  );
}

// credential type badge
function CredentialTypeBadge({ type }: { type: string }) {
  return (
    <span className="px-3 h-6 bg-[#212124] text-[#A1A1A9] text-sm font-medium rounded-xl flex items-center w-fit">
      {type.toUpperCase()}
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
      await verifyPurchaseIntent(
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
    <>
      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full">
          <thead>
            <tr className="bg-transparent">
              <th className="px-4 py-3 text-left text-xs text-[#717179] font-medium">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs text-[#717179] font-medium">
                Payment Method ID
              </th>
              <th className="px-4 py-3 text-left text-xs text-[#717179] font-medium">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs text-[#717179] font-medium">
                Credential Type
              </th>
              <th className="px-4 py-3 text-left text-xs text-[#717179] font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {purchaseIntents.map((intent) => (
              <tr
                key={intent.id}
                className="h-12 bg-[#0D0D0FCC] hover:bg-white/5 transition-all duration-200 border-b border-white/5 last:border-b-0 cursor-pointer"
              >
                {/* ID */}
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-white">
                    {intent.id}
                  </span>
                </td>
                {/* Payment Method ID */}
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-white">
                    {intent.paymentMethodId}
                  </span>
                </td>
                {/* Status */}
                <td className="px-4 py-3">
                  <div className="inline-flex">
                    <StatusBadge status={intent.status} />
                  </div>
                </td>
                {/* Credential Type */}
                <td className="px-4 py-3">
                  <div className="inline-flex">
                    <CredentialTypeBadge type={intent.credentialType} />
                  </div>
                </td>
                {/* Actions */}
                <td className="px-4 py-3 align-middle">
                  <div className="flex gap-2">
                    {intent.status === "verify" && (
                      <button
                        onClick={() => handleVerifyIntent(intent)}
                        disabled={verifyingIntent}
                        className="w-8 h-8 rounded-lg hover:bg-opacity-20 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center"
                        style={{ backgroundColor: "rgba(249, 115, 22, 0.1)" }}
                        title="Verify Intent"
                      >
                        <KeyIcon
                          className="w-4 h-4"
                          fill="rgba(253, 186, 116, 1)"
                        />
                      </button>
                    )}

                    {intent.status === "active" && (
                      <button
                        onClick={() => handleGetPurchaseIntent(intent)}
                        disabled={fetchingIntent}
                        className="w-8 h-8 rounded-lg hover:bg-opacity-20 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center"
                        style={{ backgroundColor: "rgba(181, 242, 0, 0.1)" }}
                        title="Get Credential"
                      >
                        {fetchingIntent ? (
                          <div className="w-4 h-4 border border-[#C7FB20] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <CreditCardIcon className="w-4 h-4" fill="#C7FB20" />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PurchaseIntentCredentialModal
        isOpen={credentialModalOpen}
        onClose={() => {
          setCredentialModalOpen(false);
          setSelectedIntent(null);
        }}
        intent={selectedIntent}
      />
    </>
  );
}
