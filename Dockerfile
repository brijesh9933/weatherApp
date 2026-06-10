# ---- Build stage (Node + Angular) ----
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build production assets
RUN npm run build:prod

# ---- Runtime stage (nginx) ----
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/weather /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

