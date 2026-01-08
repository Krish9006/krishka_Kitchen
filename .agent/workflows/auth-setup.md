---
description: Complete Node.js + Express + MongoDB Authentication Setup Guide
---

# 🔐 Auth Setup Guide (Reusable Template)

Har project mein ye same steps follow karo!

---

## Step 1: Install Dependencies

```bash
npm install express mongoose bcryptjs jsonwebtoken cookie-parser dotenv
```

---

## Step 2: Create Folder Structure

```
backend/
├── .env
├── .gitignore
├── server.js
├── package.json
└── src/
    ├── app.js
    ├── db/
    │   └── db.js
    ├── models/
    │   └── user.model.js
    ├── controllers/
    │   └── auth.controller.js
    └── routers/
        └── auth.routes.js
```

---

## Step 3: Create .env File

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-random-secret-key-here
```

---

## Step 4: Create .gitignore

```
node_modules/
.env
*.log
```

---

## Step 5: server.js

```javascript
require("dotenv").config();
const app = require("./src/app");
const port = process.env.PORT || 3000;
const connectDB = require("./src/db/db");
connectDB();
app.listen(port, () => console.log(`Server running on port ${port}`));
```

---

## Step 6: src/db/db.js

```javascript
const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

module.exports = connectDB;
```

---

## Step 7: src/models/user.model.js

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
```

---

## Step 8: src/controllers/auth.controller.js

```javascript
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
async function registerController(req, res) {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        
        res.cookie("token", token, { httpOnly: true });
        res.status(201).json({
            message: "User registered successfully",
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// LOGIN
async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({
            message: "Login successful",
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { registerController, loginController };
```

---

## Step 9: src/routers/auth.routes.js

```javascript
const express = require("express");
const router = express.Router();
const { registerController, loginController } = require("../controllers/auth.controller");

router.post("/register", registerController);
router.post("/login", loginController);

module.exports = router;
```

---

## Step 10: src/app.js

```javascript
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./routers/auth.routes");

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Server is running!");
});

module.exports = app;
```

---

## 🎯 API Endpoints

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | `{ name, email, password }` | Register new user |
| POST | `/api/auth/login` | `{ email, password }` | Login user |

---

## 🚀 Run Server

```bash
node server.js
```

---

## ✅ Common Mistakes to Avoid

1. ❌ Double `res.json()` in same function = crash
2. ❌ Forgetting `module.exports` = undefined error
3. ❌ Not importing controllers in routes
4. ❌ Hardcoding secrets instead of using `.env`
5. ❌ Creating separate route files for each endpoint (keep related routes together)

---

**Copy this template for every new project!** 🔥
