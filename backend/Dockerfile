FROM node:22-alpine

WORKDIR /app

COPY package.json  ./
COPY package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]