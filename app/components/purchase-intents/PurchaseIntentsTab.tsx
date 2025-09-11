"use client";

import { PurchaseIntentList } from "./PurchaseIntentList";
import { usePurchaseIntents } from "../../hooks/usePurchaseIntents";

interface PurchaseIntentsTabProps {
  privateJWT: string;
  paymentMethods: any[];
  onVerificationStarted: (intentId: string) => void;
  onVerificationCompleted: (intentId: string, result: any) => void;
  onError: (error: string) => void;
}

export function PurchaseIntentsTab({
  privateJWT,
  paymentMethods,
  onVerificationStarted,
  onVerificationCompleted,
  onError,
}: PurchaseIntentsTabProps) {
  const purchaseIntentsHook = usePurchaseIntents(privateJWT);

  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#f4f4f5]">
          Purchase Intents
        </h2>
        <button
          onClick={purchaseIntentsHook.refresh}
          disabled={!privateJWT}
          className="px-3 py-1.5 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Refresh
        </button>
      </div>
      {!privateJWT ? (
        <div className="text-center py-8 text-[#a1a1aa]">
          <p className="mb-2">🔑 Generate JWTs in the Authentication tab first</p>
          <p className="text-sm">Private JWT is needed to fetch purchase intents</p>
        </div>
      ) : (
        <PurchaseIntentList
          purchaseIntents={purchaseIntentsHook.purchaseIntents}
          paymentMethods={paymentMethods}
          onRefresh={purchaseIntentsHook.refresh}
          loading={purchaseIntentsHook.loading}
          onVerificationStarted={onVerificationStarted}
          onVerificationCompleted={onVerificationCompleted}
          onError={onError}
          jwt={privateJWT}
        />
      )}
    </div>
  );
}
