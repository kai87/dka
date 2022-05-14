FROM node:10

# Install Truffle
RUN npm install -g truffle
RUN npm config set bin-links false

# Install React Dependencies
COPY client/package.json ./client/package.json
COPY client/package-lock.json ./client/package-lock.json
RUN cd client && npm ci

# Move the source files at last, to avoid reinstall NPM modulus

# Move Contract Files
COPY contracts ./contracts
COPY migrations ./migrations
COPY test ./test
COPY truffle-config.js ./truffle-config.js

# Move React Files
COPY client/src ./client/src
COPY client/public ./client/public



