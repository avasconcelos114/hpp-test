########################################################
# Builder image
########################################################
FROM node:20.17.0-alpine AS builder

WORKDIR /app

# Install dependencies based on the package and lock files
COPY package.json yarn.lock ./
RUN yarn install

# Copy all necessary files for building
COPY . .

# Build the Next.js app
RUN yarn build

########################################################
# Production image
########################################################
FROM node:20.17.0-alpine AS runner

WORKDIR /app

# Copy only the production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built Next.js output and static files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy Next.js config and package files (for runtime)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000

CMD ["yarn", "start"]