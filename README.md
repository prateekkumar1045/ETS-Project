# ETSProject

A full-stack Employee Tracking System built with React (frontend) and Node.js/Express/MongoDB (backend). The system supports employee management, department management, leave tracking, salary management, and role-based authentication for admins and employees.

## Features

- **Authentication:** Secure login for admins and employees.
- **Admin Dashboard:**
  - Manage departments (add, edit, delete).
  - Manage employees (add, edit, view, delete).
  - Assign salaries and view salary history.
  - Approve/reject employee leave requests.
  - View summary statistics (departments, employees, salary, leave status).
- **Employee Dashboard:**
  - View and edit personal profile.
  - Apply for leave and view leave history.
  - View salary details.
  - Change password.
- **Role-based Access:** Separate dashboards and permissions for admins and employees.

## Tech Stack

- **Frontend:** React, React Router, Axios, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, Cloudinary
- **Other:** ESLint, dotenv

## Project Structure

 
## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Cloudinary account (for image uploads)

### Setup

#### 1. Clone the repository

```sh
git clone <your-repo-url>
cd ETSProject

cd server
npm install
# Configure .env with MongoDB URI, JWT secret, Cloudinary keys, etc.
npm start

cd ../frontend
npm install
npm run dev
