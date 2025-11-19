# ==============================================================================
#  ✅ FINAL DEPLOYMENT WORKFLOW FOR FIREBASE HOSTING
# ==============================================================================

name: '✅ Deploy to Firebase Hosting'

on:
  push:
    branches:
      - 'main'
      - 'master' # Added master just in case your branch uses the old naming convention
  workflow_dispatch: # Allows manual triggering of the workflow

# Prevent multiple instances of this workflow from running simultaneously
concurrency:
  group: 'firebase-deployment'
  cancel-in-progress: true

jobs:
  build_and_deploy:
    name: Build and Deploy to Firebase
    runs-on: ubuntu-latest
    
    # Set environment variables for the build process
    env:
      API_KEY: ${{ secrets.API_KEY }}

    steps:
      - name: 'Step 1: Checkout Repository'
        uses: actions/checkout@v4

      - name: 'Step 2: Set up Node.js environment'
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: 'Step 3: Install Project Dependencies'
        run: npm ci

      - name: 'Step 4: Build the Application'
        run: npm run build

      - name: 'Step 5: Deploy to Firebase Hosting'
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: 'caterpro-ai'
          channelId: live
