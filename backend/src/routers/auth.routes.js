const express = require("express");
const router = express.Router();
const {
    registerController,
    loginController,
    logoutController,
    registerfoodpartner,
    loginfoodpartner,
    getPartnerProfile
} = require("../controllers/auth.controller.real");

// User routes
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", logoutController);

// Food Partner routes
router.post("/partner/register", registerfoodpartner);
router.post("/partner/login", loginfoodpartner);
router.get("/partner/logout", logoutController);
router.get("/partner/profile", require("../middlewares/authfoodpartner"), getPartnerProfile);


module.exports = router;