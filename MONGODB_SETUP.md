# MongoDB Setup Guide

To store user details in MongoDB, you have two options:

## Option 1: Local MongoDB Installation

1. Download and install MongoDB Community Edition from: https://www.mongodb.com/try/download/community

2. Start the MongoDB service:

   - On Windows: Run MongoDB as a service or use `mongod` command
   - On Mac: `brew services start mongodb-community`
   - On Linux: `sudo systemctl start mongod`

3. Update your .env file to use:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/bmi_app
   ```

## Option 2: MongoDB Atlas (Cloud MongoDB)

1. Create a free MongoDB Atlas account at: https://www.mongodb.com/cloud/atlas/register

2. Create a new cluster (the free tier is sufficient)

3. Set up database access:

   - Create a database user with password
   - Add your IP address to the IP Access List (or use 0.0.0.0/0 for development)

4. Get your connection string:

   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

5. Update your .env file with the connection string:

   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/bmi_app?retryWrites=true&w=majority
   ```

   - Replace `<username>`, `<password>`, and `<cluster>` with your actual values

6. Restart your server

## Working with the In-Memory Fallback

If you want to continue using the in-memory storage (not recommended for production):

1. The app is currently set up to use in-memory storage when MongoDB connection fails
2. User data will be lost when the server restarts
3. You can still test the application functionality
