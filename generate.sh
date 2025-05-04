#!/bin/bash

# Write the environment variables to the .env file
echo "TWELVE_DATA_API_KEY=${TWELVE_DATA_API_KEY}" > .env
echo "PORT=${PORT}" >> .env

echo ".env file generated!"
