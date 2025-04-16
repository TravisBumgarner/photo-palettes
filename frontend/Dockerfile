FROM node:20-slim AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Development stage
FROM node:20-slim AS development

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
