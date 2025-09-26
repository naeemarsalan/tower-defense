# syntax=docker/dockerfile:1.6

# Build the static assets with Vite
FROM node:22-alpine AS build
WORKDIR /app
ENV NODE_ENV=production
COPY package.json yarn.lock ./
RUN corepack enable \
    && yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Serve the compiled application with a lightweight HTTP server
FROM node:22-alpine AS runtime
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080", "--no-clipboard"]
