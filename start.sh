#!/bin/bash

# Pakar Padi - Startup Script

echo "================================"
echo "Pakar Padi - Startup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed"
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "Warning: PostgreSQL is not installed or not in PATH"
    echo "Please ensure PostgreSQL is running"
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please edit .env file with your configuration"
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Check if database is set up
echo "Checking database..."
if psql -U postgres -d pakar_padi -c "SELECT 1" &> /dev/null; then
    echo "Database is ready"
else
    echo "Database not found. Running seed script..."
    npm run seed
fi

echo ""
echo "================================"
echo "Starting Pakar Padi..."
echo "================================"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start the application
npm run dev
