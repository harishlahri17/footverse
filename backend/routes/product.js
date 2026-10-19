const express = require("express");
const route = express.Router();


const { uploadProduct } = require("../controller/fileHandleController");
const { addProduct, getProduct, getSingleProduct, updateProduct, deleteProduct,
    addFeaturedProduct,
    removeFeaturedProduct,
    getFeaturedProducts, 
    addDiscount,
    removeDiscount} = require("../controller/productController");

route.post("/add-product", uploadProduct.array("productImages", 5), addProduct);
route.get("/get-product/", getProduct);
route.get("/get-single-product/:id", getSingleProduct);
route.put("/update-product/:id", uploadProduct.array("productImages", 5), updateProduct);
route.delete("/delete-product/:id", deleteProduct);

route.post("/featured-product/:id", addFeaturedProduct);
route.put("/remove-featured-product/:id", removeFeaturedProduct);
route.get("/get-featured-product", getFeaturedProducts);

route.put("/add-discount/:id", addDiscount);
route.put("/remove-discount/:id", removeDiscount);

module.exports = route;