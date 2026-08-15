# 🏍️ Speed Leasing — Premium Motorcycle Leasing Platform (PoC)

> **Note:** This project is a **Proof of Concept (PoC)** built to demonstrate an end-to-end digital leasing journey for premium motorcycles. It showcases real-time financial simulation, trade-in equity calculation, client application tracking, and streamlined quote generation within a modern serverless architecture.

**Speed Leasing** is a sleek, modern web platform designed for interactive financial simulation and pre-approval application workflows for premium motorcycles (Harley-Davidson, Ducati, Indian Motorcycle, etc.).

---

## ✨ Key Features

### 1. 🔍 Dynamic Fleet Catalog & Real-Time Filtering
- **Instant text search** across brands and model names.
- **Multi-criteria filters**: by motorcycle category (*Cruiser, Sport, Bobber, Custom Chopper*), manufacturer make, and maximum MSRP budget slider.
- **Detailed inspection modal**: comprehensive technical specifications sheet with high-resolution imagery, engine displacement, horsepower, and torque.
- **Fluid transition**: direct "Select & Simulate" trigger that auto-scrolls to the financial engine.

### 2. ⚡ Interactive Financial Simulator Engine
- **Real-time calculation engine** powered by a fixed 4.9% APR lease formula.
- **Customizable contract terms**:
  - Lease duration (24, 36, 48 months).
  - Adjustable down payment slider (0% to 30%).
  - Annual mileage allowance tiers (3,000, 6,000, 10,000 miles/year).
  - Add-on service packages (Full Factory Scheduled Maintenance, VIP Zero-Deductible Rider Insurance).
- **Animated tech-spec gauges**: dynamic visualization of machine specifications (displacement, power, torque) featuring smooth numeric counters.

### 3. 🔄 Instant Trade-In Appraisal Tool
- Embedded valuation engine for the rider's current motorcycle based on make, model year, odometer mileage, and vehicle condition.
- **Direct credit injection**: applies the calculated appraisal credit directly into the lease down payment, immediately reducing monthly installments.

### 4. 📝 VIP Pre-Approval Workflow & Quote Generator
- Tailored application modal supporting both **Individual** and **Corporate / Fleet** accounts.
- Generates a unique tracking reference code (`SPL-XXXXXX`).
- Clean, print-ready formal quote layout suitable for PDF export.

### 5. 📦 Client Tracking Portal (`/portal`)
- Self-service portal to monitor application progress in real time (*Submitted ➔ Under Review ➔ Pre-Approved ➔ Contract Sent ➔ Ready for Pickup*).
- Quote reprint functionality and full lease terms breakdown.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & APIs**: Next.js Route Handlers (`/api/applications`)
- **Data Persistence**: In-memory state store (lightweight server-side simulation without external database dependency)

---

## 🚀 Installation & Getting Started

### Prerequisites
- Node.js (version 18.17 or higher)
- Package manager: `npm`, `yarn`, or `pnpm`

### Setup Commands

```bash
# 1. Clone the repository
git clone <REPOSITORY_URL>
cd speed-leasing

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build and start for production
npm run build
npm run start

```

##  Project File Structure

```bash
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── applications/
│   │   │       └── route.ts        # API Route Handlers (GET / POST applications)
│   │   ├── portal/
│   │   │   └── page.tsx            # Client tracking portal route (/portal)
│   │   ├── layout.tsx              # Root layout & global providers
│   │   └── page.tsx                # Main landing page (Fleet Catalog + Simulator)
│   ├── components/
│   │   ├── ApplicationModal.tsx    # VIP pre-approval & quote modal
│   │   ├── BikeGallery.tsx         # Fleet grid, filters, and vehicle detail modal
│   │   ├── LeaseSimulator.tsx      # Core leasing engine & financial sliders
│   │   ├── TechSpecsBars.tsx       # Animated gauge bars & technical specs
│   │   └── TradeInModal.tsx        # Instant motorcycle trade-in appraisal modal
│   ├── lib/
│   │   └── bikes-data.ts           # Static catalog database & machine specs
│   └── types/
│       └── bike.ts                 # TypeScript type definitions (Bike, Simulation, Application)
├── public/                         # Static assets and vehicle images
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json

```

