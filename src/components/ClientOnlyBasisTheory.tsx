'use client'

import React, { useEffect, useState } from 'react'

interface ClientOnlyBasisTheoryProps {
    jwt: string
    children: React.ReactNode
}

export default function ClientOnlyBasisTheory({ jwt, children }: ClientOnlyBasisTheoryProps) {
    const [BasisTheoryProvider, setBasisTheoryProvider] = useState<any>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        // Dynamically import BasisTheoryProvider only on client side
        const loadBasisTheory = async () => {
            try {
                const module = await import('@basis-theory-ai/react')
                setBasisTheoryProvider(() => module.BasisTheoryProvider)
                setIsLoaded(true)
            } catch (error) {
                console.error('Failed to load BasisTheory:', error)
                setIsLoaded(true) // Still set to true to render children
            }
        }

        loadBasisTheory()
    }, [])

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#131316] text-[#f4f4f5]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading BasisTheory...</p>
                </div>
            </div>
        )
    }

    if (!BasisTheoryProvider) {
        // Fallback if BasisTheoryProvider couldn't be loaded
        return <>{children}</>
    }

    return (
        <BasisTheoryProvider apiKey={jwt}>
            {children}
        </BasisTheoryProvider>
    )
}
