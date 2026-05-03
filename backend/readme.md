# 🚀 Task Manager API (Enterprise Edition)

A secure, production-grade RESTful API for task management, built with Node.js, Express, and MongoDB. 

This API features robust Role-Based Access Control (RBAC), advanced JWT authentication, and strict data validation to ensure secure operations between Admins and Employees.

## ✨ Key Features

* **Advanced Authentication:** Implements a dual-token system. Short-lived Access Tokens (15 min) for security, paired with HttpOnly Refresh Tokens (7 days) for seamless user experience.
* **Role-Based Access Control (RBAC):** Strict separation of privileges. Admins have global access, while Employees are restricted to interacting only with tasks explicitly assigned to them.
* **Smart Update Routing:** Prevents privilege escalation. Employees can only update task statuses, while Admins can reassign and modify full task payloads through the same unified endpoint.
* **Data Validation & Sanitization:** Utilizes `express-validator` to ensure all incoming data is structurally sound, type-safe, and stripped of malicious inputs before hitting the database.
* **Clean Architecture:** Strict separation of concerns (Routes -> Controllers -> Services) for highly maintainable and testable code.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Security:** `jsonwebtoken` (JWT), `bcrypt` (Password Hashing)
* **Validation:** `express-validator`
* **Error Handling:** Custom `AppError` and `asyncHandler` wrappers

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd task_manager/backend


2. **Clone the repository**
   ```bash
      npn i 
  ```


3. **Environment Configuration
Create a .env file in the root directory and add the following variables:
    ```
    PORT=8081
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_access_key

    REFRESH_SECRET=your_super_secret_refresh_key
    ```

3. **Start the server

Authentication /api/v1/auth
    /register
    /login
    /refresh

Users /api/v1/users
    /employee

Tasks /api/v1/tasks
    /create
    /:id
    /:id/assign
