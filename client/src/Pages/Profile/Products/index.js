import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import ProductsForm from "./ProductsForm";

import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../redux/lodersSlice";
import { DeleteProduct, GetProducts } from "../../../apicalls/products";
import Bids from "./Bids";

function Products() {
  const [showBids, setShowBids] = React.useState(false);

  const [selectedProduct, setselectedProduct] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [showProductForm, setshowProductForm] = React.useState(false);
  // Define the isDarkMode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Set the initial theme based on localStorage or other logic
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts({ seller: user._id });
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  //delete the product
  const deleteProduct = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteProduct(id);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "image",
      render: (text, record) => {
        return (
          <img
            src={record?.images?.length > 0 ? record.images[0] : ""}
            alt=""
            className="w-20 h-20 object-cover rounded-md"
          />
        );
      },
    },

    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Age",
      dataIndex: "age",
    },

    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      render: (text, record) => {
        return new Date(text).toLocaleString();
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5 items-center">
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                deleteProduct(record._id);
              }}
            ></i>
            <i
              className="ri-edit-line"
              onClick={() => {
                setselectedProduct(record);
                setshowProductForm(true);
              }}
            ></i>
            <span
              className="underline cursor-pointer"
              onClick={() => {
                setselectedProduct(record);
                setShowBids(true);
              }}
            >
              Show Bids
            </span>
          </div>
        );
      },
    },
  ];

  // Apply dark mode styles conditionally
  const tableClassName = isDarkMode ? "dark-table" : "light-table";

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button
          type="default"
          onClick={() => {
            setselectedProduct(null);
            setshowProductForm(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          minHeight: "100vh", // Ensures the div takes up the full height of the viewport
          padding: "16px", // Padding around the table
          width: '100%', // Ensure it takes the full width
          margin: '0 auto', // Center the table horizontally within its container
          backgroundColor: isDarkMode ? '#1c1c1c' : '#ffffff',
          border: isDarkMode ? '1px solid #58C4DC' : '1px solid #002F34', // Border for dark and light mode
          borderRadius: '8px', // Optional: Add border radius to the table
        }}
      >
        <Table
          style={{
            maxWidth: products.length > 0 ? '1400px' : '800px',
            width: products.length > 0 ? '85%' : '70%', // Adjust the width based on the condition
            backgroundColor: isDarkMode ? '#1c1c1c' : '#ffffff',
            padding: '1px',
            borderRadius: '8px',
            margin: '0 auto', // Center the table horizontally within its container
          }}
          columns={columns}
          dataSource={products}
          className={tableClassName} // Apply the dark mode class
        />
      </div>

      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setshowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
          className={tableClassName} // Apply the dark mode class
        />
      )}

      {showBids && (
        <Bids
          showBidsModal={showBids}
          setShowBidsModal={setShowBids}
          selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
}

export default Products;
