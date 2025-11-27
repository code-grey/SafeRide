# SafeRide Backend

This is the backend for the SafeRide application, an AI-driven driver wellness and safety-focused ride/transport platform.

## Tech Stack

- **Language:** Go
- **Database:** PostgreSQL

## Getting Started

### Prerequisites

- [Go](https://golang.org/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Environment Variables

Create a `.env` file in the `backend` directory and add the following environment variables. Update the values as needed.

```env
# PostgreSQL
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=safedb

# JWT
JWT_SECRET=your-secret-key

# API Port
PORT=3000
```

### Running the Application with Docker

The easiest way to get the entire stack running is with Docker Compose.

1.  **Start the services:**
    ```bash
    docker-compose up -d --build
    ```

    This will start two containers:
    - `api`: The Go application
    - `db`: The PostgreSQL database

2.  **Access the application:**
    - The API will be available at `http://localhost:3000`

### Running the Application Locally (without Docker)

If you prefer to run the application without Docker, you will need to have PostgreSQL running on your local machine.

1.  **Start the development server:**
    ```bash
    go run main.go
    ```
