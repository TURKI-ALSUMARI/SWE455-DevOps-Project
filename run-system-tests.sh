#!/bin/bash

echo "Starting system tests..."

# Set up exit handler
function cleanup {
  echo "Cleaning up Docker containers..."
  docker-compose down
  exit_code=$?
  if [ $exit_code -ne 0 ]; then
    echo "Error cleaning up Docker containers"
    exit $exit_code
  fi
}

# Trap SIGINT and SIGTERM to ensure cleanup
trap cleanup INT TERM

# Step 1: Build and start Docker containers
echo "Building and starting Docker containers..."
docker-compose down
docker-compose build
docker-compose up -d

# Step 2: Wait for services to be ready
echo "Waiting for services to be ready..."
MAX_RETRIES=30
RETRY_INTERVAL=2

# Wait for frontend
retries=0
while [ $retries -lt $MAX_RETRIES ]; do
  if curl -s http://localhost:8080 > /dev/null; then
    echo "Frontend is up!"
    break
  fi
  retries=$((retries+1))
  echo "Waiting for frontend to be ready... ($retries/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
done

if [ $retries -eq $MAX_RETRIES ]; then
  echo "Frontend failed to start in time"
  cleanup
  exit 1
fi

# Step 3: Run Cypress tests
cd frontend
echo "Installing cypress if needed..."
npm install cypress --no-save

echo "Running system tests..."
npx cypress run --spec "cypress/e2e/system-test.cy.js"
test_exit_code=$?

# Step 4: Clean up
cd ..
cleanup

# Exit with the same code as the tests
exit $test_exit_code