# docker/db-init.Dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install -g pnpm && pnpm install

# ✅ Copy all required project files
COPY scripts/ ./scripts/
COPY apps/ ./apps/
COPY tsconfig.json ./
COPY nest-cli.json ./

# ✅ Run the script using pnpm at the root level
CMD ["pnpm", "run", "create:db:all"]
