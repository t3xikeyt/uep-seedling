# UEP Seedling Management System

This project is a full-stack seedling inventory system built with React, Vite, Express, and MySQL.

## Tech stack

- React + Vite frontend
- Node.js + Express backend
- MySQL database
- JWT authentication
- REST API endpoints

## Requirements

- Node.js 18+
- npm
- MySQL running locally
- Optional: XAMPP for local MySQL

## 1. Install dependencies

From the project root:

```bash
npm install
```

## 2. Start MySQL

Make sure your MySQL service is running before starting the backend.

If you are using XAMPP:

- Open XAMPP Control Panel
- Start MySQL

If you are using another local MySQL setup, make sure it is running on:

- Host: localhost
- Port: 3306
- User: root
- Database: uep_seedling

## 3. Environment variables

The project already contains a `.env` file with the default values:

```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=uep_seedling
DB_PORT=3306
JWT_SECRET=uep-seedling-super-secret
VITE_API_URL=http://localhost:5001/api
```

If your local MySQL credentials are different, edit the values in `.env`.

## 4. Run the system

Start the backend and frontend together:

```bash
npm run dev
```

This starts:

- Backend API: http://localhost:5001
- Frontend app: http://localhost:5173

If port 5173 is busy, Vite will automatically use the next available port, such as 5174.

## 5. Open the app

Open the browser and go to:

```text
http://localhost:5173
```

If Vite selected another port, use that port instead.

## 6. Default login accounts

The server automatically creates default users when the database is available.

- Admin
  - Username: admin
  - Email: admin@uep.edu.ph
  - Password: 123

- Staff
  - Username: staff
  - Email: staff@uep.edu.ph
  - Password: 123

- Requester
  - Username: requester
  - Email: requester@uep.edu.ph
  - Password: 123

## 7. Useful commands

Run backend only:

```bash
npm run backend
```

Run frontend only:e

```bash
npm run frontend
```

Build the frontend for production:

```bash
npm run build
```

## Troubleshooting

### MySQL connection error

If the backend reports `Unknown database`, `ECONNREFUSED`, or cannot connect to MySQL:

- Start MySQL
- Check `.env` values
- Verify the database name is `uep_seedling`

### Port already in use

If `PORT=5001` is already in use, stop the old process or change the port in `.env`.

### Frontend cannot reach backend

Make sure the backend is running before opening the app, and confirm that the proxy is pointing to the correct API URL.

## Database behavior

The app automatically creates the `uep_seedling` database and required tables on startup if MySQL is available.
