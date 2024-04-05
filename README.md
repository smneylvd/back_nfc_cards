### User Profile

#### Get User Profile

- **Method:** GET
- **Endpoint:** /users/profile
- **Description:** Retrieves the profile information of the authenticated user.
- **Authentication Required:** Yes
- **Response:**
    - Body ex: 
    ```json
    {
      "message": "Success",
      "status_code": 200,
      "content": {
        "first_name": "1",
        "last_name": "2",
        "middle_name": "3",
        "email": "123@gmail.com",
        "phone": "87001573337",
        "description": "asdasda",
        "hash": null,
        "avatar": null,
        "address": null,
        "job_address": null,
        "position": null,
        "website_link": null,
        "instagram_link": null,
        "telegram_link": "@nurikwy",
        "youtube_link": null,
        "facebook_link": "https://www.facebook.com"
      }
    }
    ```
    - 200 OK on success with the user profile data.
    - 404 Not Found if user profile is not found.
    - 500 Internal Server Error if an error occurs during the process.

#### Update User Profile

- **Method:** POST
- **Endpoint:** /users/profile
- **Description:** Updates the profile information of the authenticated user.
- **Authentication Required:** Yes
- **Request Body:**
    - attributes: Object containing user attributes to be updated.
    - Ex body: 
    ```json
    {
      "attributes": {
        "first_name": "1",
        "last_name": "2",
        "middle_name": "3",
        "email": "123@gmail.com",
        "phone": "87001573337",
        "description": "asdasda",
        "hash": null,
        "avatar": null,
        "address": null,
        "job_address": null,
        "position": null,
        "website_link": null,
        "instagram_link": null,
        "telegram_link": "@nurikwy",
        "youtube_link": null,
        "facebook_link": "https://www.facebook.com"
      }
    }
    ```
- **Response:**
    - Body: 
    ```json
    {
      "message": "Success",
      "status_code": 200,
      "content": {
        "first_name": "1",
        "last_name": "2",
        "middle_name": "3",
        "email": "123@gmail.com",
        "phone": "87001573337",
        "description": "asdasda",
        "hash": null,
        "avatar": null,
        "address": null,
        "job_address": null,
        "position": null,
        "website_link": null,
        "instagram_link": null,
        "telegram_link": "@nurikwy",
        "youtube_link": null,
        "facebook_link": "https://www.facebook.com"
      }
    }
    ```
    - 200 OK on success with the updated user profile data.
    - 400 Bad Request if request body is empty or missing attributes.
    - 404 Not Found if user is not found.
    - 500 Internal Server Error if an error occurs during the process.

### Admin Operations

#### Create New User

- **Method:** POST
- **Endpoint:** /admin/users/store
- **Description:** Creates a new user account.
- **Authentication Required:** Yes
- **Request Body:**
    - login: User login (phone number).
    - password: User password (minimum 6 characters).
    - Body ex: 
    ```json
      {
        "login": "777777732131",
        "password": "@dm1nP455w0rd"
      }
    ```
- **Response:**
    - body: 
    ```json
    {
      "message": "Success",
      "status_code": 200,
      "content": null
    }
    ```
    - 200 OK on success.
    - 400 Bad Request if login is empty or password is less than 6 characters.
    - 500 Internal Server Error if an error occurs during the process.

#### Get All Users (Admin only)

- **Method:** GET
- **Endpoint:** /admin/users
- **Description:** Retrieves information of all users.
- **Authentication Required:** Yes
- **Response:**
    - Body:
  ```json
  {
  "message": "Success",
  "status_code": 200,
  "content": [
    {
      "id": 1,
      "first_name": "1",
      "phone": "87001573337",
      "last_name": "2",
      "middle_name": "3",
      "email": "123@gmail.com",
      "role_id": 1,
      "description": "asdasda",
      "role": "admin"
    },
    {
      "id": 4,
      "first_name": null,
      "phone": "87001573336",
      "last_name": null,
      "middle_name": null,
      "email": null,
      "role_id": 2,
      "description": null,
      "role": "customer"
    }
  ]
  }

  ```
    - 200 OK on success with the list of users.
    - 403 Forbidden if user is not an admin.
    - 500 Internal Server Error if an error occurs during the process.

### Miscellaneous

#### Get Greeting Message

- **Endpoint:** /
- **Method:** GET
- **Description:** Get a greeting message.
- **Response:**
    - Status Code: 200
    - Body: "Hi page"

#### File Upload

- **Endpoint:** /upload
- **Method:** POST
- **Description:** Upload a file.
- **Request Body:** Form Data: file (File to be uploaded)
- **Response:**
    - Status Code: 200
    - Body: 
    ```json
    {
      "message": "Success",
      "status_code": 200,
      "content": "uploads/6tq-247411.txt"
    }
    ```
- **Error Responses:**
    - Status Code 400: Bad Request - Invalid request parameters or body.
    - Status Code 404: Not Found - Requested resource not found.
    - Status Code 500: Internal Server Error - Server encountered an unexpected condition.

### Authentication

#### Login

- **Endpoint:** /auth/login
- **Method:** POST
- **Description:** Log in a user.
- **Request Body:**
    - login (string, required): The user's phone number.
    - password (string, required): The user's password.
    - body ex: 
    ```json
      {
        "login": "7777777",
        "password": "password"
      }
    ```
- **Response:**
    - Status Code: 200
    - Body:
      ```json
      {
       "id": "user_id",
       "login": "user_phone_number",
       "token": "jwt_token"
      }
      ```
    - Status Code: 403
        - Body: "Invalid email or password."
    - Status Code: 404
        - Body: "User not found."
    - Status Code: 400
        - Body: Error message detailing validation errors.
    - Status Code: 500
        - Body: Error message indicating server failure.
