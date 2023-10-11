# Use the official image as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy the file from your host to your current location
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .


# Specify the command to run on container start
CMD ["npm", "run", "start"]
