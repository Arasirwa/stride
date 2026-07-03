# 👟 Stride E-Store  

A modern e-commerce platform for buying and tracking shoe orders. Built with **React**, **Zustand** for global state management, and **Tailwind CSS** for styling.  

## 🚀 Features  
- **🛍️ Browse & Purchase Shoes**: Customers can explore a variety of shoes and place orders.  
- **📦 Order Tracking**: Real-time updates from payment confirmation to shipping and delivery.  
- **🔔 Notifications System**: Categorized updates for payments, shipping, and alerts.  
- **⚡ Global State Management**: Efficient state handling with Zustand.  
- **📡 API Integration**: Fetch product and order data dynamically.  

## 🛠️ Tech Stack  
- **Frontend**: React, Zustand, Tailwind CSS  
- **Icons**: Lucide React  
- **Backend**: API-driven (your choice of backend) — runs against an in-browser mock by default, see below.

## 📌 Learning Goals  
This project focuses on:  
✅ Functionality & state management in React  
✅ Using Zustand for global state  
✅ Fetching data from an API  
✅ Implementing a dynamic order tracking system  

## 🎯 Getting Started  
1. Clone the repository:  
   ```sh
   git clone https://github.com/yourusername/shoe-e-store.git
   cd shoe-e-store
   ```
2. Install dependencies:  
   ```sh
   npm install
   ```
3. Start the development server:  
   ```sh
   npm run dev
   ```

## 📡 Data layer: demo mode vs. a real backend

Product reads/writes go through `src/services/productsService.js`, which picks one of two implementations at runtime:

- **Demo mode (default)** — no `VITE_API_BASE_URL` set. Products are served from an in-browser mock (`src/services/mockProductsAdapter.js`) seeded from `src/data/db.json`. Admin create/update/delete persists to `localStorage` so the demo behaves like a real store across reloads, with zero server to run or deploy. This is what makes the app deployable as a static site (Vercel, Netlify, GitHub Pages, etc.) with no backend at all.
- **Real backend** — set `VITE_API_BASE_URL` (copy `.env.example` to `.env`) to point at a REST API that implements `GET/POST/PUT/DELETE /products` (and `/products/:id`). The app switches over automatically; no code changes needed.

If you want to test against real HTTP semantics locally before a backend exists, `src/data/db.json` also works with [json-server](https://github.com/typicode/json-server):
```sh
npm run mock-server            # serves src/data/db.json at http://localhost:8000
# in another terminal, with .env containing VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

Cart, orders, and auth are currently local-only (Zustand + `localStorage`) and not yet wired to a backend — the same `services/` pattern used for products is the intended place to add that when a real API exists.

## 🚀 Deploying a demo

Because demo mode needs no backend, `npm run build` produces a static `dist/` folder deployable as-is. SPA rewrite rules for client-side routing are included for both:
- **Vercel** — `vercel.json`
- **Netlify** — `public/_redirects`

## 🌟 Contributing  
Feel free to fork this project and submit PRs!  
