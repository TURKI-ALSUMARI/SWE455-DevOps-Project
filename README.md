#  Stock Tracker

## Overview

**Stock Tracker** is a microservice-based web application that enables users to search and monitor real-time stock information using a modern DevOps pipeline. The application includes:

* A **ReactJS frontend** for user interaction
* A **Node.js backend** with Express.js to fetch and serve stock data
* An **API Gateway** that routes requests to the backend services
* Containerized deployment using **Docker**
* Automated **CI/CD** using GitHub Actions
* Secure secret and environment handling via **GitHub Codespaces**

This project was developed with a strong emphasis on automation, reproducibility, and team collaboration using DevOps best practices.

---

##  Features

### Frontend

* Built with **ReactJS**
* Search stocks by **ticker symbol** or **company name**
* Display stock details including price and volume
* Interactive data **visualizations** (graphs/charts)

### Backend

* Built with **Node.js + Express.js**
* Communicates with **TwelveData** API to fetch real-time stock data
* Provides an API to frontend via an **API gateway**

### DevOps

* CI/CD pipeline with **GitHub Actions**: Linting, Testing, Security Scanning, and Deployment
* Containerized with **Docker Compose**
* Secrets managed securely via **GitHub Codespaces Secrets**
* Tested using **Jest** and **Cypress**
* Vulnerability scanning using **Trivy**

---

##  Testing

We follow a layered testing approach:

* **Unit Tests**: Jest for backend and frontend units
* **Integration Tests**: Validate API Gateway and service communication
* **System Tests**: Cypress-based E2E tests running in Docker environments

---

##  CI/CD Pipeline

CI/CD is fully automated via GitHub Actions and includes:

* Linting (ESLint)
* Unit Testing (Jest)
* Integration Testing
* Security Scanning (Trivy)
* Deployment to Render.com on merge to `main`

Secrets and tokens are stored securely in **GitHub Secrets**.

---

##  Tech Stack

| Layer      | Tools                  |
| ---------- | ---------------------- |
| Frontend   | ReactJS, CSS           |
| Backend    | Node.js, Express.js    |
| API        | TwelveData API       |
| DevOps     | Docker, GitHub Actions |
| Testing    | Jest, Cypress, ESLint  |
| Security   | Trivy                  |
| Cloud IDE  | GitHub Codespaces      |
| Deployment | Render.com             |

---

##  Team & Roles

| Name           | Role            |
| -------------- | --------------- |
| Yazeed Alharbi | Developer       |
| Turki Alsumari | CI/CD Engineer  |
| Rayan Alamrani | Operations / QA |

---

##  Git Workflow

We use **GitFlow** for collaboration:

* `main`: Production-ready code
* `develop`: Integration branch
* `feature/*`: Feature development
* `release/*`: Pre-release testing
* `hotfix/*`: Emergency production fixes

![GitFlow Strategy](https://media.geeksforgeeks.org/wp-content/uploads/20240226111013/image-258.webp)

---

##  Getting Started

### Prerequisites

* Node.js
* Docker
* Git

### Clone & Setup

```bash
git clone https://github.com/TURKI-ALSUMARI/SWE455-DevOps-Project.git
cd SWE455-DevOps-Project
```

### Local Development

You can run the app via Docker Compose:

```bash
docker compose up
```

Or manually for backend (requires `.env`):

```bash
cd stock-service
npm install
npm start
```

### Running Tests

```bash
npm test       # For unit tests
npm run lint   # For linting
./run-system-tests.sh  # For end-to-end tests
```

---

## Directory Structure
```
/SWE455-DevOps-Project
├── backend/
│   ├── stock-service/       # Node.js backend service
│   └── api-gateway/         # API gateway for routing
├── frontend/                # React frontend
├── .github/workflows/       # GitHub Actions CI/CD workflows
├── docker-compose.yml       # Container orchestration config
└── README.md                # Project documentation
```
---

##  Developer Notes

* Use feature branches and open PRs into `develop`
* Follow commit convention: `[type]: message`, e.g. `feat: add search by stock code`
* Validate features with tests before merging
* Environment variables are handled via Codespaces and `.env` files
