# frontend/Dockerfile (Single Stage)
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Run preview
CMD ["npm", "run", "preview", "--", "--host", "--port", "3000"]