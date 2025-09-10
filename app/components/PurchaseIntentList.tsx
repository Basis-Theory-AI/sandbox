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
  mastercardStatus?: any
  mastercardReady?: boolean
  mastercardError?: Error | null
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
      case 'american-express':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20'
      case 'discover':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  }

  const getBrandIcon = (brand: string) => {
    console.log('💳 Brand icon:', brand)
    switch (brand.toLowerCase()) {
      case 'visa':
        return (
          <svg width="16" height="16" viewBox="0 0 3384.54 2077.85" xmlns="http://www.w3.org/2000/svg">
            <rect width="3384.54" height="2077.85" rx="150" ry="150" fill="#1434CB" />
            <path fill="#FFF" d="M1461.26,739.84l-251.37,599.74h-164l-123.7-478.62c-7.51-29.48-14.04-40.28-36.88-52.7  c-37.29-20.23-98.87-39.21-153.05-50.99l3.68-17.43h263.99c33.65,0,63.9,22.4,71.54,61.15l65.33,347.04l161.46-408.2H1461.26z   M2103.84,1143.77c0.66-158.29-218.88-167.01-217.37-237.72c0.47-21.52,20.96-44.4,65.81-50.24c22.23-2.91,83.48-5.13,152.95,26.84  l27.25-127.18c-37.33-13.55-85.36-26.59-145.12-26.59c-153.35,0-261.27,81.52-262.18,198.25c-0.99,86.34,77.03,134.52,135.81,163.21  c60.47,29.38,80.76,48.26,80.53,74.54c-0.43,40.23-48.23,57.99-92.9,58.69c-77.98,1.2-123.23-21.1-159.3-37.87l-28.12,131.39  c36.25,16.63,103.16,31.14,172.53,31.87C1996.72,1348.96,2103.34,1268.45,2103.84,1143.77 M2508.78,1339.58h143.49l-125.25-599.74  h-132.44c-29.78,0-54.9,17.34-66.02,44l-232.81,555.74h162.91L2291,1250h199.05L2508.78,1339.58z M2335.67,1127.08l81.66-225.18  l47,225.18H2335.67z M1682.93,739.84l-128.29,599.74H1399.5l128.34-599.74H1682.93z" />
          </svg>
        )
      case 'mastercard':
        return (
          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 131.39 86.9">
            <rect fill="#ff5f00" x="48.37" y="15.14" width="34.66" height="56.61" />
            <path fill="#eb001b" d="M51.94,43.45a35.94,35.94,0,0,1,13.75-28.3,36,36,0,1,0,0,56.61A35.94,35.94,0,0,1,51.94,43.45Z" />
            <path fill="#f79e1b" d="M123.94,43.45a36,36,0,0,1-58.25,28.3,36,36,0,0,0,0-56.61,36,36,0,0,1,58.25,28.3Z" />
          </svg>
        )
      case 'amex':
      case 'american-express':
        return (
          <svg width="16" height="16" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <polygon fill="#FFFFFF" points="15,16 15,40.9219055 15,66 39.9992676,66 64.9999847,66 64.9999847,41.0007019 64.9999847,16 40.0089722,16 15,16" />
            <path fill="#006FCF" d="M56.0832977,28.2666931l1.5999908-4.3500061h7.3166962V16H15v50h49.9999847v-7.8999939h-6.9000092 l-2.5499725-2.9833069l-2.6500244,2.9833069H33.2999878V42.2167053h-6.4667053L34.916687,23.916687h7.8665771l1.9000244,4.1499939 V23.916687h9.7667084L56.0832977,28.2666931L56.0832977,28.2666931z M50.5666962,31.1500244l-0.0167084-1.7500305 l0.6667175,1.7500305l3.2499847,8.6832886h3.2332916l3.2667084-8.6832886l0.6332855-1.7333374v10.416626h3.4000092V26.5 h-5.6500092l-2.5666962,6.7667236l-0.6832886,1.8332825l-0.6999969-1.8332825L52.8166962,26.5H47.166687v13.333313h3.4000092 V31.1500244L50.5666962,31.1500244z M43.25,39.833313h3.916687L41.2999878,26.5H36.75l-5.9000244,13.333313h3.8667297 L35.75,37.2666931h6.4667053L43.25,39.833313L43.25,39.833313z M38.3167114,31.0167236l0.6665649-1.6667175l0.6667175,1.6667175 l1.3833008,3.3665771h-4.1000061L38.3167114,31.0167236L38.3167114,31.0167236z M36.0332642,42.2332764v13.2834167H47.166687 v-2.8833923h-7.7333984v-2.3165894h7.5834045v-2.8666992h-7.5834045v-2.333313h7.7333984v-2.8834229H36.0332642 L36.0332642,42.2332764z M59.5499878,55.5166931h4.4167175l-6.2334137-6.6667175l6.2334137-6.6166992h-4.3500061 l-4.0167236,4.3167419l-3.9999847-4.3167419H47.166687l6.2165985,6.6667175l-6.2165985,6.6166992h4.3000031l4.0500031-4.333374 L59.5499878,55.5166931L59.5499878,55.5166931z M61.2332916,48.833313l3.7666931,3.833374v-7.6166687L61.2332916,48.833313 L61.2332916,48.833313z" />
          </svg>
        )
      case 'discover':
        return (
          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" fill-rule="nonzero">
            <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none">
              <g transform="scale(5.33333,5.33333)">
                <path d="M45,35c0,2.2 -1.8,4 -4,4h-34c-2.2,0 -4,-1.8 -4,-4v-22c0,-2.2 1.8,-4 4,-4h34c2.2,0 4,1.8 4,4z" fill="#ffffff"></path>
                <path d="M45,35c0,2.2 -1.8,4 -4,4h-25c0,0 23.6,-3.8 29,-15zM22,24c0,1.7 1.3,3 3,3c1.7,0 3,-1.3 3,-3c0,-1.7 -1.3,-3 -3,-3c-1.7,0 -3,1.3 -3,3z" fill="#ff6d00"></path>
                <path d="M11.2,21h1.1v6h-1.1zM17.2,24c0,1.7 1.3,3 3,3c0.5,0 0.9,-0.1 1.4,-0.3v-1.3c-0.4,0.4 -0.8,0.6 -1.4,0.6c-1.1,0 -1.9,-0.8 -1.9,-2c0,-1.1 0.8,-2 1.9,-2c0.5,0 0.9,0.2 1.4,0.6v-1.3c-0.5,-0.2 -0.9,-0.4 -1.4,-0.4c-1.7,0.1 -3,1.5 -3,3.1zM30.6,24.9l-1.6,-3.9h-1.2l2.5,6h0.6l2.5,-6h-1.2zM33.9,27h3.2v-1h-2.1v-1.6h2v-1h-2v-1.4h2.1v-1h-3.2zM41.5,22.8c0,-1.1 -0.7,-1.8 -2,-1.8h-1.7v6h1.1v-2.4h0.1l1.6,2.4h1.4l-1.8,-2.5c0.8,-0.2 1.3,-0.8 1.3,-1.7zM39.2,23.8h-0.3v-1.8h0.3c0.7,0 1.1,0.3 1.1,0.9c0,0.5 -0.3,0.9 -1.1,0.9zM7.7,21h-1.7v6h1.6c2.5,0 3.1,-2.1 3.1,-3c0.1,-1.8 -1.2,-3 -3,-3zM7.4,26h-0.3v-4h0.4c1.5,0 2.1,1 2.1,2c0,0.4 -0.1,2 -2.2,2zM15.3,23.3c-0.7,-0.3 -0.9,-0.4 -0.9,-0.7c0,-0.4 0.4,-0.6 0.8,-0.6c0.3,0 0.6,0.1 0.9,0.5l0.6,-0.8c-0.5,-0.5 -1,-0.7 -1.7,-0.7c-1,0 -1.8,0.7 -1.8,1.7c0,0.8 0.4,1.2 1.4,1.6c0.6,0.2 1.1,0.4 1.1,0.9c0,0.5 -0.4,0.8 -0.9,0.8c-0.5,0 -1,-0.3 -1.2,-0.8l-0.7,0.7c0.5,0.8 1.1,1.1 2,1.1c1.2,0 2,-0.8 2,-1.9c0,-0.9 -0.4,-1.3 -1.6,-1.8z" fill="#000000"></path>
              </g>
            </g>
          </svg>
        )
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
    const paymentMethod = getPaymentMethodForIntent(intent)
    const cardBrand = paymentMethod?.card?.brand?.toLowerCase()

    // Check if card details are available for this intent type
    if (!cardBrand || !['mastercard', 'visa'].includes(cardBrand)) {
      onError?.('Card details are not available for this payment method type')
      return
    }

    if (intent.status !== 'active') {
      onError?.('Card details are only available for active purchase intents')
      return
    }

    setFetchingCardDetails(true)
    setSelectedCardIntentId(intent.id)

    try {
      console.log('🃏 Fetching card details for intent:', intent.id, 'Brand:', cardBrand)

      const headers: HeadersInit = {}

      // Add JWT if provided (should have private role for fetching purchase intent details)
      if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`
      }

      // Use unified /details endpoint for both card types
      const response = await fetch(`/api/purchase-intents/${intent.id}/details`, { headers })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch card details')
      }

      console.log('✅ Card details fetched successfully:', {
        intentId: intent.id,
        cardBrand: cardBrand,
        hasCard: !!data.card,
        hasCredentials: !!data.credentials
      })

      // Handle both response formats
      if (cardBrand === 'mastercard' && data.card) {
        // Mastercard virtual card format
        setCardDetails(data.card)
        setCardDetailsModalOpen(true)

      } else if (cardBrand === 'visa' && data.credentials) {
        // Visa credentials format - convert to card format for the modal
        const cardFromCredentials = {
          type: 'visa-credentials',
          token: data.credentials.tokenizedCard?.token,
          last4: data.credentials.tokenizedCard?.last4,
          expirationDate: data.credentials.tokenizedCard?.expirationDate,
          transactionData: data.credentials.transactionData,
          retrievedAt: data.credentials.retrievedAt,
          correlationId: data.credentials.correlationId
        }

        setCardDetails(cardFromCredentials)
        setCardDetailsModalOpen(true)

      } else {
        // Neither card nor credentials available
        throw new Error(`No card details available for this ${cardBrand} purchase intent`)
      }

    } catch (error) {
      console.error('❌ Failed to fetch card details:', error)
      onError?.(error instanceof Error ? error.message : 'Failed to fetch card details')
    } finally {
      setFetchingCardDetails(false)
    }
  }

  const handleGetToken = async (intent: PurchaseIntent) => {
    const paymentMethod = getPaymentMethodForIntent(intent)
    const cardBrand = paymentMethod?.card?.brand?.toLowerCase()

    // Check if network token is available for this intent type
    if (!cardBrand || !['amex', 'american-express', 'discover'].includes(cardBrand)) {
      onError?.('Network token is not available for this payment method type')
      return
    }

    if (intent.credentialType !== 'network-token') {
      onError?.('Network token is only available for network-token credential type')
      return
    }

    if (intent.status !== 'active') {
      onError?.('Network token is only available for active purchase intents')
      return
    }

    setFetchingCardDetails(true)
    setSelectedCardIntentId(intent.id)

    try {
      console.log('🪙 Fetching network token for intent:', intent.id, 'Brand:', cardBrand)

      const headers: HeadersInit = {}

      // Add JWT if provided (should have private role for fetching purchase intent details)
      if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`
      }

      // Use unified /details endpoint for network tokens
      const response = await fetch(`/api/purchase-intents/${intent.id}/details`, { headers })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch network token')
      }

      console.log('✅ Network token fetched successfully:', {
        intentId: intent.id,
        cardBrand: cardBrand,
        credentialType: intent.credentialType,
        hasToken: !!data.token,
        hasTokenData: !!data.tokenData,
        hasNetworkToken: !!data.networkToken
      })

      // Handle network token response format - check for 'token' field first, then fallbacks
      if (data.token || data.tokenData || data.networkToken) {
        // Network token format - convert to format the modal can display
        const networkTokenDetails = {
          type: 'network-token',
          brand: cardBrand,
          tokenData: data.token || data.tokenData || data.networkToken, // 'token' field is the primary one
          networkToken: data.networkToken,
          retrievedAt: new Date().toISOString(),
          intentId: intent.id,
          credentialType: intent.credentialType
        }

        setCardDetails(networkTokenDetails)
        setCardDetailsModalOpen(true)

      } else {
        // No network token data available
        throw new Error(`No network token data available for this ${cardBrand} purchase intent`)
      }

    } catch (error) {
      console.error('❌ Failed to fetch network token:', error)
      onError?.(error instanceof Error ? error.message : 'Failed to fetch network token')
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
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${visaReady
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

              {(() => {
                const paymentMethod = getPaymentMethodForIntent(intent)
                const cardBrand = paymentMethod?.card?.brand?.toLowerCase()
                const showGetCardButton =
                  cardBrand && ['mastercard', 'visa'].includes(cardBrand) && intent.status === 'active'
                const showGetTokenButton =
                  cardBrand && ['amex', 'american-express', 'discover'].includes(cardBrand) &&
                  intent.credentialType === 'network-token' && intent.status === 'active'

                if (showGetCardButton) {
                  return (
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
                  )
                } else if (showGetTokenButton) {
                  return (
                    <button
                      onClick={() => handleGetToken(intent)}
                      disabled={fetchingCardDetails && selectedCardIntentId === intent.id}
                      className="px-3 py-1.5 bg-purple-500 text-white text-xs font-medium rounded-lg hover:bg-purple-600 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2zM9 7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H9z" />
                      </svg>
                      <span>
                        {fetchingCardDetails && selectedCardIntentId === intent.id ? 'Loading...' : 'Get Token'}
                      </span>
                    </button>
                  )
                }

                return null
              })()}
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