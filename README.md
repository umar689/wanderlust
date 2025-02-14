Wanderlust Web Project - Installation Guide

Welcome to the Wanderlust web project! Follow the steps below to set up and run the project locally on your machine.

Prerequisites

Before starting, ensure you have the following installed on your system:

Node.js (Recommended: Version 18)

MongoDB (Local or Atlas)

Nodemon (Installed globally: npm install -g nodemon)

Installation Steps

1. Clone the Repository

Run the following command to clone the Wanderlust repository from GitHub:

git clone https://github.com/Samarth0802/Wanderlust.git
cd Wanderlust-Major-Project

2. Configure the Database

Create a .env file in the root directory.

Add the following database connection string:

ATLASDB_URL=mongodb://127.0.0.1:27017/wanderlust

3. Set Up Cloudinary

Sign up for a free Cloudinary account.

Retrieve your CLOUD_NAME, CLOUD_API_KEY, and CLOUD_API_SECRET from your Cloudinary dashboard.

Add these details to your .env file:

CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

4. Configure Application Secret

Add a secure secret key to your .env file:

SECRET=your_secure_secret_key

5. Install Dependencies

Run the following command to install required packages:

npm install

6. Start the Application

Use Nodemon to start the project:

nodemon app.js

7. Access the Application

Once the server is running, open your browser and visit:

http://localhost:8080

Troubleshooting

Ensure MongoDB is running locally (mongod service) or that the provided Atlas URL is correct.

Double-check your .env file values, especially the database and Cloudinary configurations.

If nodemon is not recognized, try running the app with node app.js.

Congratulations! 🎉 You have successfully set up the Wanderlust web project. If you encounter any issues, feel free to ask for help. Happy exploring! 🌍✨

