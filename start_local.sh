#!/bin/bash

# Start Cloud SQL Proxy in the background
echo "Starting Cloud SQL Proxy..."
cloud-sql-proxy spring-radar-383220:us-central1:krownebase-1 &

# Get the process ID of the Cloud SQL Proxy
PROXY_PID=$!

# Wait a few seconds for the proxy to initialize
sleep 5

# Check if the proxy process is still running
if ! ps -p $PROXY_PID > /dev/null; then
  echo "Error: Cloud SQL Proxy failed to start. Please check your configuration and permissions."
  exit 1
fi

echo "Cloud SQL Proxy started successfully (PID: $PROXY_PID)."

# Define a function to clean up the proxy process on exit
cleanup() {
  echo "Stopping Cloud SQL Proxy (PID: $PROXY_PID)..."
  kill $PROXY_PID
}

# Trap the EXIT signal to run the cleanup function
trap cleanup EXIT

# Start the Next.js development server
echo "Starting Next.js development server..."
npm run dev

# The script will now wait here until `npm run dev` is terminated.
# The `trap` will handle cleanup automatically.
