import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: 'dhbwlpe6i',
    api_key: '837782626763286', 
    api_secret: '-Nkm3c9Vb6Hzy-L7q-ksX3rosPM'
});

const uploadOnCloudinary = async (localFilePath) => {
    console.log("Inside the upload function", localFilePath);

    try {
        if (!localFilePath) return null;

        console.log("Local file path provided");

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("Upload response:", response);

        // File has been uploaded successfully
        console.log("File is uploaded on Cloudinary:", response.url);
        return response;
    } catch (error) {
        console.error("Upload failed:", error.message); // Log the error message
        try {
            // Remove the local file if it exists
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (fileError) {
            console.error("Failed to delete local file:", fileError.message);
        }
        return null;
    }
};

export { uploadOnCloudinary };
