# 🏛️ Nonprofit Check Plus

Nonprofit Check Plus is a full-stack microservice-based application that helps manage the verification, discovery, and administration of nonprofit organizations. It uses a modular backend architecture with Kafka and TCP for inter-service communication, and a modern Angular frontend—all contained within the project directory.

---

## 📁 Project Structure

non-profit/
├── api-gateway/
├── auth-service/
├── admin-service/
├── nonprofit-service/
├── nonprofit-frontend/
├── docker-compose.yml
└── README.md

---

## ⚙️ Tech Stack

### 🧩 Backend

- **Framework**: NestJS (Microservices)
- **Databases**: PostgreSQL (per service)
- **Message Broker**: Kafka (Bitnami KRaft mode)
- **Transport**: TCP (for request/response), Kafka (for events)
- **Cache**: Redis

### 🌐 Frontend

- **Framework**: Angular
- **UI Library**: Angular Material + SCSS
- **Location**: `nonprofit-frontend/` (inside this repo)

## 🚀 Getting Started

### 1. Clone the repository

- git clone hhttps://github.com/ifymatics/Nonprofit-Check-Plus.git

- cd non-profit

### 2. Set environment variables

- Create a .env file within each service root using a sample of .env.example

3. ## Start all services with Docker

- docker-compose build

- docker-compose up

- Access the Angular frontend at (Check your terminal logs and ensure the three main services are running before sending any request Look out for logs like: ✅ SearchService is running..., ✅ Api-GatewayService is running..., ✅ AuthService is running...):

👉 http://localhost:4200

## Microservice Overview

🔐 # Auth Service

- User registration & login

- JWT authentication

- Kafka event on signup (Configured but commented as there no sending of email confirmation)

- TCP endpoint for user data

🛠️## Admin Service (Not implemented )

- Approve/block users and nonprofits

- Fetch analytics via TCP from other services

- Kafka event emitter for approval notifications

🏢 # Nonprofit Service

- Nonprofit registration and verification

- Admin approval workflow(Not implemented)

- Search and filter capabilities

🌐 API Gateway
Central entry point for frontend requests

TCP communication with all backend services

Centralized JWT guard

🧪 Frontend (nonprofit-frontend/)

cd nonprofit-frontend
npm install
ng serve
Runs at: http://localhost:4200

📬 Kafka Topics
Topic Producer Consumer Description
user.signup auth-service notification-service Send welcome or verify email
nonprofit.created nonprofit-service admin-service Notify admin of new registration
nonprofit.approved admin-service notification-service Notify user of approval

✅ Testing
Each service includes support for unit and end-to-end testing with Jest.

cd auth
npm run test

🔐 Security Features

JWT authentication

Role-based access

Email verification (via Kafka + notification-service not implemented)

Internal-only Kafka topics for microservices

🐞 Troubleshooting
TCP not working?

Make sure microservices use host in main.ts is set to service name (eg auth service name is "auth")
Use service names (e.g., auth-service is "auth", search service name is "search and api-gateway service name is "api-gateway")

Kafka not working?

Check logs with: docker-compose logs kafka

Make sure port 9092 is not used by another app

Frontend not building?

Make sure nonprofit-frontend has all dependencies installed (npm install)

Check Angular version compatibility

📌 Future Improvements
Add notification-service to send emails

Add cron-service for scheduled jobs (e.g., weekly reports)

Production-ready Dockerfile for frontend

### Ruunning on local machine without Docker

- 1.  change "host" from service name to "localhost"(

          const microserviceTcp = app.connectMicroservice<MicroserviceOptions>({
          transport: Transport.TCP,
          options: {
            host:'127.0.0.1',
            port: 4001, //parseInt('4001'),
          },

      });
      )

- 2.(a) run the following in inside each of the services' folder E.g. npm run start:dev api-gateway , (b) npm run start:dev auth, (c)npm run start:dev search

- 3 go inside nonprofit-frontend and run: ng serve and access the browser in http://localhost:4200

📝 License
MIT License. See LICENSE file for details.

📫 Contact
Built with ❤️ by Ifeanyi Okorie
GitHub: @ifymatics

```

```
