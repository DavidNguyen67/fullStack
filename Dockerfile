# Use the official Node.js image as the base image
FROM node:16.13.2

# Create and set the working directory inside the container
WORKDIR /david/backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the source code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port on which the application will run (if necessary)
# EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]
