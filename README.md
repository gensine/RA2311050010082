# Notification System

A full-stack notification management system built with React, TypeScript, and Express.

## Project Structure

```
├── logging_middleware/       # Reusable logging package (TypeScript)
├── notification_system_design.md  # Architecture & design document
├── notification_app_be/      # Express + TypeScript backend (REST API)
└── notification_app_fe/      # React + TypeScript + Vite frontend
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Vanilla CSS
- **Backend**: Express, TypeScript, ts-node
- **Logging**: Custom logging middleware (TypeScript)

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Run the Backend

```bash
cd notification_app_be
npm install
npx ts-node src/index.ts
```

Backend runs at `http://localhost:5000`

### Run the Frontend

```bash
cd notification_app_fe
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List all notifications |
| POST | `/notifications` | Create a notification |
| PATCH | `/notifications/:id/read` | Mark as read |
| DELETE | `/notifications/:id` | Delete a notification |

## Features

- Create, read, update, delete notifications
- Notification types: Info, Warning, Error, Success
- Dark mode UI with glassmorphism design
- Integrated structured logging on every API call
- Responsive layout
