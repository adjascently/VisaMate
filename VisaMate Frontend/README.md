#  VisaMate Frontend

Frontend application for **VisaMate**, an AI-powered visa and immigration assistance platform.

VisaMate’s frontend delivers a clean, intuitive, and responsive user experience that simplifies how users interact with complex visa and immigration information. It acts as the primary interface between users and the platform’s AI-driven backend services.

Built with **React (TypeScript)** and powered by **Vite**, the application emphasizes speed, scalability, and maintainability. The architecture is modular and component-driven, making it easy to extend and iterate on features.

Through seamless API integration, users can:
- Ask visa-related queries  
- Access structured policy insights  
- Interact with dynamically generated responses  
- Navigate an easy-to-use, responsive interface  

The goal of this frontend is to transform traditionally complex and fragmented immigration processes into a streamlined, user-friendly digital experience.

---

##  Tech Stack

- **React (TypeScript)**
- **Vite**
- **CSS / Global Styles**
- **API Integration (Backend Services)**

---

## 📁 Project Structure

```bash
visamate-frontend/
│
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
│
├── src/
│   ├── App.tsx             # Root component
│   ├── main.tsx            # App entry point
│   ├── index.css           # Base styles
│
│   ├── components/         # Reusable UI components
│   ├── services/           # API calls (e.g., api.ts)
│   ├── utils/              # Helper functions
│   ├── styles/             # Global styles
│
└── README.md
```

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd visamate-frontend
```

### 2. Install dependencies
```bash
npm install
```
---

## Running the Frontend

Start the development server:
```bash
npm run dev
```
By default, the app will run at:
```bash
http://localhost:5173
```

---

## Backend Integration

This frontend communicates with the VisaMate backend API.

Make sure your backend is running (typically at):
```bash
http://127.0.0.1:8000
```
Update API endpoints inside if needed in:
```bash
src/services/api.ts
```
---


## Development Workflow

Typical workflow:

- Start backend server
- Start frontend server
- Make changes in components/services
- View updates live in browser
