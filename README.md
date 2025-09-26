# LocalStore E-commerce Platform

LocalStore is a modern, full-stack e-commerce solution designed for local businesses. The platform features a professional user authentication system, comprehensive shopping experience, and robust admin panel for seamless store management.

## 🌟 Features

### Customer Experience
- **Product Browsing**: Intuitive interface for browsing and searching products
- **Shopping Cart**: Secure and reliable shopping cart functionality
- **Checkout Process**: Streamlined checkout with mobile payment integration
- **Order Tracking**: Real-time order status tracking with unique IDs
- **Responsive Design**: Seamless experience across all devices

### Admin Management
- **Product Management**: Add, edit, and remove products from inventory
- **Order Processing**: Monitor and update order statuses
- **Transaction History**: Track all sales and payment notifications
- **User Management**: Overview of customer activities and orders

### Authentication System
- **Role-Based Access**: Secure authentication with Customer/Admin roles
- **User Profile Management**: Professional user profile dropdown interface
- **Persistent Sessions**: Maintained authentication across page reloads
- **Secure Logout**: Proper cleanup of authentication tokens

## 🏗️ Architecture

### Frontend
- **React.js**: Component-based architecture
- **Lucide React**: Professional icon library
- **CSS**: Custom properties and gradients for consistent styling
- **Context API**: State management for authentication and cart functionality

### Backend
- **Python**: Flask framework for API endpoints
- **Database**: SQLite for product and order management
- **Payment Integration**: Mobile payment solutions (JazzCash/EasyPaisa)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/touseef7878/PRODIGY_FS_03.git
   cd PRODIGY_FS_03
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Start the backend server**
   ```bash
   cd backend
   python app.py
   ```

5. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

### Environment Configuration

Create a `.env` file in the frontend directory with the following variables:
```
VITE_API_URL=http://localhost:8000/api
VITE_PAYMENT_GATEWAY=your_payment_gateway_config
```

## 🔐 Authentication System

### Role Selection
When clicking the user profile icon (top-right corner of the header), users are presented with a role selection screen to choose between:
- **Customer**: Regular user for shopping
- **Admin**: Store administrator

### Customer Authentication
- Navigate to Login/Signup page by clicking the user profile icon
- Create an account or login with existing credentials
- After authentication, customers can browse products, add items to cart, and place orders

### Admin Authentication
- Navigate to Login page by clicking the user profile icon
- Use the following credentials for admin access:
  - **Email**: admin@localstore.pk
  - **Password**: admin123
- After authentication, admins can manage products, view transactions, and monitor order status

## 🛍️ User Workflow

### As a Customer
1. Click the user profile icon in the top-right
2. Select "Customer" role
3. Either sign up with a new account or login with existing credentials
4. Browse products and add items to cart
5. Proceed to checkout to place orders
6. Use the "Track Order" feature to monitor order status

### As an Admin
1. Click the user profile icon in the top-right
2. Select "Admin" role
3. Login with the admin credentials (admin@localstore.pk / admin123)
4. Access the admin panel to manage products and orders
5. Monitor transaction history and update order tracking status

## 📁 Project Structure

```
PRODIGY_FS_03/
├── backend/
│   ├── app.py          # Main Flask application
│   ├── models/         # Database models
│   ├── routes/         # API endpoints
│   └── utils/          # Utility functions
├── frontend/
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── contexts/   # React Context providers
│   │   ├── pages/      # Application pages
│   │   ├── services/   # API service calls
│   │   ├── styles/     # CSS modules
│   │   ├── utils/      # Helper functions
│   │   ├── App.jsx     # Main application component
│   │   ├── App.css     # Global styles
│   │   └── main.jsx    # Application entry point
│   ├── package.json    # Frontend dependencies
│   └── vite.config.js  # Vite build configuration
├── README.md           # This file
└── requirements.txt    # Backend dependencies
```

## 🛡️ Security Considerations

- **Client-side Authentication**: Using localStorage for demo purposes
- **Role-based Access Control**: Ensuring users only access allowed features
- **Input Validation**: Proper validation and sanitization of user inputs
- **Secure Credential Handling**: Proper handling of sensitive information
- **Session Management**: Maintaining secure authentication states

### Production Security Notes
- In production, authentication should be handled server-side with proper token validation
- Admin credentials should not be hardcoded
- Implement proper password encryption and secure transmission protocols
- Add rate limiting and CSRF protection for API endpoints

## 🔧 Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

#### Backend
- `python app.py` - Start development server
- `python -m pytest` - Run tests

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Add new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

#### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get specific order details

## 📱 Responsive Design

LocalStore features a fully responsive design that provides an optimal viewing experience across:
- Mobile devices (smartphones and tablets)
- Desktop computers
- Laptop screens
- Large format displays

All authentication flows and user interfaces adapt to different screen sizes for maximum usability.

## 🧪 Testing

### Frontend Testing
- Unit testing with Jest and React Testing Library
- Component testing for all UI elements
- Integration testing for authentication flows

### Backend Testing
- API endpoint testing with pytest
- Database operation validation
- Security and authentication flow testing

To run tests:
```bash
# Frontend tests
npm run test

# Backend tests
cd backend
python -m pytest
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, please contact:
- Email: touseefurrehman5554@gmail.com
- GitHub Issues: [Create an issue](https://github.com/touseef7878/PRODIGY_FS_03/issues)

## 🙏 Acknowledgments

- React.js for the powerful component-based architecture
- Lucide React for beautiful SVG icons
- Vite for fast development experience
- Flask for reliable backend framework
- Local business community for inspiration

---

Built with ❤️ for local commerce.