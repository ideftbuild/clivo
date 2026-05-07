FROM node:24-slim AS builder

WORKDIR /usr/src/app

# Install build dependencies (FFmpeg needed if your build touches media)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

# IMPORTANT: must NOT omit devDependencies (Nest CLI needed)
RUN npm ci

COPY . .

RUN npm run build


FROM node:24-slim AS production

WORKDIR /usr/src/app

# Install ONLY runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy only what is needed
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main"]
