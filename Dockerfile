# Use an official NodeJS runtime as a base image
FROM node

# Set the working directory to /app
WORKDIR /app

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run npm run dev when the container launches
CMD cd ./_scripts; npm install; npm run dev
