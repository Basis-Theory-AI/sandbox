import React, { useState } from "react";
import { copyToClipboard } from "../../utils";

interface Credential {
  type: "virtual-card" | "network-token";
}

interface CardCredential extends Credential {
  type: "virtual-card";
  number: string;
  expirationMonth: string;
  expirationYear: string;
  cvc: string;
}

interface NetworkTokenCredential extends Credential {
  type: "network-token";
  brand: string;
  tokenData?: any;
  networkToken?: any;
  retrievedAt: string;
  intentId: string;
  credentialType: string;
}

interface PurchaseIntentCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  credential: Credential | null;
  purchaseIntentId: string;
}

export function PurchaseIntentCredentialModal({
  isOpen,
  onClose,
  credential,
  purchaseIntentId,
}: PurchaseIntentCredentialModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !credential) return null;

  const handleCopy = (text: string, field: string) => {
    copyToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#131316] border border-white/10 rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#f4f4f5]">
              {credential.type === "network-token"
                ? "Network Token Details"
                : credential.type === "virtual-card"
                ? "Virtual Card Details"
                : "Unknown Credential"}
            </h2>
            <p className="text-xs text-[#a1a1aa] font-mono">
              Intent: {purchaseIntentId.substring(0, 8)}...
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {credential.type === "network-token" &&
            (() => {
              const tokenDetails = credential as NetworkTokenCredential;
              const tokenData =
                tokenDetails.tokenData || tokenDetails.networkToken;
              return (
                <>
                  {/* Number */}
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                      Number
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/30 rounded-lg p-3 font-mono text-sm text-[#bff660] border border-white/10">
                        {tokenData?.number
                          ? formatCardNumber(tokenData.number)
                          : "N/A"}
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(tokenData?.number || "", "number")
                        }
                        disabled={!tokenData?.number}
                        className="px-3 py-2 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {copiedField === "number" ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Expiration Date */}
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                      Expiration Date
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/30 rounded-lg p-3 font-mono text-sm text-[#bff660] border border-white/10">
                        {tokenData?.expirationMonth && tokenData?.expirationYear
                          ? `${tokenData.expirationMonth}/${tokenData.expirationYear}`
                          : "N/A"}
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(
                            `${tokenData?.expirationMonth || ""}/${
                              tokenData?.expirationYear || ""
                            }`,
                            "expiration"
                          )
                        }
                        disabled={
                          !tokenData?.expirationMonth ||
                          !tokenData?.expirationYear
                        }
                        className="px-3 py-2 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {copiedField === "expiration" ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Cryptogram */}
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                      Cryptogram
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/30 rounded-lg p-3 font-mono text-sm text-[#bff660] border border-white/10">
                        {tokenData?.cryptogram || "N/A"}
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(tokenData?.cryptogram || "", "cryptogram")
                        }
                        disabled={!tokenData?.cryptogram}
                        className="px-3 py-2 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {copiedField === "cryptogram" ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* ECI (when available) */}
                  {tokenData?.eci && (
                    <div>
                      <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                        ECI
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-black/30 rounded-lg p-3 font-mono text-sm text-[#bff660] border border-white/10">
                          {tokenData.eci}
                        </div>
                        <button
                          onClick={() => handleCopy(tokenData.eci, "eci")}
                          className="px-3 py-2 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
                        >
                          {copiedField === "eci" ? "✓" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

          {credential.type === "virtual-card" &&
            (() => {
              const cardInfo = credential as CardCredential;
              return (
                <>
                  {/* Card Number */}
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                      Card Number
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/30 rounded-lg p-3 font-mono text-sm text-[#bff660] border border-white/10">
                        {formatCardNumber(cardInfo.number)}
                      </div>
                      <button
                        onClick={() => handleCopy(cardInfo.number, "number")}
                        className="px-3 py-2 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
                      >
                        {copiedField === "number" ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Expiration Date */}
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                      Expiration Date
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/30 rounded-lg p-3 font-mono text-sm text-[#bff660] border border-white/10">
                        {cardInfo.expirationMonth}/{cardInfo.expirationYear}
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(
                            `${cardInfo.expirationMonth}/${cardInfo.expirationYear}`,
                            "expiration"
                          )
                        }
                        className="px-3 py-2 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
                      >
                        {copiedField === "expiration" ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* CVC */}
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                      CVC
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/30 rounded-lg p-3 font-mono text-sm text-[#bff660] border border-white/10">
                        {cardInfo.cvc}
                      </div>
                      <button
                        onClick={() => handleCopy(cardInfo.cvc, "cvc")}
                        className="px-3 py-2 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
                      >
                        {copiedField === "cvc" ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 text-[#e4e4e7] text-sm font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200"
          >
            Close
          </button>
        </div>

        {/* Security Notice */}
        <div
          className={`mt-4 p-3 rounded-lg ${
            credential.type === "network-token"
              ? "bg-purple-500/10 border border-purple-500/20"
              : credential.type === "virtual-card"
              ? "bg-blue-500/10 border border-blue-500/20"
              : "bg-yellow-500/10 border border-yellow-500/20"
          }`}
        >
          <div className="flex items-start gap-2">
            {credential.type === "network-token" ? (
              <svg
                className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2zM9 7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H9z"
                />
              </svg>
            ) : credential.type === "virtual-card" ? (
              <svg
                className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            ) : (
              <div>Unknown Credential</div>
            )}
            <div>
              <p
                className={`text-xs font-medium ${
                  credential.type === "network-token"
                    ? "text-purple-400"
                    : credential.type === "virtual-card"
                    ? "text-blue-400"
                    : "text-yellow-400"
                }`}
              >
                {credential.type === "network-token"
                  ? "Network Token"
                  : credential.type === "virtual-card"
                  ? "Visa Credentials"
                  : "Virtual Card"}
              </p>
              <p
                className={`text-xs ${
                  credential.type === "network-token"
                    ? "text-purple-300"
                    : credential.type === "virtual-card"
                    ? "text-blue-300"
                    : "text-yellow-300"
                }`}
              >
                {credential.type === "network-token"
                  ? "This is a network token provided directly by the card network for secure transactions."
                  : credential.type === "virtual-card"
                  ? "Tokenized card credentials secured by Visa for transaction processing."
                  : "This is a temporary virtual card for secure transactions only."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
