# 🚀 SendHub — WhatsApp Business API (WABA) Client

A modern, high-performance web application built with **React 19**, **Vite**, and **Tailwind CSS** for WhatsApp Business API management, multi-channel broadcast campaigns, dynamic template design, contact segmentation, and real-time messaging analytics.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Project Structure](#-architecture--project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the App](#running-the-app)
- [Available Scripts](#-available-scripts)
- [Key Modules](#-key-modules)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Key Features

- **📢 Broadcast Campaigns:**
  - Multi-step campaign builder with audience targeting and scheduling.
  - Real-time campaign tracking (Sent, Delivered, Read, Failed).
  - Detailed analytics with visual charts powered by **Recharts**.

- **💬 WhatsApp Template Studio:**
  - Create and preview WhatsApp-compliant message templates.
  - Support for dynamic parameters, media headers (images, documents, videos), and quick-reply / CTA buttons.
  - Live interactive mobile preview widget.

- **👥 Contact & Audience Management:**
  - Bulk contact upload via CSV/Excel with field mapping.
  - Dynamic segmentation, custom attributes, tags, and blacklist/opt-out management.

- **📊 Comprehensive Analytics Dashboard:**
  - Track delivery rates, response times, message engagement, and conversion metrics.
  - Interactive filters by date range, campaign type, and provider status.

- **⚙️ Provider & Settings Integration:**
  - Integration with WABA / BSP providers and webhooks.
  - API credential management and team/organization settings.

- **🎨 Modern Landing Page & Auth Flow:**
  - High-conversion responsive landing page with interactive demos and feature highlights.
  - Secure authentication with token-based access control, protected routes, and session persistence.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework / Library** | [React 19](https://react.dev/) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) & [Zustand](https://zustand-demo.pmnd.rs/) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Icons & UI Utilities** | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/), [React Hot Toast](https://react-hot-toast.com/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |

---

## 📂 Architecture & Project Structure

```text
client/
├── public/                # Static assets and icons
├── src/
│   ├── (auth)/            # Authentication views (Login, Signup, Forgot Password)
│   ├── (dashboard)/       # Main application layout and dashboard routes
│   ├── api/               # Centralized Axios instances and API service functions
│   ├── components/
│   │   ├── common/        # Shared components (Sidebar, Topbar, ProtectedRoute, Modals)
│   │   ├── features/      # Domain-specific components
│   │   │   ├── campaign/  # Campaign creator wizard, list, and details
│   │   │   ├── contact/   # Contact list, import modal, filters
│   │   │   ├── dashboard/ # Analytics overview, charts, and summary cards
│   │   │   ├── settings/  # API keys, provider configuration, profiles
│   │   │   └── templates/ # Template list, editor, and mobile preview
│   │   └── UI/            # Reusable UI primitives (Buttons, Inputs, Badges, Toast)
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom reusable React hooks
│   ├── store/             # Redux slices & Zustand stores (with Redux Persist)
│   ├── utils/             # Helper functions, formatters, and validators
│   ├── App.jsx            # Top-level route configuration
│   ├── LandingPage.jsx    # Public marketing and landing page
│   ├── main.jsx           # Application entry point
│   └── index.css          # Tailwind and global styles
├── .env.example           # Example environment configuration
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or higher (recommended: LTS)
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PriyanshiGoyal-15/sendhub-client.git
   cd sendhub-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root of the `client` directory:

```env
# Backend API Base URL
VITE_BASE_URL=http://localhost:5000
```

### Running the App

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles and bundles production-ready assets into `dist/`. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs ESLint to check for code quality and syntax errors. |

---

## 🔒 Authentication & Route Protection

All private dashboard routes are wrapped with [`ProtectedRoute`](file:///Users/priyanshi/Priyanshi/Backend_Project/client/src/components/common/ProtectedRoute.jsx) to ensure that only authenticated sessions with valid tokens can access campaigns, contacts, templates, and settings.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
