# BT AI Playground

A comprehensive Next.js playground application demonstrating the BT AI React SDK, featuring JWT authentication, payment method management, and purchase intent verification with real-time verification flows.

## 🎯 What This App Demonstrates

This playground shows how to integrate the Basis Theory AI React SDK in a real-world application with:

- **🔐 Secure JWT Authentication** - Server-side JWT generation with RS256 signatures
- **💳 Payment Method Management** - Create and manage tokenized payment methods via BT AI API
- **🛒 Purchase Intent Processing** - Create and verify purchase intents with Visa and Mastercard networks
- **⚡ Real-time Verification** - Live purchase intent verification with network-specific flows

## 📸 Features Overview

### Playground Features
- **Authentication Tab** - JWT status monitor with real-time expiration countdown and token display
- **Payment Methods Tab** - Create and manage tokenized payment methods with card details modal
- **Purchase Intents Tab** - Create, track, and verify purchase intents
- **Verification Modal** - Real-time purchase intent verification with Visa and Mastercard flows
- **Status Tracking** - Live updates for verification processes with detailed progress indicators

### Technical Features  
- **Automatic Token Refresh** - JWTs refresh automatically 5 minutes before expiration
- **Error Handling** - Comprehensive error states and user feedback
- **TypeScript Support** - Full type safety throughout the application
- **Responsive Design** - Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- Basis Theory project with JWT key configured
- Cloudflare CLI (for HTTPS testing of Visa verification)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd basistheory-ai/react/example
yarn install
```

### 2. Environment Setup

Create a `.env` file in the example directory with your Basis Theory project details:

```bash
# Basis Theory Project Configuration
JWT_PROJECT_ID=your-basis-theory-project-id
JWT_KEY_ID=your-jwt-key-id

# RSA Private Key (PKCS#8 format)
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----"

# Application Configuration
NEXT_PUBLIC_PROJECT_ID=your-basis-theory-project-id
NEXT_PUBLIC_DEFAULT_USER_ID=user123
NEXT_PUBLIC_DEFAULT_ROLES=public

# API Base URL (for BT AI API integration)
API_BASE_URL=http://localhost:3000
```

### 3. Run the Application

```bash
yarn dev
```

The app will be available at [http://localhost:3001](http://localhost:3001)

### 4. HTTPS Setup for Visa Verification (Required)

**Important:** Visa verification requires HTTPS to function properly. For local testing, use Cloudflare tunnel:

```bash
# Install Cloudflare CLI (if not already installed)
# macOS: brew install cloudflared
# Other platforms: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# Create secure HTTPS tunnel to your local app
cloudflared tunnel --url http://localhost:3001
```

This will generate a public HTTPS URL (e.g., `https://xyz.trycloudflare.com`) that you can use to test Visa verification flows. The tunnel will remain active while the command runs.

**Note:** Mastercard verification works over HTTP, but Visa specifically requires HTTPS for security compliance.

## 🏗️ Architecture Overview

### Backend (API Routes - Next.js App Router)

```
/api/auth/generate-jwt         - JWT generation with RS256 signatures
/api/payment-methods           - Payment method creation and listing via BT AI API
/api/purchase-intents          - Purchase intent management
/api/purchase-intents/[id]     - Individual intent operations
/api/purchase-intents/[id]/verify - Purchase intent verification
/api/event/publish             - Event publishing for verification flows
```

### Frontend Components (Next.js App Router)

```
app/
├── components/
│   ├── authentication/
│   │   ├── AuthenticationTab.tsx      - JWT status and management
│   │   └── JWTDisplayCard.tsx         - JWT token display
│   ├── payment-methods/
│   │   ├── PaymentMethodsTab.tsx      - Payment methods container
│   │   ├── PaymentMethodList.tsx      - Payment method list
│   │   └── PaymentMethodCreateModal.tsx - Payment method creation
│   ├── purchase-intents/
│   │   ├── PurchaseIntentsTab.tsx     - Purchase intents container
│   │   ├── PurchaseIntentList.tsx     - Purchase intent list
│   │   ├── CreatePurchaseIntentModal.tsx - Intent creation
│   │   └── PurchaseIntentCredentialModal.tsx - Network credentials
│   ├── shared/
│   │   ├── JSONDisplay.tsx            - JSON data display
│   │   ├── Snackbar.tsx              - Toast notifications
│   │   └── icons/                     - SVG icon components
│   └── Playground.tsx                 - Main playground container
├── hooks/
│   ├── usePaymentMethods.ts          - Payment method state
│   ├── usePurchaseIntents.ts         - Purchase intent state
│   └── useSnackbar.ts                - Notification state
├── services/
│   ├── apiService.ts                 - JWT and auth API calls
│   ├── btAiApiService.ts             - BT AI API integration
│   └── jwtService.ts                 - JWT utilities
└── page.tsx                          - Main app entry point
```

## 🔄 How It Works

### JWT Authentication Flow

1. **App Initialization** → `page.tsx` generates initial public JWT via `APIService.generateJWT()`
2. **BT AI Provider Setup** → JWT passed to `BtAiProvider` which initializes the SDK
3. **SDK Initialization** → Visa and Mastercard SDKs initialize with network credentials
4. **Authentication Tab** → Real-time JWT status
5. **Role Management** → JWTs can be regenerated with different roles (public/private) and entityId

### Payment Processing Flow

1. **JWT Generation** → Server-side JWT creation with configurable user/role claims
2. **Payment Method Creation** → Uses BT AI API to create tokenized payment methods
3. **Purchase Intent Creation** → Links payment method to purchase intent via BT AI API
4. **Verification Flow** → Real-time verification using BT AI React SDK with network-specific flows
5. **Network Verification** → Visa and Mastercard verification with credential management

## 🛠️ Development

### Available Scripts

```bash
yarn dev      # Start development server (port 3001)
yarn build    # Build for production
yarn start    # Start production server
yarn lint     # Run ESLint
```

### Key Technologies

- **@basis-theory-ai/react** - BT AI React SDK for payment verification
- **Next.js 13+** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework  
- **Jose** - JWT creation and verification (RS256 signatures)
- **React Hooks** - State management for payment methods and purchase intents

## 🔒 Security Features

- **Private Key Security** - RSA private keys never leave the server
- **JWT Expiration** - Tokens expire and refresh automatically
- **Token Validation** - All JWTs verified server-side before use
- **Secure Headers** - HTTPS and security headers in production
- **Input Validation** - All user inputs validated and sanitized

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in the Vercel dashboard
3. **Deploy** - Automatic deployments on every push

### Environment Variables for Production

```bash
JWT_PROJECT_ID=your-basis-theory-project-id
JWT_KEY_ID=your-jwt-key-id
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
NEXT_PUBLIC_PROJECT_ID=your-basis-theory-project-id
NEXT_PUBLIC_DEFAULT_USER_ID=production-user
NEXT_PUBLIC_DEFAULT_ROLES=public
API_BASE_URL=https://api.sandbox.basistheory.ai
```

## 🧪 Testing

### Test the Authentication Flow

1. **Load the app** - Initial public JWT generates automatically on app start
2. **Authentication Tab** - Check JWT status with real-time countdown
3. **Generate New JWT** - Test different user IDs and roles (public/private)
4. **Copy JWT Token** - Use the copy button to inspect the token in JWT debuggers

### Test Payment Features

1. **Payment Methods Tab** - Navigate to payment method management
2. **Create Payment Method** - Add test cards using the creation modal
3. **View Card Details** - Click on payment methods to see tokenized card data
4. **Purchase Intents Tab** - Navigate to purchase intent management
5. **Create Purchase Intent** - Link payment methods to new purchase intents
6. **View Network Credentials** - Check Visa/Mastercard credentials for each intent
7. **Verify Purchase Intent** - Test real-time verification with network-specific flows

**For Visa Verification Testing:**
- Ensure you're accessing the app via the HTTPS tunnel URL (not localhost)
- Use Visa test cards for the full verification flow experience
- Mastercard verification can be tested on localhost without HTTPS

## 🆘 Troubleshooting

### Common Issues

**JWT Generation Fails**
- Verify your private key is in PKCS#8 format
- Check that `JWT_PROJECT_ID` and `JWT_KEY_ID` are correct
- Ensure the public key is added to your Basis Theory project

**Payment Methods Not Creating**
- Confirm your BT AI API integration is properly configured
- Verify the API_BASE_URL points to the correct BT AI endpoint
- Check that your JWT has the necessary roles for payment method creation
- Ensure your Basis Theory project has payment method permissions

**Purchase Intents Issues**
- Verify your payment method exists before creating purchase intents
- Check that network credentials (Visa/Mastercard) are properly configured
- Ensure your purchase intent is in the correct status for verification
- Confirm your JWT has the necessary permissions for intent operations

**Verification Fails**
- Ensure your purchase intent is in a verifiable status
- Confirm your payment method is properly linked to the intent
- Verify your JWT hasn't expired and has sufficient permissions
- Check that network SDKs (Visa/Mastercard) are properly initialized
- **For Visa verification:** Make sure you're using the HTTPS tunnel URL, not localhost

**Cloudflare Tunnel Issues**
- Install Cloudflare CLI if you get "command not found": `brew install cloudflared`
- If tunnel fails to start, try a different port or restart the Next.js dev server
- Tunnel URLs are temporary - you'll get a new URL each time you run the command
- Keep both `yarn dev` and `cloudflared tunnel` running simultaneously in separate terminals

### Support

- **Basis Theory Docs**: [https://developers.basistheory.com](https://developers.basistheory.com)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Issue Tracker**: Create an issue in this repository

## 📄 License

This example is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using [Basis Theory AI](https://basistheory.com) and [Next.js](https://nextjs.org) 