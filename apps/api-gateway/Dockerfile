
# FROM node:alpine AS development

# WORKDIR /usr/src/app

# COPY package.json ./
# COPY package-lock.json ./
# COPY tsconfig.json tsconfig.json
# COPY nest-cli.json nest-cli.json

# RUN npm install -g pnpm

# RUN pnpm install


# COPY apps/api-gateway apps/api-gateway
# COPY libs libs

# RUN cd apps/api-gateway && pnpm install

# RUN pnpm run build api-gateway

# RUN npm run create:db:all

# FROM node:alpine AS production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package.json ./
# COPY package-lock.json ./


# RUN npm install -g pnpm

# RUN pnpm install --prod

# COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/apps/api-gateway/main"]


# ----------------------------
# Development Stage
# ----------------------------
FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm
RUN pnpm install

# Copy app source
COPY apps/api-gateway apps/api-gateway
COPY libs libs
COPY scripts scripts   

RUN cd apps/api-gateway && pnpm install

# Build the api-gateway app
RUN pnpm run build api-gateway

# Run DB creation script
RUN npm run create:db:all

# ----------------------------
# Production Stage
# ----------------------------
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install -g pnpm
RUN pnpm install --prod

# Copy build output only
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/api-gateway/main"]
