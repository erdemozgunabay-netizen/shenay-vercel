# SHENAY ILERI - Beauty & Cosmetics Platform

Professional makeup artist portfolio, luxury cosmetics shop, and AI-powered beauty analysis application built with React, TypeScript, and Firebase.

## Features

*   **AI Beauty Analysis**: Upload a photo to get personalized makeup advice, color palettes, and product recommendations using Google Gemini API.
*   **E-Commerce**: Browse and purchase cosmetics products (Cart, Checkout flow).
*   **Booking System**: Schedule appointments for makeup and skincare services.
*   **Admin Dashboard**: Comprehensive CMS to manage orders, products, services, blog posts, and site content.
*   **Multi-language Support**: English, Turkish, and German.
*   **Blog**: Beauty trends and tips content management.

## Tech Stack

*   **Frontend**: React 19, TypeScript, Tailwind CSS
*   **Backend / BaaS**: Firebase (Authentication, Firestore, Realtime Database)
*   **AI**: Google Gemini API (@google/genai)
*   **Icons**: Lucide React

## Setup & Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory with your API keys (optional, mostly for Gemini):
    ```env
    API_KEY=your_google_gemini_api_key
    ```
4.  The Firebase configuration is located in `firebase.ts`. Ensure your Firebase project is set up with Authentication, Firestore, and Realtime Database.
5.  Start the development server:
    ```bash
    npm start
    ```

## Firebase Configuration

The application requires a Firebase project with:
*   **Authentication**: Email/Password enabled.
*   **Firestore**: For storing site settings (e.g., Site Title) and other persistent data.
*   **Realtime Database**: For dynamic site configuration (content, products, services, orders).

## License

All rights reserved.
