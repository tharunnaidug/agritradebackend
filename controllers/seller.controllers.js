import seller from "../models/seller.model.js";
import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import reviewModel from "../models/review.model.js";


export const profile = async (req, res) => {

    try {
        let username = req.params.username;
        const Seller = await seller.findOne({ username });
        if (!Seller) {
            return res.status(404).json({ error: "No Seller found" });
        }

        const activeProductsCount = await productModel.countDocuments({ seller: Seller._id, status: "active" });
        const outofstockProductsCount = await productModel.countDocuments({ seller: Seller._id, qty: { $lte: 0 } });

        const orderStatusCounts = await orderModel.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $match: { "productDetails.seller": Seller._id }
            },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$status", "Placed"] }, then: "pending" },
                                { case: { $eq: ["$status", "Confirmed"] }, then: "confirmed" },
                                { case: { $eq: ["$status", "Shipped"] }, then: "shipped" },
                                { case: { $eq: ["$status", "Delivered"] }, then: "delivered" },
                                { case: { $eq: ["$status", "Cancelled"] }, then: "cancelled" }
                            ],
                            default: "$status"
                        }
                    },
                    orders: { $addToSet: "$_id" }
                }
            },
            {
                $project: {
                    _id: 1,
                    count: { $size: "$orders" } // Count unique orders
                }
            }
        ]);


        const ordersCount = {
            shipped: 0,
            delivered: 0,
            pending: 0,
            confirmed: 0
        };

        orderStatusCounts.forEach(order => {
            if (ordersCount.hasOwnProperty(order._id)) {
                ordersCount[order._id] = order.count;
            }
        });


        res.status(200).json({
            id: Seller._id,
            username: Seller.username,
            companyname: Seller.companyname,
            phno: Seller.phno,
            email: Seller.email,
            activeProductsCount,
            ordersCount,
            outofstockProductsCount
        });


    } catch (error) {
        console.log("problem in Getting profile ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const sproducts = async (req, res) => {
    try {
        const sellerId = req.user?._id;
        const allPro = await productModel.find({ seller: sellerId });

        const productsWithRating = await Promise.all(
            allPro.map(async (product) => {
                const reviews = await reviewModel.find({ product: product._id });
                const total = reviews.reduce((sum, r) => sum + r.rating, 0);
                const numReviews = reviews.length;
                const avgRating = numReviews > 0 ? (total / numReviews).toFixed(1) : null;

                return { ...product.toObject(), avgRating, numReviews };
            })
        );

        res.status(200).json({ message: "success", product: productsWithRating });
    } catch (error) {
        console.error("problem in All products Of Seller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const sproduct = async (req, res) => {
    try {
        const proid = req.params.id;

        const pro = await productModel
            .findById(proid)
            .populate("seller", "companyname")
            .lean();

        if (!pro) {
            return res.status(404).json({ error: "Product not found" });
        }

        const reviews = await reviewModel.find({ product: proid }).populate("user", "name").lean();

        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : null;


        res.status(200).json({
            message: "success",
            product: pro,
            reviews,
            avgRating
        });
    } catch (error) {
        console.log("problem in getting Seller product ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const AllSellerorders = async (req, res) => {
    try {
        let sellerId = req.user?._id;
        const orders = await orderModel.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $lookup: {
                    from: "addresses",
                    localField: "address",
                    foreignField: "_id",
                    as: "addressDetails"
                }
            },
            {
                $match: { "productDetails.seller": sellerId }
            }, {
                $unwind: {
                    path: "$addressDetails",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        res.status(200).json({ message: "success", orders: orders })

    } catch (error) {
        console.log("Problem in All Orders Of Seller", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const sellerorder = async (req, res) => {
    try {
        let orderId = req.params.id;
        const od = await orderModel.findOne({ _id: orderId }).populate("address");
        res.status(200).json(od)
    } catch (error) {
        console.log("problem in Order of Seller ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const updateSellerorder = async (req, res) => {
    try {
        let orderId = req.params.id;
        const { status } = req.body;
        if (!orderId || !status) {
            return res.status(404).json({ error: "Required Parameters Doesnot Match" })
        }
        const od = await orderModel.findOne({ _id: orderId })
        if (!od) {
            return res.status(404).json({ error: "Order Not Found" })
        }
        od.status = status;

        await od.save();

        return res.status(200).json({ message: "Order updated successfully", order: od });
    } catch (error) {
        console.log("problem in Order Update By Seller ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
// export const updateSellerorder = async (req, res) => {
//     try {
//         let orderId = req.params.id;
//         const { items, address, payment, total, status } = req.body;
//         if (!orderId || items || address || payment || total || status) {
//             return res.status(404).json({ error: "Required Parameters Doesnot Match" })
//         }
//         const od = await orderModel.findOne({ _id: orderId })
//         if (!od) {
//             return res.status(404).json({ error: "Order Not Found" })
//         }
//         od.items = items;
//         od.address = address;
//         od.payment = payment;
//         od.total = total;
//         od.status = status;

//         await od.save();

//         return res.status(200).json({ message: "Order updated successfully", order: od });
//     } catch (error) {
//         console.log("problem in Order Update By Seller ", error)
//         res.status(500).json({ error: "Internal Server Error" })
//     }
// }
export const sellerUpdateProduct = async (req, res) => {
    try {
        let sellerId = req.user?._id;
        let proid = req.params.id;
        const { title, description, category, price, qty, imgSrc } = req.body;
        if (!sellerId || !proid || !title || !description || !category || !price || !qty || !imgSrc) {
            return res.status(404).json({ error: "Required Parameters Doesnot Match" })
        }
        const pro = await productModel.findById(proid)
        if (!pro) {
            return res.status(404).json({ error: "Product Not Found" })
        }
        pro.title = title;
        pro.description = description;
        pro.category = category;
        pro.price = price;
        pro.qty = qty;
        pro.imgSrc = imgSrc;

        await pro.save();
        return res.status(200).json({ message: "Product updated successfully", product: pro });
    } catch (error) {
        console.log("problem in Update Product By Seller ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const sellerDeleteProduct = async (req, res) => {
    try {
        let proid = req.params.id;

        const pro = await productModel.findById(proid)
        if (!pro) {
            return res.status(404).json({ error: "Product Not Found" })
        }
        pro.status = 'deleted';
        await pro.save();
        return res.status(200).json({ message: 'Product marked as deleted' });

    } catch (error) {
        console.log("problem in delete Product By Seller ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const sellerAddProduct = async (req, res) => {
    try {

        let sellerId = req.user?._id;
        const { title, description, category, price, qty, imgSrc } = req.body;
        if (!sellerId || !title || !description || !category || !price || !qty || !imgSrc) {
            return res.status(404).json({ error: "Required Parameters Doesnot Match" })
        }
        const product = new productModel({

            title: title,
            description: description,
            category: category,
            price: price,
            qty: qty,
            imgSrc: imgSrc,
            seller: sellerId
        })
        await product.save();

        return res.status(200).json({ message: "Product Added Successfully!", product: product })
    } catch (error) {
        console.log("problem in Add Product By Seller ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
