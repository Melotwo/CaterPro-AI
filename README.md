<div align="center">
  <img width="1200" height="475" alt="CaterPro AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6">
</div>

# CaterPro AI 🍽️✨

CaterPro AI is your AI-powered assistant for instantly generating professional catering proposals. Tailor complete menus for any event, from corporate lunches to elegant weddings, and streamline your entire planning process.

## 📸 Adding Founder Photo

To personalize the landing page:
1.  Rename your photo to `founder.jpg`.
2.  Place it in the `public/` folder of this repository.
3.  The app will automatically display it in the "Founder's Story" section.

## 🚨 CRITICAL FIX: "FIREBASE_SERVICE_ACCOUNT is missing"

Based on your screenshots, the secret is currently in the **Environment Secrets** section. It **MUST** be in **Repository Secrets**.

### How to Fix (Do this on GitHub Website)

1.  **Go to Settings:**
    - Navigate to your Repo > **Settings** > **Secrets and variables** > **Actions**.

2.  **Remove the Wrong Secret:**
    - Look at the **"Environment secrets"** section at the top.
    - If you see `FIREBASE_SERVICE_ACCOUNT` there, click the **Trash Icon** 🗑️ to delete it.
    - If you created an Environment named "FIREBASE_SERVICE_ACCOUNT", you can ignore it or delete it in the "Environments" tab on the left.

3.  **Add the Correct Secret:**
    - Scroll down to **"Repository secrets"**.
    - Click the green **"New repository secret"** button.
    - **Name:** `FIREBASE_SERVICE_ACCOUNT`
    - **Value:** Paste the entire contents of your JSON file.
    - Click **Add secret**.

4.  **Add your API Key (If missing):**
    - Click **"New repository secret"** again.
    - **Name:** `GEMINI_API_KEY`
    - **Value:** Paste your Google AI Studio API Key.
    - Click **Add secret**.

5.  **Re-run the Deploy:**
    - Go to the **Actions** tab.
    - Click the failed run.
    - Click **Re-run jobs**.

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
