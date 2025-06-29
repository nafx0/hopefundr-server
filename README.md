# HopeFundr Server

[![Live API](https://img.shields.io/badge/Live%20API-Vercel-blue?style=for-the-badge)](https://hopefundr-server.vercel.app)
[![License](https://img.shields.io/github/license/nafx0/hopefundr-server?style=for-the-badge)](./LICENSE)

This is the backend API for [HopeFundr](https://hope-fundr.web.app) — a modern crowdfunding platform. It is built using Express.js and MongoDB, deployed on Vercel as serverless functions.

---

## 🌐 Live API

🔗 **Base URL**: [https://hopefundr-server.vercel.app](https://hopefundr-server.vercel.app)

---

## 🛠️ Tech Stack

- **Express.js** (Node.js REST API)
- **MongoDB Atlas** (NoSQL Database)
- **Vercel** (Serverless backend deployment)
- **dotenv** for environment configuration

---

## 📦 API Endpoints

### 🔹 Campaigns
- `GET /campaigns` — Get all campaigns
- `GET /campaigns/:id` — Get campaign by ID
- `GET /campaigns/email/:email` — Get campaigns by creator email
- `POST /campaigns` — Create a new campaign
- `PUT /campaigns/:id` — Update a campaign
- `DELETE /campaigns/:id` — Delete a campaign

### 🔹 Donations
- `GET /donations` — Get all donations
- `GET /donations/:id` — Get donation by ID
- `GET /donations/email/:email` — Get donations by donor email
- `GET /donations/campaign/:campaignId` — Get donations for a specific campaign
- `POST /donations` — Submit a new donation

---

## 💡 Motivation

HopeFundr Server handles the core logic and database interactions behind the scenes — ensuring reliable, secure, and fast data transactions to support crowdfunding features in the frontend client.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas URI

### Steps
```bash
git clone https://github.com/nafx0/hopefundr-server.git
cd hopefundr-server
npm install
Create a .env file and add your MongoDB credentials:

ini
Copy
Edit
DB_USER=yourMongoUser
DB_PASSWORD=yourMongoPassword
Run locally:
bash
Copy
Edit
npm run dev
🤝 Contributing
We welcome contributions to improve the API:

Fork the repository

Create a new branch: git checkout -b feature/your-feature

Commit your changes: git commit -m 'Add feature'

Push to the branch: git push origin feature/your-feature

Open a pull request

📄 License
This project is licensed under the MIT License — see LICENSE for details.

📌 Related Repositories
🖥️ Frontend: HopeFundr UI

🌐 Live App: https://hope-fundr.web.app

👤 Author
Built by Nafiul Islam Nafis
