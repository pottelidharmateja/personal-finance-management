# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /src/app

# Copy package.json and package-lock.json from the backend folder
COPY backend/package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the backend code
COPY backend ./

# Expose port 5500
EXPOSE 5500

# Set the environment to production
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "server.js"]
