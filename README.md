# Lazy-Gram: React Photo Gallery App

Welcome to Lazy-Gram, a React-based photo gallery app where users can explore, upload, and manage their photo collections. This app includes user authentication features, allowing users to register, log in, and access personalized content.

## Getting Started

Follow these steps to set up and run the Lazy-Gram project on your local machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Lazy-Coder-03/lazy-gram.git
   ```

2. Navigate to the project directory:

   ```bash
   cd lazy-gram
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a Firebase project and set up authentication and storage. Obtain your Firebase configuration.

5. Create a `.env` file in the root of the project and add your Firebase configuration:

   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_DATABASE_URL=your_database_url
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

6. Run the application:

   ```bash
   npm start
   ```

   The app will be accessible at [http://localhost:3000](http://localhost:3000).

## Features

- **User Authentication:** Register or log in to your Lazy-Gram account to access personalized features.
- **Explore Photos:** Browse through a curated collection of photos uploaded by users.
- **Upload Images:** Share your favorite moments by uploading images to Lazy-Gram.
- **Update User Profile:** Manage your user profile and update information as needed.
- **View Your Uploads:** Access a gallery of images you've uploaded.

## Project Structure

- `src/pages`: Contains React components for different pages (e.g., Home, Signup, Login, UploadImages, UserUploads).
- `src/routes`: Defines custom route components (e.g., PrivateRoute, PublicRoute).
- `src/context`: Manages the authentication state using React context.
- `src/App.jsx`: Main application component with routing logic.

## Usage

- Register a new account or log in with existing credentials.
- Explore the gallery to discover and view images uploaded by other users.
- Upload your own photos to share with the Lazy-Gram community.
- Update your user profile to personalize your Lazy-Gram experience.

Feel free to customize and extend the app based on your requirements!

## License

This project is licensed under the [MIT License](LICENSE).
