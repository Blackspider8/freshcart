# FreshCart Ecommerce

A modern React ecommerce storefront built with Vite.  
The app includes authentication, products browsing, categories, brands, cart, wishlist, checkout, and order history.

## Tech Stack

- React 19
- React Router
- Axios
- Formik + Yup
- React Hot Toast
- Vite
- ESLint
- Vitest + Testing Library

## Project Scripts

- `npm run dev` - start local development server
- `npm run build` - build production bundle
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint checks
- `npm run test` - run test suite once
- `npm run test:watch` - run tests in watch mode

## Getting Started

1. Install dependencies:

   `npm install`

2. Start development server:

   `npm run dev`

3. Open browser:

   [http://localhost:5173](http://localhost:5173)

## Build and Verification

Use this sequence before deployment:

1. `npm run lint`
2. `npm run test`
3. `npm run build`

## Notes

- API base URL is configured in `src/api/index.js`.
- Authentication token is stored in `localStorage`.
- Pages are route-lazy-loaded to reduce initial JS payload.
