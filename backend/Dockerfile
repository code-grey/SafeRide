# backend/Dockerfile
FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# LEAN BUILD FLAGS
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -trimpath -o saferide-engine .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/saferide-engine .
EXPOSE 8080
CMD ["./saferide-engine"]