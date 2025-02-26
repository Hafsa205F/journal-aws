FROM node:18

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Install dev dependencies too (for tests)
RUN npm install --only=dev

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Expose API port
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"]