# Use the official Node.js 20 image from the Docker Hub
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json file to the working directory
COPY package*.json ./

# Define a build argument named NODE_ENV
ARG NODE_ENV

# Install dependencies conditionally based on the NODE_ENV argument
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi

# Copy the rest of the application code to the working directory
COPY . ./

# Set an environment variable for the port
ENV PORT=3000

# Expose the port to the outside world
EXPOSE $PORT

# Define the command to run the application
CMD ["npm", "run", "start"]
