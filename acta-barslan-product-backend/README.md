# Acta Barslan Product Management Backend

A comprehensive Node.js Express.js backend API with JWT authentication, built for product management system.

## Features

-  🔐 JWT Authentication & Authorization
-  👤 User Management (Register, Login, Profile)
-  📦 Product Management (CRUD operations)
-  🛡️ Security Middleware (Helmet, CORS, Rate Limiting)
-  ✅ Input Validation & Error Handling
-  📊 Product Statistics & Search
-  🗄️ MongoDB Database Integration
-  📝 Comprehensive API Documentation

## Tech Stack

-  **Runtime**: Node.js
-  **Framework**: Express.js
-  **Database**: MongoDB with Mongoose
-  **Authentication**: JWT (JSON Web Tokens)
-  **Security**: bcryptjs, helmet, cors
-  **Validation**: express-validator
-  **Logging**: morgan
-  **Environment**: dotenv

## Project Structure

```
acta-barslan-product-backend/
├── config/
│   ├── database.js          # MongoDB connection
│   └── jwt.js               # JWT configuration
├── controllers/
│   ├── authController.js    # Authentication endpoints
│   └── productController.js # Product endpoints
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   ├── errorHandler.js     # Global error handling
│   └── validation.js       # Input validation middleware
├── models/
│   ├── User.js             # User schema
│   └── Product.js          # Product schema
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── products.js         # Product routes
│   └── index.js            # Main router
├── services/
│   ├── authService.js      # Authentication business logic
│   └── productService.js   # Product business logic
├── validators/
│   ├── authValidator.js    # Authentication validation rules
│   └── productValidator.js # Product validation rules
├── server.js               # Main server file
├── package.json            # Dependencies
└── env.example            # Environment variables example
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd acta-barslan-product-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/acta-barslan-product
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint           | Description               | Auth Required |
| ------ | ------------------ | ------------------------- | ------------- |
| POST   | `/register`        | Register new user         | No            |
| POST   | `/login`           | User login                | No            |
| GET    | `/profile`         | Get user profile          | Yes           |
| PUT    | `/profile`         | Update user profile       | Yes           |
| PUT    | `/change-password` | Change password           | Yes           |
| POST   | `/forgot-password` | Request password reset    | No            |
| POST   | `/reset-password`  | Reset password with token | No            |
| POST   | `/logout`          | User logout               | Yes           |

### Product Routes (`/api/products`)

| Method | Endpoint              | Description              | Auth Required | Role Required   |
| ------ | --------------------- | ------------------------ | ------------- | --------------- |
| GET    | `/`                   | Get all products         | No            | -               |
| GET    | `/featured`           | Get featured products    | No            | -               |
| GET    | `/category/:category` | Get products by category | No            | -               |
| GET    | `/search`             | Search products          | No            | -               |
| GET    | `/stats`              | Get product statistics   | No            | -               |
| GET    | `/:id`                | Get single product       | No            | -               |
| POST   | `/`                   | Create new product       | Yes           | Admin/Moderator |
| PUT    | `/:id`                | Update product           | Yes           | Admin/Moderator |
| DELETE | `/:id`                | Delete product           | Yes           | Admin/Moderator |
| PUT    | `/:id/stock`          | Update product stock     | Yes           | Admin/Moderator |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## User Roles

-  **user**: Regular user (default)
-  **admin**: Full access to all features
-  **moderator**: Can manage products

## Error Handling

All API responses follow a consistent format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Validation errors (if any)
}
```

## Validation

The API includes comprehensive input validation:

-  **Email validation**: Proper email format
-  **Password validation**: Minimum 6 characters with complexity requirements
-  **Product validation**: Required fields and data types
-  **MongoDB ObjectId validation**: For route parameters

## Security Features

-  **Helmet**: Security headers
-  **CORS**: Cross-origin resource sharing
-  **Rate Limiting**: 100 requests per 15 minutes per IP
-  **Password Hashing**: bcryptjs with salt rounds
-  **JWT Security**: Secure token generation and verification
-  **Input Sanitization**: XSS protection
-  **SQL Injection Protection**: Mongoose ODM

## Database Schema

### User Model

-  Personal information (firstName, lastName, email)
-  Authentication (password, role, isActive)
-  Profile data (phoneNumber, address, profilePicture)
-  Security fields (emailVerificationToken, passwordResetToken)

### Product Model

-  Basic info (name, description, price, category)
-  Inventory (stock, sku, brand)
-  Media (images array)
-  Specifications (weight, dimensions, color, material)
-  Metadata (tags, rating, isFeatured, isActive)
-  Audit fields (createdBy, updatedBy, timestamps)

## Development

### Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors
```

### Environment Variables

-  `PORT`: Server port (default: 5000)
-  `NODE_ENV`: Environment (development/production)
-  `MONGODB_URI`: MongoDB connection string
-  `JWT_SECRET`: Secret key for JWT signing
-  `JWT_EXPIRE`: JWT expiration time
-  `FRONTEND_URL`: Frontend application URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
