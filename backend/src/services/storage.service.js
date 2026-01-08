/**
 * STORAGE SERVICE (ImageKit)
 * ImageKit pe files upload karta hai
 * Cloud storage service - CDN ke saath fast delivery
 */

const ImageKit = require("imagekit");

// ImageKit configuration - credentials .env file se aate hain
const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_PUBLIC_KEY,    // ImageKit dashboard se milta hai
    privateKey: process.env.IMAGE_PRIVATE_KEY,  // Secret key - share mat karna!
    urlEndpoint: process.env.URLENDPOINT        // Your ImageKit URL (https://ik.imagekit.io/xxx)
});

/**
 * UPLOAD IMAGE FUNCTION
 * File ko ImageKit pe upload karta hai
 * 
 * @param {Buffer} file - File ka raw data (Multer se aata hai)
 * @param {string} filename - File ka naam (unique hona chahiye)
 * @returns {string} - Uploaded file ka URL (ImageKit CDN URL)
 */
async function uploadImage(file, filename) {
    try {
        // ImageKit upload API call
        const response = await imagekit.upload({
            file: file,           // File data
            fileName: filename,   // File name on ImageKit
        });

        // Return the CDN URL
        return response.url;
    } catch (error) {
        console.log("ImageKit Upload Error:", error);
        throw error; // Error ko controller tak bhejo
    }
}

module.exports = { uploadImage };