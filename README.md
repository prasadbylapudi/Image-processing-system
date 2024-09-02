# Image Processing System

# View the live hosted application here [Image Processing system](https://image-processing-system.onrender.com/)


## Overview

The Image Processing System is a web application that allows users to upload a CSV file containing image URLs, process the images, and then retrieve the processed images. The system provides a unique request ID for tracking the processing status and supports webhooks for real-time updates.

## Features

- **CSV Upload**: Upload a CSV file containing image URLs.
- **Processing Status**: Query the processing status using a unique request ID.
- **Webhook Integration**: Receive real-time updates when image processing is complete.
- **CSV Data Download**: View processed data in a table and download it as a CSV file.

## Tech Stack

### Backend

- **Node.js**: JavaScript runtime for the server.
- **TypeScript**:A typed superset of JavaScript that compiles to plain JavaScript, providing improved maintainability and scalability.
- **Express**: Web framework for building the API.
- **Mongoose**: MongoDB object modeling tool for Node.js.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Multer**: Middleware for handling multipart/form-data, used for file uploads.
- **uuid**: Library for generating unique identifiers.
- **Zod** : Library for backend schema validation and primarily used for data validation in TypeScript applications.

### Frontend

- **HTML/CSS**: Markup and styling for the web pages.
- **EJS**: Embedded JavaScript templating for rendering dynamic content.

  ![csv data file](https://github.com/prasadbylapudi/Image-processing-system/assets/31813770/4d07f4e0-7e71-44f3-a1e4-47554e290858)
![home page ](https://github.com/prasadbylapudi/Image-processing-system/assets/31813770/0ca84cee-6203-4fb9-aa0a-789d90e7bbc1)


## API Endpoints

### 1. Upload API

Here is the sample CSV file to upload

https://drive.google.com/file/d/1BwQ2j-qu1iIK9YDUODhVV6fDG8amTehg/view?usp=sharing

- **URL**: `/api/upload`
- **Method**: `POST`
- **Description**: Accepts the CSV file and returns a unique request ID.
- **Request Parameters**:
  - `file`: CSV file containing image URLs.
  - `webhookUrl` (optional): URL to receive real-time updates.
- **Response**:
  ```json
  {
    "requestId": "unique-request-id"
  }
  ```

2. **Status API**

   - **URL**: `/api/status/:requestId`
   - **Method**: `GET`
   - **Description**: Allows users to query the processing status with the request ID.
   - **Response**:
     ```json
     {
       "requestId": "unique-request-id",
       "status": "Processing/Completed",
       "webhookUrl": "webhook-url-if-provided"
     }
     ```

3. **Webhook Endpoint**

   - **URL**: `/api/webhook`
   - **Method**: `POST`
   - **Description**: Receives real-time updates when image processing is complete.
   - **Request Body**:
     ```json
     {
       "requestId": "unique-request-id",
       "status": "Completed",
       "message": "Image processing is complete"
     }
     ```
   - **Response**:
     ```text
     Webhook received successfully
     ```

4. **Product Data Endpoint**
Here is the end point for seeing all the csv data after image processing.
https://image-processing-system.onrender.com/api/csvData

   - **URL**: `/api/products`
   - **Method**: `GET`
   - **Description**: Retrieves all processed product data.
   - **Response**:
     ```json
     [
       {
         "SerialNumber": 1,
         "ProductName": "Product 1",
         "InputImageUrls": ["url1", "url2"],
         "OutputImageUrls": ["url3", "url4"]
       },
       ...
     ]
     ```

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **MongoDB**: Set up a MongoDB database.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/prasadbylapudi/Image-processing-system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd image-processing-system
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file and add your MongoDB connection string and Cloudinary details:

```env
MONGO_URI=your-mongodb-connection-string
CLOUD_NAME=<name>
API_KEY=<key>
API_SECRET=<secret>

```

5. Start the server:

   ```bash
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Upload a CSV**: Use the form on the homepage to upload a CSV file.
2. **Check Status**: Use the provided request ID to check the processing status.
3. **Receive Webhook Notifications**: If a webhook URL is provided, you'll receive real-time updates.
4. **View and Download Data**: Navigate to the CSV Data page to view processed data and download it as a CSV file.
