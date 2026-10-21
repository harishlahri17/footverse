const ProductModel = require("../model/ProductModel");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const addProduct = async (req, res) => {

    try {

        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ Success: false, Message: "Minimum 2 images required!" });
        }
        const { productId, productName, brand, price, discription, specification, category, type, size, color, imageTags } = req.body;

        // Map images with tags
        const images = req.files.map((file, index) => ({
            url: file.path,
            public_id: file.filename,
            tag: imageTags
                ? Array.isArray(imageTags)
                    ? imageTags[index] || "gallery"
                    : imageTags
                : "gallery",
        }));


        const sizesArray = Array.isArray(size) ? size : [size];

        const specsArray = Array.isArray(specification) ? specification : [specification];

        const productData = new ProductModel({
            productId: productId,
            productName: productName,
            brand: brand,
            category: category,
            type: type,
            color: color,
            size: sizesArray,
            price: price,
            discription: discription,
            specification: specsArray,
            productImage: images,
        });

        const saveData = await productData.save();
        res.status(200).json({
            Success: true,
            Message: "Product Added successfully !",
            Data: saveData,
        })
    } catch (error) {
        return res.status(500).json({ Success: false, Message: error.message });
    }

}


const getProduct = async (req, res) => {
    try {
        const list = await ProductModel.find({});
        return res.status(200).json({
            Message: "Product fetched successfully !",
            Success: true,
            TotalCount: list.length,
            list: list,
        });
    } catch (error) {
        return res.status(500).json({ Success: false, Message: error.message })
    }
}

const getSingleProduct = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        return res.status(200).json({
            Success: true,
            product: product
        })
    } catch (error) {
        return res.status(500).json({ Success: false, Message: error.message });
    }
}

const updateProduct = async (req, res) => {

    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({
                Success: false,
                Message: "Product not found"
            })
        }
        const { productId, productName, brand, category, type, color, price, discription, size,
            specification, imageTags } = req.body;

        //replace image only if uploaded

        let images = [];

        if (req.body.existingImages) {
            try {
                images = JSON.parse(req.body.existingImages);
            } catch (error) {
                return res.status(400).json({
                    Success: false,
                    Message: "Invalid existingImages format",
                });
            }
        }

        if (req.files && req.files.length) {
            const newImages = req.files.map((file, index) => ({
                url: file.path,
                public_id: file.filename,
                tag: req.body.imageTags
                    ? Array.isArray(req.body.imageTags)
                        ? req.body.imageTags[index] || "gallery"
                        : req.body.imageTags
                    : "gallery",
            }));

            images = [...images, ...newImages];
        }


        let updateData = {
            productId: productId,
            productName: productName,
            brand: brand,
            category: category,
            type: type,
            color: color,
            price: price,
            discription: discription,
            size: Array.isArray(size) ? size : [size],
            specification: Array.isArray(specification) ? specification : [specification],
            productImage: images
        }

        const updated = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({
            Success: true,
            Message: "Updated",
            data: updated
        });
    }
    catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }

}



const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({
                Success: false,
                Message: "Product not found",
            });
        }

        // Delete Cloudinary images first
        for (const img of product.productImage || []) {
            if (img.public_id) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        await ProductModel.findByIdAndDelete(id);

        return res.status(200).json({
            Success: true,
            Message: "Product deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            Success: false,
            Message: error.message,
        });
    }
};



// Add product to featured
const addFeaturedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findByIdAndUpdate(id, { isFeatured: true }, { new: true });
        if (!product) {
            return res.status(404).json({
                Success: false,
                Message: "Product not found"
            });
        }
        return res.status(200).json({
            Success: true,
            Message: "Added to featured product"
        });
    } catch (error) {

        return res.status(500).json({
            Success: false,
            Message: error.message
        });
    }
};

// Remove featured product
const removeFeaturedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findByIdAndUpdate(id, { isFeatured: false }, { new: true });
        if (!product) {
            return res.status(404).json({
                Success: false,
                Message: "Product not found"
            });
        }
        return res.status(200).json({
            Success: true,
            Message: "Removed from featured"
        });
    } catch (error) {
        return res.status(500).json({
            Success: false,
            Message: error.message
        });
    }
};

// Get only featured products
const getFeaturedProducts = async (req, res) => {
    try {
        const list = await ProductModel.find({
            isFeatured: true
        });
        return res.status(200).json({
            Success: true,
            list
        });
    } catch (error) {
        return res.status(500).json({
            Success: false,
            Message: error.message
        });
    }
};

const addDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, value } = req.body;
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({
                Success: false,
                Message: "Product not found"
            });
        }
        let finalPrice = product.price;
        if (type === "percentage") {
            finalPrice =
                product.price -
                (product.price * value) / 100;
        }
        if (type === "amount") {
            finalPrice = product.price - value;
        }
        if (finalPrice < 0) {
            finalPrice = 0;
        }
        product.discount = {
            isDiscount: true,
            type,
            value,
            finalPrice
        };
        await product.save();
        return res.status(200).json({
            Success: true,
            Message: "Discount added"
        });
    }
    catch (error) {
        return res.status(500).json({
            Success: false,
            Message: error.message
        });
    }
};

const removeDiscount = async (req, res) => {
    try {

        const { id } = req.params;
        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({
                Success: false,
                Message: "Product not found"
            });
        }

        product.discount = {
            isDiscount: false,
            type: "",
            value: 0,
            finalPrice: 0
        };
        await product.save();
        return res.status(200).json({
            Success: true,
            Message: "Discount removed"
        });

    }

    catch (error) {
        return res.status(500).json({
            Success: false,
            Message: error.message
        });
    }
};

module.exports = {
    addProduct, getProduct, getSingleProduct, updateProduct, deleteProduct,
    addFeaturedProduct, removeFeaturedProduct, getFeaturedProducts, addDiscount, removeDiscount
};