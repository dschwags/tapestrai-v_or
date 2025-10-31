#!/bin/bash

# Cloudflare Deployment Script for tapestrAI
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 tapestrAI Cloudflare Deployment Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Step 1: Check prerequisites
echo "Step 1: Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi
print_success "Node.js is installed"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_success "npm is installed"

# Step 2: Install Wrangler if not present
echo ""
echo "Step 2: Checking for Wrangler CLI..."

if ! command -v wrangler &> /dev/null; then
    print_warning "Wrangler not found. Installing..."
    cd worker
    npm install
    cd ..
    print_success "Wrangler installed"
else
    print_success "Wrangler is already installed"
fi

# Step 3: Login check
echo ""
echo "Step 3: Cloudflare authentication..."
print_info "You need to be logged in to Cloudflare"
print_info "If you're not logged in, run: npx wrangler login"
echo ""
read -p "Are you logged in to Cloudflare? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Please login first:"
    echo "  npx wrangler login"
    exit 1
fi

# Step 4: Deploy Worker
echo ""
echo "Step 4: Deploying Cloudflare Worker..."
print_info "This will deploy the API proxy for all 4 AI providers"
echo ""

cd worker
npx wrangler deploy

if [ $? -eq 0 ]; then
    print_success "Worker deployed successfully!"
    echo ""
    print_warning "IMPORTANT: Copy the Worker URL from the output above"
    print_warning "It looks like: https://tapestrai-worker.YOUR-SUBDOMAIN.workers.dev"
    echo ""
else
    print_error "Worker deployment failed"
    exit 1
fi

cd ..

# Step 5: Deploy Pages
echo ""
echo "Step 5: Deploying to Cloudflare Pages..."
print_info "Deploying frontend to Cloudflare Pages"
echo ""

read -p "Project name (default: tapestrai): " project_name
project_name=${project_name:-tapestrai}

npx wrangler pages deploy . --project-name="$project_name"

if [ $? -eq 0 ]; then
    print_success "Pages deployed successfully!"
    echo ""
    print_success "🎉 Deployment Complete!"
    echo ""
    print_info "Your app should be live at:"
    echo "  https://$project_name.pages.dev"
    echo ""
    print_info "Next steps:"
    echo "  1. Visit your deployed site"
    echo "  2. Add API keys in the API Setup section"
    echo "  3. Test all 4 providers"
    echo "  4. Run BugX tests: https://$project_name.pages.dev/tests/test-worker-runner.html"
    echo ""
else
    print_error "Pages deployment failed"
    exit 1
fi

# Step 6: Summary
echo ""
echo "=========================================="
echo "📊 Deployment Summary"
echo "=========================================="
print_success "Worker deployed and running"
print_success "Pages deployed and serving"
print_info "All 4 AI providers should now work!"
echo ""
print_warning "Don't forget to:"
echo "  - Test API keys on your deployed site"
echo "  - Run the BugX test suite"
echo "  - Check that CORS issues are resolved"
echo ""
