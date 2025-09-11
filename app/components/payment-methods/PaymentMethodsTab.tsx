"use client";

import { PaymentMethodList } from "./PaymentMethodList";
import { PaymentMethodModal } from "./PaymentMethodModal";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import { useState } from "react";

interface PaymentMethodsTabProps {
  publicJWT: string;
  privateJWT: string;
  onPurchaseIntentCreated: (intent: any) => void;
  onError: (error: string) => void;
}

export function PaymentMethodsTab({
  publicJWT,
  privateJWT,
  onPurchaseIntentCreated,
  onError,
}: PaymentMethodsTabProps) {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const paymentMethodsHook = usePaymentMethods(privateJWT);

  const handlePaymentMethodCreated = (newPaymentMethod: any) => {
    paymentMethodsHook.refresh();
    setPaymentModalOpen(false);
  };

  return (
    <>
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#f4f4f5]">
            Payment Methods
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentModalOpen(true)}
              disabled={!publicJWT}
              className="px-4 py-2 bg-[#bff660] text-[#131316] text-sm font-medium rounded-lg hover:bg-[#b2f63d] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Payment Method
            </button>
            <button
              onClick={paymentMethodsHook.refresh}
              disabled={!privateJWT}
              className="px-3 py-1.5 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Refresh
            </button>
          </div>
        </div>
        {!privateJWT ? (
          <div className="text-center py-8 text-[#a1a1aa]">
            <p className="mb-2">🔑 Generate JWTs in the Authentication tab first</p>
            <p className="text-sm">Private JWT is needed to fetch payment methods</p>
          </div>
        ) : (
          <PaymentMethodList
            paymentMethods={paymentMethodsHook.paymentMethods}
            onRefresh={paymentMethodsHook.refresh}
            loading={paymentMethodsHook.loading}
            onPurchaseIntentCreated={onPurchaseIntentCreated}
            onError={onError}
            jwt={privateJWT}
          />
        )}
      </div>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentMethodCreated={handlePaymentMethodCreated}
        onError={onError}
        jwt={publicJWT}
      />
    </>
  );
}
