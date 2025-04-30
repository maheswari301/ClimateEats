# Troubleshooting Guide

## Issue 1: MongoDB Connection Error

Error: `MongooseServerSelectionError: connect ECONNREFUSED ::1:27017`

### Fix:

1. Make sure MongoDB is installed and running on your machine.

2. Update the `MONGO_URI` in the `server/.env` file:

   Change from:

   ```
   MONGO_URI=mongodb://localhost:27017/bmi_app
   ```

   To:

   ```
   MONGO_URI=mongodb://127.0.0.1:27017/bmi_app
   ```

   This uses the IP address instead of the hostname to avoid IPv6 issues.

3. Restart the server after making these changes.

## Issue 2: API Connection Error

Error: `POST http://localhost:5173/api/users 500 (Internal Server Error)`

### Fix:

1. Make sure the backend server is running properly (after fixing the MongoDB connection issue).

2. Update API calls in the frontend code:

   For `Login.jsx`, make sure the axios call specifies the correct API endpoint:

   ```javascript
   // Make API call to register user
   const response = await axios.post("/api/users", userData);
   ```

3. Check the network tab in your browser's developer tools to see the exact error response.

## Additional Troubleshooting Steps:

1. **Install MongoDB**: If you haven't installed MongoDB yet, you can download it from [MongoDB Download Center](https://www.mongodb.com/try/download/community).

2. **Start MongoDB**:

   - On Windows: Start the MongoDB service from Services or run `mongod` in a command prompt
   - On Mac/Linux: Run `mongod` in a terminal

3. **Check MongoDB Connection**: Run `mongo` or `mongosh` in a terminal to verify you can connect to the database.

4. **CORS Issues**: If you encounter CORS errors, verify that the server has the proper CORS configuration:

   ```javascript
   app.use(cors());
   ```

5. **Proxy Configuration**: Verify the `vite.config.js` has the proper proxy configuration:

   ```javascript
   server: {
     proxy: {
       "/api": {
         target: "http://localhost:5000",
         changeOrigin: true,
         secure: false
       }
     }
   }
   ```

6. **Environment Variables**: Make sure all required environment variables are correctly set in both `.env` files.

7. **Restart Both Servers**: After making changes, restart both the frontend and backend servers to apply the changes.
