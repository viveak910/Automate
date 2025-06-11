# 🚀 Automate

**Automate** is a modular, microservices-based **workflow automation platform** that enables users to configure event-driven workflows with ease. Built for developers and teams, Automate allows orchestration of tasks across multiple services via an intuitive React frontend and a scalable Node.js backend.

<p align="center">
  <img src="https://img.shields.io/badge/microservices-architecture-blue.svg" alt="Microservices Architecture"/>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"/>
  <img src="https://img.shields.io/badge/containerized-Docker-blue.svg" alt="Docker Support"/>
</p>

---

## 📄 Documentation & 🎥 Demo

| Resource        | Preview |
|----------------|---------|
| 📘 [Documentation](https://drive.google.com/file/d/1ZAVFnOfAmv5c9pCldiI6ltjqA-PEvqYi/view?usp=sharing) | ![Preview](https://img.shields.io/badge/view-documentation-blue) |
| 🎬 [Demo Video](https://drive.google.com/file/d/1U90_-ISTIsZishOyIzWrmhIE4v5ghea_/view?usp=sharing) | ![Preview](https://img.shields.io/badge/watch-demo-red) |

---

## ✨ Features

- 🔧 **Visual Workflow Builder** – Create and manage workflows with an elegant UI.
- ⚙️ **Microservices Architecture** – Decoupled services for scalability and maintainability.
- 🔁 **Event-Driven Processing** – Respond to webhooks, timers, or custom events.
- 📈 **Scalable & Resilient** – Designed to be fault-tolerant and extendable.
- 🐳 **Containerized Deployment** – Quick start with Docker Compose support.

---

## 🧱 Tech Stack

| Layer           | Technology                     |
|----------------|---------------------------------|
| Frontend        | React + TypeScript              |
| Backend         | Node.js, Express, Prisma ORM    |
| Services        | `primary_backend`, `hooks`, `processor`, `worker` |
| Containerization| Docker, Docker Compose          |
| Database        | PostgreSQL                      |

---

## 🧭 Architecture

```
[ Frontend (React) ]
        |
[ Primary Backend ]
        |
 ┌──────┴───────┐
[Hooks]   [Processor]
                 |
              [Worker]
```

### Service Responsibilities

- **Frontend:** React UI for creating and managing workflows.
- **Primary Backend:** Handles auth, user APIs, and workflow definitions.
- **Hooks:** Accepts external events like webhooks.
- **Processor:** Coordinates workflow execution.
- **Worker:** Performs background tasks asynchronously.

---

## 📁 Project Structure

```
Automate/
├── frontend/             # React-based UI
├── primary_backend/      # Core APIs and database logic
├── hooks/                # Webhook/event listeners
├── processor/            # Workflow processing engine
├── worker/               # Executes tasks/jobs
├── docker-compose.yml    # Orchestration config
└── README.md
```

---

## 🛠️ Getting Started

### 🔄 Prerequisites

- Node.js (LTS version)
- Docker & Docker Compose
- Git

### ⚙️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/viveak910/Automate.git
cd Automate

# Start all services
docker compose up --build
```

Visit [http://localhost:3000](http://localhost:3000) to access the UI.

---

### 📌 Prisma Migrations (Optional)

```bash
cd primary_backend && npx prisma migrate deploy
cd ../hooks && npx prisma migrate deploy
cd ../processor && npx prisma migrate deploy
cd ../worker && npx prisma migrate deploy
```

---

## ⚡ Usage Flow

1. Launch the frontend UI.
2. Create a new workflow with a trigger and actions.
3. Configure a webhook or timer to trigger the workflow.
4. Automate tasks like email notifications, API calls, etc.
5. Monitor activity logs and job statuses.

> Example: When a user signs up (triggered via webhook), send a welcome email using the worker.

---

## 👨‍💻 Contributing

We 💚 contributions! Here’s how you can help:

```bash
# Fork and clone the repo
git clone https://github.com/your-username/Automate.git

# Create a new feature branch
git checkout -b feature/my-feature

# Install dependencies
npm install
npm run build
```

✔️ Follow [Conventional Commits](https://www.conventionalcommits.org/)  
✔️ Update documentation for changes  
✔️ Submit a well-documented PR

---

## 📄 License

```text
MIT License

Copyright (c) 2025 Viveak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 Authors & Contributors

- **Viveak** – [@viveak910](https://github.com/viveak910) – Project Lead, Architecture & Core Development
- Open to community contributions!

---

## 📬 Contact

For queries or support, open an issue or reach out via GitHub [@viveak910](https://github.com/viveak910).

---
