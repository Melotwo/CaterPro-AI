<div align="center">
  <img width="1200" height="475" alt="CaterPro AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6">
</div>

# CaterPro AI 🍽️✨

CaterPro AI instantly generates professional catering proposals using the Google Gemini API.

**[Live Demo](https://melotwo.github.io/CaterPro-AI/)**

## Key Features
- **Instant Menu Generation:** Create detailed menus tailored to any event.
- **Customizable:** Adjust for event type, guest count, budget, and dietary needs.
- **Download & Share:** Save proposals as PDF, print, or share via a link.
- **AI Chat Assistant:** Get expert advice on pairings and planning.

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API

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
    Create a `.env.local` file in the root and add your Gemini API key.
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

## Deployment
This project deploys automatically to GitHub Pages via a GitHub Action whenever changes are pushed to the `main` branch.
