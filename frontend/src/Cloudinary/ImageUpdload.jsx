const uploadImageToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file); 
      formData.append("upload_preset", "olxclone"); 
      formData.append("cloud_name", "djnjivry2");

      const response = await fetch(`https://api.cloudinary.com/v1_1/djnjivry2/image/upload`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        throw new Error(`Failed to upload image: ${errorData.error?.message || "Unknown error"}`);
      }
  
      const data = await response.json();

      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  
  export default uploadImageToCloudinary;