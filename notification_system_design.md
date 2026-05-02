# Notification System — Architecture Design Document

## Overview

A full-stack notification management system consisting of a **React (TypeScript)** frontend, a **Node.js/Express (TypeScript)** backend, and a **reusable logging middleware** package that reports structured log entries to an external evaluation server.

---

## System Architecture

```
┌─────────────────────────────────┐
│      notification_app_fe        │
│   React + TypeScript + Vite     │
│                                 │
│  ┌───────────┐  ┌────────────┐  │
│  │ Components │  │  Hooks     │  │
│  │ (UI Layer) │  │ (Data Mgmt)│  │
│  └─────┬─────┘  └─────┬──────┘  │
│        │              │          │
│        └──────┬───────┘          │
│               │                  │
│         ┌─────▼──────┐           │
│         │  API Layer  │           │
│         └─────┬──────┘           │
└───────────────┼──────────────────┘
                │ HTTP REST
                ▼
┌─────────────────────────────────┐
│      notification_app_be        │
│   Express + TypeScript          │
│                                 │
│  ┌────────┐  ┌──────────────┐   │
│  │ Routes │──▶  Handlers    │   │
│  └────────┘  └──────┬───────┘   │
│                     │            │
│              ┌──────▼───────┐   │
│              │   Services   │   │
│              └──────┬───────┘   │
│                     │            │
│              ┌──────▼───────┐   │
│              │  Data Store  │   │
│              │ (In-Memory)  │   │
│              └──────────────┘   │
└─────────────────────────────────┘

Both FE and BE use:
┌─────────────────────────────────┐
│       logging_middleware        │
│  Standalone TypeScript Package  │
│                                 │
│  Log(stack, level, pkg, msg)    │
│         │                       │
│         ▼ POST                  │
│  ┌──────────────────────────┐   │
│  │  Evaluation Log Server   │   │
│  │  /evaluation-service/logs│   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

---

## Data Flow

1. **User** interacts with the React frontend (create, read, mark-as-read, delete notifications).
2. **Frontend** sends HTTP requests to the Express backend via REST API.
3. **Backend** processes requests through the Routes → Handlers → Services → Data Store pipeline.
4. **Responses** flow back through the same layers to the frontend.
5. **Logging**: Both FE and BE call `Log()` from the shared `logging_middleware` package at strategic points (component mounts, API calls, route hits, errors, state changes).

---

## API Contract (Frontend ↔ Backend)

| Method   | Endpoint               | Description                  | Request Body                                                    | Response                        |
|----------|------------------------|------------------------------|-----------------------------------------------------------------|---------------------------------|
| `POST`   | `/notifications`       | Create a new notification    | `{ title, message, type }`                                     | `201` — Created notification    |
| `GET`    | `/notifications`       | Fetch all notifications      | —                                                               | `200` — Array of notifications  |
| `PATCH`  | `/notifications/:id`   | Mark notification as read    | `{ read: true }`                                               | `200` — Updated notification    |
| `DELETE` | `/notifications/:id`   | Delete a notification        | —                                                               | `200` — Deletion confirmation   |

### Notification Schema

```typescript
interface Notification {
  id: string;          // UUID v4
  title: string;       // Notification title
  message: string;     // Notification body
  type: "info" | "warning" | "error" | "success";
  read: boolean;       // Read/unread state
  createdAt: string;   // ISO 8601 timestamp
}
```

---

## Logging Strategy

### Logging Middleware Package

The `logging_middleware` package exposes a single function:

```typescript
Log(stack: string, level: string, pkg: string, message: string): Promise<void>
```

- Sends a POST request to the evaluation log server with a Bearer token.
- Handles errors gracefully — never crashes the calling application.
- Token is configured via environment variable or runtime setter.

### Log Placement

| Layer              | Stack      | Package      | Example Messages                                   |
|--------------------|------------|--------------|-----------------------------------------------------|
| Express Routes     | `backend`  | `route`      | `"POST /notifications route hit"`                   |
| Request Handlers   | `backend`  | `handler`    | `"Creating notification: {title}"`                  |
| Business Logic     | `backend`  | `service`    | `"Notification created successfully: id=..."`       |
| Data Store         | `backend`  | `db`         | `"Stored notification in memory: id=..."`           |
| React Pages        | `frontend` | `page`       | `"Notifications page loaded"`                       |
| React Components   | `frontend` | `component`  | `"NotificationList mounted with 5 items"`           |
| API Client         | `frontend` | `api`        | `"Fetching notifications from backend"`             |
| Custom Hooks       | `frontend` | `hook`       | `"useNotifications: data refreshed"`                |
| State Management   | `frontend` | `state`      | `"Notification marked as read: id=123"`             |

### Log Levels Used

| Level   | When Used                                          |
|---------|-----------------------------------------------------|
| `debug` | Component mounts, hook calls, state changes         |
| `info`  | Page loads, API call starts, successful operations  |
| `warn`  | Unexpected but recoverable situations               |
| `error` | API failures, validation errors, caught exceptions  |
| `fatal` | Critical failures (DB connection lost, etc.)        |

---

## Key Design Decisions

| Decision                          | Rationale                                                                 |
|-----------------------------------|---------------------------------------------------------------------------|
| **In-memory data store**          | Simplicity for evaluation; no external DB dependency needed               |
| **Vite + React (not Next.js)**    | Lightweight, fast dev server, sufficient for SPA notification app         |
| **Vanilla CSS (not MUI)**         | Full design control, premium dark-mode glassmorphism aesthetic            |
| **Polling (not WebSocket/SSE)**   | Simpler implementation; adequate for evaluation scope                     |
| **UUID v4 for IDs**               | Globally unique, no collision risk with in-memory store                   |
| **Shared logging package**        | Single source of truth for log format; reusable across FE and BE         |
| **TypeScript throughout**         | Type safety, better DX, consistent across all three packages              |

---

## Technology Stack

| Component            | Technology                        |
|----------------------|-----------------------------------|
| Frontend Framework   | React 18 + TypeScript             |
| Frontend Build Tool  | Vite                              |
| Frontend Styling     | Vanilla CSS (dark mode, glassmorphism) |
| Backend Framework    | Express.js + TypeScript           |
| Backend Runtime      | Node.js (ts-node for dev)         |
| Data Storage         | In-memory Map                     |
| Logging              | Custom middleware → Evaluation server |
| Package Manager      | npm                               |

---

## Folder Structure

```
RA2311050010082/
├── .gitignore
├── notification_system_design.md    ← This file
├── logging_middleware/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts                 ← Log() function
├── notification_app_be/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   └── src/
│       ├── index.ts                 ← Express server entry
│       ├── types/
│       │   └── notification.ts      ← Interfaces
│       ├── routes/
│       │   └── notifications.ts     ← Route definitions
│       ├── handlers/
│       │   └── notifications.ts     ← Request handlers
│       ├── services/
│       │   └── notifications.ts     ← Business logic
│       └── db/
│           └── store.ts             ← In-memory store
└── notification_app_fe/
    ├── package.json
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── main.tsx                 ← App entry
        ├── App.tsx                  ← Root component
        ├── api/
        │   └── notifications.ts     ← API client
        ├── components/
        │   ├── NotificationList.tsx
        │   ├── NotificationCard.tsx
        │   └── CreateNotificationForm.tsx
        ├── hooks/
        │   └── useNotifications.ts
        ├── pages/
        │   └── index.tsx
        ├── state/
        │   └── notificationState.ts
        └── styles/
            └── index.css
```

---

## Security Considerations

- Bearer tokens stored in `.env` files (gitignored).
- CORS configured on backend to allow frontend origin only.
- Input validation on all API endpoints.
- Logging middleware never exposes tokens in log messages.

---

## Scalability Notes (Future)

- Replace in-memory store with PostgreSQL/MongoDB for persistence.
- Add WebSocket/SSE for real-time push notifications.
- Add user authentication for multi-tenant support.
- Add pagination for notification list endpoints.
