"use client";

import { PaymentMethodList } from "./PaymentMethodList";
import { PaymentMethodCreateModal } from "./PaymentMethodCreateModal";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import { useState } from "react";

interface PaymentMethodsTabProps {
  publicJWT: string;
  privateJWT: string;
}

export function PaymentMethodsTab({
  publicJWT,
  privateJWT,
}: PaymentMethodsTabProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { paymentMethods, fetching, fetchPaymentMethods } =
    usePaymentMethods(privateJWT);

  const handlePaymentMethodCreated = () => {
    fetchPaymentMethods();
    setCreateModalOpen(false);
  };

  const handlePaymentMethodCreationError = (error: any) => {
    // TODO: ERROR SNACKBAR
    console.error(error);
    setCreateModalOpen(false);
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
              onClick={() => setCreateModalOpen(true)}
              disabled={!publicJWT}
              className="px-4 py-2 bg-[#bff660] text-[#131316] text-sm font-medium rounded-lg hover:bg-[#b2f63d] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Payment Method
            </button>
            <button
              onClick={fetchPaymentMethods}
              disabled={!privateJWT}
              className="px-3 py-1.5 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Refresh
            </button>
          </div>
        </div>
        {!privateJWT ? (
          <div className="text-center py-8 text-[#a1a1aa]">
            <p className="mb-2">Generate JWTs in the Authentication Tab</p>
            <p className="text-sm">
              Private JWT is required to fetch Payment Methods
            </p>
          </div>
        ) : (
          <PaymentMethodList
            jwt={privateJWT}
            paymentMethods={paymentMethods}
            onRefresh={fetchPaymentMethods}
            fetching={fetching}
          />
        )}
      </div>

      {/* Payment Method Creation Modal */}
      <PaymentMethodCreateModal
        jwt={publicJWT}
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onPaymentMethodCreated={handlePaymentMethodCreated}
        onCreateError={handlePaymentMethodCreationError}
      />
    </>
  );
}
