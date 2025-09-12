"use client";

import React, { useState } from "react";
import { useBtAi } from "@basis-theory-ai/react";
import { BtAiLogo } from "./shared/BtAiLogo";
import { AuthenticationTab } from "./authentication/AuthenticationTab";
import { PaymentMethodsTab } from "./payment-methods/PaymentMethodsTab";
import { PurchaseIntentsTab } from "./purchase-intents/PurchaseIntentsTab";

interface PlaygroundProps {
  initialJWT: string;
}

type Tab = "authentication" | "payment-methods" | "purchase-intents";

export function Playground({ initialJWT }: PlaygroundProps) {
  const [activeTab, setActiveTab] = useState<Tab>("authentication");

  // jwt state
  const [publicJWT, setPublicJWT] = useState(initialJWT);
  const [privateJWT, setPrivateJWT] = useState("");

  const { getStatus, updateJwt } = useBtAi();
  const visaStatus = getStatus().visa;
  const mastercardStatus = getStatus().mastercard;

  const handleJWTsChanged = (publicToken: string, privateToken: string) => {
    setPublicJWT(publicToken);
    setPrivateJWT(privateToken);

    updateJwt(publicToken);
  };

  return (
    <div className="min-h-screen bg-[#050506] text-[#f4f4f5] font-sans">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0D0D0F] backdrop-blur max-h-16">
        <div className="max-w-6xl mx-auto px-6 py-3 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BtAiLogo className="w-28 h-auto" />
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  visaStatus ? "bg-[#B5F200]" : "bg-yellow-500"
                }`}
              ></div>
              <span className="text-xs font-medium text-[#e4e4e7]">
                Visa Authentication SDK {visaStatus ? "Ready" : "Loading"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  mastercardStatus ? "bg-[#B5F200]" : "bg-yellow-500"
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

      {/* Tab Navigation Header */}
      <div className="border-b border-white/10 bg-[#0D0D0F]">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex gap-6 items-center">
            <button
              onClick={() => setActiveTab("authentication")}
              className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-lg ${
                activeTab === "authentication"
                  ? "bg-[#B5F200] text-[#131316]"
                  : "text-[#a1a1aa] hover:text-[#e4e4e7]"
              }`}
            >
              Authentication
            </button>
            <button
              onClick={() => setActiveTab("payment-methods")}
              className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-lg ${
                activeTab === "payment-methods"
                  ? "bg-[#B5F200] text-[#131316]"
                  : "text-[#a1a1aa] hover:text-[#e4e4e7]"
              }`}
            >
              Payment Methods
            </button>
            <button
              onClick={() => setActiveTab("purchase-intents")}
              className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-lg ${
                activeTab === "purchase-intents"
                  ? "bg-[#B5F200] text-[#131316]"
                  : "text-[#a1a1aa] hover:text-[#e4e4e7]"
              }`}
            >
              Purchase Intents
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Tab Content */}
        {activeTab === "authentication" && (
          <AuthenticationTab onJWTsChanged={handleJWTsChanged} />
        )}

        {activeTab === "payment-methods" && (
          <PaymentMethodsTab publicJWT={publicJWT} privateJWT={privateJWT} />
        )}

        {activeTab === "purchase-intents" && (
          <PurchaseIntentsTab privateJWT={privateJWT} />
        )}
      </div>
    </div>
  );
}
