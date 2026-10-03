# CodeQuest Academy 🚀

CodeQuest Academy is an advanced, gamified programming and software engineering learning platform built with React, TypeScript, Tailwind CSS, Vite, and Supabase. It features interactive coding lessons, learning tracks, XP leveling, weekly leagues, SaaS subscription tiers, and a secure Admin Portal for manual QR code payment approvals (GCash & Maya).

---

## ✨ Key Features

1. **Gamified Learning & Curriculum**:
   - Multiple learning paths (Web Development, Python, C++, Java, Backend, DevOps).
   - Interactive lesson player with concept briefings, coding challenges, and XP/streak rewards.
   - Weekly competitive leagues (Bronze, Silver, Gold, Diamond) with automated evaluation.
   - Heart / Life system with auto-regeneration.

2. **SaaS Subscription Tiers**:
   - **Basic (Free)**: Standard hearts, 1X XP, core curriculum.
   - **StudentPlus**: Infinite hearts, unlocked advanced learning tracks, 1.5X turbo XP.
   - **CodeQuest PRO VIP**: All tracks unlocked, infinite hearts, 2X double XP boost.
   - Flexible billing cycles (Monthly and Annual pricing).

3. **Admin Portal & Manual QR Code Payment Approvals**:
   - **Admin-Controlled QR Codes**: Authorized administrators can upload official QR code images and update merchant account details for **GCash** and **Maya** directly from the Settings / Admin Portal.
   - **Checkout Flow**: Students select GCash or Maya during checkout, scan the admin's uploaded QR code, and submit their transaction Reference Number / ID.
   - **Manual Review Queue**: Admins review pending subscription requests in the secure Admin Portal and approve or reject them with instant account tier upgrades.

4. **Role-Based Access Control (RBAC) & Supabase Integration**:
   - User roles (`'admin'` or `'user'`) synchronized with Supabase `profiles`.
   - Strict role verification guarding administrative portals and settings.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite.
- **Backend & Database**: Supabase (PostgreSQL, Auth, Row Level Security).
- **State Management**: Zustand.

---

## 📄 License

MIT License. Crafted for elite software engineering education.
