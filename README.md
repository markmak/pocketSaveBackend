# Pocket Save - MERN Stack Full Stack Website (Backend Server)

<br>

## Description

This is the backend server part of my full-stack website project developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js). The project aims to create an income and expense recording web app, encouraging users to save money to achieve their financial goals.

<br>

## Features

- Record and manage income and expenses
- Set savings targets and track progress
- Data visualization through charts and graphs

<br>

## Technologies Used

- MongoDB: Database for storing data
- Express.js: Web application framework for Node.js to handle server-side operations
- Node.js: JavaScript runtime environment for server-side development
- jsonwebtoken: User authentication
- multer: Image upload handle

<br>

## API Endpoints

<br>

### Auth

#### register user

- URL: http://localhost:3001/api/v1/auth/register
- Method: POST
- Description: register new user
- Request Body: JSON

```
{
  "name": "name_example",
  "email": "email_example",
  "password": "password_example"
}
```

#### user login

- URL: http://localhost:3001/api/v1/auth/login
- Method: POST
- Description: logs in existing user
- Request Body: JSON

```
{
  "email": "email_example",
  "password": "password_example"
}
```

#### user logout

- URL: http://localhost:3001/api/v1/auth/logout
- Method: GET
- Description: logs out currently logged-in user

#### get user

- URL: http://localhost:3001/api/v1/auth/getUser
- Method: GET
- Description: retrieves the user details when the user refreshes the page

<br>

### Dashboard page

#### get dashboard data

- URL: http://localhost:3001/api/v1/dashboard
- Method: GET
- Description: get record data for the dashboard chart

<br>

### Target and Single Target page

#### add target

- URL: http://localhost:3001/api/v1/target/
- Method: POST
- Description: add a new target
- Request Body: Form Data

  - Key: 'photo' (Type: image, Format: PNG or JPEG)
  - Key: 'json' (JSON)

```
{
  "name": "name_example",
  "amount": "amount_example",
  "targetSavingPeriod": "target_saving_period_example",
  "comment": "comment_example"
}
```

#### add saving record

- URL: http://localhost:3001/api/v1/target/:id/savingRecord
- Method: POST
- Description: add a saving record to a existing target saving record sub-document
- Request Body: JSON

```
{
  "date": "date_example",
  "amount": "amount_example"
}
```

#### get current target

- URL: http://localhost:3001/api/v1/target/currentTarget
- Method: GET
- Description: get on going target data

#### get targets

- URL: http://localhost:3001/api/v1/target/
- Method: GET
- Description: get all completed target

#### get single target

- URL: http://localhost:3001/api/v1/target/:id
- Method: GET
- Description: get full details of one target

#### edit target

- URL: http://localhost:3001/api/v1/target/:id
- Method: PATCH
- Description: update an existing target, cannot update status of the target
- Request Body: Form Data

  - Key: 'photo' (Type: image, Format: PNG or JPEG)
  - Key: 'json' (JSON)

```
{
  "name": "name_example",
  "amount": "amount_example",
  "createdAt": "created_at_example",
  "completedDate": "completed_date_example",
  "targetSavingPeriod": "target_saving_period_example",
  "comment": "comment_example",
}
```

#### edit target status

- URL: http://localhost:3001/api/v1/target/:id/status
- Method: PATCH
- Description: update status of an existing target
- Request Body: JSON

```
{
  "status": "status_example"
}
```

#### edit saving record

- URL: http://localhost:3001/api/v1/target/:id/savingRecord/:savingId
- Method: PATCH
- Description: update a saving record in a existing target
- Request Body: JSON

```
{
  "date": "date_example",
  "amount": "amount_example"
}
```

#### remove target

- URL: http://localhost:3001/api/v1/target/:id
- Method: DELETE
- Description: remove a target

#### remove saving record

- URL: http://localhost:3001/api/v1/target/:id/savingRecord/:savingId
- Method: DELETE
- Description: remove a saving record in a existing target

<br>

### Record page

#### add template

- URL: http://localhost:3001/api/v1/record/template
- Method: POST
- Description: add a record template
- Request Body: JSON

```
{
  "templateName": "template_name_example",
  "recordType": "record_type_example",
  "date": "date_example",
  "name": "name_example",
  "type": "type_example",
  "amount": "amount_example"
  "comment": "comment_example"
}
```

#### get templates

- URL: http://localhost:3001/api/v1/record/template
- Method: Get
- Description: get all the record templates for a given user

#### update template

- URL: http://localhost:3001/api/v1/record/template/:id
- Method: PUT
- Description: replace an existing template with a new one
- Request Body: JSON

```
{
  "templateName": "template_name_example",
  "recordType": "record_type_example",
  "date": "date_example",
  "name": "name_example",
  "type": "type_example",
  "amount": "amount_example"
  "comment": "comment_example"
}
```

#### remove template

- URL: http://localhost:3001/api/v1/record/template/:id
- Method: DELETE
- Description: remove an existing template

#### add record

- URL: http://localhost:3001/api/v1/record/
- Method: POST
- Description: add a record
- Request Body: JSON

```
{
  "recordType": "record_type_example",
  "date": "date_example",
  "name": "name_example",
  "type": "type_example",
  "amount": "amount_example"
  "comment": "comment_example"
}
```

#### update record

- URL: http://localhost:3001/api/v1/record/:id
- Method: PUT
- Description: replace an existing record with a new one
- Request Body: JSON

```
{
  "recordType": "record_type_example",
  "date": "date_example",
  "name": "name_example",
  "type": "type_example",
  "amount": "amount_example"
  "comment": "comment_example"
}
```

#### get records

- URL: http://localhost:3001/api/v1/record/?query_string
- Method: GET
- Description: get total number of records, total number of filtered records and filtered records.
- Query String options: page, startDate, endDate, recordType, type, name

#### remove record

- URL: http://localhost:3001/api/v1/record/:id
- Method: DELETE
- Description: remove an existing record

<br>

### Setting page

#### change user icon

- URL: http://localhost:3001/api/v1/setting/icon
- Method: POST
- Description: handle user icon image upload, and save the path to the database
- Request Body: Form Data
  - Key: 'photo' (Type: image, Format: PNG or JPEG)

#### change user info

- URL: http://localhost:3001/api/v1/setting/userInfo
- Method: PATCH
- Description: change user email and / or name
- Request Body: JSON

```
{
  "name": "name_example",
  "email": "email_example"
}
```

#### change user password

- URL: http://localhost:3001/api/v1/setting/password
- Method: PATCH
- Description: change user password
- Request Body: JSON

```
{
  "oldPassword":"old_password_example",
  "password": "password_example"
}
```

<br>

## Error Handle

### 401 UNAUTHORIZED

All APIs endpoints use HTTP-only cookie for authentication.
For invalid credentials, a 401 status code is returned with a JSON error message.

```
{
  errMsg: "Invalid Credentials"
}
```

### 400 BAD REQUEST

In case of missing or invalid data in the request, a 400 status code is returned with a JSON error message providing the details of the missing information or invalid data.

```
{
  errMsg: "example_Email is already registered."
}
```

### 500 INTERNAL SERVER ERROR

For any unexpected server errors, a 500 status code is sent with a JSON error message.

```
{
  errMsg: "Internal server error, please try again later.
}
```

<br>

## Contact

If you have any questions or suggestions, feel free to email me at [markmak212@gmail.com](mailto:markmak212@gmail.com)
