# Use the official Go image
FROM golang:1.22

# Set working directory inside container
WORKDIR /app

# Copy Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire backend source code
COPY . .

# Build the Go application
RUN go build -o main ./cmd

# Expose API port (change if needed)
EXPOSE 8080

# Start the Go server
CMD ["./main"]
