

# FROM node:alpine AS development

# WORKDIR /usr/src/app

# COPY package*.json ./
# COPY tsconfig*.json ./
# COPY nest-cli.json ./

# RUN npm install -g npm

# RUN npm install

# # RUN npm install -g @nestjs/cli && npm install

# COPY apps/auth apps/auth
# COPY libs libs

# COPY scripts scripts

# RUN cd apps/auth && npm install


# RUN npm run build auth

# FROM node:alpine AS  production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package.json ./
# COPY package-lock.json ./

# RUN npm install -g npm

# RUN npm install --prod

# COPY --from=development /usr/src/app/dist ./dist

# # CMD ["node", "dist/apps/auth/main"]
# CMD sh -c "npm run create:db:all && node dist/apps/auth/main"
FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm

RUN pnpm install


COPY apps/auth apps/auth
COPY libs libs

RUN cd apps/auth && pnpm install

RUN pnpm run build auth

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
# COPY scripts scripts

RUN npm install -g pnpm

RUN pnpm install --prod

# RUN npm run create:db:all

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]