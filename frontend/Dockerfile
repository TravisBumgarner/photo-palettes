FROM node:20-slim AS builder

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .

FROM node:20-slim AS development

WORKDIR /app
COPY --from=builder /app /app

EXPOSE 3000
CMD ["npm", "run", "dev"]
