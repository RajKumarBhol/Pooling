<div align="center">
  
# 📊 PollMaster - Real-Time Polling System

A modern, full-stack polling application built with **Spring Boot 3**, **React**, and **Tailwind CSS**. It features real-time vote broadcasting via WebSockets, JWT-based authentication, and a stunning, responsive UI.

[**Explore the Features**](#features) • [**Tech Stack**](#tech-stack) • [**Getting Started**](#getting-started) • [**API Endpoints**](#api-endpoints)

</div>

---

## ✨ Features

* **🔐 Secure Authentication**: JWT-based stateless login and registration system.
* **🛡️ Role-Based Access Control**: 
  * **Admin (Poll Creator)**: Can create, manage, close, and delete polls.
  * **User (Voter Enthusiast)**: Can participate in polls and view their voting history.
* **⚡ Real-Time Updates**: Instantly see poll results update live across all connected clients via WebSockets (STOMP).
* **📱 Responsive & Premium UI**: A highly polished, glassmorphism-inspired design built with Tailwind CSS, ensuring a great experience on both mobile and desktop.
* **🔎 Pagination & Search**: Easily find specific polls with full-text search and infinite scrolling/pagination.
* **👤 User Profiles**: Dedicated dashboards for users to track their created polls and voting participation.

## 🛠️ Tech Stack

### Frontend
* **Framework**: React 18 (Vite)
* **Styling**: Tailwind CSS, PostCSS
* **State Management**: React Context API
* **Networking**: Axios (with interceptors)
* **Real-time Engine**: `@stomp/stompjs` and `sockjs-client`
* **Icons**: `lucide-react`

### Backend
* **Framework**: Spring Boot 3.x
* **Language**: Java 21+
* **Security**: Spring Security 6 (JWT, Role checking)
* **Database Management**: Spring Data JPA / Hibernate 6
* **Database**: PostgreSQL (Supabase)
* **Real-time Server**: Spring WebSocket implementation

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
* **Java 21** or higher
* **Maven** (or use the included wrapper)
* **Node.js 18+** & **npm**
* A running **PostgreSQL** database (e.g., via Supabase or Docker)

### 1. Database Setup
Update the `/backend/src/main/resources/application.properties` file with your PostgreSQL credentials:

```properties
spring.datasource.url=jdbc:postgresql://your-host:5432/your-db
spring.datasource.username=your_username
spring.datasource.password=your_password

# Hibernate auto-creates the schema
spring.jpa.hibernate.ddl-auto=update
```

### 2. Backend Setup
Navigate into the `backend` directory and run the Spring Boot application using Maven:
```bash
cd backend
./mvnw spring-boot:run
```
*The backend will start on `http://localhost:8080`.*

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` directory, install the dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will start on `http://localhost:5173`.*

---

## 📡 Core API Endpoints

### Authentication
* `POST /api/auth/register` - Create a new account
* `POST /api/auth/login` - Authenticate and receive JWT

### Users
* `GET /api/users/me` - Get current user info
* `GET /api/users/me/history` - Get user profile dashboard (created + voted polls)

### Polls
* `GET /api/polls` - Fetch paginated polls (supports `?page=0&size=6&search=keyword`)
* `GET /api/polls/{id}` - Fetch a specific poll
* `POST /api/polls` - Create a new poll (Admin only)
* `POST /api/polls/{pollId}/vote` - Cast a vote
* `DELETE /api/polls/{id}` - Delete a poll (Admin only)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
