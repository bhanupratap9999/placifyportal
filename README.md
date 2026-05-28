# Placify Suite 🚀

Placify is a premium, state-of-the-art MERN (MongoDB, Express, React, Node.js) platform designed to dynamically connect ambitious students with top-tier global internship vectors. Featuring real-time socket events, modular course hubs, automated microtasking, and custom onboarding experiences, Placify is designed for visual excellence and optimal system performance.

---

## 🌟 Visual & Architectural Highlights

### 🎨 Design System (Aesthetic Excellence)
- **Glassmorphic Theme:** Elegant frosted-glass components, radial gradients, animated glowing backdrops, and fluid cyberpunk styling configured globally.
- **Outfit Typography:** Clean, premium typeface loaded directly via Google Fonts to establish beautiful readability.
- **Dynamic Elements:** Fluid Framer Motion stagger entrances, micro-interactions, responsive dashboard representations, and color-glow hover states.

### ⚙️ Monorepo Architecture
The workspace is split into two cleanly separated components:
* **`/backend`**: Node.js/Express API server configured with mongoose models, socket connections, error handling, and robust Windows DNS server overrides.
* **`/frontend25`**: React client powered by Vite, Tailwind CSS v4, Lucide icons, and Framer Motion.

---

## 🛠️ Environment Configurations

### 1. Backend Settings (`/backend/.env`)
Create a file named `.env` in the `/backend` directory and add the following keys:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/placify?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=8e2b8f3c7d6a5e1f0c2b9a8d4e7f3b5c9a0d8e2f6b5c4d3a2e1f0b9c8d7e6f5a
NODE_ENV=development
```
> [!TIP]
> The database connection naturally includes a **Windows DNS Server Override** to bypass the Node.js `querySrv ECONNREFUSED` issue automatically, allowing seamless connections to Atlas out-of-the-box.
> If the cloud database is ever unreachable, the system automatically falls back to spinning up a local `mongodb-memory-server` in the background.

### 2. Frontend Settings (`/frontend25/.env`)
Create a file named `.env` in the `/frontend25` directory:
```env
VITE_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>.apps.googleusercontent.com
```

---

## 🚀 Setup & Installation (Local Development)

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)

### Run the Backend
```bash
cd backend
npm install
npm start
```
*API running locally at:* `http://localhost:5000`

### Run the Frontend
```bash
cd frontend25
npm install
npm run dev
```
*Client running locally at:* `http://localhost:5173/`

---

## 📦 GitHub Pages Deployment (Frontend Only)

The Placify frontend Vite application is configured with relative assets base path routing (`base: './'`), making it immediately compatible with **GitHub Pages** deployment!

### GitHub Actions Deployment Workflow
To deploy your frontend automatically when you push to your `main` branch, add a new file `.github/workflows/deploy.yml` in the root of your project:

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend25/package-lock.json

      - name: Install & Build Frontend
        run: |
          cd frontend25
          npm install
          npm run build

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: frontend25/dist
          branch: gh-pages
```

### Manual Deployment
Alternatively, you can manually build and deploy the built `dist` folder directly:
1. Navigate to `/frontend25` and run `npm run build`.
2. Push the contents of the generated `/frontend25/dist` folder to your `gh-pages` branch on GitHub.
