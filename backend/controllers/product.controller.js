import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({products});
    } catch (error) {
        console.log("Error in get all products controller", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products"); 
        if(featuredProducts) {
           return  res.json(JSON.parse(featuredProducts)); 
        }

        // if not on redis, featch from mongodb
        // .lean() to convert mongoose object to json
        featuredProducts = await Product.find({isFeatured: true}).lean();
        if(!featuredProducts) return res.status(404).json({message: "No featured products found"}); 

        // set on redis
        await redis.set("featured_products", JSON.stringify(featuredProducts)); // cache for 1 day
        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in get featured products controller", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}

export const createProduct = async (req, res) => {
    try {
        const {name, description, isFeatured, price, image, category} = req.body;

        let cloudinaryResponse = null;
        if(image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "products"});
        }
        const product = await Product.create({
            name,
            description,
            isFeatured,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "",
            category
        });
        res.status(201).json(product);
    } catch (error) {
        console.log("Error in create product controller", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({message: "Product not found"});
            if(product.image) {
                const publicId = product.image.split("/").pop().split(".")[0];
                try {
                    await cloudinary.uploader.destroy(`products/${publicId}`); // delete image from cloudinary
                    console.log("Image deleted from cloudinary");
                } catch (error) {
                    console.log("Error deleting image from cloudinary", error.message);
                }
            }
        await Product.findByIdAndDelete(req.params.id);
        res.json({message: "Product deleted successfully"});
    } catch (error) {
        console.log("Error in delete product controller", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}


export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: {
                    size: 3
                }
            }, 
            {
                $project: {
                   _id:1,
                   name: 1,
                   image: 1,
                   description: 1,
                   price: 1
                }
            }
        ])
        res.json(products);
    } catch (error) {
        console.log("Error in get recommended products controller", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    console.log(category);
    try {
        const products = await Product.find({ category });
        res.json({products});
    } catch (error) {
        console.log("Error in get products by category controller", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({message: "Product not found"});
        product.isFeatured = !product.isFeatured;
        await product.save();
        await updateFeaturedProductsCache();
        res.json(product);
    } catch (error) {
        console.log("Error in toggle featured product controller", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}

async function updateFeaturedProductsCache() {
    try {
         const featuredProducts = await Product.find({isFeatured: true}).lean();
         await redis.set("featured_products", JSON.stringify(featuredProducts)); // cache for 1 day
    } catch (error) {
         console.log("Error updating featured products cache", error.message);
    }
}