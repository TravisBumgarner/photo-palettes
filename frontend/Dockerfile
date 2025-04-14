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

# Copy from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["npm", "run", "dev"]
