# Inventory System — Frontend

The frontend of the Inventory System, built with **React, TypeScript, and Vite**.

It provides the user interface for interacting with the Spring Boot backend through REST APIs.

## Tech Stack

| Technology | Purpose                           |
| ---------- | --------------------------------- |
| React      | UI framework                      |
| TypeScript | Type-safe JavaScript              |
| Vite       | Development server and build tool |
| Fetch API  | Backend API communication         |
| ESLint     | Code linting                      |

## Features

The frontend is organized around the system's business domains:

* Authentication
* Dashboard
* Users
* Products
* Vendors
* Customers
* Warehouses
* Locations
* Inventory
* Stock Movements
* Purchase Orders
* Sales Orders

## Project Structure

```text
src/
├── api/
│   ├── client.ts
│   └── productApi.ts
│
├── app/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── assets/
│
└── features/
    ├── auth/
    ├── customers/
    ├── dashboard/
    ├── inventory/
    ├── locations/
    ├── products/
    ├── purchase-orders/
    ├── sales-orders/
    ├── stock-movements/
    ├── users/
    ├── vendors/
    └── warehouses/
```

### API

The `api/` directory contains the code responsible for communicating with the backend.

```text
api/
├── client.ts
└── productApi.ts
```

`client.ts` provides the common API request function, while feature-specific API files contain requests for individual resources.

### Features

The `features/` directory organizes the frontend by business domain.

Each feature contains the UI related to that domain.

For example:

```text
features/
└── products/
    └── pages/
        └── ProductPage.tsx
```

This keeps related frontend code grouped together instead of putting all pages into one large directory.

## Backend Connection

The frontend communicates with the Spring Boot backend through REST APIs.

By default, API requests are sent to:

```text
http://localhost:8080/api
```

The API base URL can be configured using:

```text
VITE_API_BASE_URL
```

For example:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm

### Install Dependencies

From the frontend directory:

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Vite will display the local development URL in the terminal, normally:

```text
http://localhost:5173
```

Open that address in your browser.

## Running with the Backend

The frontend and backend run as separate development servers.

Start the backend in one terminal:

```bash
cd inventory-system-backend
./mvnw spring-boot:run
```

Then start the frontend in another terminal:

```bash
cd inventory-system-frontend
npm run dev
```

The development setup is:

```text
React + TypeScript
localhost:5173
        │
        │ REST API
        ▼
Spring Boot
localhost:8080
        │
        ▼
PostgreSQL
```

Both the frontend and backend need to be running for the complete application to function.

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the frontend for production.

```bash
npm run lint
```

Runs ESLint to check the code.

```bash
npm run preview
```

Previews the production build locally.
