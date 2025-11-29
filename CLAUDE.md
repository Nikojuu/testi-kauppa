# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **storefront template** for the Putiikkipalvelu multi-tenant e-commerce platform. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS, this template serves as the foundation for all tenant storefronts.

### Template Architecture

- **Purpose**: This is a reusable template that connects to Putiikkipalvelu (located at `D:\Projektit\verkkokauppapalvelu`)
- **Multi-tenant**: Each store is built from this template with tenant-specific styling and configuration
- **Backend API**: Connects to Putiikkipalvelu's storefront API (`/api/storefront/*` endpoints)
- **Core Logic**: All e-commerce functionality is implemented in this template
- **Per-store Customization**: Each tenant store has its own styling (colors, fonts, theme) via `tailwind.config.ts` and `src/lib/fonts.ts`

When deploying a new store, this template is duplicated and customized with:
- Tenant-specific `TENANT_ID` environment variable
- Custom Tailwind theme in `tailwind.config.ts`
- Store branding (name, logo, colors, fonts)
- Store-specific constants in `src/app/utils/constants.ts`

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

The template communicates with **Putiikkipalvelu** (located at `D:\Projektit\verkkokauppapalvelu`), which provides:

**Storefront API Endpoints** (`/api/storefront/*`):
- Product catalog and categories
- Customer authentication and management
- Order processing and history
- Campaigns and sales data
- Wishlist management
- Email verification

**Environment Variables (required):**
- `NEXT_PUBLIC_STOREFRONT_API_URL` - Base URL for Putiikkipalvelu API (e.g., `https://api.putiikkipalvelu.fi`)
- `STOREFRONT_API_KEY` - API key for server-side requests (passed as `x-api-key` header)
- `NEXT_PUBLIC_BASE_URL` - The base URL of this Next.js storefront instance
- `TENANT_ID` - Unique tenant identifier for this store (critical for multi-tenant data isolation)

**Authentication Flow:**
- Cookie-based sessions managed by Putiikkipalvelu backend
- Session token stored in `session_token` cookie
- Auth actions in `src/lib/actions/authActions.ts` handle login/register/logout
- `getUser()` server action retrieves current user from session
- All API requests include tenant context via `TENANT_ID`

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

**Per-tenant customization** is done in these files:
- `src/app/utils/constants.ts` - Store-specific constants
  - `SEO_ENABLED` - Controls search engine indexing (set to false for template/dev mode)
  - `STORE_NAME`, `STORE_DESCRIPTION`, `STORE_DOMAIN` - Basic store info
  - `SHOWCASE_CATEGORIES` - Featured categories on homepage
  - `PAYMENT_METHODS` - Enabled payment providers
- `tailwind.config.ts` - Custom colors, fonts, and design tokens for the tenant
- `src/lib/fonts.ts` - Store-specific font configuration
- `.env` - Tenant-specific `TENANT_ID` and API configuration

**Important**: These constants are currently hardcoded per store instance. In the future, they may be fetched from the Putiikkipalvelu backend based on `TENANT_ID`.

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

**Tenant-specific styling** is the primary customization point for each store:

- **Tailwind theme** (`tailwind.config.ts`) - Define custom colors, spacing, and design tokens per store
  - Example colors: `warm-white`, `charcoal`, `burnt-orange`, `sage-green`, etc.
  - Each tenant can have completely different color schemes
- **Custom fonts** (`src/lib/fonts.ts`) - Store-specific typography using `next/font`
- **Animations** - Shared across all stores via `tailwindcss-animate`
- **Component variants** - Shared component system via `class-variance-authority`

**Template vs Instance**:
- The template contains all UI components and logic
- Each store instance customizes only the theme, fonts, and constants
- This ensures consistency in functionality while allowing brand differentiation

### TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` → `src/*`
- JSX transform: `react-jsx` (no React import needed)
- Target: ES2017

## Important Patterns

### Data Fetching
- All data (products, categories, orders, customers) is fetched from Putiikkipalvelu API
- API endpoints are prefixed with `/api/storefront/*`
- Server-side requests must include:
  - `x-api-key` header with `STOREFRONT_API_KEY`
  - Requests are automatically scoped to `TENANT_ID` on the backend
- Client components should use server actions, not direct API calls
- Data is tenant-isolated on the backend - the template handles API communication

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

### For Development (Template)

Copy `.env.example` to `.env.local` and configure:
- `NEXT_PUBLIC_STOREFRONT_API_URL` - Point to Putiikkipalvelu backend (local: `http://localhost:3000`, production: `https://api.putiikkipalvelu.fi`)
- `STOREFRONT_API_KEY` - Get from Putiikkipalvelu admin panel
- `TENANT_ID` - Use a test tenant ID for development
- Payment provider keys (Stripe, Paytrail)
- Shipping API keys (Shipit)
- `RESEND_API_KEY` for email sending

### For New Store Deployment

When creating a new tenant store from this template:
1. Duplicate this repository
2. Set unique `TENANT_ID` for the new store
3. Customize `tailwind.config.ts` with store branding
4. Update `src/app/utils/constants.ts` with store info
5. Configure `src/lib/fonts.ts` with store fonts
6. Set production `NEXT_PUBLIC_STOREFRONT_API_URL`
7. Deploy to hosting platform

### Backend Connection

This template connects to **Putiikkipalvelu** backend located at:
- Local development: `D:\Projektit\verkkokauppapalvelu`
- API documentation: See Putiikkipalvelu's `/api/storefront/*` endpoints
- All stores share the same backend, isolated by `TENANT_ID`
