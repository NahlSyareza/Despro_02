# Tahap 1: Build React
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Build menjadi file statis (HTML/CSS/JS)
RUN npm run build

# Tahap 2: Serve dengan Nginx
FROM nginx:alpine
# Copy hasil build dari Tahap 1 ke folder Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Tambahkan config khusus agar React Router (SPA) jalan
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]