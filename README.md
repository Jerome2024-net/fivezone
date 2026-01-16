# FiveZone - Plateforme de référencement de restaurants et commerces

Une plateforme moderne pour découvrir des restaurants et des commerces, construite avec Next.js 14+, TypeScript, Tailwind CSS et Prisma.

## Fonctionnalités

- **Annuaire d'entreprises** : Parcourir et rechercher des restaurants et des commerces.
- **Fiches détaillées** : Voir les photos, les avis, les notes et les détails de localisation.
- **Avis utilisateurs** : S'inscrire pour laisser des avis et des notes.
- **Panneau Admin/Propriétaire** : Gérer les fiches d'entreprises.
- **Design Réactif** : Interface mobile-friendly avec Tailwind CSS.

## Stack Technique

- **Framework** : [Next.js 14+](https://nextjs.org/) (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS v4
- **Base de données** : PostgreSQL (via Prisma)
- **ORM** : Prisma
- **Icônes** : Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use local SQLite/Docker)

### Installation

1.  Clone the repository (or use the current folder).
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    - Create a `.env` file in the root if not exists.
    - Add your database URL:
      ```env
      DATABASE_URL="postgresql://user:password@localhost:5432/restofind?schema=public"
      ```
4.  Run Prisma migrations (to create tables):
    ```bash
    npx prisma migrate dev --name init
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```
6.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components.
  - `ui`: Basic building blocks (Buttons, Inputs, etc.).
  - `layout`: Layout components (Header, Footer).
- `src/lib`: Utility functions and Prisma client instance.
- `prisma`: Database schema and migrations.

## Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm start`: Start production server.
- `npm run lint`: Run ESLint.
- `npx prisma studio`: Open Prisma Studio to manage database records.
