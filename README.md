# Sage - Q&A Platform

A modern Stack Overflow-inspired question and answer platform built with Spring Boot and Next.js.

##  Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

##  Features

- **User Authentication & Authorization** with JWT tokens
- **Question Management** - Ask, edit, and delete questions
- **Answer System** - Provide answers to questions
- **Voting System** - Upvote/downvote questions and answers
- **Comments** - Add comments to questions and answers
- **Tagging System** - Organize questions with tags
- **User Profiles** - View user statistics and activity
- **Badge System** - Earn badges for various achievements
- **Search & Filter** - Find questions by keywords and tags
- **Real-time Updates** - Modern UI with responsive design
- **Markdown Support** - Rich text formatting with LaTeX math support

##  Tech Stack

### Backend
- **Java 21** - Programming language
- **Spring Boot 3.5.0** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database access
- **JWT** - Token-based authentication
- **PostgreSQL/CockroachDB** - Database
- **Lombok** - Reduce boilerplate code
- **OpenAPI/Swagger** - API documentation

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Radix UI** - Accessible components
- **React Markdown** - Markdown rendering
- **Lucide React** - Icons

##  Prerequisites

Before running this project, make sure you have the following installed:

- **Java 21** or higher
- **Node.js 18** or higher
- **npm** or **yarn**
- **PostgreSQL** or **CockroachDB**
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sage
```

### 2. Database Setup

#### Option A: PostgreSQL
1. Install PostgreSQL
2. Create a database named `sage_db`
3. Update database credentials in `src/main/resources/application.properties`

#### Option B: CockroachDB (Recommended)
1. Install CockroachDB
2. Start CockroachDB:
   ```bash
   cockroach start-single-node --insecure --listen-addr=localhost:26257
   ```
3. Create database:
   ```bash
   cockroach sql --insecure -e "CREATE DATABASE sage_db;"
   ```

### 3. Backend Setup

1. Navigate to the root directory
2. Build the project:
   ```bash
   ./gradlew build
   ```

### 4. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🏃‍♂️ Running the Application

### Start the Backend Server

From the root directory:

```bash
./gradlew bootRun
```

The backend will start on `http://localhost:8080`

### Start the Frontend Development Server

From the `frontend` directory:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### Production Build

#### Backend
```bash
./gradlew bootJar
java -jar build/libs/sage-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

## 📚 API Documentation

Once the backend is running, you can access the API documentation at:
- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

## 📁 Project Structure

```
sage/
├── src/main/java/com/devik/sage/          # Backend source code
│   ├── controller/                        # REST controllers
│   ├── model/                             # JPA entities
│   ├── service/                           # Business logic
│   ├── security/                          # Security configuration
│   └── exception/                         # Exception handling
├── src/main/resources/
│   ├── application.properties             # Backend configuration
│   └── data.sql                           # Initial data
├── frontend/                              # Next.js frontend
│   ├── src/app/                           # App router pages
│   ├── src/components/                    # React components
│   ├── src/lib/                           # Utility functions
│   └── public/                            # Static assets
├── build.gradle.kts                       # Backend dependencies
└── README.md                              # This file
```

## 🔧 Configuration

### Backend Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:26257/sage_db?sslmode=disable
spring.datasource.username=root
spring.datasource.password=

# JWT Configuration
jwt.secret=your-secret-key-here
jwt.expiration=86400000
```

### Frontend Configuration

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

##  Testing

### Backend Tests
```bash
./gradlew test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🐳 Docker Support

### Backend Dockerfile
```dockerfile
FROM openjdk:21-jdk
COPY build/libs/sage-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- Inspired by Stack Overflow's design and functionality
- Built with modern web technologies and best practices
- Community-driven development approach

---

**Happy Coding!** 🚀

For any questions or issues, please open an issue in the repository or contact the maintainers.
