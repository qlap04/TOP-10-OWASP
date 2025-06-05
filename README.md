# TOP-10-OWASP Library Management System

## 🔒 Overview

This project is a library management system built to simulate and practice identifying, exploiting, and mitigating the **OWASP Top 10 (2022)** security vulnerabilities. The system is designed following the MVC architecture using **TypeScript**, **Node.js**, **Express.js**, **EJS**, and includes features like rate-limiting and reCAPTCHA v2 for enhanced security.

## 📚 Features

### Roles & Permissions:

- **Student**
  - View books
  - Request to borrow books (requires approval)
  
- **Librarian**
  - Manage books
  - Approve/reject borrow requests

- **Admin**
  - Full access: manage users, books, and borrow requests

### Security Focus:

The application intentionally includes common web vulnerabilities such as:

- SQL Injection
- Broken Authentication
- Cross-Site Scripting (XSS)
- Insecure Direct Object References (IDOR)
- Security Misconfigurations
- Cross-Site Request Forgery (CSRF)
- And more...

Each vulnerability is paired with:

- **An explanation of the exploit**
- **A guided demo**
- **Suggested mitigation strategies**

## 🧠 Learning Objectives

- Understand how real-world attacks exploit OWASP Top 10 vulnerabilities
- Practice secure coding patterns
- Gain hands-on experience in securing web applications

## 🖥️ Demo

📺 Watch the full walkthrough of exploiting and fixing vulnerabilities:  
[▶️ YouTube Demo](https://youtu.be/SR0ylswWwfo)

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Frontend:** EJS templates
- **Security:** Express-rate-limit, reCAPTCHA v2
- **Database:** (Specify if using MongoDB, MySQL, etc.)

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/qlap04/TOP-10-OWASP.git
cd TOP-10-OWASP

# Install dependencies
npm install

# Run the app
npm run dev
