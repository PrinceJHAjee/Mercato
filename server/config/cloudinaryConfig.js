const cloudinary = require('cloudinary').v2;

// Configuration
cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.cloud_api_key, 
    api_secret: process.env.cloud_api_secret // Click 'View API Keys' above to copy your API secret
});



module.exports=cloudinary;