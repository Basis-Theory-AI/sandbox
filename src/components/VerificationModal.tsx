import React, { useState, useEffect } from 'react'
import { 
  BasisTheoryProvider, 
  useBasisTheory
} from '@basis-theory-ai/react'

type VerificationState = 
  | 'STARTING'           // Initial state
  | 'PROCESSING'         // Processing verification
  | 'SUCCESS'            // Verification complete
  | 'ERROR'              // Verification failed

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  intent: {
    id: string
    brand: string
    last4?: string
  }
  jwt: string
  visaSession?: any
  onSuccess: (result: any) => void
  onError: (error: string) => void
}

export function VerificationModal({ 
  isOpen, 
  onClose, 
  intent, 
  jwt, 
  visaSession,
  onSuccess, 
  onError 
}: VerificationModalProps) {
  const { verifyPurchaseIntent } = useBasisTheory()
  const [state, setState] = useState<VerificationState>('STARTING')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)


  const getBrandStyle = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return {
          gradient: 'from-blue-600 to-blue-800',
          title: 'Visa Verification',
          color: 'blue'
        }
      case 'mastercard':
        return {
          gradient: 'from-red-600 to-orange-600',
          title: 'Mastercard Verification',
          color: 'red'
        }
      default:
        return {
          gradient: 'from-purple-600 to-purple-800',
          title: 'Payment Verification',
          color: 'purple'
        }
    }
  }

  const brandStyle = getBrandStyle(intent.brand)

  const startVerification = async () => {
    console.log('🚀 Starting verification using SDK only...')
    
    if (state !== 'STARTING') {
      console.log('⚠️ Verification already started, skipping...', { currentState: state })
      return
    }

    setState('PROCESSING')
    setProgress(10)
    setError(null)

    try {
      console.log('📋 Verification context:', {
        intentId: intent.id,
        brand: intent.brand,
        last4: intent.last4
      })

      setProgress(50)

      // Use ONLY the SDK method - no custom API calls
      console.log('🔄 Calling verifyPurchaseIntent from SDK...')
      const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '00000000-0000-0000-0000-000000000000' // Fallback project ID
      const result = await verifyPurchaseIntent(projectId, intent.id)
      
      console.log('✅ SDK verification result:', result)
      setProgress(100)

      // Check for successful verification - API returns status: 'SUCCESS' with purchaseIntentStatus
      if (result && (
        result.status === 'SUCCESS' || 
        result.status === 'VERIFIED' || 
        result.purchaseIntentStatus === 'active' ||
        result.purchaseIntentStatus === 'verified'
      )) {
        setState('SUCCESS')
        setTimeout(() => {
          onSuccess(result)
          onClose()
        }, 1500)
      } else {
        console.error('❌ Unexpected verification result structure:', result)
        throw new Error(result?.error || `Verification failed - received status: ${result?.status}, purchaseIntentStatus: ${result?.purchaseIntentStatus}`)
      }

    } catch (error) {
      console.error('❌ Verification failed:', error)
      setState('ERROR')
      setError(error instanceof Error ? error.message : 'Verification failed')
    }
  }

  const handleClose = () => {
    if (state === 'PROCESSING' || state === 'STARTING') {
      return
    }
    onClose()
  }

  const handleRetry = () => {
    console.log('🔄 Retry button clicked, resetting state...')
    setState('STARTING')
    setError(null)
    setProgress(0)
    
    setTimeout(() => {
      startVerification()
    }, 10)
  }

  // Auto-start verification when modal opens
  useEffect(() => {
    if (isOpen && state === 'STARTING') {
      console.log('🔄 Modal opened, starting verification...', {
        isOpen,
        state,
        brand: intent.brand,
        intentId: intent.id
      })
      
      setTimeout(() => {
        startVerification()
      }, 100)
    }
  }, [isOpen, state])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#131316] border border-white/10 rounded-xl p-6 max-w-md w-full">
        {/* Header */}
        <div className={`bg-gradient-to-r ${brandStyle.gradient} rounded-lg p-4 mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{brandStyle.title}</h3>
                <p className="text-blue-100">
                  {intent.brand.toUpperCase()} •••• {intent.last4}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={state === 'PROCESSING' || state === 'STARTING'}
              className="text-white/70 hover:text-white transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-[#a1a1aa] mb-2">
            <span>Progress</span>
            <span>{progress}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${brandStyle.gradient} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          {state === 'STARTING' && (
            <div className="space-y-4">
              <div className="w-12 h-12 border-2 border-[#a1a1aa] border-t-[#bff660] rounded-full animate-spin mx-auto"/>
              <div>
                <h4 className="text-lg font-semibold text-[#f4f4f5] mb-2">Initializing Verification</h4>
                <p className="text-[#a1a1aa] text-sm">Setting up secure authentication...</p>
              </div>
            </div>
          )}

          {state === 'PROCESSING' && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto">
                <svg className="w-16 h-16 text-[#bff660]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="360 12 12" dur="2s" repeatCount="indefinite"/>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[#f4f4f5] mb-2">Verifying Payment</h4>
                <p className="text-[#a1a1aa] text-sm">Please wait while we verify your payment method...</p>
              </div>
            </div>
          )}

          {state === 'SUCCESS' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-2">Verification Successful!</h4>
                <p className="text-[#a1a1aa] text-sm">Your payment method has been verified</p>
              </div>
            </div>
          )}

          {state === 'ERROR' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-2">Verification Failed</h4>
                <p className="text-[#a1a1aa] text-sm mb-4">{error}</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleRetry}
                    className="flex-1 px-4 py-2 bg-[#bff660] text-[#131316] text-sm font-medium rounded-lg hover:bg-[#b2f63d] transition-all duration-200"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-white/10 text-[#e4e4e7] text-sm font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 