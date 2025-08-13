# 🔧 CORS Fix Guide for Node.js Backend

## The Problem
Your Angular app (http://localhost:4201) is trying to connect to your Node.js API (http://localhost:3000), but the browser blocks this due to CORS policy.

## ✅ Solution: Fix CORS on Your Backend

You need to add CORS headers to your Node.js backend. Here are the two main approaches:

### Option 1: Using the `cors` package (Recommended)

1. **Install the cors package** in your backend:
   ```bash
   npm install cors
   ```

2. **Add this to your main server file** (usually `app.js`, `server.js`, or `index.js`):
   ```javascript
   const cors = require('cors');

   // Enable CORS for your Angular app
   app.use(cors({
     origin: ['http://localhost:4201', 'http://localhost:4200', 'http://localhost:3000'],
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

### Option 2: Manual CORS Headers

Add this middleware **before your routes** in your backend:

```javascript
app.use((req, res, next) => {
  // Allow requests from your Angular app
  res.header('Access-Control-Allow-Origin', 'http://localhost:4201');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

## 🚀 After Adding CORS

1. **Restart your Node.js backend** server
2. **Test the login** in your Angular app at http://localhost:4201
3. The CORS error should be resolved!

## 🧪 Testing

Your Angular app is configured to connect directly to:
- **Backend URL**: `http://localhost:3000`
- **Login endpoint**: `http://localhost:3000/api/auth/login`
- **Authentication**: Bearer token in Authorization header

## ⚠️ Important Notes

- **CORS is a browser security feature** - it only affects browser requests
- **The backend must allow the frontend origin** - that's why we specify `http://localhost:4201`
- **For production**, replace `localhost:4201` with your actual domain
- **Credentials: true** allows cookies and authorization headers

## 🔍 Verify It's Working

After fixing CORS, you should see:
1. ✅ No CORS errors in browser console
2. ✅ Successful login with demo credentials
3. ✅ Token stored in localStorage
4. ✅ Redirect to dashboard
5. ✅ API testing buttons work

The Angular authentication system is ready - it just needs your backend to allow the cross-origin requests!
