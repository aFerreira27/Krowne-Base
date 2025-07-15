
# Krowne Product Hub

This application is a comprehensive hub for managing and viewing Krowne product information. It provides a user-friendly interface for searching, viewing, creating, and editing product details, all backed by a robust cloud-based infrastructure.

## Recent Updates

- Addressed a hydration mismatch error by suppressing the hydration warning on the `<html>` tag in `/src/app/layout.tsx`.
- Fixed a build error caused by an incorrect component name (`<Header>` instead of `<CardHeader>`) in `/src/app/products/[id]/page.tsx`.
- Noted the importance of maintaining aspect ratio for images by adjusting either width or height and setting the other to `auto`. The image in question was `/public/images/krowne_logo.png`, although the general principle applies to all images.
- Switched from using local data files to fetching product data directly from the **Google Cloud SQL database**.
- Updated Firebase configuration to use **Firebase App Hosting** for the Next.js backend.
- Resolved TypeScript type errors related to the database connection and API routing by ensuring data fetched from the database is properly typed and handled.
- Cleaned up sensitive information (like service account keys) from the Git history using `git-filter-repo`.
- Implemented a secure and recommended method for database authentication in production using **Workload Identity Federation (WIF)** and **Application Default Credentials (ADC)**, by granting the Firebase App Hosting service account the necessary "Cloud SQL Client" IAM role. This eliminates the need for service account key files in the deployed environment.
- Added a dedicated API route (`/src/app/api/test-db/route.ts`) to explicitly test the database connection from the deployed Firebase App Hosting backend.

---

## Table of Contents
1.  [Technology Stack](#technology-stack)
2.  [Deployment](#deployment)
3.  [Data Flow: From Input to Database](#data-flow-from-input-to-database)
4.  [Project Structure](#project-structure)
5.  [Key Libraries & Dependencies](#key-libraries--dependencies)
6.  [Local Development Setup](#local-development-setup)

---

## Technology Stack

The Krowne Product Hub is built with a modern, scalable, and type-safe technology stack designed for performance and maintainability.

-   **Framework**: **Next.js (App Router)** - A production-grade React framework providing server-side rendering (SSR), static site generation (SSG), and powerful routing capabilities.
-   **Language**: **TypeScript** - A typed superset of JavaScript that enhances code quality and developer experience by catching errors early.
-   **UI Library**: **React** - The core library for building dynamic and interactive user interfaces.
-   **Styling**: **Tailwind CSS** - A utility-first CSS framework for rapid and consistent UI development.
-   **UI Components**: **ShadCN UI** - A collection of beautifully designed, reusable, and accessible components built on top of Radix UI and Tailwind CSS.
-   **Icons**: **Lucide React** - A simply beautiful and consistent icon library.
-   **Database**: **PostgreSQL** - A powerful, open-source object-relational database system for storing all product data.
-   **Database Hosting**: **Google Cloud SQL** - A fully-managed database service from Google Cloud that hosts our PostgreSQL instance.
-   **Hosting**: **Firebase App Hosting** - A secure, fast, and scalable hosting solution optimized for Next.js applications, handling server-side rendering, static assets, and backend functions seamlessly.
-   **Generative AI**: **Google Genkit** - A framework for building AI-powered features, used here for potential future integrations.

## Key Features
- **Homepage**: A hero section with a prominent search bar and a gallery of recently viewed items.
- **Product Database**: A searchable and filterable grid view of all products in the database.
- **Product Detail View**: A comprehensive page displaying all product details, including images, specifications, documentation, and compliance information.
- **Product Creation & Editing**: Robust forms for adding new products and editing existing ones, with support for image and file uploads.
- **Database Sync Status**: A mock page indicating the synchronization status with other company databases.

## Deployment

The application is deployed to Firebase Hosting and Firebase App Hosting.

To deploy the application, you will need the [Firebase CLI](https://firebase.google.com/docs/cli). If you haven't already, install it globally:




## Data Flow: From Input to Database

Understanding the path data takes is key to working with this application. Here is the step-by-step lifecycle for creating and updating a product:

1.  **User Input (Client-Side Form)**: The process starts on the `/products/new` or `/products/[id]/edit` pages. The user fills out a form built with **React Hook Form** and validated by a **Zod** schema.

2.  **Client-Side API Call**: When the user submits the form, a client-side function from `src/lib/products-client.ts` is triggered. This function uses the native `fetch` API to send the validated form data as a JSON payload to the corresponding Next.js API route (e.g., `POST /api/products`).

3.  **API Route Handler (Server-Side)**: The request is received by the appropriate API route handler in `src/app/api/products/`. This is the application's "backend" layer, running on the server.

4.  **Database Interaction (Server-Side)**: The API handler calls a dedicated server-side function from `src/lib/products.ts`. This function contains the raw **pg** (PostgreSQL) logic to `INSERT` or `UPDATE` data in the Google Cloud SQL database.

5.  **Database Response & Sanitization (Server-Side)**: The database returns the newly created or updated product row. This raw data is passed to a central sanitization function in `src/lib/sanitize.ts`. **This is a critical step.** This function ensures the data conforms perfectly to the `Product` TypeScript type, converting any `null` values from the database (for empty arrays like `images` or `specifications`) into empty arrays (`[]`).

6.  **API Response to Client**: The now clean, sanitized product data is sent back to the client as the JSON response from the API call.

7.  **Client-Side Update**: The client-side `fetch` call receives the sanitized product data. It can then use this data to update the UI, such as redirecting the user to the newly created product's detail page, without fear of runtime errors from malformed data.

This architecture ensures a clear separation of concerns: client components handle user interaction, API routes manage the business logic, and dedicated functions handle database communication and data integrity.

---

## Project Structure

The project follows a standard Next.js App Router structure, with clear separation between UI components, application logic, and backend services.

```
.
├── /docs                   # Project documentation.
├── /public                 # Static assets (images, fonts, etc.).
│   └── /images
├── /src
│   ├── /ai                 # Genkit configuration and AI flows.
│   ├── /app                # Next.js App Router: all pages and API routes.
│   │   ├── /api            # Backend API endpoints for CRUD operations.
│   │   ├── /products       # Routes for viewing, creating, and editing products.
│   │   ├── globals.css     # Global styles and Tailwind CSS directives.
│   │   └── layout.tsx      # The root layout for the entire application.
│   ├── /components         # Reusable React components.
│   │   ├── /ui             # Core ShadCN UI components.
│   │   └── *.tsx           # Custom application-specific components.
│   ├── /hooks              # Custom React hooks (e.g., useRecentlyViewed).
│   ├── /lib                # Core application logic, utilities, and types.
│   │   ├── db.ts           # Database connection logic (Google Cloud SQL).
│   │   ├── products.ts     # Server-side functions for database interaction.
│   │   ├── products-client.ts # Client-side functions for API interaction.
│   │   ├── sanitize.ts     # Central function to clean and format database data.
│   │   └── types.ts        # TypeScript type definitions for the application.
├── .env                    # Environment variables for LOCAL development.
├── apphosting.yaml         # Configuration for Firebase App Hosting (PRODUCTION).
├── next.config.ts          # Next.js configuration file.
├── package.json            # Project dependencies and scripts.
└── tailwind.config.ts      # Tailwind CSS configuration file.
```

## Key Libraries & Dependencies

-   `@google-cloud/cloud-sql-connector` & `pg`: The Node.js connector and driver for connecting to the PostgreSQL database on Cloud SQL.
-   `react-hook-form` & `@hookform/resolvers`: Provides a powerful and efficient way to manage complex forms, used for creating and editing products.
-   `zod`: A TypeScript-first schema declaration and validation library, used to define the shape of our data and validate form inputs.
-   `use-debounce`: A React hook to debounce user input, improving performance in the search functionality.
-   `class-variance-authority` & `clsx` & `tailwind-merge`: Utilities used by ShadCN to create flexible and customizable component styles.
-   `embla-carousel-react`: The underlying library for the image carousel on the product detail page.

## Local Development Setup

To run the application locally, you must have a `.env` file in the project root with the correct credentials for the Google Cloud SQL instance. This file is ignored by Git for security. The `next.config.ts` is configured to automatically load these variables.

**Example `.env` file:**
```bash
INSTANCE_CONNECTION_NAME="your-gcp-project:region:your-sql-instance"
DB_USER="your-database-user"
DB_PASS="your-database-password"
DB_NAME="your-database-name"
```
**1. Install dependencies and start the development server:**
```bash
npm install
npm run dev
```
The application should now be running with the correct database credentials.
