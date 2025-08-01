import React, { useState } from 'react'

interface PaymentMethodCreatorProps {
  onPaymentMethodCreated?: (paymentMethod: any) => void
  onError?: (error: string) => void
}

interface CardFormData {
  cardNumber: string
  expirationMonth: string
  expirationYear: string
  cvc: string
}

// Test card numbers with proper Visa/Mastercard SVG icons
const TEST_CARDS = {
  visa: {
    number: '4622943123121270',
    brand: 'Visa',
    icon: (
      <svg width="20" height="12" viewBox="0 0 3384.54 2077.85" xmlns="http://www.w3.org/2000/svg">
        <rect width="3384.54" height="2077.85" rx="150" ry="150" fill="#1434CB"/>
        <path fill="#FFF" d="M1461.26,739.84l-251.37,599.74h-164l-123.7-478.62c-7.51-29.48-14.04-40.28-36.88-52.7  c-37.29-20.23-98.87-39.21-153.05-50.99l3.68-17.43h263.99c33.65,0,63.9,22.4,71.54,61.15l65.33,347.04l161.46-408.2H1461.26z   M2103.84,1143.77c0.66-158.29-218.88-167.01-217.37-237.72c0.47-21.52,20.96-44.4,65.81-50.24c22.23-2.91,83.48-5.13,152.95,26.84  l27.25-127.18c-37.33-13.55-85.36-26.59-145.12-26.59c-153.35,0-261.27,81.52-262.18,198.25c-0.99,86.34,77.03,134.52,135.81,163.21  c60.47,29.38,80.76,48.26,80.53,74.54c-0.43,40.23-48.23,57.99-92.9,58.69c-77.98,1.2-123.23-21.1-159.3-37.87l-28.12,131.39  c36.25,16.63,103.16,31.14,172.53,31.87C1996.72,1348.96,2103.34,1268.45,2103.84,1143.77 M2508.78,1339.58h143.49l-125.25-599.74  h-132.44c-29.78,0-54.9,17.34-66.02,44l-232.81,555.74h162.91L2291,1250h199.05L2508.78,1339.58z M2335.67,1127.08l81.66-225.18  l47,225.18H2335.67z M1682.93,739.84l-128.29,599.74H1399.5l128.34-599.74H1682.93z"/>
      </svg>
    )
  },
  mastercard: {
    number: '5120350110725465',
    brand: 'Mastercard',
    icon: (
      <svg width="20" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 131.39 86.9">
        <rect fill="#ff5f00" x="48.37" y="15.14" width="34.66" height="56.61"/>
        <path fill="#eb001b" d="M51.94,43.45a35.94,35.94,0,0,1,13.75-28.3a36,36,0,1,0,0,56.61A35.94,35.94,0,0,1,51.94,43.45Z"/>
        <path fill="#f79e1b" d="M123.94,43.45a36,36,0,0,1-58.25,28.3a36,36,0,0,0,0-56.61,36,36,0,0,1,58.25,28.3Z"/>
      </svg>
    )
  }
}

export function PaymentMethodCreator({ onPaymentMethodCreated, onError }: PaymentMethodCreatorProps) {
  const [formData, setFormData] = useState<CardFormData>({
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvc: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<'visa' | 'mastercard' | null>(null)

  // Auto-fill form with test card data
  const fillTestCard = (brand: 'visa' | 'mastercard') => {
    const testCard = TEST_CARDS[brand]
    setFormData({
      cardNumber: testCard.number,
      expirationMonth: '12',
      expirationYear: '2028',
      cvc: '123'
    })
    setSelectedBrand(brand)
  }

  // Detect card brand from card number
  const detectCardBrand = (cardNumber: string): 'visa' | 'mastercard' | null => {
    const cleanNumber = cardNumber.replace(/\s/g, '')
    if (cleanNumber.startsWith('4')) return 'visa'
    if (cleanNumber.startsWith('5')) return 'mastercard'
    return null
  }

  // Create payment method with brand detection
  const createPaymentMethod = async () => {
    if (!formData.cardNumber || !formData.expirationMonth || !formData.expirationYear || !formData.cvc) {
      onError?.('Please select a test card first')
      return
    }

    const detectedBrand = detectCardBrand(formData.cardNumber)
    if (!detectedBrand) {
      onError?.('Unable to detect card brand')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          expirationMonth: formData.expirationMonth,
          expirationYear: formData.expirationYear,
          cvc: formData.cvc,
          cardBrand: detectedBrand
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment method')
      }

      onPaymentMethodCreated?.(result)
      
      // Reset form
      setFormData({
        cardNumber: '',
        expirationMonth: '',
        expirationYear: '',
        cvc: ''
      })
      setSelectedBrand(null)

    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const detectedBrand = detectCardBrand(formData.cardNumber)
  const hasCardData = formData.cardNumber && formData.expirationMonth && formData.expirationYear && formData.cvc

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <p className="text-[#a1a1aa] text-sm">Select a test card to get started</p>
      </div>

      {/* Test Card Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries(TEST_CARDS).map(([key, card]) => (
          <button
            key={key}
            onClick={() => fillTestCard(key as 'visa' | 'mastercard')}
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
  )
} 