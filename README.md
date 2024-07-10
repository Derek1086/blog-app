# Code Structure

The code is structured into two main directories: backend and frontend.

## Backend

The backend is built using Node.js and Express.js. The main files are:

- index.js: This file sets up the server and connects to the MongoDB database. It also sets up middlewares and routes.
- routes: This directory contains the route handlers for different endpoints.
- models: This directory contains the schema definitions for the MongoDB collections.
- controllers: This directory contains the logic for handling requests and interacting with the database.
- utils: This directory contains utility functions used throughout the application.

## Frontend

The frontend is built using React and Vite. The main files are:

- index.html: This file sets up the HTML structure and loads the main.jsx file.
- main.jsx: This file sets up the React app and loads the necessary components.
- src: This directory contains the main source code for the frontend. It is divided into pages, components, and other directories.
  - pages: This directory contains the different pages of the application.
  - components: This directory contains the reusable components used across the application.
  - context: This directory contains the context providers for managing global state.
  - ui: This directory contains the UI components and styling.
  - url.js: This file contains the URL endpoints for the backend API.

## Additional Information

- JWT (JSON Web Tokens) for authentication. The frontend sends the JWT token in the Authorization header of each request. The backend verifies the token and provides access to protected routes and data.

- MongoDB as the database. The database connection is set up in the backend index.js file.

- Multer for image uploads. The image files are stored in the /images directory in the backend. The frontend sends the image files to the /api/upload endpoint in the backend.

- ESLint for code linting and formatting. The linting rules are defined in the .eslintrc.json file.

- Prettier for code formatting. The formatting rules are defined in the .prettierrc file.

- TVite for frontend development. Vite provides fast development and build times, and supports hot module replacement (HMR).

- React Router for routing. The routing configuration is defined in the frontend main.jsx file.

- Material-UI for UI components. The UI components are customized in the frontend ui directory.

- Axios for making HTTP requests. The Axios instance is configured in the frontend url.js file.
