const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routers/auth.routes");
const foodRoutes = require("./routers/food.routes");
const orderRoutes = require("./routers/order.routes");
const userRoutes = require("./routers/user.routes");
const socialRoutes = require("./routers/social.routes");

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true
}));

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/social", socialRoutes);

app.get("/", (req, res) => {
    res.send("Zomato Clone Backend - Server Running!");
});

module.exports = app;