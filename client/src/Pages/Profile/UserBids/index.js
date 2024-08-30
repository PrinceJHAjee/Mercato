import { message, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import { GetAllBids } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/lodersSlice"; 

function Bids() {
  const [bidsData, setBidsData] = React.useState([]);

  // Define the isDarkMode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Set the initial theme based on localStorage or other logic
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllBids({
        buyer : user._id ,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        setBidsData(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const columns = [

    {
        title: "Product",
        dataIndex: "product",
        render: (text, record) => {
            return record.product.name;
        },
    },
    {
      title: "Bid Placed On",
      dataIndex: "createdAt",
      render: (text, record) => {
        return moment(text).format("DD-MM-YYYY hh:mm a");
      },
    },
    {
      title: "Seller",
      dataIndex: "seller",
      render: (text, record) => {
        return record.seller.name;
      },
    },
    {
        title: "Offered Price",
        dataIndex: "offeredPrice",
        render:(text,record)=>{
            return record.product.price;
        }
      },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
    },
    
    {
      title: "Message",
      dataIndex: "message",
    },

    {
      title: "Contact Details",
      dataIndex: "contactDetails",
      render: (text, record) => {
        return (
          <div>
            <p>Phone: {record.mobile}</p>
            <p>Email: {record.buyer.email}</p>
          </div>
        );
      },
    },
  ];

  // Apply dark mode styles conditionally
  const tableClassName = isDarkMode ? 'dark-table' : 'light-table';

  
useEffect(()=>{
getData();
}, [])
  return (
    <div style={{
      maxWidth: bidsData.length > 0 ? '1500px' : '949px',
      backgroundColor: isDarkMode ? '#1c1c1c' : '#ffffff',
      padding: '16px',
      borderRadius: '8px',
      minHeight: '100vh', // Ensure it takes the full height
      width: '100%', // Ensure it takes the full width
      margin: '0 auto', // Center the container
      border: isDarkMode ? '1px solid #333' : '1px solid #ccc', // Border for dark and light mode
    }}>
      <Table columns={columns} dataSource={bidsData}
       className={tableClassName}  // Apply the dark mode class
       style={{
        border: isDarkMode ? '1px solid #58C4DC' : '1px solid #002F34', // Border for the table itself
        borderRadius: '8px', // Optional: Add border radius to the table
      }}
      />
    </div>
  );
}

export default Bids;
