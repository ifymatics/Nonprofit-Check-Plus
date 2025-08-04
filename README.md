# 🏛️ Nonprofit Check Plus

Nonprofit Check Plus is a full-stack microservice-based application that helps manage the verification, discovery, and administration of nonprofit organizations. It uses a modular backend architecture with Kafka and TCP for inter-service communication, and a modern Angular frontend—all contained within the project directory.

---

## 📁 Project Structure

non-profit/
├── api-gateway/ # API Gateway service (NestJS)
├── auth-service/ # Auth and user management (NestJS)
├── admin-service/ # Admin dashboard and analytics (NestJS)
├── nonprofit-service/ # Nonprofit registration and approval (NestJS)
├── nonprofit-frontend/ # Angular frontend (inside project root)
├── docker-compose.yml # Docker orchestration
└── README.md # Project documentation

yaml
Copy
Edit

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

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/non-profit.git
cd non-profit
2. Set environment variables
Create a .env file at the root or within each service:

env
Copy
Edit
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=nonprofit_db
KAFKA_BROKER=kafka:9092
REDIS_HOST=redis
3. Start all services with Docker
bash
Copy
Edit
docker-compose up --build
Access the Angular frontend at:
👉 http://localhost:4200

🧱 Microservice Overview
🔐 Auth Service
User registration & login

JWT authentication

Kafka event on signup

TCP endpoint for user data

🛠️ Admin Service
Approve/block users and nonprofits

Fetch analytics via TCP from other services

Kafka event emitter for approval notifications

🏢 Nonprofit Service
Nonprofit registration and verification

Admin approval workflow

Search and filter capabilities

🌐 API Gateway
Central entry point for frontend requests

TCP communication with all backend services

Centralized JWT guard

🧪 Frontend (nonprofit-frontend/)
bash
Copy
Edit
cd nonprofit-frontend
npm install
ng serve
Runs at: http://localhost:4200

📬 Kafka Topics
Topic	Producer	Consumer	Description
user.signup	auth-service	notification-service	Send welcome or verify email
nonprofit.created	nonprofit-service	admin-service	Notify admin of new registration
nonprofit.approved	admin-service	notification-service	Notify user of approval

✅ Testing
Each service includes support for unit and end-to-end testing with Jest.

bash
Copy
Edit
cd auth-service
npm run test
npm run test:e2e
🔐 Security Features
JWT authentication

Role-based access

Email verification (via Kafka + notification-service)

Internal-only Kafka topics for microservices

🐞 Troubleshooting
TCP not working?

Make sure microservices use host: '0.0.0.0' in main.ts

Use service names (e.g., auth-service) in clients—not localhost

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

CI/CD pipeline (GitHub Actions)

👨‍💻 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss.

📝 License
MIT License. See LICENSE file for details.

📫 Contact
Built with ❤️ by Ifeanyi Okorie
GitHub: @ifymatics
```
