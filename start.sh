#!/bin/sh
echo "Waiting for database to be ready..."
sleep 5
echo "Pushing database schema..."
npx prisma db push --accept-data-loss
echo "Starting application..."
npm start