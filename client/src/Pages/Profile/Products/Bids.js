import { message, Modal, Table } from "antd";
import React, { useEffect } from "react";
import { SetLoader } from "../../../redux/lodersSlice";
import { useDispatch } from "react-redux";
import { GetAllBids } from "../../../apicalls/products";
import moment from "moment";
import Dividerr from "../../../Components/Dividerr";

function Bids({ showBidsModal, setShowBidsModal, selectedProduct }) {
    const[bidsData,setBidsData]=React.useState([]);

    const dispatch = useDispatch();

    const getData = async () => {
      try {
        dispatch(SetLoader(true));
        const response = await GetAllBids({
          product: selectedProduct._id,
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
          title: "Bid Placed On",
          dataIndex: "createdAt",
          render: (text, record) => {
            return moment(text).format("DD-MM-YYYY hh:mm a");
          }
        },
        {
          title: "Name",
          dataIndex: "name",
          render: (text, record) => {
            return record.buyer.name;
          },
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

      useEffect(() => {
        if (selectedProduct) {
          getData();
        }
      }, [selectedProduct]);
    
  
  return (
    <Modal
      title=""
      open={showBidsModal}
      onCancel={() => setShowBidsModal(false)}
      centered
      width={window.innerWidth > 768 ? 1500 : '90%'}
      footer={null}
    >
   <div className="flex flex-col gap-3">
   <h1 className=" text-primary">Bids</h1>
        <Dividerr />
        <h1 className="text-xl text-gray-500">
          Product Name: {selectedProduct.name}
        </h1>
        <Table columns={columns} dataSource={bidsData} />

   </div>
    </Modal>
  );
}

export default Bids;
