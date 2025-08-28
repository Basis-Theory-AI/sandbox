declare module '@basis-theory-ai/react' {
    import { ReactNode } from 'react';

    export interface BasisTheoryProviderProps {
        apiKey: string;
        environment?: string;
        children: ReactNode;
    }

    export function BasisTheoryProvider(props: BasisTheoryProviderProps): JSX.Element;

    export function useBasisTheory(): {
        bt: any;
        isInitialized: boolean;
        isLoading: boolean;
        initError: Error | null;
        apiKey: string;
        environment: string;
        visaSession: any;
        visaError: Error | null;
        mastercardManager: any;
        mastercardSession: any;
        mastercardError: Error | null;
        isMastercardReady: boolean;
        getSessionKey: () => string;
        isReady: () => boolean;
        getStatus: () => 'loading' | 'error' | 'ready' | 'idle';
        verifyPurchaseIntent: (projectId: string, intentId: string) => Promise<any>;
        getVisaStatus: () => any;
        isVisaReady: () => boolean;
        getVisaRequestId: () => string | null;
        getMastercardStatus: () => 'loading' | 'ready' | 'authenticated' | 'error';
        isMastercardAuthenticated: () => boolean;
        getMastercardCorrelationId: () => string | null;
    };

    export function verifyPurchaseIntent(projectId: string, intentId: string): Promise<any>;
    export function getVisaStatus(): any;
    export function verifyPurchaseIntentWithPasskey(projectId: string, intentId: string, iframeData: any, config: any): Promise<any>;
    export const visaIframeManager: any;

    export default class WebSDK {
        static init(config: any): WebSDK;
        constructor(config?: {});
        config: {
            apiUrl: any;
            debug: any;
        };
        getVersion(): string;
        isReady(): boolean;
    }
}
