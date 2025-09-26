# syntax=docker/dockerfile:1.6

# Install dependencies once and share across build targets
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable \
    && corepack prepare yarn@1.22.22 --activate \
    && yarn install --frozen-lockfile

# Provide a runtime for the REST command server
FROM node:22-alpine AS rest-command-server
WORKDIR /app
ENV NODE_ENV=production
ENV COMMAND_SERVER_PORT=3001
COPY --from=deps /app/node_modules ./node_modules
COPY package.json yarn.lock ./
COPY scripts ./scripts
USER node
EXPOSE 3001
CMD ["node", "scripts/restCommandServer.mjs"]

# Build the static assets with Vite
FROM deps AS build
COPY . .
RUN yarn build

# Serve the compiled application with a lightweight HTTP server
FROM node:22-alpine AS frontend-runtime
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080", "--no-clipboard"]
