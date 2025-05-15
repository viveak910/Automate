FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN npx prisma generate

EXPOSE 3009

CMD ["npm", "run", "dev"]
