FROM node:20-alpine
RUN apk add --no-cache python3 make g++ gcc
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["sh", "-c", "node seed.js && node index.js"]
