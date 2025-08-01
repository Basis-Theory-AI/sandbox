# Basis Theory React Integration Example

A comprehensive Next.js example application demonstrating secure payment processing with Basis Theory's React SDK, featuring JWT authentication, payment method management, and purchase intent verification.

## 🎯 What This App Demonstrates

This example shows how to build a production-ready payment application using Basis Theory with:

- **🔐 Secure JWT Authentication** - Server-side JWT generation with RS256 signatures
- **💳 Payment Method Management** - Create and manage tokenized payment methods
- **🛒 Purchase Intent Processing** - Create and verify purchase intents with real-time status
- **⚡ Real-time Updates** - Live JWT status monitoring with automatic token refresh
- **🛡️ Security Best Practices** - Private keys stay server-side, sensitive data never exposed
- **🎨 Modern UI** - Clean, responsive interface built with Tailwind CSS

## 📸 Features Overview

### Dashboard Features
- **JWT Status Monitor** - Real-time JWT status with expiration countdown
- **Payment Method Creator** - Add new payment methods with card tokenization
- **Payment Method List** - View and manage existing payment methods
- **Purchase Intent Manager** - Create and track purchase intents
- **Verification Modal** - Real-time purchase intent verification with status updates

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
cd basis-theory-react-example
yarn install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory with your Basis Theory project details:

```bash
# Basis Theory Project Configuration
JWT_PROJECT_ID=your-basis-theory-project-id
JWT_KEY_ID=your-jwt-key-id

# RSA Private Key (PKCS#8 format)
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----"

# Application Configuration
NEXT_PUBLIC_DEFAULT_USER_ID=example-user-123
NEXT_PUBLIC_DEFAULT_ROLES=private

# API Base URL (for payment method and purchase intent APIs)
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

### Backend (API Routes)

```
/api/auth/jwt          - JWT generation and refresh
/api/payment-methods   - Payment method CRUD operations  
/api/purchase-intents  - Purchase intent management
```

### Frontend Components

```
src/
├── components/
│   ├── JWTStatus.tsx           - Real-time JWT monitoring
│   ├── PaymentMethodCreator.tsx - Payment method creation form
│   ├── PaymentMethodList.tsx    - Payment method management
│   ├── PurchaseIntentList.tsx   - Purchase intent tracking
│   ├── VerificationModal.tsx    - Purchase intent verification
│   └── CardDetailsModal.tsx     - Card details display
├── hooks/
│   └── useJWT.ts               - JWT state management
└── App.jsx                     - Main application
```

## 🔄 How It Works

### JWT Authentication Flow

1. **Frontend Requests JWT** → `useJWT` hook calls `/api/auth/jwt`
2. **Backend Generates JWT** → Server creates RS256-signed JWT with user claims
3. **Frontend Receives Token** → JWT stored in state with expiration tracking
4. **Basis Theory Integration** → JWT passed as API key to `BasisTheoryProvider`
5. **Automatic Refresh** → Token refreshes 5 minutes before expiration

### Payment Processing Flow

1. **Tokenize Card Data** → Sensitive card data tokenized with Basis Theory
2. **Create Payment Method** → Token referenced to create payment method
3. **Create Purchase Intent** → Link payment method to purchase intent
4. **Verify Transaction** → Real-time verification with status updates

## 🛠️ Development

### Available Scripts

```bash
yarn dev      # Start development server (port 3001)
yarn build    # Build for production
yarn start    # Start production server
yarn lint     # Run ESLint
```

### Key Technologies

- **Next.js 13+** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework  
- **Jose** - JWT creation and verification
- **Basis Theory React SDK** - Payment tokenization and processing

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
NEXT_PUBLIC_DEFAULT_USER_ID=production-user
NEXT_PUBLIC_DEFAULT_ROLES=private
API_BASE_URL=https://your-api-domain.com
```

## 🧪 Testing

### Test the JWT Flow

1. **Load the app** - JWT should generate automatically
2. **Check JWT Status** - Green status indicates successful authentication
3. **Copy JWT Token** - Use the copy button to inspect the token
4. **Wait for Refresh** - Token should refresh before expiration

### Test Payment Features

1. **Create Payment Method** - Add a test card (use Basis Theory test cards)
2. **View Payment Methods** - Check the payment method list updates
3. **Create Purchase Intent** - Link a payment method to a purchase
4. **Verify Purchase** - Test the verification flow with real-time updates

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
- Confirm your Basis Theory project has the correct permissions
- Verify the API_BASE_URL points to your payment API
- Check that your JWT has the necessary roles (`private`)

**Verification Fails**
- Ensure your purchase intent is in the correct status
- Confirm your payment method is properly linked
- Verify your JWT hasn't expired
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

Built with ❤️ using [Basis Theory](https://basistheory.com) and [Next.js](https://nextjs.org)