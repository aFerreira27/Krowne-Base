#!/bin/bash

# Start Cloud SQL Proxy in the background
cloud-sql-proxy spring-radar-383220:us-central1:krownebase-1 &

# Get the process ID of the Cloud SQL Proxy
PROXY_PID=$!

# Wait a few seconds for the proxy to start
sleep 5

# Start the Next.js development server
npm run dev

# When the Next.js server stops, kill the proxy process
kill $PROXY_PID