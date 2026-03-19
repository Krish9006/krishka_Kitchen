const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
        const fullPath = path.join(currentPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('alert(')) {
                
                // Add import if not present
                if (!content.includes("from 'react-hot-toast'") && !content.includes('from "react-hot-toast"')) {
                    const importStatement = "import { toast } from 'react-hot-toast';\n";
                    // find first import and put it after
                    let replaced = false;
                    content = content.replace(/import .*;?\n/, (match) => {
                        replaced = true;
                        return match + importStatement;
                    });
                    if (!replaced) content = importStatement + content;
                }

                // Replace specific alert shapes
                // alert("Error...") -> toast.error("Error...")
                // alert("Success...") -> toast.success("Success...")
                content = content.replace(/alert\((.*?)\)/g, (match, p1) => {
                    const str = p1.toLowerCase();
                    const isError = str.includes('failed') || str.includes('error') || str.includes('expired') || p1.includes('error.response');
                    return isError ? `toast.error(${p1}, { style: { borderRadius: '10px', background: '#333', color: '#fff' } })` : `toast.success(${p1}, { style: { borderRadius: '10px', background: '#333', color: '#fff' } })`;
                });

                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

walkDir(dir);
