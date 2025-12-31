FROM node:22-alpine

WORKDIR /app

COPY package.json  ./
COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]