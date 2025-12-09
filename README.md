<div align="center">
  <img width="1200" height="475" alt="CaterPro AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6">
</div>

# CaterPro AI 🍽️✨

CaterPro AI is your AI-powered assistant for instantly generating professional catering proposals. Tailor complete menus for any event, from corporate lunches to elegant weddings, and streamline your entire planning process.

## Key Features
- **Instant Menu Generation:** Create detailed menus tailored to any event.
- **Full Customization:** Adjust for event type, guest count, budget, and dietary needs.
- **Operational Checklists:** Generate mise en place, service notes, and logistics plans.
- **Download & Share:** Save proposals as PDF, print, or share via a unique link (**Pro**).
- **AI Chat Assistant:** Get expert advice on pairings and planning (**Premium & Pro**).
- **Find Local Suppliers:** Discover local wholesalers and specialty suppliers (**Pro**).

---

## 🚀 Deployment Guide (Fixing the Red X)

**This project is configured to deploy automatically to Firebase Hosting.**

If your build passes but the **"Deploy to Firebase"** step fails with `Input required and not supplied: firebaseServiceAccount`, follow these steps:

### 1. Get your Firebase Service Account JSON
You need a service account key to allow GitHub to upload to Firebase.
*   **Option A (Command Line):** Run `firebase init hosting:github` in your local terminal. Follow the prompts. It will eventually provide you with a Service Account JSON snippet.
*   **Option B (Google Cloud Console):**
    1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
    2. Select your project (`caterpro-ai`).
    3. Go to **IAM & Admin** > **Service Accounts**.
    4. Click on the default App Engine service account (or create a new one).
    5. Click **Keys** > **Add Key** > **Create new key** > **JSON**.
    6. This will download a JSON file to your computer. Open it and copy the entire content.

### 2. Add the Secret to GitHub
1.  Go to your GitHub Repository page.
2.  Click **Settings** > **Secrets and variables** > **Actions**.
3.  Click **New repository secret**.
4.  **Name:** `FIREBASE_SERVICE_ACCOUNT`
5.  **Value:** Paste the entire content of the JSON file.
6.  Click **Add secret**.

### 3. Trigger a New Build
Go to the **Actions** tab in GitHub, select the failed run, and click **Re-run jobs**, or simply push a small change to the repo.

---

## Subscription Tiers

CaterPro AI offers multiple tiers to fit your business needs.

| Feature                      | Free         | Starter ($9/mo) | Professional ($19/mo) | Business ($29/mo) | Enterprise ($99/mo) |
| ---------------------------- | ------------ | --------------- | --------------------- | ----------------- | ------------------- |
| **Generations**              | 3 / Day      | Unlimited       | Unlimited             | Unlimited         | Unlimited           |
| **No Watermark**             | ❌           | ✅              | ✅                    | ✅                | ✅                  |
| **AI Food Photography**      | ❌           | ❌              | ✅ **Michelin Style** | ✅                | ✅                  |
| **Save Menus**               | ❌           | ❌              | 10 Menus              | Unlimited         | Unlimited           |
| **AI Chat & Pairings**       | ❌           | ❌              | ✅                    | ✅                | ✅                  |
| **Shareable Links**          | ❌           | ❌              | ❌                    | ✅                | ✅                  |
| **Find Suppliers**           | ❌           | ❌              | ❌                    | ✅                | ✅                  |
| **Bulk List Editing**        | ❌           | ❌              | ❌                    | ✅                | ✅                  |

---

## Running Locally

### Prerequisites
*   Node.js (v18+)

### Setup Instructions

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Melotwo/CaterPro-AI.git
    cd CaterPro-AI
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up your API Key:**
    Create a `.env` file in the root by copying the example file:
    ```sh
    cp .env.example .env
    ```
    Then, open the new `.env` file and add your Gemini API key.

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
