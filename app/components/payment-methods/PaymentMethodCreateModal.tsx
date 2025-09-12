"use client";

import React, { useState } from "react";

interface PaymentMethodCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentMethodCreated?: (paymentMethod: any) => void;
  onError?: (error: string) => void;
  jwt?: string;
}

interface CardFormData {
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cvc: string;
}

// Test card numbers with proper brand SVG icons
const TEST_CARDS = {
  visa: {
    number: '4622943123121270',
    brand: 'Visa',
    icon: (
      <svg width="48" height="48" viewBox="0 0 3384.54 2077.85" xmlns="http://www.w3.org/2000/svg">
        <rect width="3384.54" height="2077.85" rx="150" ry="150" fill="#1434CB"/>
        <path fill="#FFF" d="M1461.26,739.84l-251.37,599.74h-164l-123.7-478.62c-7.51-29.48-14.04-40.28-36.88-52.7  c-37.29-20.23-98.87-39.21-153.05-50.99l3.68-17.43h263.99c33.65,0,63.9,22.4,71.54,61.15l65.33,347.04l161.46-408.2H1461.26z   M2103.84,1143.77c0.66-158.29-218.88-167.01-217.37-237.72c0.47-21.52,20.96-44.4,65.81-50.24c22.23-2.91,83.48-5.13,152.95,26.84  l27.25-127.18c-37.33-13.55-85.36-26.59-145.12-26.59c-153.35,0-261.27,81.52-262.18,198.25c-0.99,86.34,77.03,134.52,135.81,163.21  c60.47,29.38,80.76,48.26,80.53,74.54c-0.43,40.23-48.23,57.99-92.9,58.69c-77.98,1.2-123.23-21.1-159.3-37.87l-28.12,131.39  c36.25,16.63,103.16,31.14,172.53,31.87C1996.72,1348.96,2103.34,1268.45,2103.84,1143.77 M2508.78,1339.58h143.49l-125.25-599.74  h-132.44c-29.78,0-54.9,17.34-66.02,44l-232.81,555.74h162.91L2291,1250h199.05L2508.78,1339.58z M2335.67,1127.08l81.66-225.18  l47,225.18H2335.67z M1682.93,739.84l-128.29,599.74H1399.5l128.34-599.74H1682.93z"/>
      </svg>
    )
  },
  mastercard: {
    number: '5186161910000103',
    brand: 'Mastercard',
    icon: (
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 131.39 86.9">
        <rect fill="#ff5f00" x="48.37" y="15.14" width="34.66" height="56.61"/>
        <path fill="#eb001b" d="M51.94,43.45a35.94,35.94,0,0,1,13.75-28.3a36,36,0,1,0,0,56.61A35.94,35.94,0,0,1,51.94,43.45Z"/>
        <path fill="#f79e1b" d="M123.94,43.45a36,36,0,0,1-58.25,28.3a36,36,0,0,0,0-56.61,36,36,0,0,1,58.25,28.3Z"/>
      </svg>
    )
  },
  amex: {
    number: '370000000000002',
    brand: 'AMEX',
    icon: (
      <svg width="48" height="48" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <polygon fill="#FFFFFF" points="15,16 15,40.9219055 15,66 39.9992676,66 64.9999847,66 64.9999847,41.0007019 64.9999847,16 40.0089722,16 15,16"/>
        <path fill="#006FCF" d="M56.0832977,28.2666931l1.5999908-4.3500061h7.3166962V16H15v50h49.9999847v-7.8999939h-6.9000092 l-2.5499725-2.9833069l-2.6500244,2.9833069H33.2999878V42.2167053h-6.4667053L34.916687,23.916687h7.8665771l1.9000244,4.1499939 V23.916687h9.7667084L56.0832977,28.2666931L56.0832977,28.2666931z M50.5666962,31.1500244l-0.0167084-1.7500305 l0.6667175,1.7500305l3.2499847,8.6832886h3.2332916l3.2667084-8.6832886l0.6332855-1.7333374v10.416626h3.4000092V26.5 h-5.6500092l-2.5666962,6.7667236l-0.6832886,1.8332825l-0.6999969-1.8332825L52.8166962,26.5H47.166687v13.333313h3.4000092 V31.1500244L50.5666962,31.1500244z M43.25,39.833313h3.916687L41.2999878,26.5H36.75l-5.9000244,13.333313h3.8667297 L35.75,37.2666931h6.4667053L43.25,39.833313L43.25,39.833313z M38.3167114,31.0167236l0.6665649-1.6667175l0.6667175,1.6667175 l1.3833008,3.3665771h-4.1000061L38.3167114,31.0167236L38.3167114,31.0167236z M36.0332642,42.2332764v13.2834167H47.166687 v-2.8833923h-7.7333984v-2.3165894h7.5834045v-2.8666992h-7.5834045v-2.333313h7.7333984v-2.8834229H36.0332642 L36.0332642,42.2332764z M59.5499878,55.5166931h4.4167175l-6.2334137-6.6667175l6.2334137-6.6166992h-4.3500061 l-4.0167236,4.3167419l-3.9999847-4.3167419H47.166687l6.2165985,6.6667175l-6.2165985,6.6166992h4.3000031l4.0500031-4.333374 L59.5499878,55.5166931L59.5499878,55.5166931z M61.2332916,48.833313l3.7666931,3.833374v-7.6166687L61.2332916,48.833313 L61.2332916,48.833313z"/>
      </svg>
    )
  },
  discover: {
    number: '6011000000000004',
    brand: 'Discover',
    icon: (
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" fill-rule="nonzero">
        <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none">
          <g transform="scale(5.33333,5.33333)">
            <path d="M45,35c0,2.2 -1.8,4 -4,4h-34c-2.2,0 -4,-1.8 -4,-4v-22c0,-2.2 1.8,-4 4,-4h34c2.2,0 4,1.8 4,4z" fill="#ffffff"></path>
            <path d="M45,35c0,2.2 -1.8,4 -4,4h-25c0,0 23.6,-3.8 29,-15zM22,24c0,1.7 1.3,3 3,3c1.7,0 3,-1.3 3,-3c0,-1.7 -1.3,-3 -3,-3c-1.7,0 -3,1.3 -3,3z" fill="#ff6d00"></path>
            <path d="M11.2,21h1.1v6h-1.1zM17.2,24c0,1.7 1.3,3 3,3c0.5,0 0.9,-0.1 1.4,-0.3v-1.3c-0.4,0.4 -0.8,0.6 -1.4,0.6c-1.1,0 -1.9,-0.8 -1.9,-2c0,-1.1 0.8,-2 1.9,-2c0.5,0 0.9,0.2 1.4,0.6v-1.3c-0.5,-0.2 -0.9,-0.4 -1.4,-0.4c-1.7,0.1 -3,1.5 -3,3.1zM30.6,24.9l-1.6,-3.9h-1.2l2.5,6h0.6l2.5,-6h-1.2zM33.9,27h3.2v-1h-2.1v-1.6h2v-1h-2v-1.4h2.1v-1h-3.2zM41.5,22.8c0,-1.1 -0.7,-1.8 -2,-1.8h-1.7v6h1.1v-2.4h0.1l1.6,2.4h1.4l-1.8,-2.5c0.8,-0.2 1.3,-0.8 1.3,-1.7zM39.2,23.8h-0.3v-1.8h0.3c0.7,0 1.1,0.3 1.1,0.9c0,0.5 -0.3,0.9 -1.1,0.9zM7.7,21h-1.7v6h1.6c2.5,0 3.1,-2.1 3.1,-3c0.1,-1.8 -1.2,-3 -3,-3zM7.4,26h-0.3v-4h0.4c1.5,0 2.1,1 2.1,2c0,0.4 -0.1,2 -2.2,2zM15.3,23.3c-0.7,-0.3 -0.9,-0.4 -0.9,-0.7c0,-0.4 0.4,-0.6 0.8,-0.6c0.3,0 0.6,0.1 0.9,0.5l0.6,-0.8c-0.5,-0.5 -1,-0.7 -1.7,-0.7c-1,0 -1.8,0.7 -1.8,1.7c0,0.8 0.4,1.2 1.4,1.6c0.6,0.2 1.1,0.4 1.1,0.9c0,0.5 -0.4,0.8 -0.9,0.8c-0.5,0 -1,-0.3 -1.2,-0.8l-0.7,0.7c0.5,0.8 1.1,1.1 2,1.1c1.2,0 2,-0.8 2,-1.9c0,-0.9 -0.4,-1.3 -1.6,-1.8z" fill="#000000"></path>
          </g>
        </g>
      </svg>
    )
  }
};

export function PaymentMethodCreateModal({
  isOpen,
  onClose,
  onPaymentMethodCreated,
  onError,
  jwt,
}: PaymentMethodCreateModalProps) {
  const [formData, setFormData] = useState<CardFormData>({
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvc: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<'visa' | 'mastercard' | 'amex' | 'discover' | null>(null);

  if (!isOpen) return null;

  // Auto-fill form with test card data
  const fillTestCard = (brand: 'visa' | 'mastercard' | 'amex' | 'discover') => {
    const testCard = TEST_CARDS[brand];
    setFormData({
      cardNumber: testCard.number,
      expirationMonth: '12',
      expirationYear: '2028',
      cvc: '123'
    });
    setSelectedBrand(brand);
  };

  // Detect card brand from card number
  const detectCardBrand = (cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'discover' | null => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    if (cleanNumber.startsWith('6')) return 'discover';
    return null;
  };

  // Create payment method with brand detection
  const createPaymentMethod = async () => {
    if (!formData.cardNumber || !formData.expirationMonth || !formData.expirationYear || !formData.cvc) {
      onError?.('Please select a test card first');
      return;
    }

    const detectedBrand = detectCardBrand(formData.cardNumber);
    if (!detectedBrand) {
      onError?.('Unable to detect card brand');
      return;
    }

    setLoading(true);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      // Add JWT if provided (should have public role for payment method creation)
      if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
      }
      
      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          expirationMonth: formData.expirationMonth,
          expirationYear: formData.expirationYear,
          cvc: formData.cvc,
          cardBrand: detectedBrand
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment method');
      }

      onPaymentMethodCreated?.(result);
      onClose();
      
      // Reset form
      setFormData({
        cardNumber: '',
        expirationMonth: '',
        expirationYear: '',
        cvc: ''
      });
      setSelectedBrand(null);

    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const detectedBrand = detectCardBrand(formData.cardNumber);
  const hasCardData = formData.cardNumber && formData.expirationMonth && formData.expirationYear && formData.cvc;

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
            <p className="text-[#a1a1aa] text-sm">Select a test card to get started</p>
          </div>

          {/* Test Card Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(TEST_CARDS).map(([key, card]) => (
              <button
                key={key}
                onClick={() => fillTestCard(key as 'visa' | 'mastercard' | 'amex' | 'discover')}
                className={`p-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-1 border ${
                  selectedBrand === key 
                    ? 'bg-[#bff660]/10 border-[#bff660] text-[#bff660]' 
                    : 'bg-white/5 border-white/10 text-[#e4e4e7] hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-center mb-2">{card.icon}</div>
                <div className="text-sm">Test {card.brand}</div>
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
                <label className="block text-sm font-medium text-[#e4e4e7] mb-2">Month</label>
                <input
                  type="text"
                  value={formData.expirationMonth}
                  readOnly
                  placeholder="--"
                  className="w-full px-3 py-3 border border-white/10 rounded-lg bg-white/5 text-[#a1a1aa] cursor-not-allowed font-mono text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#e4e4e7] mb-2">Year</label>
                <input
                  type="text"
                  value={formData.expirationYear}
                  readOnly
                  placeholder="----"
                  className="w-full px-3 py-3 border border-white/10 rounded-lg bg-white/5 text-[#a1a1aa] cursor-not-allowed font-mono text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#e4e4e7] mb-2">CVC</label>
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
              onClick={createPaymentMethod}
              disabled={!hasCardData || loading}
              className={`w-full p-4 rounded-xl font-semibold transition-all duration-200 ${
                hasCardData && detectedBrand
                  ? 'bg-[#bff660] text-[#131316] hover:bg-[#b2f63d] hover:-translate-y-1'
                  : 'bg-white/5 text-[#a1a1aa] border border-white/10 cursor-not-allowed'
              } ${loading ? 'opacity-75' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#131316] border-t-transparent mr-2"></div>
                  Creating Payment Method...
                </div>
              ) : hasCardData && detectedBrand ? (
                <div className="flex items-center justify-center gap-2">
                  {TEST_CARDS[detectedBrand].icon}
                  <span>Create {TEST_CARDS[detectedBrand].brand} Payment Method</span>
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
