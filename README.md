# FoundIt? — Campus Lost-and-Found Platform 🛡️🎓

**FoundIt?** is a campus lost-and-found repository engineered with **Modern Neo-Brutalism**, powered by **SQLite + Prisma**, **JWT Authentication with bcryptjs**, and **Two-Tier Role-Based Access Control (RBAC)**: **Student** and **Administrator**.

---

## 🎨 Modern Neo-Brutalism Design System

- **Vibe**: Bold, student-centric, trendy editorial streetwear zine aesthetics.
- **Palette**:
  - Background: Warm Bone White / Cream (`#F4F4F0`)
  - Typography & Borders: Stark Absolute Black (`#000000`, `border-2 sm:border-[3px] border-black`)
  - Accents: Highlighter Yellow (`#FFE600`), Safety Orange (`#FF5C00`), Electric Cyan (`#00F0FF`), Acid Mint (`#00FF66`), Hot Pink (`#FF48B0`)
- **Shadows**: Hard, solid black drop shadows (`shadow-[4px_4px_0px_0px_#000]`, `shadow-[6px_6px_0px_0px_#000]`). Zero blurry corporate drop shadows.

---

## 🏛️ System Roles & Strict Permissions

### 1. Student Role (`STUDENT`)
- **Feed Browsing**: Search and filter all posted campus items by category and location.
- **Official 3-Point Claim Form**: To initiate a claim on an available item, students must submit:
  1. `FULL NAME`
  2. `REGISTRATION NUMBER`
  3. `DEPARTMENT`
- **Duplicate Lockout**: Once an item is claimed or under review, its status becomes `PENDING`, rendering a prominent hazard badge and disabling the claim button (`CLAIM PENDING // UNDER REVIEW`), preventing duplicate claims.
- **Upload Restrictions**: Students **cannot** post items, delete posts, or approve claims.

### 2. Administrator Role (`ADMIN`)
- **Master Command Console** (`/admin`): Master control room with metrics, item repository, and claim adjudication.
- **Exclusive Item Uploading**: Admins have the sole authority to post new found items via the **Upload Modal** (with the pre-processing AI enhancement studio).
- **Claim Adjudication**: Directly review student credentials and execute:
  - 🟢 **`APPROVE`**: Sets claim to approved and resolves the item (`status: 'resolved'`).
  - 🔴 **`REJECT`**: Rejects fraudulent claims and reverts item back to `available`.
- **Master Purge Power**: Dedicated **`DELETE ITEM`** button on every listing to purge corrupted or duplicate entries.

---

## 🔑 Pre-Seeded Demo Accounts

| Role | Email | Password | Access Rights & Portal |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `student@campus.edu` | `student123` | [`/student`](http://localhost:5173/student) — Browse feed & submit official claim request |
| 🛡️ **Admin** | `admin@campus.edu` | `admin123` | [`/admin`](http://localhost:5173/admin) — Exclusive upload, approve/reject claims, delete items |

*(Tip: The `/login` page includes **1-Click Autofill** buttons for instant testing!)*

---

## 🚀 Quick Start

Start both the Vite frontend and Express backend simultaneously:
```bash
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
