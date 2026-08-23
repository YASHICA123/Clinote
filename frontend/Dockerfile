FROM node:20-alpine AS build

WORKDIR /app

# Copy package config files
COPY package*.json ./
RUN npm install

# Copy frontend source and build
COPY . .
RUN npm run build

# Production serve stage
FROM node:20-alpine

WORKDIR /app

# Install serve package for serving build assets
RUN npm install -g serve

# Copy build output
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
