 # Create image based on the official Node 8.5 image from the dockerhub
FROM node:9.2.1-alpine

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app/api

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app/api

# Copy dependency definitions
COPY package.json /usr/src/app/api

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /usr/src/app/api/

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]