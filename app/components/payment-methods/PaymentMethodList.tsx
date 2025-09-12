import React from "react";
import { getCardIcon } from "../shared/CardIcons";
import { usePurchaseIntents } from "../../hooks/usePurchaseIntents";

interface PaymentMethodListProps {
  jwt?: string;
  paymentMethods: any[];
  onRefresh?: () => void;
  fetching?: boolean;
}

// Card Type Badge - shows icon + card type instead of brand name
function CardBadge({ brand, type }: { brand: string; type: string }) {
  const getCardTypeColor = (type: string) => {
    switch (type?.toLowerCase() ?? "credit") {
      case "debit":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "credit":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "prepaid":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      default:
        return "bg-[#71717b]/10 text-[#e4e4e7] border-[#71717b]/20";
    }
  };

  const icon = getCardIcon(brand);

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-lg border ${getCardTypeColor(
        type
      )} flex items-center gap-1`}
    >
      {typeof icon === "string" ? <span>{icon}</span> : icon}
      <span>{type?.toUpperCase() ?? "CREDIT"}</span>
    </span>
  );
}

export function PaymentMethodList({
  jwt,
  paymentMethods,
  onRefresh,
  fetching,
}: PaymentMethodListProps) {
  const { createPurchaseIntent, creating } = usePurchaseIntents(jwt);

  const handleCreatePurchaseIntent = async (paymentMethod: any) => {
    try {
      const result = await createPurchaseIntent(paymentMethod);
      // TODO: SUCCESS SNACKBAR
    } catch (error) {
      // TODO: ERROR SNACKBAR
      console.error(error);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 text-[#a1a1aa]">
          <div className="w-5 h-5 border-2 border-[#a1a1aa] border-t-[#bff660] rounded-full animate-spin"></div>
          <span className="text-sm">Loading Payment Methods...</span>
        </div>
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-[#a1a1aa] text-sm mb-3">
          No Payment Methods found
        </div>
        <button
          onClick={onRefresh}
          className="px-3 py-1.5 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <CardBadge brand={method.card.brand} type={method.card.type} />
                <div className="font-mono text-sm text-[#f4f4f5]">
                  {method.card.details.bin} •••• {method.card.details.last4}
                </div>
                <div className="font-mono text-sm text-[#f4f4f5]">
                  {String(method.card.details.expirationMonth).padStart(2, "0")}
                  /{String(method.card.details.expirationYear).slice(-2)}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#a1a1aa]">
                <div className="flex items-center gap-1">
                  <span>ID:</span>
                  <span className="font-mono text-[#bff660]">{method.id}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Credentials:</span>
                  <span className="text-[#bff660]">
                    {method.credentialTypes.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => handleCreatePurchaseIntent(method)}
                disabled={creating}
                className="px-3 py-1.5 bg-[#bff660] text-[#131316] text-xs font-medium rounded-lg hover:bg-[#b2f63d] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-1"
              >
                {creating ? (
                  <>
                    <div className="w-3 h-3 border border-[#131316] border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>Create Intent</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
