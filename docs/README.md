
# Krowne Product Hub

This application is a comprehensive hub for managing and viewing Krowne product information. It provides a user-friendly interface for searching, viewing, creating, and editing product details, all backed by a robust cloud-based infrastructure.

## Table of Contents
1.  [Technology Stack](#technology-stack)
2.  [Key Features](#key-features)
3.  [Project Structure](#project-structure)
4.  [Key Libraries & Dependencies](#key-libraries--dependencies)
5.  [Local Development Setup](#local-development-setup)

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

-   **Homepage**: A hero section with a prominent search bar and a gallery of recently viewed items.
-   **Product Database**: A searchable and filterable grid view of all products in the database.
-   **Product Detail View**: A comprehensive page displaying all product details, including images, specifications, documentation, and compliance information.
-   **Product Creation & Editing**: Robust forms for adding new products and editing existing ones, with support for image and file uploads.
-   **Database Sync Status**: A mock page indicating the synchronization status with other company databases.

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

To run the application locally, you must have a `.env` file in the project root with the correct credentials for the Google Cloud SQL instance. This file is ignored by Git for security.

**Example `.env` file:**
```bash
INSTANCE_CONNECTION_NAME="your-gcp-project:region:your-sql-instance"
DB_USER="your-database-user"
DB_PASS="your-database-password"
DB_NAME="your-database-name"
```

Once the `.env` file is configured, you can install dependencies and start the development server:

```bash
npm install
npm run dev
```
