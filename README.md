# 🛠️ SHRAMSETU (श्रमसेतु)
### Cooperative-Powered Local Workforce & Community Services Marketplace

> **Smart India Hackathon (SIH) 2026**

**ShramSetu** is a cooperative-owned digital service marketplace platform that enables Labour Cooperative Federations and Labour Cooperative Societies to provide verified household and community services while ensuring fair wages, worker welfare, and consumer trust.

---

## 🌟 Core Differentiators
1. **Cooperative Ownership**: Workers belong to registered Labour Cooperatives, ensuring fair wage distribution and democratic governance.
2. **AI-Powered Matching Engine**: Ranks providers on skill, distance, availability, ratings, and experience.
3. **Verified Skill & Identity**: Multi-level verification framework for worker trust and safety.
4. **Worker Health & Welfare Shield**: Pooled health cover, accident insurance, and digital work history tracking.
5. **AI Demand Forecasting & Workforce Allocation**: Proactive gap detection for cooperative admins to optimize supply across city zones.

---

## 🚀 Architecture
- `apps/web`: Next.js 15 App Router, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- `backend`: Node.js, Express.js, TypeScript, MongoDB (Mongoose), JWT Auth, RBAC
- `ai`: Python FastAPI Service for Service Classification, Matching, & Demand Forecasting

---

## 🏃 Quick Start

### 1. Environment Setup
Copy `.env.example` to `.env` in `backend/`:
```bash
cp .env.example backend/.env
```

### 2. Install Dependencies
```bash
npm install --prefix backend
npm install --prefix apps/web
```

### 3. Run Backend
```bash
npm run dev --prefix backend
```

### 4. Run Frontend
```bash
npm run dev --prefix apps/web
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.
