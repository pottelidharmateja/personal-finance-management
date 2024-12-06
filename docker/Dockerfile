# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Make port 80 available outside this container
EXPOSE 80

# Set the environment to production
ENV NODE_ENV=production

# Change the command to point to the correct location of your main file
CMD ["node", "backend/server.js"]
