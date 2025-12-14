# 🏃 Athletics Scoreboard System

A full-stack **Athletics Tournament Management & Live Scoreboard System** designed to manage athletes, events, heats, and race results while delivering a **real-time live leaderboard experience** similar to professional sports broadcasts.

This system enables administrators to manage competitions efficiently and allows viewers to track results live without refreshing the page.

---

## 🚀 Key Features

### 👤 Admin Features

* Add and manage athletes
* Create athletics events (e.g., 100m, 200m)
* Organize multiple heats per event
* Enter official race results
* Automatic ranking and position calculation
* Real-time leaderboard updates
* Toast notifications for successful actions and errors

---

### 👥 Viewer / User Features

* View upcoming and live events
* Watch **real-time leaderboards**
* See winner, runner-up, and podium standings
* Sports-broadcast-style UI experience

---

## 🏗️ System Modules

### 1️⃣ Athlete Management

* Register athletes with:

  * Name
  * Country
  * Age
  * Gender
* Centralized athlete database
* Clean and intuitive admin form
* Success and error notifications

---

### 2️⃣ Event Management

* Create athletics events with:

  * Event name (e.g., 100m Sprint)
  * Distance (in meters)
  * Category (Men / Women / U18)
* Events act as the **parent structure** for heats and results

---

### 3️⃣ Heat Management

* Each event can have multiple heats
* Athletes are assigned to specific heats
* Mirrors **real-world athletics competition formats**
* Handles large athlete participation efficiently

---

### 4️⃣ Results Management

* Admin enters:

  * Finish time
  * Reaction time (optional)
* The system automatically:

  * Calculates athlete positions
  * Sorts rankings
  * Updates the live leaderboard

---

### 5️ Live Leaderboard

* Displays:

  * 🥇 Winner
  * 🥈 Runner-up
  * 🥉 Third place
* Sports-style scrolling headline ticker
* Updates instantly using WebSockets
* No manual refresh required

---

## ⚙️ Ranking Logic

* Athletes are ranked based on **finish time**
* Fastest time → Position 1
* Tie-breakers can be extended (e.g., reaction time)
* Rankings recalculate automatically after result entry

---

##  UI / UX Highlights

* Sports-themed modern UI
* Podium-style winner display
* Live update indicators
* Smooth animations and transitions
* Glassmorphism card design
* Fully responsive layout

---

##  Notifications

* Toast notifications for:

  * Successful athlete creation
  * Successful result submission
  * Validation or server errors
* Non-blocking UX (no alerts or page reloads)



##  Tech Stack

### Frontend

* React
* Tailwind CSS
* shadcn/ui
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Sequelize ORM
* REST APIs
* Socket.IO (WebSockets)

### Database

* MySQL / PostgreSQL (via Sequelize)



##  Real-Time Data Flow

1. Admin enters race results
2. Backend processes rankings
3. WebSocket broadcasts updates
4. All connected clients receive instant updates



##  Competition Model 

### 🟦 What is an Event?

An **Event** represents the type of race.

**Examples:**

* 100m Sprint (Men)
* 200m Race (Women)

👉 Defines *what* race is being conducted.



### 🟧 What is a Heat?

A Heat is a smaller group of athletes competing within an event.

**Why heats are needed:**

* Too many athletes can’t race at once
* Tracks have limited lanes
* Matches real athletics competition standards

**Example:**

* Event: 100m Sprint

  * Heat 1: 8 athletes
  * Heat 2: 8 athletes

👉 Athletes compete **within heats**, not all together.



### 🟩 What are Results?

**Results** are the official race timings entered after a heat finishes.

Each result includes:

* Athlete
* Finish time
* Position

👉 Results determine the final rankings.



## 🏆 Ranking Summary

* Fastest athlete → 🥇 Winner
* Second fastest → 🥈 Runner-up
* Third fastest → 🥉 Third place
* Rankings are calculated automatically by the system



## ⚡ Live Leaderboard Experience

* Updates instantly when results are entered
* No page refresh required
* Displays:

  * Winner
  * Runner-up
  * Full rankings



