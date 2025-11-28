# backend/Dockerfile (Single Stage)
FROM golang:latest

WORKDIR /app

# Copy dependency files first
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Ensure go.sum is consistent with go.mod before building
RUN go mod tidy

# Build the binary
# Disabling CGO for static binary, though single stage doesn't strictly require it, it's good practice.
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -trimpath -o saferide-engine .

# Expose the port
EXPOSE 8080

# Run the binary
CMD ["./saferide-engine"]