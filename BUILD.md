# LocalStore E-Commerce: Build and Setup Guide

This guide provides detailed instructions on how to set up, build, and run the LocalStore E-Commerce application.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python:** Version 3.7 or higher
- **Node.js:** Version 14 or higher
- **npm:** (Node Package Manager) or yarn

---

## Backend Setup (Flask)

The backend is a Flask application that serves the API and interacts with the database.

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```

2.  **Create a Virtual Environment:**
    It is recommended to use a virtual environment to manage Python dependencies.
    ```bash
    python -m venv venv
    ```

3.  **Activate the Virtual Environment:**
    -   **On Windows:**
        ```bash
        .\venv\Scripts\activate
        ```
    -   **On macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```

4.  **Install Dependencies:**
    Install all required Python packages from the `requirements.txt` file.
    ```bash
    pip install -r ../requirements.txt
    ```

5.  **Run the Flask Server:**
    This command will start the backend server. The `init_db()` function will also run for the first time to create the database and seed it with sample products.
    ```bash
    python app.py
    ```

The backend API will be running at `http://localhost:5000`.

---

## Frontend Setup (React)

The frontend is a React application built with Vite.

1.  **Navigate to the Frontend Directory:**
    ```bash
    cd frontend
    ```

2.  **Install Dependencies:**
    This will install all the necessary Node.js packages, including React.
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    This command starts the Vite development server.
    ```bash
    npm run dev
    ```

The frontend application will be accessible at `http://localhost:5173`.

---

## Database

-   The application uses **SQLite** for the database, which is a file-based database.
-   The database file, `localstore.db`, is located in the `backend/instance/` directory.
-   When the backend server is started for the first time, the database is automatically created and populated with sample data.

---

## Building for Production

While the above instructions are for a development environment, here are the general steps for a production build:

### Backend

For a production environment, it is recommended to use a production-grade WSGI server like Gunicorn or uWSGI instead of Flask's built-in development server.

### Frontend

1.  **Navigate to the `frontend` directory.**
2.  **Build the application:**
    ```bash
    npm run build
    ```
    This command creates a `dist` folder with the optimized and minified production-ready files.
3.  **Serve the `dist` folder** using a static file server.
