import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find({userId: req.user._id,isActive: true})
        res.json(coupons || null);
    } catch (error) {
        console.log("Error in get coupon controller", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}

export const validateCoupon = async (req, res) => {
    try {
        const {code} = req.body;
        const coupon = await Coupon.findOne({code: code, userId: req.user._id, isActive: true});
        if(!coupon) return res.status(404).json({message: "Coupon not found"});
        if(coupon.expirationDate < Date.now()) {
            coupon.isActive = false;
            return res.status(404).json({message: "Coupon expired"});
        } 

        res.json({
            coupon: coupon.code,
            message: "Coupon applied successfully",
            discountPercentage: coupon.discountPercentage
        } || null);
    } catch (error) {
        console.log("Error in validate coupon controller", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}