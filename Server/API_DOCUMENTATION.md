# Salon & Spa Booking System API Documentation

## Authentication Routes

### Register User

- **Route:** POST /api/auth/register
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "customer"
    }
  }
  ```

### Login User

- **Route:** POST /api/auth/login
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "customer"
    }
  }
  ```

## Service Routes

### Get All Services

- **Route:** GET /api/services
- **Access:** Public
- **Query Parameters:**
  - category (optional)
  - isActive (optional)
- **Response:**
  ```json
  [
    {
      "id": "service_id",
      "name": "Haircut",
      "description": "Professional haircut service",
      "duration": 30,
      "price": 25.0,
      "category": "haircut",
      "image": "image_url",
      "isActive": true
    }
  ]
  ```

### Create Service

- **Route:** POST /api/services
- **Access:** Admin only
- **Request Body:**
  ```json
  {
    "name": "Haircut",
    "description": "Professional haircut service",
    "duration": 30,
    "price": 25.0,
    "category": "haircut",
    "image": "file_upload"
  }
  ```

## Appointment Routes

### Get All Appointments

- **Route:** GET /api/appointments
- **Access:** Authenticated
- **Query Parameters:**
  - status (optional)
  - startDate (optional)
  - endDate (optional)
- **Response:**
  ```json
  [
    {
      "id": "appointment_id",
      "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890"
      },
      "service": {
        "name": "Haircut",
        "duration": 30,
        "price": 25.0
      },
      "appointmentDate": "2024-03-20T10:00:00Z",
      "status": "pending",
      "paymentStatus": "pending",
      "totalAmount": 25.0
    }
  ]
  ```

### Create Appointment

- **Route:** POST /api/appointments
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "serviceId": "service_id",
    "appointmentDate": "2024-03-20T10:00:00Z",
    "notes": "Optional notes"
  }
  ```

### Update Appointment Status

- **Route:** PATCH /api/appointments/:id/status
- **Access:** Admin/Owner
- **Request Body:**
  ```json
  {
    "status": "confirmed" // pending, confirmed, cancelled, completed
  }
  ```

## Review Routes

### Get Service Reviews

- **Route:** GET /api/reviews/service/:serviceId
- **Access:** Public
- **Response:**
  ```json
  [
    {
      "id": "review_id",
      "user": {
        "name": "John Doe"
      },
      "service": {
        "name": "Haircut"
      },
      "rating": 5,
      "comment": "Great service!",
      "createdAt": "2024-03-20T10:00:00Z"
    }
  ]
  ```

### Create Review

- **Route:** POST /api/reviews
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "serviceId": "service_id",
    "rating": 5,
    "comment": "Great service!"
  }
  ```

## Promotion Routes

### Get Active Promotions

- **Route:** GET /api/promotions
- **Access:** Public
- **Response:**
  ```json
  [
    {
      "id": "promotion_id",
      "title": "Summer Special",
      "description": "20% off on all spa services",
      "discountType": "percentage",
      "discountValue": 20,
      "code": "SUMMER20",
      "startDate": "2024-03-01T00:00:00Z",
      "endDate": "2024-03-31T23:59:59Z",
      "applicableServices": [
        {
          "id": "service_id",
          "name": "Spa Treatment",
          "price": 100.0
        }
      ]
    }
  ]
  ```

### Validate Promotion Code

- **Route:** POST /api/promotions/validate
- **Access:** Public
- **Request Body:**
  ```json
  {
    "code": "SUMMER20",
    "serviceId": "service_id"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Promotion code is valid",
    "promotion": {
      "id": "promotion_id",
      "discountType": "percentage",
      "discountValue": 20
    }
  }
  ```

## General Notes

1. All authenticated routes require Authorization header:

   ```
   Authorization: Bearer jwt_token
   ```

2. Error Responses:

   ```json
   {
     "error": "Error message"
   }
   ```

   or

   ```json
   {
     "errors": [
       {
         "msg": "Error message",
         "param": "field_name",
         "location": "body"
       }
     ]
   }
   ```

3. Image Upload:
   - Supported formats: jpeg, jpg, png
   - Maximum size: 5MB
   - Form-data key: "image"
