# Chowkimat Goushala

A serverless web application for the **Shree Kalyan Chowkimath Kamadhenu Goushala Seva Trust**. This platform manages gallery images, temple information, and donation details through a secure Cloudflare-based architecture.

## 🚀 Technology Stack

- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
- **Backend**: Hono (Cloudflare Workers)
- **Database**: Cloudflare D1 (SQLite)
- **Object Storage**: Cloudflare R2 (Images & Assets)
- **ORM**: Drizzle ORM
- **Authentication**: JWT via Web Crypto API

## 🛠 Features

- **Dynamic Gallery**: Upload and manage temple images directly to R2.
- **Admin Dashboard**: Secure management interface at `/admin`.
- **Role-Based Permissions**: Granular access control for admins (Gallery, Site Settings, Financials).
- **Financial Security**: Bank details and QR codes are protected by an additional secret code layer.
- **Dynamic Content**: Address, contact info, and donation details are editable from the dashboard.
- **Responsive Design**: Premium, mobile-first aesthetic with smooth animations.

## 📦 Project Structure

- `artifacts/gosuala`: React frontend application.
- `artifacts/api-server`: Hono backend worker.
- `lib/db`: Shared database schema and migrations.

## 🔧 Setup & Deployment

### Prerequisites
- Node.js & npm/pnpm
- Cloudflare Account & Wrangler CLI

### Installation
```bash
npx pnpm install
```

### Database Setup (Remote)
```bash
cd artifacts/api-server
npx wrangler d1 migrations apply chowkimat --remote
npx wrangler d1 execute chowkimat --remote --file=./seed.sql
```

### Run Locally
1. Start the backend:
   ```bash
   cd artifacts/api-server
   npx wrangler dev
   ```
2. Start the frontend:
   ```bash
   cd artifacts/gosuala
   npx pnpm run dev
   ```

### Deployment
```bash
cd artifacts/api-server
npx wrangler deploy
```

---

## 🛡 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🤝 Maintained By

Maintained with ❤️ by **RanStack Solutions**.

---
© 2026 Shree Kalyan Chowkimath Kamadhenu Goushala Seva Trust
