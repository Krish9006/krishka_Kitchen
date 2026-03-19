const fs = require('fs');
const path = require('path');

// 1. Backend Controller: Send token
const authControllerPath = path.join(__dirname, 'backend/src/controllers/auth.controller.real.js');
let authContent = fs.readFileSync(authControllerPath, 'utf8');
authContent = authContent.replace('message: "Food Partner registered successfully",\n            partner:', 'message: "Food Partner registered successfully",\n            token: token,\n            partner:');
authContent = authContent.replace('message: "Login successful",\n            partner:', 'message: "Login successful",\n            token: token,\n            partner:');
fs.writeFileSync(authControllerPath, authContent, 'utf8');

// 2. PartnerLogin.jsx
const loginPath = path.join(__dirname, 'fronted/src/Pages/PartnerLogin.jsx');
let loginContent = fs.readFileSync(loginPath, 'utf8');
if (!loginContent.includes("localStorage.setItem('token', response.data.token);")) {
    loginContent = loginContent.replace("localStorage.setItem('partner', JSON.stringify(response.data.partner));", "localStorage.setItem('partner', JSON.stringify(response.data.partner));\n                localStorage.setItem('token', response.data.token);");
    fs.writeFileSync(loginPath, loginContent, 'utf8');
}

// 3. PartnerRegister.jsx
const regPath = path.join(__dirname, 'fronted/src/Pages/PartnerRegister.jsx');
let regContent = fs.readFileSync(regPath, 'utf8');
if (!regContent.includes("localStorage.setItem('token', response.data.token);")) {
    regContent = regContent.replace("localStorage.setItem('partner', JSON.stringify(response.data.partner));", "localStorage.setItem('partner', JSON.stringify(response.data.partner));\n                localStorage.setItem('token', response.data.token);");
    fs.writeFileSync(regPath, regContent, 'utf8');
}

// Helper to inject token headers
function injectTokens(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Inject token logic inside component or just regex replace axios calls
    const axiosRegex = /axios\.(get|post|put|delete)\(([^,]+),?\s*(\{.*?\})?\s*,?\s*(\{.*?\})?\)/g;
    
    // Quick and dirty manual replacement for these specific files
    if (filePath.includes('PartnerProfile.jsx')) {
        content = content.replace(/\{ withCredentials: true \}/g, "{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }");
    }
    else if (filePath.includes('PartnerOrders.jsx')) {
        content = content.replace(/\{ withCredentials: true \}/g, "{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }");
    }
    else if (filePath.includes('AddFood.jsx')) {
        content = content.replace(/\{ withCredentials: true \}/g, "{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }");
        // Sometimes config is third arg, e.g. axios.post(url, data, { withCredentials: true })
        content = content.replace(/\{ headers: \{ 'Content-Type': 'multipart\/form-data' \}, withCredentials: true \}/g, "{ headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }");
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

injectTokens(path.join(__dirname, 'fronted/src/Pages/PartnerProfile.jsx'));
injectTokens(path.join(__dirname, 'fronted/src/Pages/PartnerOrders.jsx'));
injectTokens(path.join(__dirname, 'fronted/src/Pages/AddFood.jsx'));

console.log("Dashboard issues patched!");
