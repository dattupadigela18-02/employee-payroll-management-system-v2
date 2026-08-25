# Employee Payroll Management System

A full-stack web application for managing employees, attendance, leave, payroll, and payslips.

The application is built with **React.js** for the frontend, **Spring Boot** for the backend, and **MySQL** for database management.

---

## 🚀 Features

### 👨‍💼 Employee Management
- Add new employees
- View employee details
- Edit employee information
- Delete employees

### 🕐 Attendance Management
- Manage employee attendance
- Add attendance records
- Edit attendance records
- Delete attendance records

### 📝 Leave Management
- Manage employee leave records
- Add leave requests/records
- Edit leave information
- Delete leave records

### 💰 Payroll Management
- Manage employee payroll information
- Add payroll records
- Edit payroll records
- Delete payroll records

### 🧾 Payslip Management
- View employee payslip information
- Generate payslip PDF
- Manage payroll-related payslip details

### 📊 Dashboard
- Provides an overview of employee and payroll-related information.

---

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Java
- Spring Boot
- Spring Data JPA
- REST APIs
- Maven

### Database

- MySQL

### Development Tools

- IntelliJ IDEA
- Visual Studio Code
- Git
- GitHub

---

## 🏗️ Application Architecture

```text
┌───────────────────────────┐
│        React.js           │
│         Frontend          │
└─────────────┬─────────────┘
              │
              │ REST APIs
              ▼
┌───────────────────────────┐
│       Spring Boot         │
│          Backend          │
└─────────────┬─────────────┘
              │
              │ JPA / Hibernate
              ▼
┌───────────────────────────┐
│          MySQL            │
│         Database          │
└───────────────────────────┘

employee-payroll-management-system-v2/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── README.md
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── README.md
│   └── .gitignore
│
├── .gitignore
└── README.md


