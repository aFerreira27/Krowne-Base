
# Krowne Base

This application is a comprehensive hub for managing and viewing Krowne product information. It provides a user-friendly interface for searching, viewing, creating, and editing product details, all backed by a robust cloud-based infrastructure.

---

## Table of Contents
1.  [Updates](#recent-updates)
2.  [Technology Stack](#technology-stack)
3.  [Key Features](#key-features)
4.  [Deployment](#deployment)
5.  [Data Flow: From Input to Database](#data-flow-from-input-to-database)
6.  [Project Structure](#project-structure)
7.  [Key Libraries & Dependencies](#key-libraries--dependencies)
8.  [Local Development Setup](#local-development-setup)

---

## Recent Updates

- **AI-Powered Data Entry**: Implemented a new feature on the "New Product" page that allows users to upload a PDF specification sheet. A Genkit AI flow parses the document and automatically populates the form fields, including name, SKU, description, specifications, and relevant product tags.
- **Product Tagging System**: Added a comprehensive tagging system to the product schema. Users can now add, remove, and filter products by tags, improving organization and searchability.
- **UI Enhancements**: Added an "Add Product" button directly to the product listing page for quicker access. Updated product cards to display the product series and tags.
- **Firebase Deployment Error**: Resolved a deployment error: `Could not read source directory` during Firebase App Hosting deploy. This was caused by a dangling symlink named `result` in the project root, likely created by the Nix environment or during Cloud SQL Proxy setup. The fix was to manually remove it using `rm result`.
- **Favicon Conflict in Next.js**: Fixed an issue where the favicon wasn't displaying correctly. This was due to a conflicting file (likely `favicon.ico` or similar) in the `src/app` directory. Removing or renaming the file resolved the conflict with Next.js's automatic favicon handling.
- **Local Development Script**: Added a `start_local.sh` script that automates launching both the Cloud SQL Proxy and the Next.js development server, streamlining local development and testing.
- **Custom Domain** Added support for a custom domain (`krownebase.art`) on Firebase App Hosting.
- **Google Cloud SQL database** Switched from using local data files to fetching product data directly from the Google Cloud SQL database.
- **Firebase App Hosting** Updated Firebase configuration to use Firebase App Hosting for the Next.js backend.

## Technology Stack

The Krowne Product Hub is built with a modern, scalable, and type-safe technology stack designed for performance and maintainability.

-   **Framework**: **Next.js (App Router)** - A production-grade React framework providing server-side rendering (SSR), static site generation (SSG), and powerful routing capabilities.
-   **Language**: **TypeScript** - A typed superset of JavaScript that enhances code quality and developer experience by catching errors early.
-   **UI Library**: **React** - The core library for building dynamic and interactive user interfaces.
-   **Styling**: **Tailwind CSS** - A utility-first CSS framework for rapid and consistent UI development.
-   **Development Environment**: **Nix** - Used to ensure a consistent and reproducible development environment across different machines.
-   **UI Components**: **ShadCN UI** - A collection of beautifully designed, reusable, and accessible components built on top of Radix UI and Tailwind CSS.
-   **Icons**: **Lucide React** - A simply beautiful and consistent icon library.
-   **Database**: **PostgreSQL** - A powerful, open-source object-relational database system for storing all product data.
-   **Database Hosting**: **Google Cloud SQL** - A fully-managed database service from Google Cloud that hosts our PostgreSQL instance.
-   **Hosting**: **Firebase App Hosting** - A secure, fast, and scalable hosting solution optimized for Next.js applications, handling server-side rendering, static assets, and backend functions seamlessly.
-   **Generative AI**: **Google Genkit** - A framework for building AI-powered features, used here for potential future integrations.

## Key Features
- **Homepage**: Search bar and recently viewed items
- **Product Database**: Searchable, filterable grid view with product tags.
- **Product Detail View**: Comprehensive product page displaying info, images, specs, documents.
- **Product Creation & Editing**: Forms with image/file uploads and an **AI-powered option to auto-populate from a PDF spec sheet**.
- **Database Sync Status**: Links and tracks sync status with other databases - to implement

## Deployment

To deploy, use [Firebase CLI](https://firebase.google.com/docs/cli).

## Data Flow: From Input to Database

1. **Form Submission** → `React Hook Form` + `Zod`
2. **API Call** → via `fetch()` to `/api/products`
3. **Route Handler** → Server-side API
4. **Database Call** → via `pg` in `src/lib/products.ts`
5. **Sanitization** → `src/lib/sanitize.ts`
6. **API Response** → Validated `Product` type
7. **Client Update** → Safe UI render

## Project Structure

```
.
├── /docs
├── /public/images
├── /src
│   ├── /ai
│   ├── /app
│   │   ├── /api
│   │   ├── /products
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── /components
│   │   ├── /ui
│   │   └── *.tsx
│   ├── /hooks
│   ├── /lib
│   │   ├── db.ts
│   │   ├── products.ts
│   │   ├── products-client.ts
│   │   ├── sanitize.ts
│   │   └── types.ts
├── .env
├── apphosting.yaml
├── next.config.ts
├── package.json
└── tailwind.config.ts
```

## Key Libraries & Dependencies

- `@google-cloud/cloud-sql-connector`, `pg`
- `react-hook-form`, `@hookform/resolvers`
- `zod`, `use-debounce`
- `clsx`, `tailwind-merge`, `class-variance-authority`
- `embla-carousel-react`

## Local Development Setup

**Example `.env`:**
```bash
INSTANCE_CONNECTION_NAME="your-gcp-project:region:your-sql-instance"
DB_USER="your-database-user"
DB_PASS="your-database-password"
DB_NAME="your-database-name"
```

### 1. Install and start dev server
```bash
npm install
npm run dev
```

### 2. Use the local startup script

Make sure `start_local.sh` is executable:
```bash
chmod +x start_local.sh
./start_local.sh
```

> 💡 **Note**: Ensure the [Cloud SQL Auth proxy](https://cloud.google.com/sql/docs/postgres/connect-admin-proxy#install) is installed and in your `$PATH`.
