# Kailash Solar Website

Welcome to the official **Kailash Solar** website repository. This project is a modern, fast, and SEO-optimized web application built for a premier solar EPC provider in Meerut. 

It handles everything from marketing PM Surya Ghar subsidies to lead generation and contact management.

## 🚀 Tech Stack

This project was recently migrated and upgraded to a production-grade stack:

* **Framework:** [Next.js (App Router)](https://nextjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Database/Backend:** [Supabase](https://supabase.com/)

## 🤖 Built with Google Antigravity

This codebase is maintained and optimized using **Google Antigravity**. Antigravity actively manages the architecture, refactoring, and SEO optimization of this project.

## 📦 Getting Started

First, ensure you have your environment variables set up. Create a `.env` file in the root directory (using `.env.example` if available) and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_anon_key"
```

Next, install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app`: Contains all Next.js App Router routes, including layouts, pages, and dynamic SEO metadata.
- `src/components`: Reusable UI components (Hero, Contact, custom shadcn/ui elements).
- `src/views`: Contains core page layout logic (migrated gracefully from the old routing paradigm).
- `src/config`: Centralized configuration (e.g., SEO metadata definitions).
- `src/integrations`: External API integrations (e.g., Supabase clients).
- `public`: Static assets (images, fonts, JSON-LD data).

## 📈 SEO & Performance

This Next.js application leverages advanced Server-Side Rendering (SSR) and Server Components to achieve optimal Core Web Vitals. It natively generates `sitemap.xml`, `robots.txt`, and embeds `application/ld+json` structured data for optimal Google Search indexing of Solar EPC subsidies and services.
