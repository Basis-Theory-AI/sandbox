"use client";

import { PaymentMethodList } from "./PaymentMethodList";
import { PaymentMethodCreateModal } from "./PaymentMethodCreateModal";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import { useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";

interface PaymentMethodsTabProps {
  publicJWT: string;
  privateJWT: string;
  onPurchaseIntentCreated?: (intent: any) => void;
  onError?: (error: string) => void;
}

export function PaymentMethodsTab({
  publicJWT,
  privateJWT,
  onPurchaseIntentCreated,
  onError,
}: PaymentMethodsTabProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const {
    paymentMethods,
    fetching,
    fetchPaymentMethods,
    pagination,
    currentPage,
    pageSize,
    goToPage,
    changePageSize,
  } = usePaymentMethods(privateJWT);
  const { showSuccess, showError } = useSnackbar();

  const handlePaymentMethodCreated = () => {
    showSuccess("Payment Method Created", "Payment method created successfully.");
    fetchPaymentMethods();
    setCreateModalOpen(false);
  };

  const handlePaymentMethodCreationError = (error: any) => {
    showError("Payment Method Creation Failed", error.message || error);
    setCreateModalOpen(false);
  };

  return (
    <>
      {!privateJWT ? (
        <div className="bg-[#0D0D0F] backdrop-blur border border-white/10 rounded-xl p-6">
          <div className="text-center py-8 text-[#a1a1aa]">
            <p className="mb-2">Generate JWTs in the Authentication Tab</p>
            <p className="text-sm">
              Private JWT is required to fetch Payment Methods
            </p>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-2xl font-semibold text-[#f4f4f5] mb-2">
                Payment Methods
              </h1>
              <p className="text-base text-[#a1a1aa]">
                Manage and Create Payment Methods
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCreateModalOpen(true)}
                disabled={!publicJWT}
                className="px-4 h-8 bg-[#B5F200] text-[#131316] text-sm font-medium font-sans rounded-lg hover:bg-[#A3E600] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                + Create
              </button>
              <button
                onClick={fetchPaymentMethods}
                className="px-3 h-8 bg-white/10 text-[#e4e4e7] text-sm font-medium font-sans rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 flex items-center"
              >
                Refresh
              </button>
            </div>
          </div>

          <PaymentMethodList
            jwt={privateJWT}
            paymentMethods={paymentMethods}
            onRefresh={fetchPaymentMethods}
            fetching={fetching}
            onPurchaseIntentCreated={onPurchaseIntentCreated}
            onError={onError}
            pagination={pagination}
            onPageChange={goToPage}
            onPageSizeChange={changePageSize}
          />
        </div>
      )}

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
