# Use an official Node.js image
FROM node:16-alpine

# Set working directory
WORKDIR /frontend

# Copy package.json and install dependencies
COPY package.json ./

RUN npm install

# Copy the rest of the code
COPY . .

# Expose the frontend port
EXPOSE 3000

# Run the React app
CMD ["npm", "start"]
