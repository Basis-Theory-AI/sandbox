"use client";

import React, { useState } from "react";
import { TEST_CARDS } from "../../shared/constants";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";

interface PaymentMethodCreateModalProps {
  jwt?: string;
  isOpen: boolean;
  onClose: () => void;
  onPaymentMethodCreated?: (paymentMethod: any) => void;
  onCreateError?: (error: string) => void;
}

type CardBrand = "visa" | "mastercard" | "american-express" | "discover";

export function PaymentMethodCreateModal({
  jwt,
  isOpen,
  onClose,
  onPaymentMethodCreated,
  onCreateError,
}: PaymentMethodCreateModalProps) {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    cvc: "",
  });

  const [selectedBrand, setSelectedBrand] = useState<CardBrand | null>(null);
  const { createPaymentMethod, creating } = usePaymentMethods(jwt);

  if (!isOpen) return null;

  // Auto-fill form with test card data
  const fillTestCard = (brand: CardBrand) => {
    const testCard = TEST_CARDS[brand];

    setFormData({
      cardNumber: testCard.number,
      expirationMonth: "12",
      expirationYear: "2028",
      cvc: "123",
    });

    setSelectedBrand(brand);
  };

  // Create payment method using hook
  const handleCreatePaymentMethod = async () => {
    if (!formData.cardNumber) {
      onCreateError?.("Please select a test card first");
      return;
    }

    try {
      const result = await createPaymentMethod(formData);

      onPaymentMethodCreated?.(result);
      onClose();

      // reset form
      setFormData({
        cardNumber: "",
        expirationMonth: "",
        expirationYear: "",
        cvc: "",
      });
      setSelectedBrand(null);
    } catch (error) {
      onCreateError?.(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#131316] border border-white/10 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#f4f4f5]">
            Create Payment Method
          </h2>
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

        {/* Payment Method Creator Content */}
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <p className="text-[#a1a1aa] text-sm">Select a Test Card</p>
          </div>

          {/* Test Card Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(TEST_CARDS).map(([key, card]) => (
              <button
                key={key}
                onClick={() => fillTestCard(key as CardBrand)}
                className={`p-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-1 border ${
                  selectedBrand === key
                    ? "bg-[#B5F200]/10 border-[#B5F200] text-[#B5F200]"
                    : "bg-white/5 border-white/10 text-[#e4e4e7] hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  TODO
                </div>
                <div className="text-sm">Test {key.toUpperCase()}</div>
              </button>
            ))}
          </div>

          {/* Card Form - Read Only */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                readOnly
                placeholder="Select a test card above"
                className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-[#a1a1aa] cursor-not-allowed font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                  Month
                </label>
                <input
                  type="text"
                  value={formData.expirationMonth}
                  readOnly
                  placeholder="--"
                  className="w-full px-3 py-3 border border-white/10 rounded-lg bg-white/5 text-[#a1a1aa] cursor-not-allowed font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={formData.expirationYear}
                  readOnly
                  placeholder="----"
                  className="w-full px-3 py-3 border border-white/10 rounded-lg bg-white/5 text-[#a1a1aa] cursor-not-allowed font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                  CVC
                </label>
                <input
                  type="text"
                  value={formData.cvc}
                  readOnly
                  placeholder="---"
                  className="w-full px-3 py-3 border border-white/10 rounded-lg bg-white/5 text-[#a1a1aa] cursor-not-allowed font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div className="space-y-4">
            <button
              onClick={handleCreatePaymentMethod}
              disabled={creating}
              className={`w-full h-8 rounded-lg font-medium font-sans text-sm transition-all duration-200 flex items-center justify-center ${
                formData.cardNumber
                  ? "bg-[#B5F200] text-[#131316] hover:bg-[#A3E600] hover:-translate-y-1"
                  : "bg-white/5 text-[#a1a1aa] border border-white/10 cursor-not-allowed"
              } ${creating ? "opacity-75" : ""}`}
            >
              {creating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#131316] border-t-transparent mr-2"></div>
                  Creating Payment Method...
                </div>
              ) : formData.cardNumber ? (
                <div className="flex items-center justify-center gap-2">
                  <span>Create Payment Method</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>💳</span>
                  <span>Select Test Card Above</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
