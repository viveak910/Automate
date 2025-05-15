FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the project
RUN npm run build

# Then run prisma generate, migrate and seed with compiled js
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate dev --name init --skip-seed && node dist/prisma/seed.js && npm run dev"]
