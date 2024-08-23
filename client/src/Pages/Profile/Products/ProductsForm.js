import { Col, Form, Input, Modal, Row, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";

import { AddProduct, EditProduct } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/lodersSlice";
import React, { useEffect } from "react";
import Images from "./Images";

const additionalThings = [
  {
    label: "Bill Available",
    name: "billAvailable",
  },
  {
    label: "Warrenty Available",
    name: "warrentyAvailable",
  },
  {
    label: "Accessories Available",
    name: "accessoriesAvailable",
  },
  {
    label: "Box Available",
    name: "boxAvailable",
  },
];

const rules=[
  {
  required:"true",
  message:"This field is required"
  }
];
function ProductsForm({ showProductForm, setShowProductForm, selectedProduct, getData }) {
  const [selectedTab="1", setSelectedTab]=React.useState("1");
  const dispatch = useDispatch();
  const {user}=useSelector(state=> state.users)
  const onFinish = async(values) => {
   try {
    
    dispatch(SetLoader(true));
    let response=null;
    if(selectedProduct){
      response=await EditProduct(selectedProduct._id,values);

    }else{
      values.seller=user._id; 
      values.status="pending";
      response=await AddProduct(values);
      
    }
     
    dispatch(SetLoader(false));
    if(response.success){
      message.success(response.message);
      getData();
      setShowProductForm(false);
    }else{
      
      message.error(response.message);
    }
    
   } catch (error) {
    dispatch(SetLoader(false));
    message.error(error.message);
    
   }
  }
  const formRef = React.useRef(null);
 
  useEffect(() => {
    if (selectedProduct) {
      formRef.current.setFieldsValue(selectedProduct);
    }
  }, [selectedProduct]);

  return (
    <Modal
      title=""
      open={showProductForm}
      onCancel={() => setShowProductForm(false)}
      centered
      width={1000}
      okText="Save"
      onOk={()=>{
        formRef.current.submit();
      }}
      {...(selectedTab==="2" && {footer: false})}
     
    >
      <div>
        <h1 className="text-primary rext-2xl text-center font-semibold uppercase">
          {selectedProduct ? "Edit Product" : "Add Product"}
        </h1>
      <Tabs defaultActiveKey="1"
      activeKey={selectedTab}
      onChange={(key)=>setSelectedTab(key)}>
        <Tabs.TabPane tab="General" key="1">
          <Form layout="vertical"
          ref={formRef}
          onFinish={onFinish}>
            <Form.Item label="Name" name="name" rules={rules}>
              <input type="text" className="w-full border p-2" 
              //both down by gpt
              value={formRef.current?.getFieldValue('name') || ''} 
              onChange={(e) => formRef.current.setFieldsValue({ name: e.target.value })}/>
            </Form.Item>
            <Form.Item label="Description" name="description" rules={rules}>
              <textarea type="text" className="w-full border p-2"
              //by gpt
              value={formRef.current?.getFieldValue('description') || ''}
              onChange={(e) => formRef.current.setFieldsValue({ description: e.target.value })}
              ></textarea>
            </Form.Item>

            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item label="Price" name="price" rules={rules}>
                  <input type="number" className="w-full border p-2" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Category" name="category" rules={rules}>
                  <select className="w-full border p-2"
                  //by gpt
                  value={formRef.current?.getFieldValue('category') || ''}
                  onChange={(e) => formRef.current.setFieldsValue({ category: e.target.value })}>
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Appliances">Appliances</option>
                    <option value="sports">Sports</option>
                    <option value="Others">Others</option>
                  </select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Age" name="age" rules={rules}>
                  <Input type="number"
                  value={formRef.current?.getFieldValue('age') || 0}/>
                </Form.Item>
              </Col>
            </Row>
            {/* for check box */}
            <div className="flex gap-10">
              {additionalThings.map((item) =>{
                return (
                  <Form.Item label={item.label} name={item.name}
                  valuePropName="checked">
                    <Input type="checkbox"
                    value={item.name}
                    onChange={(e)=>{
                      formRef.current.setFieldsValue({
                        [item.name]:e.target.checked,
                      });
                    }} 
                    checked={formRef.current?.getFieldValue(item.name) || false}
                    //by gpt
                    
                    />
                  </Form.Item>
                );


              })}
                
              

            </div>

            <Form.Item label="Show Bids on Product Page" name="showBidsOnProductPage"
                  valuePropName="checked">
                    <Input type="checkbox"
                   
                    onChange={(e)=>{
                      formRef.current.setFieldsValue({
                        showBidsOnProductPage:e.target.checked,
                      });
                    }} 
                    checked={formRef.current?.getFieldValue("showBidsOnProductPage") || false}
                    style={{width:50}}
                    
                    />
                  </Form.Item>
           
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Images" key="2"
        disabled={!selectedProduct}>
         <Images
         selectedProduct={selectedProduct} 
          setShowProductForm={setShowProductForm}
         getData={getData}
         />
        </Tabs.TabPane>
      </Tabs>
      </div>
    </Modal>
  );
}

export default ProductsForm;
