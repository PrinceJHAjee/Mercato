import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/lodersSlice";
import { GetProducts, UpdateProductStatus } from "../../apicalls/products";
import { GetAllUsers, UpdateUserStatus } from "../../apicalls/Users";

function Users({isDarkMode}) {

  const [users, setUsers] = React.useState([]);
   

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllUsers(null);
      dispatch(SetLoader(false));
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
 //for admin
  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(SetLoader(true));
      const response = await UpdateUserStatus(id, status);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "20%", // Adjust width accordingly
      minWidth: 150, // Ensures minimum width for the column

    },
    {
        title: "Email",
        dataIndex: "email",
        width: "30%", // Adjust width accordingly
      minWidth: 250,

    },
    {
        title: "Role",
        dataIndex: "role",
        render:(text, record)=>{
            return record.role.toUpperCase();
        },
        width: "10%", // Adjust width accordingly
        minWidth: 100,
    },
    {
        title:"Created At",
        dataIndex:"createdAt",
        render:(text, record)=>{
            return new Date(text).toLocaleString();
        },
        width: "20%", // Adjust width accordingly
        minWidth: 200,
    },

    
   

    {
      title: "Status",
      dataIndex: "status",
      render:(text, record)=>{
        return record.status.toUpperCase();

      },
      width: "10%", // Adjust width accordingly
      minWidth: 100,
    },
    
   
    {
      title: "Action",
      dataIndex: "action",
      width: "30%", // Adjust width accordingly
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div className="flex gap-5">
            {status === "active" && (
              <span
                className="underline cursor-pointer
            "
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
               Block
              </span>
            )}
            {status === "blocked" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "active")}
              >
               Unblock
              </span>
            )}


          </div>
        );
      },
      minWidth: 150,
    },
  ];

  // Apply dark mode styles conditionally
  const tableClassName = isDarkMode ? 'dark-table' : 'light-table';

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="max-w-[1150px]">
      <Table columns={columns} dataSource={users} pagination={false}
  scroll={{ x: '100%' }}
  className={tableClassName} // Apply the dark mode class
  />
    </div>
  );
}

export default Users;
