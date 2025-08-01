import React, { useState } from 'react'
import { VerificationModal } from './VerificationModal'
import { CardDetailsModal } from './CardDetailsModal'

interface PaymentMethod {
  id: string
  type: string
  card: {
    brand: string
    type: string
    details: {
      bin: string
      last4: string
      expirationYear: number
      expirationMonth: number
    }
    display: {
      artUrl: string
      issuerName?: string
      description: string
      backgroundColor: string
      foregroundColor: string
    }
  }
  credentialTypes: string[]
  createdAt: string
}

interface PurchaseIntent {
  id: string
  paymentMethodId: string
  credentialType: string
  status: string
  createdAt: string
}

interface PurchaseIntentListProps {
  purchaseIntents: PurchaseIntent[]
  paymentMethods: PaymentMethod[]
  onRefresh?: () => void
  loading?: boolean
  onVerificationStarted?: (intentId: string) => void
  onVerificationCompleted?: (intentId: string, result: any) => void
  onError?: (error: string) => void
  jwt?: string
  visaSession?: any
  visaReady?: boolean
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verify':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'verified':
        return 'bg-[#bff660]/10 text-[#bff660] border-[#bff660]/20'
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'pending':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'expired':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-[#71717b]/10 text-[#e4e4e7] border-[#71717b]/20'
    }
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getStatusColor(status)}`}>
      {status.toUpperCase()}
    </span>
  )
}

// Credential type badge
function CredentialTypeBadge({ type }: { type: string }) {
  return (
    <span className="px-2 py-1 text-xs font-mono bg-white/5 text-[#e4e4e7] rounded border border-white/10">
      {type}
    </span>
  )
}

// Brand badge component with proper SVG icons
function BrandBadge({ brand, last4 }: { brand?: string, last4?: string }) {
  if (!brand) return null;
  
  const getBrandStyle = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'mastercard':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'amex':
      case 'american express':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'discover':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  }

  const getBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return (
          <svg width="16" height="10" viewBox="0 0 3384.54 2077.85" xmlns="http://www.w3.org/2000/svg">
            <rect width="3384.54" height="2077.85" rx="150" ry="150" fill="#1434CB"/>
            <path fill="#FFF" d="M1461.26,739.84l-251.37,599.74h-164l-123.7-478.62c-7.51-29.48-14.04-40.28-36.88-52.7  c-37.29-20.23-98.87-39.21-153.05-50.99l3.68-17.43h263.99c33.65,0,63.9,22.4,71.54,61.15l65.33,347.04l161.46-408.2H1461.26z   M2103.84,1143.77c0.66-158.29-218.88-167.01-217.37-237.72c0.47-21.52,20.96-44.4,65.81-50.24c22.23-2.91,83.48-5.13,152.95,26.84  l27.25-127.18c-37.33-13.55-85.36-26.59-145.12-26.59c-153.35,0-261.27,81.52-262.18,198.25c-0.99,86.34,77.03,134.52,135.81,163.21  c60.47,29.38,80.76,48.26,80.53,74.54c-0.43,40.23-48.23,57.99-92.9,58.69c-77.98,1.2-123.23-21.1-159.3-37.87l-28.12,131.39  c36.25,16.63,103.16,31.14,172.53,31.87C1996.72,1348.96,2103.34,1268.45,2103.84,1143.77 M2508.78,1339.58h143.49l-125.25-599.74  h-132.44c-29.78,0-54.9,17.34-66.02,44l-232.81,555.74h162.91L2291,1250h199.05L2508.78,1339.58z M2335.67,1127.08l81.66-225.18  l47,225.18H2335.67z M1682.93,739.84l-128.29,599.74H1399.5l128.34-599.74H1682.93z"/>
          </svg>
        )
      case 'mastercard':
        return (
          <svg width="16" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 131.39 86.9">
            <rect fill="#ff5f00" x="48.37" y="15.14" width="34.66" height="56.61"/>
            <path fill="#eb001b" d="M51.94,43.45a35.94,35.94,0,0,1,13.75-28.3,36,36,0,1,0,0,56.61A35.94,35.94,0,0,1,51.94,43.45Z"/>
            <path fill="#f79e1b" d="M123.94,43.45a36,36,0,0,1-58.25,28.3,36,36,0,0,0,0-56.61,36,36,0,0,1,58.25,28.3Z"/>
          </svg>
        )
      case 'amex':
      case 'american express':
        return '💎'
      case 'discover':
        return '🟠'
      default:
        return '💳'
    }
  }

  const icon = getBrandIcon(brand)

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getBrandStyle(brand)} uppercase flex items-center gap-1`}>
      {typeof icon === 'string' ? <span>{icon}</span> : icon}
      {brand}
      {last4 && <span className="text-[10px] opacity-75">••••{last4}</span>}
    </span>
  )
}

export function PurchaseIntentList({
  purchaseIntents,
  paymentMethods,
  onRefresh,
  loading,
  onVerificationStarted,
  onVerificationCompleted,
  onError,
  jwt,
  visaSession,
  visaReady = false
}: PurchaseIntentListProps) {
  const [verificationModalOpen, setVerificationModalOpen] = React.useState(false)
  const [selectedIntent, setSelectedIntent] = React.useState<PurchaseIntent | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<PaymentMethod | null>(null)
  
  // Card details modal state
  const [cardDetailsModalOpen, setCardDetailsModalOpen] = useState(false)
  const [cardDetails, setCardDetails] = useState<any>(null)
  const [selectedCardIntentId, setSelectedCardIntentId] = useState<string>('')
  const [fetchingCardDetails, setFetchingCardDetails] = useState(false)

  const getPaymentMethodForIntent = (intent: PurchaseIntent): PaymentMethod | null => {
    return paymentMethods.find(pm => pm.id === intent.paymentMethodId) || null
  }

  const handleGetCard = async (intent: PurchaseIntent) => {
    if (intent.status !== 'active') {
      onError?.('Card details are only available for active purchase intents')
      return
    }

    setFetchingCardDetails(true)
    setSelectedCardIntentId(intent.id)

    try {
      console.log('🃏 Fetching card details for intent:', intent.id)
      
      const response = await fetch(`/api/purchase-intents/${intent.id}/details`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch card details')
      }

      if (!data.card) {
        throw new Error('No card details available for this purchase intent')
      }

      console.log('✅ Card details fetched successfully:', {
        intentId: intent.id,
        hasCard: !!data.card,
        cardData: data.card
      })

      setCardDetails(data.card)
      setCardDetailsModalOpen(true)

    } catch (error) {
      console.error('❌ Failed to fetch card details:', error)
      onError?.(error instanceof Error ? error.message : 'Failed to fetch card details')
    } finally {
      setFetchingCardDetails(false)
    }
  }

  const handleVerifyIntent = (intent: PurchaseIntent) => {
    console.log('🔍 Starting verification for intent:', {
      intentId: intent.id,
      paymentMethodId: intent.paymentMethodId,
      credentialType: intent.credentialType
    })

    if (!jwt) {
      onError?.('JWT token is required for verification')
      return
    }

    if (!visaReady) {
      onError?.('Visa Authentication SDK must be ready before verification')
      return
    }

    const paymentMethod = getPaymentMethodForIntent(intent)

    console.log('💳 Payment method lookup result:', {
      intentPaymentMethodId: intent.paymentMethodId,
      foundPaymentMethod: !!paymentMethod,
      paymentMethodData: paymentMethod,
      totalPaymentMethods: paymentMethods.length,
      availablePaymentMethodIds: paymentMethods.map(pm => pm.id)
    })

    if (!paymentMethod) {
      const errorMsg = `Payment method not found for this purchase intent. Looking for ID: ${intent.paymentMethodId}`
      console.error('❌', errorMsg)
      onError?.(errorMsg)
      return
    }

    console.log('✅ Found payment method for verification:', {
      paymentMethodId: paymentMethod.id,
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.details.last4,
      hasAllRequiredFields: !!(paymentMethod.id && paymentMethod.card.brand)
    })

    console.log('🚀 Opening verification modal for intent:', intent.id, 'with payment method:', paymentMethod.id)
    setSelectedIntent(intent)
    setSelectedPaymentMethod(paymentMethod)
    setVerificationModalOpen(true)
    onVerificationStarted?.(intent.id)
  }

  const handleModalClose = () => {
    setVerificationModalOpen(false)
    setSelectedIntent(null)
    setSelectedPaymentMethod(null)
  }

  const handleVerificationSuccess = (result: any) => {
    console.log('🎉 Verification successful:', result)
    onVerificationCompleted?.(selectedIntent?.id || '', result)
    onRefresh?.()
    handleModalClose()
  }

  const handleVerificationError = (error: string) => {
    console.error('❌ Verification failed:', error)
    onError?.(error)
    handleModalClose()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 text-[#a1a1aa]">
          <div className="w-5 h-5 border-2 border-[#a1a1aa] border-t-[#bff660] rounded-full animate-spin"></div>
          <span className="text-sm">Loading purchase intents...</span>
        </div>
      </div>
    )
  }

  if (purchaseIntents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-[#a1a1aa] text-sm mb-3">No purchase intents found</div>
        <button
          onClick={onRefresh}
          className="px-3 py-1.5 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200"
        >
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {purchaseIntents.map((intent) => (
        <div
          key={intent.id}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            {/* Left side - Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="font-mono text-sm text-[#f4f4f5]">
                  {intent.id}
                </div>
                <StatusBadge status={intent.status} />
                <CredentialTypeBadge type={intent.credentialType} />
                {(() => {
                  const paymentMethod = getPaymentMethodForIntent(intent)
                  return paymentMethod ? (
                    <BrandBadge 
                      brand={paymentMethod.card.brand} 
                      last4={paymentMethod.card.details.last4} 
                    />
                  ) : null
                })()}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-[#a1a1aa]">
                <div className="flex items-center gap-1">
                  <span>Payment Method:</span>
                  <span className="font-mono text-[#bff660]">
                    {intent.paymentMethodId}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Created:</span>
                  <span>{new Date(intent.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2 ml-4">
              {intent.status === 'verify' && (
                <button
                  onClick={() => handleVerifyIntent(intent)}
                  disabled={!visaReady}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                    visaReady 
                      ? 'bg-[#bff660] text-[#131316] hover:bg-[#b2f63d] hover:-translate-y-0.5' 
                      : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>🔐</span>
                  <span>Verify</span>
                  {!visaReady && <span className="text-xs ml-1">(SDK Loading...)</span>}
                </button>
              )}
              
              {intent.status === 'verified' && (
                <div className="flex items-center gap-1 text-xs text-[#bff660]">
                  <span>✅</span>
                  <span>Verified</span>  
                </div>
              )}
              
              {intent.status === 'active' && (
                <button
                  onClick={() => handleGetCard(intent)}
                  disabled={fetchingCardDetails && selectedCardIntentId === intent.id}
                  className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>
                    {fetchingCardDetails && selectedCardIntentId === intent.id ? 'Loading...' : 'Get Card'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Verification Modal */}
      {selectedIntent && selectedPaymentMethod && jwt && (
        <VerificationModal
          isOpen={verificationModalOpen}
          onClose={handleModalClose}
          intent={{
            id: selectedIntent.id,
            brand: selectedPaymentMethod.card.brand,
            last4: selectedPaymentMethod.card.details.last4
          }}
          jwt={jwt}
          visaSession={visaSession}
          onSuccess={handleVerificationSuccess}
          onError={handleVerificationError}
        />
      )}

      {/* Card Details Modal */}
      <CardDetailsModal
        isOpen={cardDetailsModalOpen}
        onClose={() => {
          setCardDetailsModalOpen(false)
          setCardDetails(null)
          setSelectedCardIntentId('')
        }}
        cardDetails={cardDetails}
        purchaseIntentId={selectedCardIntentId}
      />
    </div>
  )
} 