FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app (assuming TypeScript)
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Start the app with Prisma DB pull at runtime
CMD sh -c "npx prisma db pull && node dist/index.js"
