import React from "react";
import { getCardIcon } from "../shared/CardIcons";
import { usePurchaseIntents } from "../../hooks/usePurchaseIntents";
import { ShoppingCartIcon } from "../shared/icons/ShoppingCartIcon";

interface PaymentMethodListProps {
  jwt?: string;
  paymentMethods: any[];
  onRefresh?: () => void;
  fetching?: boolean;
}

function CardBadge({ brand, type }: { brand: string; type: string }) {
  const icon = getCardIcon(brand);

  return (
    <span
      className="px-3 h-6 text-sm font-medium rounded-xl text-[#28D9D8] flex items-center gap-1 w-fit"
      style={{ backgroundColor: "rgba(15, 187, 189, 0.1)" }}
    >
      {typeof icon === "string" ? <span>{icon}</span> : icon}
      <span>{type?.toUpperCase()} CARD</span>
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
          <div className="w-5 h-5 border-2 border-[#a1a1aa] border-t-[#B5F200] rounded-full animate-spin"></div>
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
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs text-[#717179] font-medium">
                Details
              </th>
              <th className="px-4 py-3 text-left text-xs text-[#717179] font-medium">
                Credential Types
              </th>
              <th className="px-4 py-3 text-left text-xs text-[#717179] font-medium">
                Created Date
              </th>
              <th className="px-4 py-3 text-left text-xs text-[#717179] font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((method) => (
              <tr
                key={method.id}
                className="h-12 bg-[#0D0D0FCC] hover:bg-white/5 transition-all duration-200 border-b border-white/5 last:border-b-0 cursor-pointer"
              >
                {/* ID */}
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-white">
                    {method.id}
                  </span>
                </td>
                {/* Type */}
                <td className="px-4 py-3">
                  <div className="inline-flex">
                    <CardBadge
                      brand={method.card.brand}
                      type={method.card.type}
                    />
                  </div>
                </td>
                {/* Details */}
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-[#f4f4f5]">
                    {method.card.details.bin}••••{method.card.details.last4}{" "}
                    {String(method.card.details.expirationMonth).padStart(
                      2,
                      "0"
                    )}
                    /{String(method.card.details.expirationYear).slice(-2)}
                  </span>
                </td>

                {/* Credentials Types */}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {method.credentialTypes.map((credential: string) => (
                      <span
                        key={credential}
                        className="h-6 px-3 bg-[#212124] text-[#A1A1A9] text-sm font-medium rounded-xl flex items-center"
                      >
                        {credential.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </td>
                {/* Created Date */}
                <td className="px-4 py-3">
                  <span className="text-sm text-[#A1A1A9]">
                    {new Date(method.createdAt).toLocaleDateString()}
                  </span>
                </td>
                {/* Actions */}
                <td className="px-4 py-3 align-middle">
                  <button
                    onClick={() => handleCreatePurchaseIntent(method)}
                    disabled={creating}
                    className="w-8 h-8 rounded-lg hover:bg-opacity-20 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(181, 242, 0, 0.1)" }}
                    title="Create Purchase Intent"
                  >
                    {creating ? (
                      <div className="w-4 h-4 border border-[#C7FB20] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <ShoppingCartIcon className="w-4 h-4" fill="#C7FB20" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
