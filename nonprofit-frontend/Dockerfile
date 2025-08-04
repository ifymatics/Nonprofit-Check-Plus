# Stage 1: Build the Angular app
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli && npm install
COPY . .
RUN ng build --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built Angular files
COPY --from=build /app/dist/nonprofit-frontend/browser /usr/share/nginx/html

EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# FROM node:latest AS build

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci
# RUN npm install -g @angular/cli && npm install

# COPY . .

# FROM nginx:latest

# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# COPY --from=build /app/dist/nonprofit-frontend /usr/share/nginx/html

# EXPOSE 80
