import React, { useState } from 'react'

interface CardDetails {
  number: string
  expirationMonth: string
  expirationYear: string
  cvc: string
}

interface CardDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  cardDetails: CardDetails | null
  purchaseIntentId: string
}

// Copy to clipboard utility
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

export function CardDetailsModal({ isOpen, onClose, cardDetails, purchaseIntentId }: CardDetailsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!isOpen || !cardDetails) return null

  const handleCopy = (text: string, field: string) => {
    copyToClipboard(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleCopyAll = () => {
    const allDetails = `Card Number: ${cardDetails.number}
Expiration: ${cardDetails.expirationMonth}/${cardDetails.expirationYear}
CVC: ${cardDetails.cvc}`
    copyToClipboard(allDetails)
    setCopiedField('all')
    setTimeout(() => setCopiedField(null), 2000)
  }

  const formatCardNumber = (number: string) => {
    return number.replace(/(.{4})/g, '$1 ').trim()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#131316] border border-white/10 rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#f4f4f5]">Virtual Card Details</h2>
            <p className="text-xs text-[#a1a1aa] font-mono">Intent: {purchaseIntentId.substring(0, 8)}...</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-xs font-medium text-[#a1a1aa] mb-2">Card Number</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-black/30 rounded-lg p-3 font-mono text-sm text-[#bff660] border border-white/10">
                {formatCardNumber(cardDetails.number)}
              </div>
              <button
                onClick={() => handleCopy(cardDetails.number, 'number')}
                className="px-3 py-2 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
              >
                {copiedField === 'number' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-xs font-medium text-[#a1a1aa] mb-2">Expiration Date</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-black/30 rounded-lg p-3 font-mono text-sm text-[#bff660] border border-white/10">
                {cardDetails.expirationMonth}/{cardDetails.expirationYear}
              </div>
              <button
                onClick={() => handleCopy(`${cardDetails.expirationMonth}/${cardDetails.expirationYear}`, 'expiration')}
                className="px-3 py-2 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
              >
                {copiedField === 'expiration' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* CVC */}
          <div>
            <label className="block text-xs font-medium text-[#a1a1aa] mb-2">CVC</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-black/30 rounded-lg p-3 font-mono text-sm text-[#bff660] border border-white/10">
                {cardDetails.cvc}
              </div>
              <button
                onClick={() => handleCopy(cardDetails.cvc, 'cvc')}
                className="px-3 py-2 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
              >
                {copiedField === 'cvc' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={handleCopyAll}
            className="flex-1 px-4 py-2 bg-[#bff660] text-[#131316] text-sm font-medium rounded-lg hover:bg-[#b2f63d] transition-all duration-200 hover:-translate-y-0.5"
          >
            {copiedField === 'all' ? '✓ All Details Copied!' : 'Copy All Details'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 text-[#e4e4e7] text-sm font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200"
          >
            Close
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-xs text-yellow-400 font-medium">Virtual Card</p>
              <p className="text-xs text-yellow-300">This is a temporary virtual card for secure transactions only.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 