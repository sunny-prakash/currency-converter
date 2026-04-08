# CurrencyFlow - Premium Currency Converter

CurrencyFlow is a premium, real-time currency conversion application built with Next.js, Framer Motion, and Tailwind CSS.

## Features

- **Real-time Conversion**: Fetches latest exchange rates from open APIs.
- **Interactive Charts**: 30-day historical data visualization.
- **Premium Design**: Dark/Light mode support with glassmorphism aesthetics.
- **Animations**: Smooth transitions and micro-interactions powered by Framer Motion.
- **Favorites**: Star your most-used currencies for quick access.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **State Management**: React Context API
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Tailwind CSS, clsx, tailwind-merge

## Project Structure

A quick overview of the folder structure to help you navigate:

- `src/app/`: Next.js App Router pages and layouts. The main entry point is `page.tsx`.
- `src/components/`: Reusable React components (e.g., Currency Converter form, Historical Chart, UI elements).
- `src/context/`: React Context providers for managing global state like the current selected currencies, rates, and themes.
- `src/lib/`: Utility functions, helper classes, and API service wrappers for fetching currency data.
- `src/constants/`: Static configuration data, API endpoints, or constant variables used across the application.

## Development Guide

### State Management
The application relies heavily on the React Context API to avoid prop drilling. Ensure that any new global state (like user preferences or active currency pair) is added to the relevant context provider in `src/context/` and exposed via custom hooks.

### Data Fetching
Currency data is fetched from open APIs. The fetching logic is decoupled from the UI components. Check `src/lib/` for the exact fetching functions, which handle data formatting before it's passed down to components like Recharts.

### Styling and Theming
Tailwind CSS is used extensively. For dynamic class names, we use `clsx` and `tailwind-merge` (typically exposed as a `cn()` utility in `src/lib/`).
Framer Motion is used for micro-interactions. If adding new components, try to maintain the glassmorphism aesthetic and smooth transitions found in existing components.

## Available Commands

- `npm run dev`: Runs the app in development mode on `http://localhost:3000`.
- `npm run build`: Builds the app for production to the `.next` folder.
- `npm run start`: Starts the production server using the build output.
- `npm run lint`: Runs ESLint to catch formatting and logic errors.

## License

MIT
