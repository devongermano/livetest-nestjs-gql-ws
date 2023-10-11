# ---- Build Stage ----
FROM node:18 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package*.json files
COPY package*.json ./

# Install dependencies
RUN yarn

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# ---- Run Stage ----
FROM node:18-slim

# Set working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379


# Command to run the application
CMD ["npm", "run", "start:prod"]
