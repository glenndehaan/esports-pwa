#!/bin/bash

#
# This script is used to build the docker container using the Dockerfile.
# After running this script you can manage this container through Kitematic or the Docker CLI
#

CURRENTDIR=$( pwd )
CHECK_DOCKER_CONTAINER_EXISTS=$( docker ps -a | grep esports-pwa )

if [[ ! -z "$CHECK_DOCKER_CONTAINER_EXISTS" ]]; then
    CHECK_DOCKER_CONTAINER_UP=$( docker inspect -f {{.State.Running}} esports-pwa )

    if [ $CHECK_DOCKER_CONTAINER_UP != "true" ]; then
        echo "Aha... Your container is build but you have to start it. Use Kitematic to start the container or use the Docker CLI"
    else
        echo "WOW! Stop! Your container is already build and running! Use Kitematic to view your console or use the Docker CLI"
    fi
else
    echo "Initial Docker container build..."
    echo ""
    docker build -t esports-pwa .

    echo "Starting Docker container..."
    echo ""
    docker run -t -d --name esports-pwa -p 3000:3000 -v $CURRENTDIR:/app esports-pwa

    echo ""
    echo "Alright! Your container is ready! Use Kitematic to view your console or use the Docker CLI"
fi
