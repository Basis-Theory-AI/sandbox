import React from 'react'

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

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[]
  onRefresh?: () => void
  loading?: boolean
  onPurchaseIntentCreated?: (purchaseIntent: any) => void
  onError?: (error: string) => void
}

// Brand badge component with proper SVG icons
function BrandBadge({ brand }: { brand: string }) {
  const getBrandColor = (brand: string) => {
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
        return 'bg-[#71717b]/10 text-[#e4e4e7] border-[#71717b]/20'
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
    <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getBrandColor(brand)} flex items-center gap-1`}>
      {typeof icon === 'string' ? <span>{icon}</span> : icon}
      <span>{brand.toUpperCase()}</span>
    </span>
  )
}

// Card type badge
function CardTypeBadge({ type }: { type: string }) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'debit':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'credit':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
      case 'prepaid':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20'
      default:
        return 'bg-[#71717b]/10 text-[#e4e4e7] border-[#71717b]/20'
    }
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getTypeColor(type)}`}>
      {type.toUpperCase()}
    </span>
  )
}

export function PaymentMethodList({
  paymentMethods,
  onRefresh,
  loading,
  onPurchaseIntentCreated,
  onError
}: PaymentMethodListProps) {
  const [creatingIntentFor, setCreatingIntentFor] = React.useState<string | null>(null)

  const handleCreatePurchaseIntent = async (paymentMethod: PaymentMethod) => {
    setCreatingIntentFor(paymentMethod.id)
    
    try {
      const response = await fetch('/api/purchase-intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          credentialType: 'VISA_SRC',
          mandates: [
            {
              type: 'maxAmount',
              value: '500.00',
              details: {
                currency: '840',
                period: 'monthly'
              }
            },
            {
              type: 'merchantMcc',
              value: '4444',
              details: {
                description: 'BasisTheory AI Demo'
              }
            }
          ]
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create purchase intent')
      }

      console.log('✅ Purchase intent created:', data)
      onPurchaseIntentCreated?.(data)
      
    } catch (error) {
      console.error('❌ Failed to create purchase intent:', error)
      onError?.(error instanceof Error ? error.message : 'Failed to create purchase intent')
    } finally {
      setCreatingIntentFor(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 text-[#a1a1aa]">
          <div className="w-5 h-5 border-2 border-[#a1a1aa] border-t-[#bff660] rounded-full animate-spin"></div>
          <span className="text-sm">Loading payment methods...</span>
        </div>
      </div>
    )
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-[#a1a1aa] text-sm mb-3">No payment methods found</div>
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
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            {/* Left side - Payment method info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <BrandBadge brand={method.card.brand} />
                <CardTypeBadge type={method.card.type} />
                <div className="font-mono text-sm text-[#f4f4f5]">
                  •••• {method.card.details.last4}
                </div>
                <div className="text-sm text-[#bff660] font-medium bg-[#bff660]/10 px-2 py-1 rounded border border-[#bff660]/20">
                  {String(method.card.details.expirationMonth).padStart(2, '0')}/{String(method.card.details.expirationYear).slice(-2)}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-[#a1a1aa]">
                <div className="flex items-center gap-1">
                  <span>ID:</span>
                  <span className="font-mono text-[#bff660]">
                    {method.id}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Credentials:</span>
                  <span>{method.credentialTypes.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Created:</span>
                  <span>{new Date(method.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Issuer info */}
              {method.card.display.issuerName && (
                <div className="mt-1 text-xs text-[#a1a1aa]">
                  <span>Issuer: </span>
                  <span className="text-[#e4e4e7]">{method.card.display.issuerName}</span>
                </div>
              )}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => handleCreatePurchaseIntent(method)}
                disabled={creatingIntentFor === method.id}
                className="px-3 py-1.5 bg-[#bff660] text-[#131316] text-xs font-medium rounded-lg hover:bg-[#b2f63d] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-1"
              >
                {creatingIntentFor === method.id ? (
                  <>
                    <div className="w-3 h-3 border border-[#131316] border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    <span>Create Intent</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 