# SafeRide Frontend

SafeRide is a next-generation, AI-driven driver wellness and blockchain safety solution. This repository contains the complete frontend implementation, designed to deliver a seamless, intuitive, and high-impact user experience. The UI is built with a modern glassmorphism aesthetic and is fully responsive for desktop, tablet, and mobile devices.

## Features

The application is structured into several key modules, each with a rich set of features:

### 1. Landing & Authentication
- **Multi-Section Landing Page:** A visually engaging introduction to SafeRide, detailing its features, impact, and technology.
- **Complete Authentication Flow:** User-friendly screens for login, registration, and password reset.

### 2. Driver Dashboard
- **Real-Time Wellness Indicators:** AI-powered widgets display critical driver stats like fatigue level, alertness, and overall health.
- **Incident Management:** An alert system for immediate incident capture and a detailed history log for past events.
- **Route Planner:** An integrated map interface for planning and visualizing routes.

### 3. Insurance Module
- **Blockchain-Verified Certificates:** Instantly verify insurance certificates against immutable blockchain records.
- **Policy & Claims Management:** A clear interface to view policy status, manage claims, and upload necessary documents.

### 4. Blockchain Integration
- **Tamperproof Trip History:** A transparent and accessible log of all trip histories and safety events recorded on the blockchain.
- **Record Verification:** View hash details, timestamps, and verification status for each blockchain record.

### 5. Interactive Features
- **Live Chat Support:** A persistent widget for instant user support.
- **Feedback & Bug Reporting:** A modal-based system for users to submit feedback and report issues.
- **Notification Center:** A centralized hub for safety alerts, system updates, and other important notifications.

## Tech Stack

- **Framework:** [React](https://reactjs.org/) (with TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **State Management:** React Context API
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)

## Project Structure

The codebase is organized into a scalable and maintainable structure:

```
src/
|-- components/    # Reusable UI components (widgets, cards, layout elements)
|-- context/       # Global state management (Feedback, MobileMenu)
|-- pages/         # Top-level page components (Dashboard, Login, Landing)
|-- App.tsx        # Main application component
|-- Router.tsx     # Application routing configuration
|-- index.tsx      # Entry point of the application
```

## Getting Started

To get the project up and running on your local machine, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd saferide-frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Start the development server:**
    ```sh
    npm start
    ```

The application will be available at `http://localhost:3000`.

## Available Scripts

-   `npm start`: Runs the app in development mode.
-   `npm test`: Launches the test runner.
-   `npm run build`: Builds the app for production.

## Deployment

This section will be updated with detailed instructions for deploying the application to a production environment.
