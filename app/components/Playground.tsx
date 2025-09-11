"use client";

import React, { useState } from "react";
import { useBasisTheory } from "@basis-theory-ai/react";
import { BasisTheoryLogo } from "./shared/BasisTheoryLogo";
import { AuthenticationTab } from "./authentication/AuthenticationTab";
import { PaymentMethodModal } from "./payment-methods/PaymentMethodModal";
import { PaymentMethodList } from "./payment-methods/PaymentMethodList";
import { PurchaseIntentList } from "./purchase-intents/PurchaseIntentList";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import { usePurchaseIntents } from "../hooks/usePurchaseIntents";

export function Playground() {
  const { getStatus } = useBasisTheory();
  const visaStatus = getStatus().visa;
  const mastercardStatus = getStatus().mastercard;

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "authentication" | "payment-methods" | "purchase-intents"
  >("authentication");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Simple JWT state management
  const [publicJWT, setPublicJWT] = useState(""); // For payment method creation
  const [privateJWT, setPrivateJWT] = useState(""); // For data fetching

  // Use custom hooks for data management
  const paymentMethodsHook = usePaymentMethods(privateJWT);
  const purchaseIntentsHook = usePurchaseIntents(privateJWT);

  const handleJWTsChanged = (publicToken: string, privateToken: string) => {
    setPublicJWT(publicToken);
    setPrivateJWT(privateToken);
  };

  // Handle success messages
  const handlePaymentMethodCreated = (newPaymentMethod: any) => {
    setSuccessMessage("Payment Method Created Successfully!");
    setError(null);
    paymentMethodsHook.refresh();
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handlePurchaseIntentCreated = (newPurchaseIntent: any) => {
    setSuccessMessage("Purchase Intent Created Successfully!");
    setError(null);
    purchaseIntentsHook.refresh();
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleVerificationStarted = (intentId: string) => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleVerificationCompleted = (intentId: string, result: any) => {
    if (result.status === "VERIFIED" || result.status === "ACTIVE") {
      setSuccessMessage(
        `Purchase Intent ${
          result.status === "VERIFIED" ? "Verified" : "Activated"
        } Successfully!`
      );
    } else {
      setSuccessMessage(
        "Verification step completed - check the intent status"
      );
    }

    setError(null);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#131316] text-[#f4f4f5] font-['Inter',sans-serif]">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BasisTheoryLogo className="w-28 h-auto" />
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    visaStatus ? "bg-[#bff660]" : "bg-yellow-500"
                  }`}
                ></div>
                <span className="text-xs font-medium text-[#e4e4e7]">
                  Visa Authentication SDK {visaStatus ? "Ready" : "Loading"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    mastercardStatus ? "bg-[#bff660]" : "bg-yellow-500"
                  }`}
                ></div>
                <span className="text-xs font-medium text-[#e4e4e7]">
                  Mastercard Authentication SDK{" "}
                  {mastercardStatus ? "Ready" : "Loading"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-white/5 backdrop-blur rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab("authentication")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "authentication"
                ? "bg-[#bff660] text-[#131316]"
                : "text-[#a1a1aa] hover:text-[#e4e4e7] hover:bg-white/5"
            }`}
          >
            Authentication
          </button>
          <button
            onClick={() => setActiveTab("payment-methods")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "payment-methods"
                ? "bg-[#bff660] text-[#131316]"
                : "text-[#a1a1aa] hover:text-[#e4e4e7] hover:bg-white/5"
            }`}
          >
            Payment Methods
          </button>
          <button
            onClick={() => setActiveTab("purchase-intents")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "purchase-intents"
                ? "bg-[#bff660] text-[#131316]"
                : "text-[#a1a1aa] hover:text-[#e4e4e7] hover:bg-white/5"
            }`}
          >
            Purchase Intents
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3">
            <span className="text-red-500">❌</span>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-[#bff660]/10 border border-[#bff660]/20 text-[#bff660] rounded-xl flex items-center gap-3">
            <span className="text-[#bff660]">✅</span>
            <span className="text-sm">{successMessage}</span>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "authentication" && (
          <AuthenticationTab onJWTsChanged={handleJWTsChanged} />
        )}

        {activeTab === "payment-methods" && (
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
                onPurchaseIntentCreated={handlePurchaseIntentCreated}
                onError={handleError}
                jwt={privateJWT}
              />
            )}
          </div>
        )}

        {activeTab === "purchase-intents" && (
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
                paymentMethods={paymentMethodsHook.paymentMethods}
                onRefresh={purchaseIntentsHook.refresh}
                loading={purchaseIntentsHook.loading}
                onVerificationStarted={handleVerificationStarted}
                onVerificationCompleted={handleVerificationCompleted}
                onError={handleError}
                jwt={privateJWT}
              />
            )}
          </div>
        )}
      </div>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentMethodCreated={handlePaymentMethodCreated}
        onError={handleError}
        jwt={publicJWT}
      />
    </div>
  );
}
