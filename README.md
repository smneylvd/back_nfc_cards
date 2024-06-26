### Instruction to run
1. Install PgAdmin with Postgresql from https://www.pgadmin.org/download/. Go through installation. In the end it will ask you to set password. **REMEMBER IT**. Or just simply write down on `.env` as follows `DB_PASSWORD="password"`
2. Install Node.js in project used version `v18.17.0` from https://nodejs.org/en/download. You can use any version of ^18 or above
3. Install all needed dependencies. Open terminal in root folder of project. Then use `npm install`
4. Run application with `node backend.js` Application logs default message that it successfully started with current datetime on `http://localhost:8080/api`

- All uploaded files are available on `http://localhost:8080/uploads/some_file.jpeg`. Note that after setting and updating avatar image **previous one automatically deletes** - to avoid data redundancy.
- File upload limit is set in .env file `FILE_UPLOAD_LIMIT`


_Ps: For developing purposes you can use command_ `nodemon backend.js` _- This will run application in automatially reboot mode. Means: everytime you save project source file it will automatially reboot._

### About database
Project uses **PostgreSQL**.

**Make sure you properly set up the configuration in .env file. If you followed instructions:** You have only changed the database password. Configure Database name, user, password if necessary.

If you did everything right project should run without any errors

Note: All needed scripts with migrations in `./src/tables/` 

There stored migrations that run automatically everytime you run project. It only creates tables if they don't exist.

If you need to add more tables or change structure. You either change migration files and delete tables manually - **you will lose all your data**.

Or better and safe way is to create another file with migration. Import and call them in main file 
### `backend.js`

### API documentation

#### Get User Data by hash

- **Method:** GET
- **Endpoint:** /hash/some_unique_hash
- **Description:** Retrieves the user's information by hash .
- **Authentication Required:** No
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
