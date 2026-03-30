# Learner360° 🎓

Learner360° is a modern, scalable, and premium educational platform designed to provide an unparalleled learning and administrative experience. Migrated from a legacy architecture to a robust Next.js application, it offers rich features ranging from comprehensive course catalogs to robust administrative user management and event booking.

## 🚀 Key Features

*   **Modern Next.js Architecture**: Built with the Next.js App Router for optimal performance, server-side rendering, and seamless routing.
*   **Premium Visual Design**: Features a refined, high-end "Premium Light" theme (Wild Sand/Zinc palette) using Tailwind CSS, complete with glassmorphism components, gradients, and micro-animations.
*   **Curated Course Catalog**: Realistic, industry-relevant educational content for 2025 across popular domains like Web Development and Data Science.
*   **Placement & Career Opportunities**: Real-world placement data, featuring top-tier IT companies, salary ranges, and hiring trends.
*   **Administrative Control Panel**: A secure and robust user management system for viewing, editing, and deleting user accounts with detailed status tracking.
*   **Dynamic Event Booking**: Interactive event discovery with dynamic filter pills (e.g., 'Today', 'Tomorrow', 'Party') inspired by modern ticket booking platforms.
*   **Database-Backed Setup**: Integrated with Prisma and SQLite for efficient data modeling, seeding, and retrieval.

## 🛠️ Technology Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (React)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database ORM**: [Prisma](https://www.prisma.io/)
*   **Database**: SQLite

## 📦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18.17 or higher) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ramireddyhari1/lms.git
   cd lms/learner-next
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup the Database:
   Initialize the Prisma SQLite database and seed it with realistic, curated platform data.
   ```bash
   npx prisma db push
   # If you have a seed script configured:
   npx prisma db seed
   ```

4. Run the Development Server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to view the application in its premium light theme.

## 🏗️ Project Structure

*   **`/src/app`**: Contains the Next.js application routes (e.g., `/teams`, `/learner`, `/notifications`, `/support`).
*   **`/src/components`**: Reusable UI components (Sidebar, Navbar, Custom Cards, Filter Pills).
*   **`/prisma`**: Database schema and data seeding scripts.
*   **`/public`**: Static assets, images, and fonts ensuring a cinematic aesthetic.

## 🤝 Contribution

Contributions are welcome! Please ensure that your pull requests adhere to the premium design guidelines (avoiding absolute blacks, utilizing the Wild Sand palette) and maintain strict type safety across the project.

---
*Developed with ❤️ as part of the Learner 1.3 Initiative.*
