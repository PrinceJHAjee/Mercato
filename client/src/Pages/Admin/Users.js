import { Button, message, Table } from "antd";
import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/lodersSlice";
import { GetProducts, UpdateProductStatus } from "../../apicalls/products";
import { GetAllUsers, UpdateUserStatus } from "../../apicalls/Users";

function Users() {
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
    },
    {
        title: "Email",
        dataIndex: "email",
    },
    {
        title: "Role",
        dataIndex: "role",
        render:(text, record)=>{
            return record.role.toUpperCase();
        }
    },
    {
        title:"Created At",
        dataIndex:"createdAt",
        render:(text, record)=>{
            return new Date(text).toLocaleString();
        }
    },

    
   

    {
      title: "Status",
      dataIndex: "status",
      render:(text, record)=>{
        return record.status.toUpperCase();

      }
    },
    
   
    {
      title: "Action",
      dataIndex: "action",
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
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={users} pagination={false}
  scroll={{ x: '100%' }}/>
    </div>
  );
}

export default Users;
