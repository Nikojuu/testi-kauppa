# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 e-commerce storefront built with React 19, TypeScript, and Tailwind CSS. The application is a headless storefront that connects to an external backend API (Putiikkipalvelu) for product data, orders, and customer management.

### Key Technologies
- **Next.js 16** with App Router
- **React 19** (using react-jsx transform)
- **TypeScript** with strict mode
- **Tailwind CSS** with custom design tokens
- **Zustand** for client-side state management (cart, campaign cart)
- **Zod** for schema validation
- **React Hook Form** + Conform for form handling
- **Radix UI** for accessible UI components
- **Framer Motion** for animations

## Development Commands

```bash
# Start development server (runs on http://localhost:3001 by default)
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linter
npm run lint

# Preview email templates
npm run email
```

## Architecture

### Route Structure

The app uses Next.js App Router with route groups:

**Storefront routes** (`src/app/(storefront)/`):
- `/` - Homepage with hero, category showcase, and about section
- `/products/[...slug]` - Product listing and detail pages (catch-all dynamic route)
- `/cart` - Shopping cart page
- `/checkout` - Multi-step checkout flow
- `/payment/success/[orderId]` - Payment success page
- `/payment/cancel/[orderId]` - Payment cancellation page
- `/about` - About page
- `/contact` - Contact form
- `/gallery` - Image gallery
- `/privacy-policy` - Privacy policy
- `/terms` - Terms and conditions
- `/verify-email` - Email verification handler

**Auth/Dashboard routes** (`src/app/(auth)/`):
- `/login` - Customer login
- `/register` - Customer registration
- `/(dashboard)/mypage` - Customer dashboard home
- `/(dashboard)/myinfo` - Customer profile management
- `/(dashboard)/myorders` - Order history
- `/(dashboard)/mywishlist` - Customer wishlist

### Backend Integration

The app communicates with an external backend API (Putiikkipalvelu):

**Environment Variables (required):**
- `NEXT_PUBLIC_STOREFRONT_API_URL` - Base URL for the storefront API
- `STOREFRONT_API_KEY` - API key for server-side requests (passed as `x-api-key` header)
- `NEXT_PUBLIC_BASE_URL` - The base URL of this Next.js app
- `TENANT_ID` - Tenant identifier for multi-tenant backend

**Authentication Flow:**
- Uses cookie-based sessions managed by the backend
- Session token stored in `session_token` cookie
- Auth actions in `src/lib/actions/authActions.ts` handle login/register/logout
- `getUser()` server action retrieves current user from session

### State Management

**Client-side (Zustand):**
- `src/hooks/use-cart.ts` - Main shopping cart with persistent storage
- `src/hooks/use-campaign-cart.ts` - Calculated cart totals with campaign/sale logic

**Server Actions:**
- `src/lib/actions/authActions.ts` - Customer auth, profile, wishlist
- `src/lib/actions/stripeActions.ts` - Stripe payment checkout
- `src/lib/actions/paytrailActions.ts` - Paytrail payment checkout (Finnish payment provider)
- `src/lib/actions/shipmentActions.ts` - Shipit shipping integration
- `src/app/actions.ts` - Contact form submission (uses Resend)

### Payment Methods

Configured in `src/app/utils/constants.ts` via `PAYMENT_METHODS` array. Currently supports:
- **Stripe** - Credit card payments
- **Paytrail** - Finnish payment provider (bank transfers, mobile payments, etc.)

Checkout flow creates a pending order, then redirects to payment provider. Payment webhooks (handled by backend) update order status.

### Shipping Integration

Uses **Shipit** API for shipping label generation and pickup point selection:
- `getShipmentMethods()` fetches available shipping methods with pricing
- Drop-in location selection for pickup points
- Shipping labels created after successful payment

### Store Configuration

Key constants in `src/app/utils/constants.ts`:
- `SEO_ENABLED` - Controls search engine indexing (set to false for template/dev mode)
- `STORE_NAME`, `STORE_DESCRIPTION`, `STORE_DOMAIN` - Basic store info
- `SHOWCASE_CATEGORIES` - Featured categories on homepage
- `PAYMENT_METHODS` - Enabled payment providers

These should eventually be fetched from the database but are hardcoded for now.

### Image Handling

Next.js Image component configured in `next.config.mjs` with remote patterns for:
- `utfs.io` - UploadThing
- `ik.imagekit.io` - ImageKit CDN
- `dsh3gv4ve2.ufs.sh` - Custom CDN
- `www.shipit.fi` & `apitest.shipit.ax` - Shipping provider logos
- `resources.paytrail.com` - Payment provider assets
- `picsum.photos` - Placeholder images (dev only)

Custom `ImageKitImage` component (`src/components/ImageKitImage.tsx`) provides ImageKit-specific optimizations.

### Email

Uses **Resend** for transactional emails:
- Email templates in `src/components/Email/`
- React Email components (`@react-email/components`)
- Preview emails locally with `npm run email`

### Campaigns & Sales

Campaign system supports:
- **Buy X, Pay Y** campaigns (e.g., buy 3 pay for 2)
- **Free Shipping** campaigns (minimum cart value threshold)
- Product-level sales with start/end dates
- Variation-level sales (override product pricing)

Campaign logic calculated in `useCampaignCart` hook. Campaigns fetched from backend via `getCampaigns()` utility.

### Path Aliases

TypeScript configured with `@/*` alias pointing to `src/*`:
```typescript
import { useCart } from "@/hooks/use-cart";
import { ProductCard } from "@/components/ProductCard";
```

### Styling

Uses custom Tailwind theme with design tokens defined in `tailwind.config.ts`:
- Custom colors: `warm-white`, `charcoal`, `burnt-orange`, `sage-green`, etc.
- Custom fonts via `src/lib/fonts.ts` (using `next/font`)
- Animations via `tailwindcss-animate`
- Component variants via `class-variance-authority`

### TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` → `src/*`
- JSX transform: `react-jsx` (no React import needed)
- Target: ES2017

## Important Patterns

### Data Fetching
- Products, categories, and orders are fetched from external API
- Use `fetch()` with `x-api-key` header for server-side requests
- Client components should use server actions, not direct API calls

### Form Validation
- Use Zod schemas (defined in `src/lib/zodSchemas.ts`)
- Forms use React Hook Form + Conform integration
- Server-side validation always required

### Error Handling
- Payment actions throw `CartError` for inventory/product issues
- Frontend should handle errors by removing invalid cart items

### Localization
- Currently Finnish-only (hardcoded strings)
- Forms use Finnish labels and error messages
- Consider i18n if adding multi-language support

## Environment Setup

Copy `.env` and configure:
- Point `NEXT_PUBLIC_STOREFRONT_API_URL` to backend (production or local)
- Add `STOREFRONT_API_KEY` from backend admin
- Configure payment provider keys (Stripe, Paytrail)
- Configure shipping API keys (Shipit)
- Add `RESEND_API_KEY` for email sending

The storefront connects to `D:\Projektit\verkkokaupat\Hennan-Korukauppa` repository which contains the backend API.
