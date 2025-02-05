# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose the port (5173 for Vite, 3000 for CRA)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]

