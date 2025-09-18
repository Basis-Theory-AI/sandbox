"use client";

import React, { useState } from "react";

interface CreatePurchaseIntentModalProps {
  paymentMethod: any;
  isOpen: boolean;
  onClose: () => void;
  onPurchaseIntentCreated?: (intent: any) => void;
  onCreateError?: (error: string) => void;
  jwt?: string;
}

interface MandateFormData {
  maxAmount: string;
  currency: string;
  expirationTime: string;
  merchant: string;
  merchantCategory: string;
  merchantCategoryCode: string;
  description: string;
  prompt: string;
  consumer: string;
  consumerEmail: string;
}

export function CreatePurchaseIntentModal({
  paymentMethod,
  isOpen,
  onClose,
  onPurchaseIntentCreated,
  onCreateError,
  jwt,
}: CreatePurchaseIntentModalProps) {
  const [formData, setFormData] = useState<MandateFormData>({
    maxAmount: "329.00",
    currency: "840",
    expirationTime: "2024-12-31T23:59:59Z",
    merchant: "Amazon",
    merchantCategory: "Miscellaneous and Specialty Retail Stores",
    merchantCategoryCode: "5999",
    description: "Purchase of Ray-Ban Meta Glasses, Wayfarer",
    prompt: "I'd like to buy one of those fancy AI glasses with cameras.",
    consumer: "user-123",
    consumerEmail: "user@example.com",
  });

  const [creating, setCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreatePurchaseIntent = async () => {
    setCreating(true);

    try {
      const mandates = [
        {
          type: "maxAmount",
          value: formData.maxAmount,
          details: {
            currency: formData.currency,
          },
        },
        {
          type: "expirationTime",
          value: formData.expirationTime,
        },
        {
          type: "merchant",
          value: formData.merchant,
          details: {
            category: formData.merchantCategory,
            categoryCode: formData.merchantCategoryCode,
          },
        },
        {
          type: "description",
          value: formData.description,
        },
        {
          type: "prompt",
          value: formData.prompt,
        },
        {
          type: "consumer",
          value: formData.consumer,
          details: {
            email: formData.consumerEmail,
          },
        },
      ];

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (jwt) {
        headers["Authorization"] = `Bearer ${jwt}`;
      }

      const response = await fetch("/api/purchase-intents", {
        method: "POST",
        headers,
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          mandates: mandates,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create purchase intent");
      }

      onPurchaseIntentCreated?.(result);
      onClose();
    } catch (error) {
      onCreateError?.(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="border border-white/10 rounded-xl p-6 max-h-[80vh] overflow-y-auto"
        style={{ width: "600px", backgroundColor: "rgba(13, 13, 15, 1)" }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#f4f4f5] mb-1">
            Create Purchase Intent
          </h2>
          <p className="text-base text-[#a1a1aa]">
            Configure Mandates and Create Purchase Intent
          </p>
        </div>

        <div className="space-y-6">
          {/* Amount & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Max Amount
              </label>
              <input
                type="text"
                value={formData.maxAmount}
                onChange={(e) =>
                  setFormData({ ...formData, maxAmount: e.target.value })
                }
                placeholder="329.00"
                className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] font-mono text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Currency Code
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                placeholder="840"
                className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] font-mono text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
              />
            </div>
          </div>

          {/* Expiration */}
          <div>
            <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
              Expiration Time
            </label>
            <input
              type="text"
              value={formData.expirationTime}
              onChange={(e) =>
                setFormData({ ...formData, expirationTime: e.target.value })
              }
              placeholder="2024-12-31T23:59:59Z"
              className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] font-mono text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
            />
          </div>

          {/* Merchant Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Merchant
              </label>
              <input
                type="text"
                value={formData.merchant}
                onChange={(e) =>
                  setFormData({ ...formData, merchant: e.target.value })
                }
                placeholder="Amazon"
                className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.merchantCategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      merchantCategory: e.target.value,
                    })
                  }
                  placeholder="Miscellaneous and Specialty Retail Stores"
                  className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                  Category Code
                </label>
                <input
                  type="text"
                  value={formData.merchantCategoryCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      merchantCategoryCode: e.target.value,
                    })
                  }
                  placeholder="5999"
                  className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] font-mono text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
                />
              </div>
            </div>
          </div>

          {/* Description & Prompt */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Purchase of Ray-Ban Meta Glasses, Wayfarer"
                className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Prompt
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) =>
                  setFormData({ ...formData, prompt: e.target.value })
                }
                placeholder="I'd like to buy one of those fancy AI glasses with cameras."
                rows={3}
                className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8 resize-none"
              />
            </div>
          </div>

          {/* Consumer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Consumer ID
              </label>
              <input
                type="text"
                value={formData.consumer}
                onChange={(e) =>
                  setFormData({ ...formData, consumer: e.target.value })
                }
                placeholder="user-123"
                className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] font-mono text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Consumer Email
              </label>
              <input
                type="email"
                value={formData.consumerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, consumerEmail: e.target.value })
                }
                placeholder="user@example.com"
                className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-8">
          <button
            onClick={handleCreatePurchaseIntent}
            disabled={creating}
            className={`w-full h-10 rounded-lg font-medium font-sans text-sm transition-all duration-200 flex items-center justify-center ${
              creating
                ? "bg-[#B5F200] text-[#131316] opacity-75"
                : "bg-[#B5F200] text-[#131316] hover:bg-[#A3E600] hover:-translate-y-1"
            }`}
          >
            {creating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#131316] border-t-transparent mr-2"></div>
                Creating Purchase Intent...
              </>
            ) : (
              "Create Purchase Intent"
            )}
          </button>

          <button
            onClick={onClose}
            disabled={creating}
            className="w-full h-10 rounded-lg font-medium font-sans text-sm transition-all duration-200 flex items-center justify-center bg-white/10 text-[#e4e4e7] border border-white/20 hover:bg-white/15 hover:border-white/30 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
