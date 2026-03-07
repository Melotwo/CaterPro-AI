<div align="center">
  <img width="1200" height="475" alt="CaterPro AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6">
</div>

# CaterPro AI 🍽️✨

**The AI-Powered Assistant for Professional Chefs & Caterers**

CaterPro AI automates the "boring" side of catering. From generating complete menu proposals to creating shopping lists organized by aisle, it helps chefs spend less time on paperwork and more time in the kitchen.

---

## 🚀 Key Features

*   **Instant Menu Generation:** Create detailed, event-specific menus in seconds.
*   **Smart Shopping Lists:** Ingredients are automatically sorted by category and store type.
*   **Cost & Logistics:** Built-in delivery fee calculators and portion planning.
*   **Professional PDF Exports:** Download beautiful, unbranded proposals to send to clients.
*   **AI Chat Consultant:** Get expert advice on wine pairings, substitutions, and logistics.

---

## 🎨 Customization

### Updating the Founder Photo
The "Founder Story" on the landing page is designed to be personalized.

1.  **Take a photo** (Portrait/Vertical orientation works best).
2.  **Upload it** to the **main page** of this repository.
3.  **That's it!** The system automatically detects your photo (JPG or PNG) and updates the site.

*(Note: It may take 2-3 minutes for the changes to go live).*

---

## 🛡️ Branding & Verification

To verify your app and finish the branding:

1.  **Custom Domain:** Ensure your domain `caterproai.com` is correctly linked in the Firebase Console under **Hosting**.
2.  **Google Search Console:** Add your site to Google Search Console to verify ownership and improve SEO.
3.  **Social Media Branding:** Update the `metadata.json` file in this repository with your official business description to ensure correct link previews on WhatsApp and Facebook.

---

## 💻 Local Development

To run CaterPro AI on your own machine:

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
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_google_ai_studio_key_here
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

---

## 🔑 GitHub Secrets Setup

For the live site to work, you **must** add these secrets in your GitHub repository (**Settings > Secrets and variables > Actions**):

*   `VITE_GEMINI_API_KEY`: Your Google Gemini API Key.
*   `VITE_FIREBASE_API_KEY`: Your Firebase Web API Key.
*   `FIREBASE_SERVICE_ACCOUNT`: Your Firebase Service Account JSON (for deployment).
*   *(And all other VITE_FIREBASE_* variables as listed in the deployment logs).*

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
