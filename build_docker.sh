#!/bin/bash

#
# This script is used to build the docker container using the Dockerfile.
# After running this script you can manage this container through Kitematic or the Docker CLI
#

CURRENTDIR=$( pwd )

echo "Initial Docker container build..."
echo ""
docker build -t esports-pwa .

echo "Starting Docker container..."
echo ""
docker run -t -d --name esports-pwa -p 3000:3000 -v $CURRENTDIR:/app esports-pwa

echo ""
echo "Alright! Your container is ready! Use Kitematic to view your console or use the Docker CLI"
