
# Stocks Tracker Application

## Overview

The **Stocks Tracker Application** is a platform designed to monitor and track stock prices, historical data, and perform searches by stock code or name. It uses **Node.js** for the backend and **HTML** and **CSS** for the frontend. The app provides functionalities to search stocks by their ticker symbol, company name, and view stock history. In addition, the app will include graphing and data visualization.


## Features

### Backend:
- **Search by stock code**: Allows users to search for stocks by their unique ticker symbol.
- **Search by stock name**: Allows users to search for stocks by their company name.
- **Historical data**: Fetch historical stock data (price, volume, etc.).

### Frontend:
- Basic HTML and CSS frontend to interact with the backend.
- Displays stock data in a tabular format as well as graphs for data visulization.


## Tech Stack

- **Backend**: Node.js
- **Frontend**: HTML, CSS
- **API**: AlphaVantage (for stock data)
- **Testing**: Jest (Backend testing)
- **Linting**: ESLint
- **CI/CD**: GitHub Actions


## Team Roles

- **Developer** (Yazeed): Responsible for coding the core backend features, setting up the API, and writing tests for the backend logic.
- **CI/CD Engineer** (Turki): Manages GitHub Actions workflows for continuous integration and continuous deployment, automating linting, testing, and deployment.
- **Operations/QA Analyst** (Rayan): Oversees testing, logging, and monitoring of the app's production performance.


## Branching Strategy

We follow the **GitFlow** strategy for branching:

1. **Main (previously Master) Branch** (`main`): The main branch represents the production-ready state of the project.
2. **Development Branch** (`develop`): This is the branch where all feature branches are merged. It's where the ongoing development happens.
3. **Feature Branches**: These are created off `develop` for each new feature or task. Naming convention: `feature/<feature-name>`.
4. **Release Branches**: Once development reaches a stable point, a release branch is created from `develop` for testing and preparation.
5. **Hotfix Branches**: These branches are used to address critical issues on the production branch. Naming convention: `hotfix/<issue-name>`.

The following image demostrates how the GitFlow branching strategy works:
![alt text](https://media.geeksforgeeks.org/wp-content/uploads/20240226111013/image-258.webp)


## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js**: [Install Node.js](https://nodejs.org/)
- **npm**: Node.js package manager (comes with Node.js)

### Clone the Repository

```bash
git clone https://github.com/TURKI-ALSUMARI/SWE455-DevOps-Project.git
cd SWE455-DevOps-Project
```

### Install Dependencies

```bash
npm install
```

### Run the Backend Locally

To start the server locally, use:

```bash
npm start
```

The server will be available at `http://localhost:3000`.

### Run Tests

To run the unit tests, use:

```bash
npm test
```

---

## Directory Structure

```
/stocks-tracker
    ├── /src                   # Backend source code
    │   ├── index.js           # Main server file
    │   ├── routes/            # API routes
    │   ├── controllers/       # Business logic
    │   └── data/              # Stock data (mock or real)
    ├── /public                # Frontend (HTML, CSS)
    ├── /tests                 # Unit tests for backend
    ├── .eslintrc.json          # ESLint configuration
    ├── package.json           # Node.js dependencies and scripts
    ├── package-lock.json      # Locked dependency versions
    └── README.md              # Project documentation
```


### Notes for Developers:

1. Always create a feature branch from `develop` for new features or bug fixes.
2. When committing, ensure the commit message follows this format:
   - **[type]**: A short description of the changes.
   - Example: `feat: add search by stock code API`.
3. Each feature must be tested using Jest before merging into `develop`.
