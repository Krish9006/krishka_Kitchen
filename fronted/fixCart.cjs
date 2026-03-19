const fs = require('fs');
const path = require('path');
const fileP = path.join(__dirname, 'src', 'components', 'CartSheet.jsx');
let content = fs.readFileSync(fileP, 'utf8');

const regex = /const response = await axios\.post\('https:\/\/krishka-kitchen-2\.onrender\.com\/api\/order', orderData, \{\s*withCredentials: true\s*\}\);/g;

const replacement = `const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please login to place an order", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
                return;
            }

            const response = await axios.post('https://krishka-kitchen-2.onrender.com/api/order', orderData, {
                headers: { Authorization: \`Bearer \$\{token\}\` },
                withCredentials: true
            });`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(fileP, content, 'utf8');
    console.log("Fixed!");
} else {
    console.log("Not found regex");
}
