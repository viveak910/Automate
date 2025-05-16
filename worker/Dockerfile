# Use an official Node.js LTS image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the worker source code
COPY . .

# Generate Prisma client
RUN npx prisma generate



# Expose no port (worker runs in background)
# EXPOSE not needed

# Start the worker
CMD ["npm", "start"]
