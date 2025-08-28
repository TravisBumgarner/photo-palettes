FROM node:22-slim AS builder

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .

FROM node:22-slim AS development

WORKDIR /app
COPY --from=builder /app /app

EXPOSE 3000

# Bind to 0.0.0.0 so it's accessible on LAN
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]