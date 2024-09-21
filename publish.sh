#!/bin/bash

# Exit script if any command fails
set -e

# Ensure that the user has npm authentication set up
if [ -z "$NODE_AUTH_TOKEN" ]; then
  echo "NODE_AUTH_TOKEN environment variable is not set. Please set it before publishing."
  exit 1
fi

# Install dependencies and build the project
echo "Installing dependencies and building the project..."
yarn install --frozen-lockfile
yarn build

# Configure Git user (required in GitHub Actions)
echo "Configuring Git user..."
git config --local user.email "sascha.rose@gmail.com"
git config --local user.name "Sascha Rose"

# Bump version, create git tag, and push changes
echo "Bumping version and creating git tag..."
npm version patch

echo "Pushing changes and tags to GitHub..."
git push origin main --tags

# Publish to NPM
echo "Publishing to NPM..."
npm publish --access public

# Commit changes (skip if there are no changes to commit)
if git diff-index --quiet HEAD; then
  echo "No changes to commit."
else
  git commit -m "chore: build artifacts [skip ci]"
fi

# Add all changes to git
echo "Adding changes to git..."
git add .

echo "✅ Publish complete!"