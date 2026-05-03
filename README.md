---

## 🛣️ API Endpoints

### Auth
*   `POST /auth/register` - Create a new account.
*   `POST /auth/login` - Authenticate and receive tokens.
*   `POST /auth/refresh` - Rotate expired Access Tokens using HttpOnly cookies.

### Tasks
*   `GET /task/count` - Get task numbers based on role scope.
*   `POST /task` - Create a new task (validated by role).
*   `PUT /task/:id` - Update task status or assignment.
*   `DELETE /task/:id` - Update task status or assignment.

### Users
*   `GET /user/users` - Fetch team members (Filtered by department for Dept Heads).

---

## 👤 Author
**Dipen (Dinesh) Boro**
*   Full-Stack Developer.
*   Submission for Zakti Digital Take-home Assignment.

---

---

# 🚀 Department Task Manager with RBAC

A secure, full-stack Task Management System featuring **Role-Based Access Control (RBAC)** and **Department-level Resource Isolation**. Built for the **Zakti Digital** take-home assignment.

## 📑 Table of Contents
* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [RBAC Permission Matrix](#-rbac-permission-matrix)
* [Installation & Setup](#-installation--setup)
* [API Endpoints](#-api-endpoints)

---

## ✨ Features

*   **Secure Authentication**: JWT-based authentication with Access and Refresh token rotation.
*   **Role-Based Access Control**: Three distinct roles (**Org Admin**, **Dept Head**, and **Member**) with specific permissions.
*   **Resource Isolation**: Users can only see and manage data relevant to their department or themselves.
*   **Dashboard Analytics**: Real-time task counting for quick status overviews.
*   **Dynamic UI**: A responsive React interface that adapts its components and navigation based on user roles.

## 💻 Tech Stack

**Frontend:**
*   **React (Vite)** with **TypeScript** for type safety.
*   **Tailwind CSS** for modern, responsive styling.
*   **React Router** for secure role-based routing.
*   **Axios** with Interceptors for automatic token refreshing.

**Backend:**
*   **Node.js** & **Express**.
*   **MongoDB** & **Mongoose** for schema-based data modeling.
*   **Express-Validator** for robust request validation.
*   **JWT** for secure identity management.
*   **BCRYPT** for password hashing.


---

## 🛡️ RBAC Permission Matrix

| Feature | Org Admin | Dept Head | Member |
| :--- | :---: | :---: | :---: |
| View All Tasks | ✅ | ❌ | ❌ |
| View Dept Tasks | ✅ | ✅ | ❌ |
| Create/Edit Tasks | ✅ | ✅ (In Dept) | ✅ (Self) |
| Manage Users | ✅ | ❌ | ❌ |
| View Dashboard | ✅ (Global) | ✅ (Dept) | ✅ (Self) |

---

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository
```bash
git clone <your-repo-link>
cd <client>
npm install 
cd <backend>
npm i

### 2. Create a .env file in the backend folder:
```bash
PORT=8080
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
```bash

### 3. Run the both porject 
npm run dev
