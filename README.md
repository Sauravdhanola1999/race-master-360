# 🏃 RaceMaster 360

<div align="center">

**A Professional Athletics Tournament Management & Live Scoreboard System**

*Real-time race results, instant rankings, and broadcast-style leaderboards*

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?logo=socket.io)](https://socket.io/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Key Modules](#-key-modules)
- [UI/UX Highlights](#-uiux-highlights)
- [Real-Time Updates](#-real-time-updates)
- [Contributing](#-contributing)

---

## 🎯 Overview

**RaceMaster 360** is a full-stack athletics tournament management system designed to streamline competition administration while delivering a professional, real-time viewing experience. The system enables administrators to efficiently manage athletes, events, heats, and race results, while viewers can track live leaderboards with instant updates—no page refresh required.

### Core Purpose

- **For Administrators**: Comprehensive dashboard to manage all aspects of athletics competitions
- **For Viewers**: Live, broadcast-style leaderboard experience with real-time updates
- **For Organizers**: Automated ranking calculations and instant result distribution

---

## ✨ Features

### 👤 Administrator Features

- **Athlete Management**
  - Add and manage athlete profiles (name, country, age, gender)
  - Personal best (PB) and season best (SB) tracking
  - Centralized athlete database with search and filtering
  - Edit and update athlete information

- **Event Management**
  - Create athletics events (100m, 200m, 400m, etc.)
  - Define event distance and category (Men/Women/U18)
  - Event listing and organization

- **Heat Management**
  - Organize multiple heats per event
  - Assign athletes to specific heats
  - Heat number and round management
  - Mirrors real-world athletics competition formats

- **Result Entry**
  - Enter official race results (finish time, reaction time)
  - Automatic position calculation
  - Real-time leaderboard updates
  - Validation and error handling

- **Dashboard Analytics**
  - Overview statistics (events, athletes, heats)
  - Quick navigation to all management sections
  - Real-time data visualization

### 👥 Viewer/Public Features

- **Live Leaderboard**
  - Real-time race results with WebSocket updates
  - Podium display (🥇 Winner, 🥈 Runner-up, 🥉 Third place)
  - Sports-style scrolling headline ticker
  - Full results table with positions and timings

- **Event Browsing**
  - View all upcoming and live events
  - Event details with distance and category
  - Heat listings per event
  - Responsive card-based layout

- **User Experience**
  - Broadcast-style UI with live indicators
  - Smooth animations and transitions
  - Confetti celebrations for winners
  - Fully responsive design (mobile, tablet, desktop)

---

## 📁 Project Structure

```
race-master-360/
├── public/                          # Static assets
│   ├── racemaster.png              # Logo
│   ├── runner-silhouette.webp      # Background assets
│   └── image.jpg                   # Profile images
│
├── src/
│   ├── auth/                       # Authentication
│   │   ├── AuthProvider.jsx       # Context provider for auth state
│   │   └── PrivateRoute.jsx       # Protected route wrapper
│   │
│   ├── components/                 # Reusable components
│   │   ├── Header.jsx             # Global navigation header
│   │   ├── LiveBadge.jsx          # Live indicator badge
│   │   ├── AthleteForm.jsx        # Athlete registration form
│   │   ├── CountrySelect.jsx      # Country selection component
│   │   └── ui/                     # shadcn/ui components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── table.jsx
│   │       ├── input.jsx
│   │       ├── select.jsx
│   │       ├── toast.jsx
│   │       └── ...
│   │
│   ├── pages/
│   │   ├── admin/                  # Admin panel pages
│   │   │   ├── AdminLayout.jsx    # Admin layout wrapper
│   │   │   ├── Dashboard.jsx      # Admin dashboard with stats
│   │   │   ├── Athletes.jsx        # Athlete management
│   │   │   ├── Events.jsx          # Event management
│   │   │   ├── Heats.jsx           # Heat management
│   │   │   └── ResultEntry.jsx     # Race result entry
│   │   │
│   │   ├── user/                   # Public-facing pages
│   │   │   ├── Home.jsx            # Landing page with events
│   │   │   ├── EventDetails.jsx    # Individual event view
│   │   │   └── LiveLeaderboard.jsx # Live results page
│   │   │
│   │   ├── Login.jsx               # Admin login page
│   │   └── NotFound.jsx            # 404 error page
│   │
│   ├── services/                    # API and WebSocket services
│   │   ├── api.js                  # Axios API client
│   │   └── socket.js               # Socket.IO client setup
│   │
│   ├── hooks/                       # Custom React hooks
│   │   └── use-toast.js            # Toast notification hook
│   │
│   ├── lib/                         # Utility functions
│   │   └── utils.js                # Helper functions (cn, etc.)
│   │
│   ├── utils/                       # Additional utilities
│   │   └── helpers.js              # General helper functions
│   │
│   ├── App.jsx                      # Main app component with routing
│   ├── main.jsx                     # Application entry point
│   └── index.css                    # Global styles and animations
│
├── .env                             # Environment variables
├── components.json                  # shadcn/ui configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── vite.config.js                   # Vite build configuration
├── package.json                      # Dependencies and scripts
└── README.md                        # This file
```

### Key Directories Explained

- **`src/pages/admin/`**: Complete admin panel for managing competitions
- **`src/pages/user/`**: Public-facing pages for viewing events and results
- **`src/components/ui/`**: Reusable UI components built with shadcn/ui
- **`src/services/`**: API communication and WebSocket real-time updates
- **`src/auth/`**: Authentication and route protection logic

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **Vite** | 7.2.4 | Build tool and dev server |
| **React Router DOM** | 7.10.1 | Client-side routing |
| **Tailwind CSS** | 3.4.19 | Utility-first CSS framework |
| **shadcn/ui** | Latest | High-quality component library |
| **Socket.IO Client** | 4.8.1 | Real-time WebSocket communication |
| **Axios** | 1.13.2 | HTTP client for API requests |
| **React Confetti** | 6.4.0 | Celebration animations |
| **JWT Decode** | 4.0.0 | Token authentication |

### Backend (Referenced)

- **Node.js** with **Express.js**
- **Sequelize ORM** for database operations
- **Socket.IO** for WebSocket server
- **MySQL/PostgreSQL** database
- **JWT** for authentication

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- Backend API server running (see backend repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd race-master-360
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in root directory
   VITE_API_URL=http://localhost:3000/api
   VITE_SOCKET_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

---

## 🏗️ Architecture

### Application Flow

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  React Frontend │◄────►│  REST API    │
│  (Vite + React) │      │  (Express)   │
└────────┬────────┘      └──────┬───────┘
         │                       │
         │ WebSocket             │
         │ (Socket.IO)           │
         ▼                       ▼
┌─────────────────┐      ┌──────────────┐
│  Live Updates   │      │  Database    │
│  (Real-time)    │      │  (MySQL/     │
│                 │      │   PostgreSQL)│
└─────────────────┘      └──────────────┘
```

### Routing Structure

- **`/`** - Home page (public events listing)
- **`/event/:id`** - Event details page
- **`/live`** - Live leaderboard (with eventId query param)
- **`/login`** - Admin authentication
- **`/admin`** - Admin dashboard (protected)
  - **`/admin/athletes`** - Athlete management
  - **`/admin/events`** - Event management
  - **`/admin/heats`** - Heat management
  - **`/admin/results`** - Result entry

---

## 🔑 Key Modules

### 1. Authentication System

- **JWT-based authentication** for admin access
- **Protected routes** using `PrivateRoute` component
- **Auth context** for global state management
- **Automatic token validation** and refresh

### 2. Athlete Management

- **CRUD operations** for athlete profiles
- **Country selection** with search functionality
- **Personal best tracking** (PB and SB)
- **Gender categorization** (Male/Female/Other)
- **Responsive data tables** with pagination

### 3. Event & Heat Management

- **Hierarchical structure**: Events → Heats → Results
- **Event categorization** by distance and category
- **Heat organization** with round management
- **Athlete assignment** to specific heats

### 4. Result Entry System

- **Form validation** for race results
- **Automatic position calculation** based on finish time
- **Reaction time tracking** (optional)
- **Real-time leaderboard updates** via WebSocket
- **Error handling** with user-friendly notifications

### 5. Live Leaderboard

- **WebSocket integration** for instant updates
- **Podium visualization** (top 3 athletes)
- **Scrolling marquee** with winner announcements
- **Full results table** with all positions
- **Confetti animations** for winners
- **Responsive design** for all devices

---

## 🎨 UI/UX Highlights

### Design System

- **Dark theme** with sports-inspired color palette
- **Glassmorphism effects** for modern card designs
- **Smooth animations** and transitions
- **Responsive grid layouts** for all screen sizes
- **Touch-optimized** for mobile devices

### Key UI Components

- **Fixed header** with sticky navigation
- **Live badge indicators** with pulsing animations
- **Toast notifications** for user feedback
- **Responsive tables** with horizontal scrolling on mobile
- **Card-based layouts** with hover effects
- **Loading states** and empty state designs

### Responsive Breakpoints

- **Mobile**: < 640px (optimized for phones)
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## 🔄 Real-Time Updates

### WebSocket Integration

The application uses **Socket.IO** for real-time communication:

1. **Connection**: Client connects to WebSocket server on page load
2. **Room Joining**: Client joins specific event leaderboard room
3. **Updates**: Server broadcasts result updates to all connected clients
4. **Automatic Sync**: UI updates instantly without page refresh

### Update Flow

```
Admin enters result
    ↓
Backend processes & calculates rankings
    ↓
WebSocket broadcasts update
    ↓
All connected clients receive update
    ↓
UI updates automatically
```

---

## 📱 Responsive Design

The application is fully responsive and optimized for:

- ✅ **Mobile phones** (320px and up)
- ✅ **Tablets** (768px and up)
- ✅ **Desktop** (1024px and up)
- ✅ **Large screens** (1440px and up)

### Mobile Optimizations

- Compact header with hamburger menu
- Touch-friendly buttons (44px minimum)
- Horizontal scrolling tables
- Stacked layouts for forms
- Optimized font sizes and spacing

---

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style

- **ESLint** for code quality
- **Prettier** (recommended) for formatting
- **Component-based** architecture
- **Custom hooks** for reusable logic


## 👥 Support

For issues, questions, or contributions, please contact the development team.

---

<div align="center">

**Built with ❤️ for Athletics Competitions**

*RaceMaster 360 - Where Every Millisecond Matters*

</div>
