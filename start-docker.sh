#!/bin/bash

# Pakar Padi - Docker Startup Script

echo "================================"
echo "Pakar Padi - Docker Startup"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    echo "Please install Docker from https://www.docker.com/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed"
    echo "Please install Docker Compose"
    exit 1
fi

echo "Docker version: $(docker --version)"
echo "Docker Compose version: $(docker-compose --version)"
echo ""

# Build and start containers
echo "Starting Docker containers..."
docker-compose up -d

echo ""
echo "================================"
echo "Pakar Padi is running!"
echo "================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000/api"
echo "Admin Panel: http://localhost:3000/admin"
echo ""
echo "Default credentials:"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop: docker-compose down"
echo ""
