#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the Angular app
echo "Building Angular application..."
npm run build -- --configuration production

# Copy built files to wwwroot
echo "Copying files to deployment directory..."
cp -r dist/finance-dashboard/* /home/site/wwwroot/

# Copy web.config for URL rewriting
cp web.config /home/site/wwwroot/

echo "Deployment completed successfully!"
