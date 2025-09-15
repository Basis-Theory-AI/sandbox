"use client";

import { PurchaseIntentList } from "./PurchaseIntentList";
import { usePurchaseIntents } from "../../hooks/usePurchaseIntents";

interface PurchaseIntentsTabProps {
  privateJWT: string;
}

export function PurchaseIntentsTab({ privateJWT }: PurchaseIntentsTabProps) {
  const { fetchPurchaseIntents, purchaseIntents, fetching } =
    usePurchaseIntents(privateJWT);

  return (
    <>
      {!privateJWT ? (
        <div className="bg-[#0D0D0F] backdrop-blur border border-white/10 rounded-xl p-6">
          <div className="text-center py-8 text-[#a1a1aa]">
            <p className="mb-2">
              Generate JWTs in the Authentication tab first
            </p>
            <p className="text-sm">
              Private JWT is required to fetch Purchase Intents
            </p>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-2xl font-semibold text-[#f4f4f5] mb-2">
                Purchase Intents
              </h1>
              <p className="text-base text-[#a1a1aa]">
                Manage Purchase Intents and Fetch Credentials
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchPurchaseIntents}
                className="px-3 h-8 bg-white/10 text-[#e4e4e7] text-sm font-medium font-sans rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 flex items-center"
              >
                Refresh
              </button>
            </div>
          </div>
          <PurchaseIntentList
            jwt={privateJWT}
            purchaseIntents={purchaseIntents}
            onRefresh={fetchPurchaseIntents}
            loading={fetching}
          />
        </div>
      )}
    </>
  );
}
