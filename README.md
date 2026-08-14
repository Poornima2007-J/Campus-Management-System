# 🎓 Smart Campus Management Platform

A modern, full-stack **Smart Campus Management Platform** designed to digitally connect students, faculty, coordinators, and administrators through a centralized campus ecosystem.

The platform provides role-based dashboards, academic management, communication tools, AI-powered assistance, real-time interactions, and campus services in a single responsive application.

## 🚀 Features

### 👨‍🎓 Student Portal

* Student dashboard
* Course and academic information
* Assignment management
* Assignment submission
* Event information
* Profile management
* Real-time communication
* AI Campus Copilot
* Global search

### 👨‍🏫 Faculty Portal

* Faculty dashboard
* Course management
* Assignment creation
* Student submission management
* Academic tracking
* Communication with students
* Course portal views

### 🧑‍💼 Coordinator Portal

* Course coordination
* Faculty and student management
* Academic monitoring
* Assignment and course management
* Campus-level coordination

### 🛡️ Admin Portal

* Centralized campus administration
* User management
* Student, faculty and coordinator management
* Course management
* Campus activity monitoring
* Dashboard analytics

### 🤖 AI Campus Copilot

* AI-powered campus assistance
* Smart user interaction
* Campus-related information assistance
* Integrated AI service layer

### 💬 Communication

* Real-time chat
* Role-based communication
* Global search
* Notifications and campus updates

### 🔐 Authentication & Security

* Authentication system
* OTP verification
* Student onboarding
* Profile setup wizard
* Role-based access
* Protected dashboards

### 📱 Responsive Design

The application is designed to work across:

* 💻 Desktop
* 📱 Mobile
* 📟 Tablet

---

## 🛠️ Tech Stack

### Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### AI

* AI Campus Copilot
* AI Service Integration

### Development Tools

* npm
* Docker
* Git & GitHub

---

## 🏗️ Project Architecture

```text
Smart Campus Management Platform
│
├── public/
│   ├── images/
│   └── icons.svg
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ai/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── landing/
│   │   ├── layout/
│   │   └── portals/
│   │
│   ├── context/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── server/
│   └── index.js
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── vite.config.ts
```

---

## 👥 User Roles

| Role              | Main Responsibilities                                    |
| ----------------- | -------------------------------------------------------- |
| 🎓 Student        | Courses, assignments, submissions, events, communication |
| 👨‍🏫 Faculty     | Courses, assignments, submissions, student management    |
| 🧑‍💼 Coordinator | Academic coordination and monitoring                     |
| 🛡️ Admin         | Complete campus administration                           |

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-campus-management-platform.git
```

### 2. Navigate to the Project

```bash
cd smart-campus-management-platform
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file based on the provided `.env.example`.

```bash
cp .env.example .env
```

Add the required environment variables.

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

### 6. Start Backend

If the backend is configured separately:

```bash
node server/index.js
```

---

## 🐳 Docker Setup

The project also includes Docker configuration.

Build and run using:

```bash
docker-compose up --build
```

To stop the containers:

```bash
docker-compose down
```

---

## 📸 Application Modules

The platform includes:

* 🏠 Landing Page
* 🔐 Authentication
* 📊 Role-Based Dashboards
* 🎓 Student Portal
* 👨‍🏫 Faculty Portal
* 🧑‍💼 Coordinator Portal
* 🛡️ Admin Portal
* 📚 Course Management
* 📝 Assignment Management
* 📤 Assignment Submission
* 💬 Real-Time Chat
* 🔎 Global Search
* 🤖 AI Campus Copilot
* 👤 Profile Management
* 📅 Campus Events

---

## 🎯 Project Objective

The main objective of this project is to create a **unified digital campus ecosystem** where students, faculty, coordinators, and administrators can access academic and administrative services through a single intelligent platform.

Instead of using multiple disconnected systems, the platform brings essential campus activities together into one centralized application.

---

## 🌟 Key Highlights

* ⚡ Fast and modern React + Vite architecture
* 🎨 Responsive Tailwind CSS UI
* 🔐 Role-based authentication
* 🤖 AI-powered campus assistant
* 💬 Real-time communication
* 📚 Academic and assignment management
* 🛡️ Multi-role administration
* 🐳 Docker support
* 📱 Fully responsive design

---

## 🔮 Future Enhancements

* 📊 Advanced analytics and reports
* 🔔 Push notifications
* 📅 Smart timetable generation
* 🎯 AI-based student performance prediction
* 💳 Online fee/payment integration
* 🚌 Smart campus transportation tracking
* 📍 Campus navigation
* 📱 Progressive Web App support
* ☁️ Cloud deployment
* 🔑 Advanced authentication and authorization

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

## 📄 License

This project is developed for educational and academic purposes.



⭐ If you find this project useful, consider giving it a **star** on GitHub!
