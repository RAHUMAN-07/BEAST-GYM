# ⚡ BEAST GYM — High-Performance Athletic Sanctuary

![BEAST GYM Banner](public/gym_hero.png)

> **BEAST GYM** is a state-of-the-art, high-performance web application designed for elite athletes and fitness enthusiasts. Built with a striking **Electric Cyber Green & Deep Obsidian Black** theme, dynamic scroll-driven fly-in animations, an interactive 7-Day Workout & Macro Planner, and a full Node.js/SQLite backend API.

---

## 🌟 Key Features

### 🎬 1. Animated Opening Screen
- **Cinematic Entrance**: Glowing neon green letter cascade for `BEAST GYM` with background particle animations on initial site visit.

### 📜 2. Dynamic Scroll Fly-In Animations
- **Viewport Scroll Triggers**: Headlines (`BEAST GYM`, `WE EXIST TO BUILD BEASTS`, `SIX WEAPONS FOR YOUR GOALS`, `GET YOUR BEAST PLAN`, `LET'S TALK PERFORMANCE`) split into words and fly in smoothly from external bounds as you scroll.

### 🏋️ 3. Personalized 7-Day Workout & Macro Planner
- **Interactive 4-Step Wizard**: Collects user profile (Age, Height, Weight, Gender), training goals (Fat Loss, Muscle Gain, Raw Strength), experience level, and schedule.
- **Science-Backed TDEE & Macro Calculator**: Mifflin-St Jeor equation generates daily caloric target, Protein, Carbs, and Fat targets with visual progress bars.
- **Bespoke 7-Day Split**: Generates daily exercise routines, sets, reps, rest intervals, form tips, and weekly progression protocols.

### 🖼️ 4. Interactive High-Res Gym Gallery
- **Pexels & Unsplash Stock Photography**: Real-world high-resolution photography covering Olympic Power Racks, HIIT Turf, Cryo Plunge Tubs, and Boxing Arenas.
- **Full-Screen Lightbox Modal**: Click any gallery item for an enlarged preview with facility location details and descriptions.

### 🌐 5. Single-Layer Smooth Navigation
- Seamless multi-page layout switching between **Home**, **About Us**, **Services**, **Gallery**, **🎯 Get My Plan**, and **Contact Us**.

### 🔐 6. Full Stack Authentication & Database Backend
- **User Authentication**: JWT-based Login & Signup with hashed passwords.
- **Onboarding Wizard**: Saves user body metrics, fitness goals, and preferences.
- **SQLite Database**: Auto-initialized schema tracking users, workouts, nutrition logs, and admin statistics.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Core** | React 18, TypeScript, Vite |
| **Styling & Motion** | Tailwind CSS, Custom CSS Keyframe Animations, Google Fonts (Anton, Outfit, Inter) |
| **UI Components** | Lucide React Icons, Custom Modals, Lightbox Preview |
| **Backend API** | Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs |
| **Database** | SQLite3 / `sqlite` (Persistent local storage) |
| **Development** | Concurrently, Nodemon |

---

## 📂 Project Structure

```text
BEAST-GYM/
├── public/
│   ├── favicon.svg
│   └── gym_hero.png
├── server/
│   ├── db/
│   │   ├── database.js          # SQLite connection & table initialization
│   │   └── fitpulse.db
│   ├── middleware/
│   │   └── auth.js              # JWT auth verification middleware
│   ├── routes/
│   │   ├── auth.js              # Signup & login endpoints
│   │   ├── workouts.js          # Workout logging & routines
│   │   ├── nutrition.js         # Daily macro & meal logging
│   │   ├── progress.js          # Weight & measurement logs
│   │   └── admin.js             # Admin dashboard analytics
│   └── server.js                # Express app entrypoint
├── src/
│   ├── components/
│   │   ├── auth/                # Login / Signup modals
│   │   ├── common/              # Navbar, OpeningScreen, ScrollFlyInHeadline
│   │   ├── landing/             # PricingSection, TrainerProfiles, Testimonials
│   │   ├── nutrition/            # MealLoggerModal, GroceryListModal
│   │   └── onboarding/           # OnboardingWizard
│   ├── context/
│   │   └── AuthContext.tsx       # Auth & User state context
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── GalleryPage.tsx
│   │   ├── WorkoutPlannerPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── DashboardPage.tsx
│   ├── services/
│   │   └── api.ts               # Axios / Fetch client API layer
│   ├── App.tsx
│   ├── index.css                # Global cyber green design system & utility classes
│   └── main.tsx
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/RAHUMAN-07/BEAST-GYM.git
   cd BEAST-GYM
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_beast_key_2026
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the Development Server**
   To start both the **Vite Frontend Dev Server** and **Express Backend Server** concurrently:
   ```bash
   npm run dev
   ```

   - **Frontend**: Open `http://localhost:5173` in your browser.
   - **Backend API**: Running on `http://localhost:5000`.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `POST` | `/api/onboarding` | Submit initial onboarding metrics |
| `GET` | `/api/workouts` | Retrieve saved workout routines |
| `POST` | `/api/workouts/log` | Log a completed workout session |
| `GET` | `/api/nutrition/today` | Fetch daily macro targets and logged meals |
| `POST` | `/api/nutrition/log` | Add a new meal to nutrition log |

---

## 🎨 Design System & Colors

- **Primary Electric Green**: `#00ff66`
- **Secondary Emerald**: `#10b981`
- **Deep Obsidian Background**: `#050a07`
- **Card Container**: `#080e0a`
- **Border Utility**: `border-emerald-900/60`
- **Typography**: `Anton` (Display Headlines), `Outfit` (Subheaders), `Inter` (Body Text)

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Created & Maintained By

**BEAST GYM Team** — Built with passion for fitness, modern design, and high performance.
- GitHub: [@RAHUMAN-07](https://github.com/RAHUMAN-07)
