# Use an official Node.js runtime as a parent image
FROM node:16

#RUN npm install -g nodemon

# Set the working directory
WORKDIR /backend

# Copy package.json and install dependencies
COPY package.json .

RUN npm install

# Copy the rest of the application code
COPY . ./


#RUN npm install -g nodemon

# Expose the backend port
EXPOSE 3001


CMD ["npm", "run", "dev"]

# Run the application
#CMD ["npm", "run", "start"]