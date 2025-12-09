<div align="center">
  <img width="1200" height="475" alt="CaterPro AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6">
</div>

# CaterPro AI 🍽️✨

CaterPro AI is your AI-powered assistant for instantly generating professional catering proposals. Tailor complete menus for any event, from corporate lunches to elegant weddings, and streamline your entire planning process.

## 🚨 Deployment Fix: "Input required and not supplied: firebaseServiceAccount"

If your build passes but the **"Deploy to Firebase"** step fails, you are missing the security key in GitHub.

### 1. Get your Firebase Service Account JSON
1.  Go to the [Google Cloud Console Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts).
2.  Ensure your project `caterpro-ai` is selected at the top.
3.  Locate the service account (usually `firebase-adminsdk...`).
4.  Click the **three dots** > **Manage keys**.
5.  Click **Add Key** > **Create new key** > **JSON**.
6.  Open the downloaded file and **copy the entire content**.

### 2. Add the Secret to GitHub
1.  Go to your GitHub Repository page.
2.  Click **Settings** > **Secrets and variables** > **Actions**.
3.  Click **New repository secret**.
4.  **Name:** `FIREBASE_SERVICE_ACCOUNT` (Exact spelling is important!)
5.  **Value:** Paste the JSON content you copied.
6.  Click **Add secret**.

### 3. Trigger a New Deploy
Go to the **Actions** tab, select the failed run, and click **Re-run jobs**.

---

## Key Features
- **Instant Menu Generation:** Create detailed menus tailored to any event.
- **Full Customization:** Adjust for event type, guest count, budget, and dietary needs.
- **Operational Checklists:** Generate mise en place, service notes, and logistics plans.
- **Download & Share:** Save proposals as PDF, print, or share via a unique link (**Pro**).
- **AI Chat Assistant:** Get expert advice on pairings and planning (**Premium & Pro**).
- **Find Local Suppliers:** Discover local wholesalers and specialty suppliers (**Pro**).

## Running Locally

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
    Create a `.env` file and add your `API_KEY` from Google AI Studio.

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
