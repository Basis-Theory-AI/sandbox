import React, { useState, useEffect } from 'react'
import {
  BasisTheoryProvider,
  useBasisTheory,
  verifyPurchaseIntentWithPasskey,
  visaIframeManager
} from '@basis-theory-ai/react'

// Hardcoded API key for testing (replace with your actual sandbox key)
const HARDCODED_API_KEY = 'key_your-basis-theory-sandbox-api-key-here'

function PurchaseIntentDemo() {
  const { isInitialized, isLoading, initError, getStatus } = useBasisTheory()
  
  // Visa SDK state
  const [visaStatus, setVisaStatus] = useState({
    isReady: false,
    isLoading: true,
    error: null,
    session: null
  })

  // Initialize Visa iframe manager
  useEffect(() => {
    console.log('🚀 Initializing Visa iframe manager...')
    
    try {
      // Initialize the Visa iframe manager
      visaIframeManager.initialize()
      
      // Set up event listeners
      visaIframeManager.addEventListener('sessionReady', (session) => {
        console.log('✅ Visa session ready:', session)
        setVisaStatus({
          isReady: true,
          isLoading: false,
          error: null,
          session: session
        })
      })
      
      visaIframeManager.addEventListener('error', (error) => {
        console.error('❌ Visa error:', error)
        setVisaStatus({
          isReady: false,
          isLoading: false,
          error: error,
          session: null
        })
      })
      
    } catch (error) {
      console.error('❌ Failed to initialize Visa iframe manager:', error)
      setVisaStatus({
        isReady: false,
        isLoading: false,
        error: error,
        session: null
      })
    }
    
    // Cleanup on unmount
    return () => {
      visaIframeManager.cleanup()
    }
  }, [])

  const handleVerifyPurchaseIntent = async () => {
    try {
      console.log('🔄 Starting purchase intent verification with passkey...')
      
      // Get iframe session data
      const iframeData = visaIframeManager.getSession()
      if (!iframeData) {
        throw new Error('Visa session not ready - please wait for initialization')
      }
      
      // Test data (replace with real data in production)
      const projectId = '00000000-0000-0000-0000-000000000000'
      const intentId = 'e8abccae-3876-4325-8706-e37931685d1c'
      
      const result = await verifyPurchaseIntentWithPasskey(
        projectId,
        intentId,
        iframeData,
        { apiKey: HARDCODED_API_KEY }
      )
      
      console.log('✅ Purchase intent verification successful:', result)
      alert(`Success! Status: ${result.status}. Check console for details.`)
      
    } catch (error) {
      console.error('❌ Purchase intent verification failed:', error)
      alert(`Verification failed: ${error.message}`)
    }
  }

  const handleCheckSDKStatus = () => {
    console.log('📊 Current SDK Status:', {
      basisTheory: {
        isInitialized,
        isLoading,
        hasError: !!initError,
        status: getStatus(),
        error: initError?.message || null
      },
      visa: {
        isReady: visaStatus.isReady,
        isLoading: visaStatus.isLoading,
        hasError: !!visaStatus.error,
        hasSession: !!visaStatus.session,
        error: visaStatus.error?.message || null
      }
    })
  }

  // Check if both SDKs are ready for verification
  const isReadyForVerification = isInitialized && visaStatus.isReady

  if (isLoading || visaStatus.isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }} />
        <h3>Loading SDK...</h3>
        <p style={{ color: '#666', textAlign: 'center' }}>
          {isLoading && 'Loading BasisTheory SDK...'}<br/>
          {visaStatus.isLoading && 'Loading Visa SDK...'}
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (initError) {
    return (
      <div style={{
        padding: '40px',
        maxWidth: '600px',
        margin: '40px auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#e74c3c' }}>❌ BasisTheory Initialization Error</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>{initError.message}</p>
        <div style={{
          padding: '20px',
          backgroundColor: '#fff3cd',
          borderRadius: '4px',
          border: '1px solid #ffeeba'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>💡 Quick Fix:</h4>
          <p style={{ margin: 0, color: '#856404' }}>
            Update the <code>HARDCODED_API_KEY</code> in <code>src/App.jsx</code> with your actual BasisTheory sandbox API key.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '40px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>🎯 BasisTheory Integration Test</h1>
        <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>Purchase Intent Verification with Visa Passkey</p>
      </header>

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>🔐 BasisTheory SDK</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <span style={{ fontWeight: '600', color: '#666' }}>SDK Status:</span>
            <span style={{
              color: getStatus() === 'ready' ? '#28a745' : '#ffc107',
              fontWeight: '500'
            }}>
              {getStatus().toUpperCase()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
            <span style={{ fontWeight: '600', color: '#666' }}>Initialized:</span>
            <span style={{
              color: isInitialized ? '#28a745' : '#dc3545',
              fontWeight: '500'
            }}>
              {isInitialized ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>🔐 Visa SDK Status</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <span style={{ fontWeight: '600', color: '#666' }}>Status:</span>
            <span style={{
              color: visaStatus.isReady ? '#28a745' : visaStatus.isLoading ? '#ffc107' : '#dc3545',
              fontWeight: '500'
            }}>
              {visaStatus.isReady ? 'READY' : visaStatus.isLoading ? 'LOADING' : 'ERROR'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <span style={{ fontWeight: '600', color: '#666' }}>Session Ready:</span>
            <span style={{
              color: visaStatus.session ? '#28a745' : '#dc3545',
              fontWeight: '500'
            }}>
              {visaStatus.session ? 'Yes' : 'No'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
            <span style={{ fontWeight: '600', color: '#666' }}>Error:</span>
            <span style={{
              color: visaStatus.error ? '#dc3545' : '#28a745',
              fontWeight: '500'
            }}>
              {visaStatus.error ? 'Yes' : 'None'}
            </span>
          </div>
        </div>
        {visaStatus.error && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#f8d7da',
            borderRadius: '4px',
            border: '1px solid #f5c6cb'
          }}>
            <h5 style={{ margin: '0 0 5px 0', color: '#721c24' }}>Error Details:</h5>
            <p style={{ margin: 0, color: '#721c24', fontSize: '14px' }}>
              {visaStatus.error.message || 'Unknown error occurred'}
            </p>
          </div>
        )}
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>🎯 Actions</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={handleVerifyPurchaseIntent}
            disabled={!isReadyForVerification}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              backgroundColor: isReadyForVerification ? '#007bff' : '#ccc',
              border: 'none',
              borderRadius: '6px',
              cursor: isReadyForVerification ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              opacity: isReadyForVerification ? 1 : 0.6
            }}
            onMouseOver={(e) => {
              if (isReadyForVerification) {
                e.target.style.backgroundColor = '#0056b3'
                e.target.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseOut={(e) => {
              if (isReadyForVerification) {
                e.target.style.backgroundColor = '#007bff'
                e.target.style.transform = 'translateY(0)'
              }
            }}
          >
            🔐 Verify Purchase Intent
          </button>

          <button
            onClick={handleCheckSDKStatus}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              backgroundColor: '#28a745',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#1e7e34'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#28a745'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            🔍 Check SDK Status
          </button>
        </div>
        
        {!isReadyForVerification && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#fff3cd',
            borderRadius: '4px',
            border: '1px solid #ffeeba'
          }}>
            <h5 style={{ margin: '0 0 5px 0', color: '#856404' }}>⏳ Waiting for SDKs:</h5>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
              {!isInitialized && <li>BasisTheory SDK initialization</li>}
              {!visaStatus.isReady && <li>Visa SDK session ready</li>}
            </ul>
          </div>
        )}
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '25px',
        borderRadius: '8px',
        borderLeft: '4px solid #007bff'
      }}>
        <h4 style={{ marginTop: 0, color: '#333' }}>📋 Instructions:</h4>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px', color: '#666' }}>
            Replace the <code>HARDCODED_API_KEY</code> with your actual BasisTheory sandbox API key
          </li>
          <li style={{ marginBottom: '8px', color: '#666' }}>
            Wait for both BasisTheory and Visa SDKs to be ready (status shows READY)
          </li>
          <li style={{ marginBottom: '8px', color: '#666' }}>
            Click "Verify Purchase Intent" to test the passkey authentication flow
          </li>
          <li style={{ marginBottom: '8px', color: '#666' }}>
            Check the browser console (F12) to see detailed logs throughout the process
          </li>
          <li style={{ marginBottom: '8px', color: '#666' }}>
            Use "Check SDK Status" to see detailed information in console
          </li>
        </ol>
      </div>
    </div>
  )
}

function App() {
  return (
    <BasisTheoryProvider
      apiKey={HARDCODED_API_KEY}
      environment="sandbox"
    >
      <PurchaseIntentDemo />
    </BasisTheoryProvider>
  )
}

export default App