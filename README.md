# 🎮 CodeQuest Academy - Personal Portfolio Project

<div align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React Badge" />
  <img src="https://img.shields.io/badge/TypeScript-7.0-blue?style=for-the-badge&logo=typescript" alt="TS Badge" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind Badge" />
  <img src="https://img.shields.io/badge/Supabase-Database-emerald?style=for-the-badge&logo=supabase" alt="Supabase Badge" />
  <img src="https://img.shields.io/badge/Vite-Ready-646CFF?style=for-the-badge&logo=vite" alt="Vite Badge" />
</div>

---

### 🌟 Project Overview

**CodeQuest Academy** is an advanced, fully interactive, and gamified web application designed to help users master software engineering and web development through play! 

This is a **personal portfolio project** built to showcase full-stack engineering skills, modern component design, secure third-party integrations, and dynamic state synchronization.

🔗 **Live Demo on GitHub Pages**: [https://entrinax22.github.io/CodeQuest](https://entrinax22.github.io/CodeQuest)

---

### ✨ Key Features Deployed

#### 1. 🕹️ Gamified Curriculum & Lesson Player
* **Interactive Challenges**: Learn core Web Development, Python, C++, Java, Backend APIs, and DevOps through modular coding exercises and concept briefings.
* **Hearts/Lives System**: Starts with 5 hearts that auto-regenerate over time (12-minute interval), with instant refills available using earned XP.
* **XP Leveling & Streaks**: Earn XP for correctly answering challenges and maintain consecutive coding streaks! Includes double XP boost items.

#### 2. 🏆 Competitive Weekly Tournament Leagues
* **Dynamic Leagues**: Compete in real-time across four progressive ranks (Bronze, Silver, Gold, and Diamond).
* **Automated Rewards**: Top users are placed on the leaderboard and can claim dynamically scaling XP rewards and heart refills based on their rank!

#### 3. 💳 Integrated SaaS Subscription & Admin Portal
* **Membership Tiers**:
  * **Basic (Free)**: Core curriculum tracks and standard heart refills.
  * **StudentPlus**: Unlocks advanced tracks, infinite hearts, and 1.5X turbo XP.
  * **CodeQuest PRO VIP**: Unlimited access, infinite hearts, and 2X double XP.
* **MVP Payment Flow (GCash & Maya)**: Temporary peer-to-peer manual verification flow. Users scan the admin's custom payment QR code, submit their reference transaction ID, and wait for verification.
* **Role-Protected Admin Portal**: Authorized admin accounts can upload QR codes, update GCash/Maya merchant accounts, and approve/reject subscription requests in real-time.

#### 4. 🎨 Redesigned Premium Interface
* **Light-Slate Theme**: Features an extremely clean, modern, and high-contrast Light-Slate layout inside the **Settings** and **Profile** tabs to deliver an elite user experience.
* **Interactive Sound FX**: Custom high-fidelity audio feedback triggers on correct/incorrect answers, rank upgrades, and level up fanfares.

---

### 🔮 Future Roadmap (Scaling from MVP to Production)

Currently, peer-to-peer GCash & Maya manual verification is used as an agile, low-overhead MVP solution. Future development phases include:
- [ ] **Fully Automated Payment Gateways**: Integrating **Stripe** or **Paymongo** to support credit/debit cards and automated GCash/Maya e-wallet redirections.
- [ ] **Instant Account Provisioning**: Leveraging webhook listeners to upgrade subscription tiers instantly upon successful webhook receipts.
- [ ] **Automatic Billing Cycles**: Offloading monthly renewals, receipt generation, and subscription cancellations to automated gateway handlers.

---

### 🛠️ Tech Stack & Architecture

* **Frontend**: React 19, TypeScript 7.0, Tailwind CSS v4, Lucide Icons, Vite.
* **Backend Database & Authentication**: Supabase (PostgreSQL, Real-Time Subscriptions, Row Level Security).
* **State Management**: Zustand (with local storage persistence and cloud sync).
* **CI/CD Pipeline**: GitHub Actions (automated builds & deployments with encrypted secrets).

---

### 🚀 Running the Project Locally

#### 1. Clone the repository:
```bash
git clone https://github.com/entrinax22/CodeQuest.git
cd CodeQuest
```

#### 2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

#### 3. Setup your environment variables:
Create a `.env` file in the root directory and add your Supabase credentials (see `.env.example`):
```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anonymous-key"
```

#### 4. Run the development server:
```bash
npm run dev
```

---

### 🛡️ Secure CI/CD Deployments via GitHub Actions

This repository is configured with a automated GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys your static pages directly to **GitHub Pages** securely without exposing private environment variables:

1. **Vite Relative Path**: Configured with `base: './'` inside `vite.config.ts` to ensure assets load correctly on GitHub subdirectory URLs.
2. **Encrypted Secrets**: Builds are initiated by the cloud container loading your secrets (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) strictly at build-time.
3. **Zero Leaked Keys**: Your private `.env` file remains local and is safely ignored by Git via `.gitignore`.

---

### 📄 License

This personal project is licensed under the MIT License - feel free to use and adapt it for your own portfolio! Crafted with passion for modern web engineering. 🚀
