# LocalStore E-commerce Application

A modern e-commerce web application with professional user authentication, role-based access control, and a comprehensive shopping experience.

## Features

- Professional header with user profile management
- Role-based authentication (User/Admin)
- Product browsing and searching
- Shopping cart functionality
- Checkout process with mobile payment integration (JazzCash/EasyPaisa)
- Order tracking
- Admin panel for product and order management

## Authentication System

### Role Selection
When clicking the user profile icon (top-right corner of the header), users are presented with a role selection screen to choose between:
- **Customer**: Regular user for shopping
- **Admin**: Store administrator

### Customer Login/Signup
- Navigate to Login/Signup page by clicking the user profile icon
- Create an account or login with existing credentials
- After authentication, customers can:
  - Browse products
  - Add items to cart
  - Place orders
  - Track orders using the Order ID

### Admin Login
- Navigate to Login page by clicking the user profile icon
- Use the following credentials for admin access:
  - **Email**: admin@localstore.pk
  - **Password**: admin123
- After authentication, admins can:
  - Add new products
  - Edit existing products
  - Delete products
  - View transaction history
  - Monitor payment notifications
  - Update order tracking status

## Project Structure

```
PRODIGY_FS_03/
├── backend/
│   ├── app.py
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx (Main application component)
│   │   ├── App.css (Styling)
│   │   └── index.css
│   ├── package.json
│   └── ...
├── BUILD.md
├── README.md
└── requirements.txt
```

## UI/UX Improvements

### Header Redesign
- Removed the prominent "Admin" button from the center of the header
- Added a professional user profile icon in the top-right corner
- Added dropdown menu with user options when authenticated
- Implemented responsive design for all screen sizes

### Authentication Flows
- **Role Selection Page**: Clean interface to choose between customer and admin
- **User Login/Signup Page**: Professional form with validation
- **Admin Login Page**: Secure login with fixed credentials
- **Consistent Design**: All login flows match the site's color scheme, gradients, and rounded styling

### Security & Session Management
- Token-based authentication using localStorage
- Proper role-based access control
- Secure logout functionality
- Session persistence across page reloads

## How to Use

1. **Start the Application**
   - Run the backend server: `python backend/app.py`
   - Run the frontend: `cd frontend && npm run dev`
   - Visit `http://localhost:5000` in your browser

2. **As a Customer**
   - Click the user profile icon in the top-right
   - Select "Customer" role
   - Either sign up with a new account or login with existing credentials
   - Browse products and add items to cart
   - Proceed to checkout to place orders

3. **As an Admin**
   - Click the user profile icon in the top-right
   - Select "Admin" role
   - Login with the admin credentials (admin@localstore.pk / admin123)
   - Access the admin panel to manage products and orders

4. **Order Tracking**
   - After placing an order, use the "Track Order" feature
   - Enter the provided tracking ID to view order status
   - Track shipment progress from order placement to delivery

## Technical Implementation

### Frontend Technologies
- React.js
- Lucide React icons
- CSS with custom properties and gradients

### Authentication Flow
1. User clicks profile icon in header
2. Role selection screen appears
3. User selects role (Customer/Admin) and proceeds to login
4. Credentials are validated
5. User data and authentication token are stored in localStorage
6. Appropriate UI is displayed based on user role
7. Upon logout, all stored authentication data is cleared

### State Management
- React Context API for authentication state
- React Context API for cart functionality
- LocalStorage for persistent authentication

## Security Considerations
- Client-side authentication with localStorage
- Role-based access control for sensitive functionality
- Input validation and sanitization
- Secure credential handling

## Responsive Design
- Fully responsive layout for all screen sizes
- Mobile-friendly navigation and authentication flows
- Adaptive components for different devices

## Development Notes
- Authentication state persists between sessions
- All authentication flows use consistent styling
- Admin credentials are hardcoded for demo purposes
- Real-world implementation would connect to backend authentication service