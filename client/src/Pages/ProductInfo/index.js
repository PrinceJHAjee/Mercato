import React from "react";
import { useSelector } from "react-redux";
import { GetAllBids, GetProductById, GetProducts } from "../../apicalls/products";
import { SetLoader } from "../../redux/lodersSlice";
import { useDispatch } from "react-redux";
import { Button, message } from "antd";
import Dividerr from "../../Components/Dividerr";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import BidModal from "./BidModal";

function ProductInfo() {
    const { user } = useSelector((state) => state.users);
  const [product, setProduct] = React.useState(null);
  const [showAddNewBid, setShowAddNewBid] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(id);
      dispatch(SetLoader(false));
      if (response.success) {
        const bidsResponse=await GetAllBids({product:id});
        setProduct({
            ...response.data,
            bids:bidsResponse.data
        });
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  React.useEffect(() => {
    getData();
  }, []);

  return (
    product && (
      <div>
        <div className="grid grid-cols-2 gap-5 mt-5">
          {/*  col for images */}
          <div className="flex flex-col gap-5">
            <img
              src={product.images[selectedImageIndex]}
              className="w-full h-full object-cover rounded-md md-2"
              alt=""
            />
            {/* for other small images */}
            <div className="flex gap-5">
              {product.images.map((image, index) => {
                return (
                  <img
                    src={image}
                    className={
                      "w-20 h-20 object-cover rounded-md cursor-pointer" +
                      (selectedImageIndex === index
                        ? " border-2 border-green-700 border-solid p-2"
                        : "")
                    }
                    onClick={() => setSelectedImageIndex(index)}
                    alt=""
                  />
                );
              })}
            </div>
            <Dividerr />

            <div>
            <h1 className="text-gray-600">Added On</h1>
              <span className="text-gray-600">
                {moment(product.createdAt).format("MMM D , YYYY hh:mm A")}
              </span>
            </div>

          </div>

          {/* for info */}
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-[#002F34]">
                {product.name}
              </h1>
              <span>{product.description}</span>
            </div>

            <Dividerr />

            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-[#002F34]">
                Product details
              </h1>
              <div className="flex justify justify-between mt-5">
                <span>Price</span>
                <span>$ {product.price}</span>
              </div>
              
              <div className="flex justify-between mt-2">
                <span>Category</span>
                <span>{product.category}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Bill Available</span>
                <span>{product.billAvailable? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Box Available</span>
                <span>{product.boxAvailable? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Accessories Available</span>
                <span>{product.accessoriesAvailable? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Warrenty Available</span>
                <span>{product.warrentyAvailable? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Purchased Year</span>
                <span>{moment().subtract(product.age, 'years').format("YYYY")} ({product.age} years ago)</span>
              </div>
              




            </div>

            <Dividerr />
            <div className="flex flex-col">
              
              
              <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-[#002F34]">
                Seller Details
              </h1>
              <div className="flex justify justify-between mt-2">
                <span>Name</span>
                <span> {product.seller.name}</span>
              </div>
              
              <div className="flex justify-between mt-2">
                <span>email</span>
                <span>{product.seller.email}</span>
              </div>

              




            </div>
              




            </div>
            
            <Dividerr />
            <div className="flex flex-col">
                <div className="flex justify-between mb-5" >
                <h1 className="text-2xl font-semibold text-[#002F34]">Bids</h1>   
                <Button
                onClick={() => setShowAddNewBid(!showAddNewBid)}
                disabled={user._id === product.seller._id}
                >
                    
                 New Bid
                </Button>

                </div>

                {product.showBidsOnProductPage &&
                product?.bids?.map((bid) => {
                  return (
                    <div className="border border-gray-300 border-solid p-3 rounded mt-5">
                      <div className="flex justify-between text-gray-700">
                        <span>Name</span>
                        <span> {bid.buyer.name}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Bid Amount</span>
                        <span> $ {bid.bidAmount}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Bid Placed On</span>
                        <span>
                          {" "}
                          {moment(bid.createdAt).format("MMM D , YYYY hh:mm A")}
                        </span>
                      </div>
                    </div>
                  );
                })}  
            </div>
            
            


          </div>
        </div>
        {showAddNewBid && (
          <BidModal
            product={product}
            reloadData={getData}
            showBidModal={showAddNewBid}
            setShowBidModal={setShowAddNewBid}
          />
        )}
      </div>
    )
  );
  
}


export default ProductInfo;
