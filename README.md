# Demo Frontend

Small plain HTML + JavaScript demo page that sends a POST request to a backend API.

## Configure API base URL

Set `window.APP_CONFIG.API_BASE_URL` in `index.html` (or replace the `__API_BASE_URL__` placeholder during deploy).

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

The app sends requests to `${API_BASE_URL}/api/demo`.

## Build and deploy

1. Build static files:

   ```bash
   npm run build
   ```

2. Deploy `dist` to GitHub Pages:

   ```bash
   npm run deploy
   ```
