const fs = require('fs');
const path = require('path');

function replaceCode(filePath, findRx, replaceStr) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    if (findRx.test(content)) {
        content = content.replace(findRx, replaceStr);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Replaced in ${filePath}`);
    } else {
        console.log(`Not found in ${filePath}`);
    }
}

// 1. PartnerLogin
replaceCode(
    path.join(__dirname, 'fronted/src/Pages/PartnerLogin.jsx'),
    /localStorage\.setItem\('partner', JSON\.stringify\(response\.data\.partner\)\);/g,
    "localStorage.setItem('partner', JSON.stringify(response.data.partner));\n                localStorage.setItem('token', response.data.token);"
);

// 2. PartnerRegister
replaceCode(
    path.join(__dirname, 'fronted/src/Pages/PartnerRegister.jsx'),
    /localStorage\.setItem\('partner', JSON\.stringify\(response\.data\.partner\)\);/g,
    "localStorage.setItem('partner', JSON.stringify(response.data.partner));\n                localStorage.setItem('token', response.data.token);"
);

// 3. PartnerProfile
replaceCode(
    path.join(__dirname, 'fronted/src/Pages/PartnerProfile.jsx'),
    /\{ withCredentials: true \}/g,
    "{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }"
);

// 4. PartnerOrders
replaceCode(
    path.join(__dirname, 'fronted/src/Pages/PartnerOrders.jsx'),
    /\{ withCredentials: true \}/g,
    "{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }"
);

// 5. AddFood
replaceCode(
    path.join(__dirname, 'fronted/src/Pages/AddFood.jsx'),
    /\{\s*headers:\s*\{\s*'Content-Type':\s*'multipart\/form-data',\s*\},\s*withCredentials:\s*true\s*\}/g,
    "{ headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }"
);
