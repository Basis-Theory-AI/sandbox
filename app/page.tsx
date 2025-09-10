'use client'

import React, { useState, useEffect } from 'react'
import * as BasisTheory from '@basis-theory-ai/react'

const BasisTheoryProvider = BasisTheory.default as any
const { useBasisTheory } = BasisTheory
import { useJWT } from './hooks/useJWT'
import { JWTStatus } from './components/JWTStatus'
import { PaymentMethodCreator } from './components/PaymentMethodCreator'
import { PaymentMethodList } from './components/PaymentMethodList'
import { PurchaseIntentList } from './components/PurchaseIntentList'

// BasisTheory Logo Component
function BasisTheoryLogo({ className = "w-32 h-auto" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 99.766 32.656" overflow="visible">
      <g>
        <g>
          <defs>
            <linearGradient id="basisTheoryGradient" x1="0.9593908893962928" x2="0.040609110603707255" y1="1" y2="0">
              <stop offset="0" stopColor="rgb(178,246,61)" stopOpacity="1"></stop>
              <stop offset="1" stopColor="rgb(146,255,247)" stopOpacity="1"></stop>
            </linearGradient>
          </defs>
          <path d="M 0 22.934 L 0 7.809 C 0 3.496 3.496 0 7.809 0 L 24.009 0 C 25.133 0 26.209 0.458 26.989 1.268 L 31.499 5.95 L 31.634 6.098 C 32.292 6.852 32.655 7.82 32.655 8.821 L 32.655 24.847 C 32.655 29.16 29.159 32.656 24.846 32.656 L 9.721 32.656 C 8.695 32.656 7.705 32.275 6.944 31.586 L 6.794 31.443 L 1.212 25.861 C 0.436 25.085 0 24.032 0 22.934 Z M 4.733 20.87 L 4.733 8.756 C 4.733 6.535 6.534 4.734 8.755 4.733 L 21.608 4.733 C 22.482 4.733 23.318 5.089 23.924 5.718 L 27.024 8.937 L 27.129 9.052 C 27.639 9.636 27.923 10.387 27.923 11.167 L 27.923 23.9 C 27.923 26.122 26.122 27.923 23.9 27.923 L 11.786 27.923 C 10.986 27.923 10.218 27.626 9.628 27.092 L 9.512 26.982 L 5.674 23.143 C 5.071 22.54 4.733 21.722 4.733 20.87 Z M 11.832 18.775 L 13.881 20.824 L 20.824 20.824 L 20.824 13.544 L 19.176 11.832 L 11.832 11.832 Z M 23.19 22.007 C 23.19 22.661 22.66 23.19 22.007 23.19 L 13.85 23.19 C 13.281 23.19 12.733 22.979 12.312 22.597 L 12.23 22.519 L 10.136 20.426 C 9.707 19.996 9.466 19.413 9.466 18.806 L 9.466 10.648 C 9.466 9.994 9.996 9.465 10.649 9.465 L 19.208 9.465 C 19.79 9.465 20.351 9.686 20.776 10.085 L 20.858 10.167 L 22.549 11.922 L 22.624 12.004 C 22.988 12.421 23.19 12.956 23.19 13.512 L 23.19 22.006 Z M 7.1 20.87 C 7.1 21.095 7.19 21.31 7.349 21.47 L 11.187 25.308 L 11.249 25.364 C 11.401 25.489 11.591 25.557 11.787 25.557 L 23.9 25.557 C 24.815 25.557 25.556 24.815 25.556 23.9 L 25.556 11.168 C 25.556 10.977 25.492 10.791 25.373 10.641 L 25.319 10.58 L 22.219 7.36 C 22.059 7.194 21.839 7.1 21.608 7.1 L 8.755 7.1 C 7.841 7.1 7.099 7.842 7.099 8.757 L 7.099 20.871 Z M 2.367 22.934 C 2.367 23.404 2.554 23.855 2.887 24.187 L 8.469 29.77 L 8.533 29.83 C 8.858 30.125 9.282 30.29 9.723 30.29 L 24.847 30.29 C 27.853 30.29 30.29 27.853 30.29 24.847 L 30.29 8.821 C 30.29 8.391 30.134 7.977 29.852 7.655 L 29.795 7.592 L 25.285 2.91 C 24.951 2.563 24.49 2.367 24.009 2.367 L 7.809 2.367 C 4.804 2.368 2.368 4.803 2.367 7.808 L 2.367 22.933 Z" fill="url(#basisTheoryGradient)"></path>
        </g>
        <path d="M 96.626 24.608 L 96.626 9.822 L 99.709 9.822 L 99.709 24.608 Z M 96.569 7.71 L 96.569 4.599 L 99.766 4.599 L 99.766 7.71 Z M 84.581 24.951 C 81.698 24.951 79.415 23.495 79.415 20.498 C 79.415 16.844 82.697 15.588 86.208 15.588 C 87.892 15.588 88.72 15.588 89.947 15.759 L 89.947 15.16 C 89.947 13.048 89.005 11.935 86.465 11.935 C 84.952 11.935 83.468 12.391 83.011 14.075 L 80.356 14.075 C 80.813 11.335 83.04 9.48 86.579 9.48 C 88.519 9.48 90.089 9.965 91.317 11.078 C 92.43 12.048 92.944 13.533 92.944 15.474 L 92.944 21.982 C 92.944 22.524 93.287 22.752 93.744 22.752 C 93.972 22.752 94.343 22.724 94.657 22.639 L 94.657 24.579 C 94.4 24.637 93.687 24.722 92.716 24.722 C 91.203 24.722 90.261 24.408 90.118 23.523 L 89.976 22.639 L 89.947 22.639 C 89.091 23.894 87.178 24.951 84.581 24.951 Z M 85.637 22.753 C 88.263 22.753 89.947 21.097 89.947 18.985 L 89.947 18.043 C 88.805 17.872 87.949 17.786 86.407 17.786 C 84.295 17.786 82.469 18.528 82.469 20.326 C 82.469 21.839 83.668 22.753 85.637 22.753 Z M 64.578 24.779 C 62.238 24.779 60.496 23.837 60.496 20.755 L 60.496 12.277 L 58.156 12.277 L 58.156 9.822 L 60.496 9.822 L 60.496 5.312 L 63.579 5.312 L 63.579 9.822 L 67.375 9.822 L 67.375 12.277 L 63.579 12.277 L 63.579 19.955 C 63.579 21.497 64.292 22.096 65.634 22.096 C 66.176 22.096 66.747 21.982 67.204 21.839 L 67.204 24.409 C 66.349 24.65 65.466 24.774 64.578 24.779 Z M 50.248 24.951 C 47.48 24.951 45.968 23.781 45.054 22.211 L 44.997 22.211 L 44.997 24.608 L 42 24.608 L 42 4 L 45.054 4 L 45.054 12.106 L 45.111 12.106 C 45.939 10.565 47.623 9.48 50.135 9.48 C 54.473 9.48 56.985 13.02 56.985 17.158 C 56.985 21.497 54.245 24.951 50.249 24.951 Z M 49.478 22.411 C 52.361 22.411 53.96 20.041 53.96 17.187 C 53.96 14.532 52.418 11.992 49.478 11.992 C 46.681 11.992 45.025 14.247 45.025 17.187 C 45.025 19.984 46.652 22.41 49.478 22.41 Z" fill="rgb(255,255,255)"></path>
      </g>
    </svg>
  )
}

// Copy to clipboard utility
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

// Enhanced Authentication Tab Component
function AuthenticationTab({ defaultJWT, onJWTUpdate }: { defaultJWT: string, onJWTUpdate?: (publicJWT: string, privateJWT: string) => void }) {
  const [frontendJWT, setFrontendJWT] = useState(defaultJWT)
  const [backendJWT, setBackendJWT] = useState('')
  const [entityId, setEntityId] = useState('user123')
  const [isCreatingFrontend, setIsCreatingFrontend] = useState(false)
  const [isCreatingBackend, setIsCreatingBackend] = useState(false)
  const [copiedFrontend, setCopiedFrontend] = useState(false)
  const [copiedBackend, setCopiedBackend] = useState(false)
  const [isLoadingBackendJWT, setIsLoadingBackendJWT] = useState(true)

  // Initialize with default JWTs
  useEffect(() => {
    setFrontendJWT(defaultJWT)
  }, [defaultJWT])

  // Fetch the existing backend JWT
  useEffect(() => {
    const fetchBackendJWT = async () => {
      try {
        const response = await fetch('/api/auth/backend-jwt')
        const data = await response.json()

        if (response.ok) {
          setBackendJWT(data.jwt)
          // Notify parent when backend JWT is loaded
          if (onJWTUpdate && frontendJWT) {
            onJWTUpdate(frontendJWT, data.jwt)
          }
        } else {
          console.error('Failed to fetch backend JWT:', data.error)
        }
      } catch (error) {
        console.error('Error fetching backend JWT:', error)
      } finally {
        setIsLoadingBackendJWT(false)
      }
    }

    fetchBackendJWT()
  }, [])

  const createJWT = async (roles: string[], isBackend = false) => {
    const setter = isBackend ? setIsCreatingBackend : setIsCreatingFrontend
    setter(true)

    try {
      const endpoint = isBackend ? '/api/auth/backend-jwt' : '/api/auth/jwt'
      const response = await fetch(endpoint, {
        method: isBackend ? 'GET' : 'POST',
        headers: isBackend ? {} : { 'Content-Type': 'application/json' },
        body: isBackend ? undefined : JSON.stringify({
          userId: entityId,
          roles: roles
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create JWT')
      }

      if (isBackend) {
        setBackendJWT(data.jwt)
        // Notify parent of JWT updates (backend JWT has private role)
        if (onJWTUpdate && frontendJWT) {
          onJWTUpdate(frontendJWT, data.jwt)
        }
      } else {
        setFrontendJWT(data.jwt)
        // Notify parent of JWT updates (frontend JWT has public role)
        if (onJWTUpdate && backendJWT) {
          onJWTUpdate(data.jwt, backendJWT)
        }
      }

    } catch (error) {
      console.error('Failed to create JWT:', error)
    } finally {
      setter(false)
    }
  }

  const handleCopy = (jwt: string, isBackend = false) => {
    copyToClipboard(jwt)
    if (isBackend) {
      setCopiedBackend(true)
      setTimeout(() => setCopiedBackend(false), 2000)
    } else {
      setCopiedFrontend(true)
      setTimeout(() => setCopiedFrontend(false), 2000)
    }
  }

  const decodeJWT = (jwt: string) => {
    try {
      const payload = jwt.split('.')[1]
      return JSON.parse(atob(payload))
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Entity ID Input */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-3">Entity Configuration</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#a1a1aa] mb-2">Entity ID</label>
            <input
              type="text"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[#e4e4e7] text-sm font-mono focus:outline-none focus:border-[#bff660] focus:bg-white/8"
              placeholder="user123"
            />
          </div>
        </div>
      </div>

      {/* Frontend JWT */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#f4f4f5]">Frontend JWT (Public Role)</h3>
            <p className="text-xs text-[#a1a1aa]">Used by React SDK and to Create Payment Methods</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => createJWT(['public'])}
              disabled={isCreatingFrontend}
              className="px-3 py-1.5 bg-[#bff660] text-[#131316] text-xs font-medium rounded-lg hover:bg-[#b2f63d] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isCreatingFrontend ? 'Creating...' : 'Create New'}
            </button>
            <button
              onClick={() => handleCopy(frontendJWT)}
              className="px-3 py-1.5 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
            >
              {copiedFrontend ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        {frontendJWT && (
          <>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-[#bff660] overflow-hidden mb-3">
              <div className="break-all">{frontendJWT}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-[#a1a1aa] max-h-32 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{JSON.stringify(decodeJWT(frontendJWT), null, 2)}</pre>
            </div>
          </>
        )}
      </div>

      {/* Backend JWT */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#f4f4f5]">Backend JWT (Private Role)</h3>
            <p className="text-xs text-[#a1a1aa]">Used to Create/Fetch Purchase Intents and Fetch Payment Methods</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => createJWT(['private'], true)}
              disabled={isCreatingBackend}
              className="px-3 py-1.5 bg-[#bff660] text-[#131316] text-xs font-medium rounded-lg hover:bg-[#b2f63d] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isCreatingBackend ? 'Refreshing...' : 'Refresh'}
            </button>
            {backendJWT && (
              <button
                onClick={() => handleCopy(backendJWT, true)}
                className="px-3 py-1.5 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:-translate-y-0.5"
              >
                {copiedBackend ? '✓ Copied!' : 'Copy'}
              </button>
            )}
          </div>
        </div>
        {isLoadingBackendJWT ? (
          <div className="bg-black/30 rounded-lg p-3 text-xs text-[#a1a1aa] text-center flex items-center justify-center gap-2">
            <div className="w-3 h-3 border border-[#a1a1aa] border-t-[#bff660] rounded-full animate-spin"></div>
            Loading backend JWT...
          </div>
        ) : backendJWT ? (
          <>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-[#bff660] overflow-hidden mb-3">
              <div className="break-all">{backendJWT}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-[#a1a1aa] max-h-32 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{JSON.stringify(decodeJWT(backendJWT), null, 2)}</pre>
            </div>
          </>
        ) : (
          <div className="bg-black/30 rounded-lg p-3 text-xs text-[#a1a1aa] text-center">
            Failed to load backend JWT
          </div>
        )}
      </div>
    </div>
  )
}

// Payment Method Modal Component
function PaymentMethodModal({ isOpen, onClose, onPaymentMethodCreated, onError, jwt }: {
  isOpen: boolean
  onClose: () => void
  onPaymentMethodCreated?: (paymentMethod: any) => void
  onError?: (error: string) => void
  jwt?: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#131316] border border-white/10 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#f4f4f5]">Create Payment Method</h2>
          <button
            onClick={onClose}
            className="text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <PaymentMethodCreator
          onPaymentMethodCreated={(pm) => {
            onPaymentMethodCreated?.(pm)
            onClose()
          }}
          onError={onError}
          jwt={jwt}
        />
      </div>
    </div>
  )
}

function AppContent({ jwt }: { jwt: string }) {
  const {
    getVisaStatus,
    getMastercardStatus,
    isMastercardReady,
    mastercardError
  } = useBasisTheory()
  const visaStatus = getVisaStatus()
  const mastercardStatus = getMastercardStatus()

  const [paymentMethods, setPaymentMethods] = useState([])
  const [purchaseIntents, setPurchaseIntents] = useState([])
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false)
  const [loadingPurchaseIntents, setLoadingPurchaseIntents] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'authentication' | 'payment-methods' | 'purchase-intents'>('authentication')
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  // Manage JWTs with different roles
  const [publicJWT, setPublicJWT] = useState(jwt) // For payment method creation (default has public role)
  const [privateJWT, setPrivateJWT] = useState<string | null>(null) // For everything else

  const handleJWTUpdate = (publicToken: string, privateToken: string) => {
    setPublicJWT(publicToken)
    setPrivateJWT(privateToken)
  }

  // Initialize private JWT on mount and then fetch data
  useEffect(() => {
    const initializeAndFetch = async () => {
      try {
        // First, get the private JWT
        const response = await fetch('/api/auth/backend-jwt')
        const data = await response.json()
        if (response.ok) {
          setPrivateJWT(data.jwt)

          // Now fetch data with the private JWT
          // Fetch payment methods with private JWT
          setLoadingPaymentMethods(true)
          try {
            const pmResponse = await fetch('/api/payment-methods', {
              headers: {
                'Authorization': `Bearer ${data.jwt}`
              }
            })
            const pmData = await pmResponse.json()
            if (pmResponse.ok) {
              setPaymentMethods(pmData)
            }
          } catch (err) {
            console.error('Error fetching payment methods:', err)
          } finally {
            setLoadingPaymentMethods(false)
          }

          // Fetch purchase intents with private JWT
          setLoadingPurchaseIntents(true)
          try {
            const piResponse = await fetch('/api/purchase-intents', {
              headers: {
                'Authorization': `Bearer ${data.jwt}`
              }
            })
            const piData = await piResponse.json()
            if (piResponse.ok) {
              setPurchaseIntents(piData)
            }
          } catch (err) {
            console.error('Error fetching purchase intents:', err)
          } finally {
            setLoadingPurchaseIntents(false)
          }
        }
      } catch (error) {
        console.error('Failed to initialize:', error)
      }
    }
    initializeAndFetch()
  }, [])

  // Fetch payment methods (requires private role)
  const fetchPaymentMethods = async () => {
    setLoadingPaymentMethods(true)
    try {
      // Use private JWT for fetching payment methods
      const jwtToUse = privateJWT || jwt
      const response = await fetch('/api/payment-methods', {
        headers: {
          'Authorization': `Bearer ${jwtToUse}`
        }
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch payment methods')
      }

      setPaymentMethods(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoadingPaymentMethods(false)
    }
  }

  // Fetch purchase intents (requires private role)
  const fetchPurchaseIntents = async () => {
    setLoadingPurchaseIntents(true)
    try {
      // Use private JWT for fetching purchase intents
      const jwtToUse = privateJWT || jwt
      const response = await fetch('/api/purchase-intents', {
        headers: {
          'Authorization': `Bearer ${jwtToUse}`
        }
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch purchase intents')
      }

      setPurchaseIntents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoadingPurchaseIntents(false)
    }
  }

  // Data is loaded in the initialization useEffect above

  // Handle success messages
  const handlePaymentMethodCreated = (newPaymentMethod: any) => {
    setSuccessMessage('Payment Method Created Successfully!')
    setError(null)
    fetchPaymentMethods()
    setTimeout(() => setSuccessMessage(null), 5000)
  }

  const handlePurchaseIntentCreated = (newPurchaseIntent: any) => {
    setSuccessMessage('Purchase Intent Created Successfully!')
    setError(null)
    fetchPurchaseIntents()
    setTimeout(() => setSuccessMessage(null), 5000)
  }

  const handleVerificationStarted = (intentId: string) => {
    console.log(`🚀 Starting verification for intent: ${intentId}`)
    setError(null)
    setSuccessMessage(null)
  }

  const handleVerificationCompleted = (intentId: string, result: any) => {
    console.log(`✅ Verification completed for intent: ${intentId}`, result)

    if (result.status === 'VERIFIED' || result.status === 'ACTIVE') {
      setSuccessMessage(`Purchase Intent ${result.status === 'VERIFIED' ? 'Verified' : 'Activated'} Successfully!`)
    } else {
      setSuccessMessage('Verification step completed - check the intent status')
    }

    setError(null)
    setTimeout(() => setSuccessMessage(null), 5000)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setSuccessMessage(null)
  }

  return (
    <div className="min-h-screen bg-[#131316] text-[#f4f4f5] font-['Inter',sans-serif]">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BasisTheoryLogo className="w-28 h-auto" />
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#bff660]"></div>
                <span className="text-xs font-medium text-[#e4e4e7]">Basis Theory Tokenization SDK Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${visaStatus.isReady ? 'bg-[#bff660]' : 'bg-yellow-500'}`}></div>
                <span className="text-xs font-medium text-[#e4e4e7]">
                  Visa Authentication SDK {visaStatus.isReady ? 'Ready' : 'Loading'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-white/5 backdrop-blur rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('authentication')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'authentication'
                ? 'bg-[#bff660] text-[#131316]'
                : 'text-[#a1a1aa] hover:text-[#e4e4e7] hover:bg-white/5'
              }`}
          >
            Authentication
          </button>
          <button
            onClick={() => setActiveTab('payment-methods')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'payment-methods'
                ? 'bg-[#bff660] text-[#131316]'
                : 'text-[#a1a1aa] hover:text-[#e4e4e7] hover:bg-white/5'
              }`}
          >
            Payment Methods
          </button>
          <button
            onClick={() => setActiveTab('purchase-intents')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'purchase-intents'
                ? 'bg-[#bff660] text-[#131316]'
                : 'text-[#a1a1aa] hover:text-[#e4e4e7] hover:bg-white/5'
              }`}
          >
            Purchase Intents
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3">
            <span className="text-red-500">❌</span>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-[#bff660]/10 border border-[#bff660]/20 text-[#bff660] rounded-xl flex items-center gap-3">
            <span className="text-[#bff660]">✅</span>
            <span className="text-sm">{successMessage}</span>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'authentication' && (
          <AuthenticationTab defaultJWT={jwt} onJWTUpdate={handleJWTUpdate} />
        )}

        {activeTab === 'payment-methods' && (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#f4f4f5]">Payment Methods</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="px-4 py-2 bg-[#bff660] text-[#131316] text-sm font-medium rounded-lg hover:bg-[#b2f63d] transition-all duration-200 hover:-translate-y-0.5"
                >
                  Create Payment Method
                </button>
                <button
                  onClick={fetchPaymentMethods}
                  className="px-3 py-1.5 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200"
                >
                  Refresh
                </button>
              </div>
            </div>
            <PaymentMethodList
              paymentMethods={paymentMethods}
              onRefresh={fetchPaymentMethods}
              loading={loadingPaymentMethods}
              onPurchaseIntentCreated={handlePurchaseIntentCreated}
              onError={handleError}
              jwt={privateJWT || jwt}
            />
          </div>
        )}

        {activeTab === 'purchase-intents' && (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#f4f4f5]">Purchase Intents</h2>
              <button
                onClick={fetchPurchaseIntents}
                className="px-3 py-1.5 bg-white/10 text-[#e4e4e7] text-xs font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200"
              >
                Refresh
              </button>
            </div>
            <PurchaseIntentList
              purchaseIntents={purchaseIntents}
              paymentMethods={paymentMethods}
              onRefresh={fetchPurchaseIntents}
              loading={loadingPurchaseIntents}
              onVerificationStarted={handleVerificationStarted}
              onVerificationCompleted={handleVerificationCompleted}
              onError={handleError}
              jwt={privateJWT || jwt}
              visaSession={visaStatus.session}
              visaReady={visaStatus.isReady}
              mastercardStatus={mastercardStatus}
              mastercardReady={isMastercardReady}
              mastercardError={mastercardError}
            />
          </div>
        )}
      </div>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentMethodCreated={handlePaymentMethodCreated}
        onError={handleError}
        jwt={publicJWT}
      />
    </div>
  )
}

function BasisTheoryDemo({ jwt }: { jwt: string }) {
  const {
    isInitialized,
    isLoading,
    initError,
    getStatus,
    getVisaStatus,
    isVisaReady,
    visaSession,
    visaError,
    getMastercardStatus,
    isMastercardReady,
    mastercardError
  } = useBasisTheory()

  // Get Visa status from hook
  const visaStatus = getVisaStatus()

  // Visa is now initialized by the BasisTheoryProvider automatically

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131316] text-[#f4f4f5] font-['Inter',sans-serif]">
        <div className="text-center p-8 bg-white/5 backdrop-blur rounded-xl border border-white/10 max-w-md">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-[#f4f4f5] mb-2">
            BasisTheory Initialization Failed
          </h2>
          <p className="text-[#a1a1aa] mb-4 text-sm">
            {initError.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#bff660] text-[#131316] px-4 py-2 rounded-lg hover:bg-[#b2f63d] transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131316] text-[#f4f4f5] font-['Inter',sans-serif]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#a1a1aa] border-t-[#bff660] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#f4f4f5] mb-2">
            Initializing BasisTheory SDK...
          </h2>
          <p className="text-[#a1a1aa] text-sm">
            Setting up secure payment environment
          </p>
        </div>
      </div>
    )
  }

  return <AppContent jwt={jwt} />
}

export default function Home() {
  const jwtHook = useJWT()
  const { jwt, isLoading, error } = jwtHook

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131316] text-[#f4f4f5] font-['Inter',sans-serif]">
        <div className="text-center p-8">
          <div className="w-10 h-10 border-2 border-[#a1a1aa] border-t-[#bff660] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#f4f4f5] mb-2">
            Generating Authentication Token...
          </h2>
          <p className="text-[#a1a1aa] text-sm">
            Setting up secure session
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131316] text-[#f4f4f5] font-['Inter',sans-serif]">
        <div className="text-center p-8 bg-white/5 backdrop-blur rounded-xl border border-white/10 max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-[#f4f4f5] mb-2">
            Authentication Error
          </h2>
          <p className="text-[#a1a1aa] mb-4 text-sm">
            {error}
          </p>
          <JWTStatus
            {...jwtHook}
            onRefresh={jwtHook.refreshJWT}
          />
        </div>
      </div>
    )
  }

  if (!jwt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131316] text-[#f4f4f5] font-['Inter',sans-serif]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#a1a1aa] border-t-[#bff660] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#f4f4f5] mb-2">
            Setting up Authentication...
          </h2>
          <p className="text-[#a1a1aa] text-sm">
            Generating secure tokens
          </p>
        </div>
      </div>
    )
  }

  return (
    <BasisTheoryProvider
      apiKey={jwt}
      environment="local"
      visa={{
        apiKey: process.env.NEXT_PUBLIC_VISA_API_KEY || '',
        clientAppId: process.env.NEXT_PUBLIC_VISA_CLIENT_APP_ID || '',
        clientName: 'BasisTheory React SDK Demo'
      }}
    // Mastercard is initialized automatically from VITE_ env vars at build time
    >
      <BasisTheoryDemo jwt={jwt} />
    </BasisTheoryProvider>
  )
} 