"use client";

import React, { useState } from "react";
import { TEST_CARDS } from "../../shared/constants";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import { getCardIcon } from "../shared/CardIcons";

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

  // auto-fill form with test card data
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
    if (
      !formData.cardNumber ||
      !formData.expirationMonth ||
      !formData.expirationYear ||
      !formData.cvc
    ) {
      onCreateError?.("Please fill in all card details");
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
      <div
        className="border border-white/10 rounded-xl p-6 max-h-[80vh] overflow-y-auto"
        style={{ width: "600px", backgroundColor: "rgba(13, 13, 15, 1)" }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#f4f4f5] mb-1">
            Create Payment Method
          </h2>
          <p className="text-base text-[#a1a1aa]">
            Select a Test Card or enter card details manually
          </p>
        </div>

        {/* Payment Method Creator Content */}
        <div>
          {/* Test Card Buttons - Vertical Stack */}
          <div className="space-y-3 mb-6">
            {Object.entries(TEST_CARDS).map(([key, card]) => (
              <button
                key={key}
                onClick={() => fillTestCard(key as CardBrand)}
                className={`w-full p-4 rounded-lg border transition-all duration-200 hover:border-white/20 ${
                  selectedBrand === key
                    ? "bg-[#B5F200]/10 border-[#B5F200]"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">{getCardIcon(key)}</div>
                  <div className="flex items-center gap-3 font-mono text-sm text-[#f4f4f5]">
                    <span>•••• {card.number.slice(-4)}</span>
                    <span>12/28</span>
                    <span>123</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-white/10"></div>

          {/* Card Form - Editable */}
          <div className="space-y-4 mt-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => {
                  setFormData({ ...formData, cardNumber: e.target.value });
                  setSelectedBrand(null); // Unselect test card when typing
                }}
                placeholder="4622 9431 2312 1270"
                className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] font-mono text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
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
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      expirationMonth: e.target.value,
                    });
                    setSelectedBrand(null); // Unselect test card when typing
                  }}
                  placeholder="12"
                  className="w-full px-3 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] font-mono text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={formData.expirationYear}
                  onChange={(e) => {
                    setFormData({ ...formData, expirationYear: e.target.value });
                    setSelectedBrand(null); // Unselect test card when typing
                  }}
                  placeholder="2028"
                  className="w-full px-3 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] font-mono text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                  CVC
                </label>
                <input
                  type="text"
                  value={formData.cvc}
                  onChange={(e) => {
                    setFormData({ ...formData, cvc: e.target.value });
                    setSelectedBrand(null); // Unselect test card when typing
                  }}
                  placeholder="123"
                  className="w-full px-3 py-3 border border-white/10 rounded-lg bg-white/5 text-[#f4f4f5] font-mono text-sm focus:outline-none focus:border-[#B5F200] focus:bg-white/8"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCreatePaymentMethod}
              disabled={
                creating ||
                !formData.cardNumber ||
                !formData.expirationMonth ||
                !formData.expirationYear ||
                !formData.cvc
              }
              className={`w-full h-10 rounded-lg font-medium font-sans text-sm transition-all duration-200 flex items-center justify-center ${
                formData.cardNumber &&
                formData.expirationMonth &&
                formData.expirationYear &&
                formData.cvc
                  ? "bg-[#B5F200] text-[#131316] hover:bg-[#A3E600] hover:-translate-y-1"
                  : "bg-white/5 text-[#a1a1aa] border border-white/10 cursor-not-allowed"
              } ${creating ? "opacity-75" : ""}`}
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#131316] border-t-transparent mr-2"></div>
                  Creating Payment Method...
                </>
              ) : (
                "Create Payment Method"
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
    </div>
  );
}
