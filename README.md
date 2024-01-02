


# Lazy-Gram: React Photo Gallery App

Lazy-Gram is a photo gallery app developed with React, Vite, Tailwind CSS, and Daisy UI. It provides users with the ability to explore, upload, and manage their photo collections.

## Getting Started

To run the Lazy-Gram project locally, follow these steps:

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

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
   VITE_REACT_APP_FIREBASE_API_KEY=your_api_key
   VITE_REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_REACT_APP_FIREBASE_DATABASE_URL=your_database_url
   VITE_REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   VITE_REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

6. Run the application:

   ```bash
   npm run dev
   ```

   The app will be accessible at [http://localhost:3000](http://localhost:3000).

## Features

- **Responsive Design:** Lazy-Gram provides a seamless experience on various devices, from desktop to mobile.
- **Photo Exploration:** Browse through a curated collection of photos uploaded by other users.
- **Upload Your Photos:** Share your favorite moments by uploading images to Lazy-Gram.
- **Tailwind CSS and Daisy UI Integration:** Enjoy the benefits of a utility-first CSS framework and additional UI components.

## Project Structure

- `src/pages`: Contains React components for different pages (e.g., Home, UploadImages, UserUploads).
- `src/routes`: Defines custom route components for navigation.
- `src/context`: Manages the application's state.
- `src/App.jsx`: Main application component with routing logic.

## Scripts

- `npm run dev`: Start the development server using Vite.
- `npm run build`: Build the application for production.
- `npm run lint`: Run ESLint to check for code style and potential issues.

## Technologies Used

- React
- Vite
- Firebase (for authentication and storage)
- Tailwind CSS
- Daisy UI (Tailwind CSS component library)

## Usage

- Explore the photo gallery to discover images uploaded by other users.
- Upload your own photos to share your memories with the Lazy-Gram community.

Feel free to customize and extend the app based on your requirements!

## License

This project is licensed under the [MIT License](LICENSE).

---

If you have any questions or need further assistance, don't hesitate to reach out. Happy coding!
```

Make sure to update the Firebase configuration placeholders in the `.env` section with your actual Firebase configuration values.
