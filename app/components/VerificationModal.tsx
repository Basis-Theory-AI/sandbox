import React, { useState, useEffect, useRef, useCallback } from 'react'
import { 
  useBasisTheory
} from '@basis-theory-ai/react'

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
  const verificationStartedRef = useRef(false)

  const startVerification = useCallback(async () => {
    try {
      const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '00000000-0000-0000-0000-000000000000';
      
      // Call SDK method - this will show the unified modal automatically
      const result = await verifyPurchaseIntent(projectId, intent.id);
      
      // SDK handles everything internally, we just close this trigger modal
      onSuccess(result);
      onClose();
      
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Verification failed');
      onClose();
    }
  }, [verifyPurchaseIntent, intent.id, onSuccess, onClose, onError]);

  // Start verification when modal opens
  useEffect(() => {
    if (isOpen && !verificationStartedRef.current) {
      verificationStartedRef.current = true;
      startVerification();
    }
    
    if (!isOpen) {
      verificationStartedRef.current = false;
    }
  }, [isOpen, startVerification]);

  // Don't render anything - the SDK will show its own beautiful modal
  return null;
} 