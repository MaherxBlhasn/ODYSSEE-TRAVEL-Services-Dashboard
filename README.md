# 🚀 Travel Dashboard

A modern, responsive dashboard for **Odyssee Travel Services**, built with Next.js, React, and Tailwind CSS. This dashboard provides travel agencies with a comprehensive overview of bookings, offers, analytics, customer contacts, and agency settings—all in one place.

---

## ✨ Features

- 📊 **Dashboard Overview:** Key stats on bookings, website visits, active offers, and revenue.
- 📈 **Analytics:** Visualize monthly bookings and traffic sources.
- 🏷️ **Offers Management:** Add, edit, and manage travel offers with ease.
- 👥 **Customer Contacts:** View and manage recent customer inquiries.
- ⚙️ **Settings:** Update agency information and contact details.
- 📱 **Responsive Design:** Optimized for desktop and mobile devices.

---

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) ⚡
- [React 19](https://react.dev/) ⚛️
- [Tailwind CSS 4](https://tailwindcss.com/) 🎨
- [Lucide React Icons](https://lucide.dev/icons/) 🖼️

---

## 🚦 Getting Started

### 📋 Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### ⚡ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MaherxBlhasn/ODYSSEE-TRAVEL-Services-Dashboard.git
   cd travel-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. 🌐 Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

```
app/
  dashboard/
    analytics/         # 📊 Analytics page & charts
    components/        # 🧩 Reusable UI components
    contacts/          # 👥 Customer contacts page
    home/              # 🏠 Dashboard home/overview
    offers/            # 🏷️ Offers management
    sections/          # 📦 Section containers for each dashboard area
    settings/          # ⚙️ Agency settings page
  login/               # 🔐 Login page
public/                # 🖼️ Static assets (images, icons)
```

---

## 🛠️ Customization

- 🏷️ **Add new offers:** Use the "Add Offer" button in the Offers section.
- ⚙️ **Edit agency info:** Update details in the Settings section.
- 📊 **Modify stats/data:** Update mock data in `app/dashboard/data.ts`.

---

## 📜 Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm start` – Start the production server
- `npm run lint` – Lint the codebase

---

## 📝 License

This project is for internal use by Odyssee Travel Services.
