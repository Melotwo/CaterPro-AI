<div align="center">
  <img width="1200" height="475" alt="CaterPro AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6">
</div>

# CaterPro AI 🍽️✨

**CaterPro AI** is a revolutionary tool designed to streamline the menu planning process for caterers, event planners, and private chefs. Leveraging the power of the Google Gemini API, this application transforms simple event parameters—like event type, guest count, and budget—into comprehensive, beautifully formatted menu proposals in seconds.

## Key Features

-   **⚡ Instant Menu Generation:** Craft detailed, multi-course menus tailored to any event.
-   **📄 Professional Proposals:** Output includes creative themes, appetizers, mains, sides, desserts, and expert service/plating notes.
-   **🔧 Highly Customizable:** Tailor menus based on event type, guest count, budget, cuisine style, and specific dietary restrictions.
-   **📥 Download & Share:** Easily save, print, or download your professional menu proposals as a PDF.
-   **🤖 AI Chat Assistant:** Get expert advice on pairings, planning, and logistics from an integrated AI consultant.

## Tech Stack

-   **Frontend:** React, TypeScript, Vite
-   **Styling:** Tailwind CSS
-   **AI:** Google Gemini API

This project demonstrates a modern, responsive, and powerful front-end application that solves a real-world business problem.

---

## Running Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm

### Installation & Setup

1.  **Clone the repo**
    ```sh
    git clone https://github.com/Melotwo/caterpro-ai.git
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Set up your environment variables**
    Create a new file named `.env.local` in the root of your project and add your Google Gemini API key:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```
4.  **Run the development server**
    ```sh
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or whichever port the console indicates) to view it in the browser.

## Deployment to GitHub Pages

This project is set up for easy deployment to GitHub Pages.

1.  Ensure the `homepage` property in your `package.json` file is set to `https://Melotwo.github.io/caterpro-ai/`.
2.  Run the deployment script:
    ```sh
    npm run deploy
    ```
This will build the app and push the contents of the `dist` folder to a `gh-pages` branch on your repository. GitHub will then automatically serve this branch as your live site.
