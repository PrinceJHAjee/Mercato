import { Button, message, Upload } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/lodersSlice";
import { EditProduct, UploadProductImage } from "../../../apicalls/products";
import { Error } from "mongoose";

const Images = ({ selectedProduct, setShowProductForm, getData }) => {
  const [showPreview = false, setShowPreview] = React.useState(true);
  const [file=null, setFile] = React.useState(null);
  const [images = [], setImages] = React.useState(selectedProduct.images);

  const dispatch = useDispatch();

  const upload = async () => {
    try {
      dispatch(SetLoader(true));
      //upload image to coloudinary
      const formData = new FormData();
      formData.append("productId", selectedProduct._id);
      formData.append("file", file);
      const response = await UploadProductImage(formData);
      dispatch(SetLoader(false));
      if (response && response.success) {
        message.success(response.message);
        setImages([...images, response.data]);
        setShowProductForm(false);
        setFile(null);
        getData();
      } else {
        message.error(response ? response.message : "Image upload failed.");
      }
    } catch (error) {
      dispatch(SetLoader(false));

      message.error(error.message);
    }
  };

  const deleteImage = async (image) => {
    try {
      const updatedImagesArray=images.filter((img) => img !==image);
      const updatedProduct={...selectedProduct, images:updatedImagesArray};
      
      const response = await EditProduct(selectedProduct._id, updatedProduct);
      
      if(response.success){
        message.success(response.message);
        setImages(updatedImagesArray);
        setFile(null)
        getData();
      }else{
        throw new Error(response.message);
      }
      dispatch(SetLoader(true));

      
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  }
  return (
    <div>
      <div className="flex flex-wrap gap-5 mb-5">
        {images.map((image) => {
          return (
            <div className="flex gap-2 border border-solid border-gray-500 rounded p-5 items-end w-full md:w-auto">
              <img className="h-20 w-20 object-cover" src={image} alt={image} />
              <i className="ri-delete-bin-line" onClick={() => deleteImage(image)}></i>
            </div>
          );
        })}
      </div>
      <Upload
        listType="picture"
        beforeUpload={() => false}
        onChange={(info) => {
          setFile(info.file);
          setShowPreview(true);
        }}
        
        showUploadList={showPreview}
      >
        <Button className="w-full md:w-auto" type="dashed">Upload Images</Button>
      </Upload>

      <div className="flex justify-end gap-5 mt-5">
        <Button
          type="default"
          onClick={() => {
            setShowProductForm(false);
          }}
        >
          Cancel
        </Button>

        <Button type="primary" onClick={upload} disabled={!file}>
          Upload
        </Button>
      </div>
    </div>
  );
};

export default Images;
