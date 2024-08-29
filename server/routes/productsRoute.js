const router = require("express").Router();
const Product = require("../models/productModel");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddlewares");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const path = require("path");
const Notification = require("../models/notificationsModel");

const authMiddlewares = require("../middlewares/authMiddlewares");

//add a new product
router.post("/add-product", authMiddleware, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();

     // Fetch the user information
     const user = await User.findById(req.body.userId);

    // send notification to admin
    const admins = await User.find({ role: "admin" });
    admins.forEach(async (admin) => {
      const newNotification = new Notification({
        user: admin._id,
        message: `New product added by ${user.name}`,
        title: "New Product",
        onClick: `/admin`,
        read: false,
      });
      await newNotification.save();
    });
    
    res.send({
      success: true,
      message: "Product added successfully",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

//get all products
router.post("/get-products", async (req, res) => {
  try {
    const { seller, category = [], age = [], status, search="" } = req.body;
    let filters = {};
    if (seller) {
      filters.seller = seller;
    }
    if(status){
      filters.status=status;
    }

     // filter by category
    //  if (category.length > 0) {
    //   filters.category = { $in: category };
    // }

    //by gpt
    if (category.length > 0) {
      filters.category = { 
        $in: category.map(c => new RegExp(`^${c}$`, 'i')) 
      };
    }

    // filter by age
    // if (age.length > 0) {
    //   age.forEach((item) => {
    //     const fromAge = item.split("-")[0];
    //     const toAge = item.split("-")[1];
    //     filters.age = { $gte: fromAge, $lte: toAge };
    //   });
    // }

    //from gpt
    if (age.length > 0) {
      filters.$or = age.map((item) => {
        const [fromAge, toAge] = item.split("-").map(Number);
        return { age: { $gte: fromAge, $lte: toAge } };
      });
    }


    // Search filter
    if (search) {
      filters.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ];
    }

const products = await Product.find(filters).populate('seller').sort({ createdAt: -1 });
    res.send({
      success: true,
      data: products,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

//get product by id
router.get("/get-product-by-id/:id", async (req, res) => { 
  try {
    const product = await Product.findById(req.params.id).populate("seller");
    res.send({
      success: true,
      data: product,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
}
);


// edit a product
router.put("/edit-product/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//delete a product
router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get image from pc
const storage = multer.diskStorage({
  // //define where the files should be saved temporarily before being uploaded to Cloudinary. BY GPT
  // destination: function (req, file, cb) {
  //     cb(null, 'uploads/'); // Ensure this directory exists for temp storage
  // },
  // filename:function (req, file, callback){
  //     callback(null,  Date.now()+ '-' + file.originalname);
  // },

  //again by gpt
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

router.post(
  "/upload-image-to-product",
  authMiddlewares,
  multer({ storage: storage }).single("file"),
  async (req, res) => {
    try {
      //BYGPT
      if (!req.file || !req.file.path) {
        return res
          .status(400)
          .send({ success: false, message: "No file uploaded" });
      }
      //upload image to cloudinary
      

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Mercato-product",
      });
      
      const productId = req.body.productId;
      await Product.findByIdAndUpdate(productId, {
        $push: { images: result.secure_url },
      });
      res.send({
        success: true,
        message: "Image uploaded successfully",
        data: result.secure_url,
      });
    } catch (error) {
      
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
);

//update product status for admin
router.put("/update-product-status/:id", authMiddleware, async (req, res) => {
  try {
    const {status}=req.body;
    await Product.findByIdAndUpdate
    (req.params.id, {status});

    // Find the product by ID and update its status
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // This option returns the updated product
    );

    if (!updatedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // send notification to seller
    const newNotification = new Notification({
      user: updatedProduct.seller,
      message: `Your product ${updatedProduct.name} has been ${status}`,
      title: "Product Status Updated",
      onClick: `/profile`,
      read: false,
    });

    await newNotification.save();
    
    res.send({
      success: true,
      message: "Product status updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
}
);



module.exports = router;
