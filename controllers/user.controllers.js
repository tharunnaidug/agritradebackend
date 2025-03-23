import user from "../models/user.model.js";
import orderModel from "../models/order.model.js";
import addressModel from "../models/address.model.js";
import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js"

export const profile = async (req, res) => {

    try {
        let username = req.params.username;
        const User = await user.findOne({ username })
        if (!User) return res.status(404).json({ error: "No user found" })

        const address = await addressModel.findOne({ userId: User._id })
        const orders = await orderModel.find({ userId: User._id })

        res.status(200).json({
            id: User._id,
            username: User.username,
            name: User.name,
            phno: User.phno,
            email: User.email,
            address: address,
            orders: orders,
            pic: User.pic,
            gender: User.gender,
            dob: User.dob
        })


    } catch (error) {
        console.log("problem in Getting profile ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
};

export const address = async (req, res) => {
    try {
        let userId = req.user._id;
        const add = await addressModel.find({ userId: userId })
        res.status(200).json({ add })
    } catch (error) {
        console.log("problem in Getting address ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
};

export const updateAdd = async (req, res) => {
    try {
        const { fullname, addressLine1, addressLine2, city, state, country, pincode, phno } = req.body;
        let userId = req.user._id;
        const add = await addressModel.updateOne({ userId: userId }, { $set: { fullname: fullname, addressLine1: addressLine1, addressLine2: addressLine2, city: city, state: state, country: country, pincode: pincode, phno: Number(phno) } }, { upsert: true })
        res.status(200).json({ message: "success" })
    } catch (error) {
        console.log("problem in Updating address ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
};

export const allOrder = async (req, res) => {
    try {
        let userId = req.user._id;
        const allOdd = await orderModel.find({ userId: userId })
        res.status(200).json(allOdd)
    } catch (error) {
        console.log("problem in All Order ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
};

export const order = async (req, res) => {
    try {
        let orderId = req.params.id;
        const od = await orderModel.findOne({ _id: orderId })
        res.status(200).json(od)
    } catch (error) {
        console.log("problem in Order ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
};

export const checkout = async (req, res) => {

    try {
        let userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized User ID not found" });
        }

        const { orderItems, address, payment, total } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ error: "No items in order" });
        }
        for (let item of orderItems) {
            let product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Product ${item.productId} not found` });
            }
            if (product.qty < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.title}` });
            }

            product.qty -= item.quantity;
            await productModel.save();
        }

        const newOrder = new orderModel({
            userId,
            items: orderItems,
            address,
            payment,
            total
        });

        await newOrder.save();

        res.status(200).json({ message: "Order Placed", orderId: newOrder._id });

    } catch (error) {
        console.log("Problem in Checkout: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const cancelorder = async (req, res) => {
    let oid = req.params.id;
    try {
        let order = await orderModel.findById(oid);
        if (!order)
            return res.status(400).json({ error: "No order Found" });
        for (let item in order.items) {
            let product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Product ${item.productId} not found` });
            }

            product.qty += item.quantity;
            await productModel.save();
        }

        await order.save();

        res.status(200).json({ message: "success" })

    } catch (error) {
        console.log("Problem in Order Cancel : ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const cart = async (req, res) => {
    try {
        let userId = req.user._id;
        let cart = await cartModel.findOne({ userId }).lean();

        if (!cart) {
            return res.status(404).json({ message: "Cart not found", cart: [] });
        }

        let updatedItems = [];
        let outOfStockItems = [];

        for (let item of cart.items) {
            let product = await productModel.findById(item.productId);

            if (!product || product.qty <= 0) {
                outOfStockItems.push({ ...item, outOfStock: true });
                continue;
            }
            let newQty = Math.min(item.qty, product.qty);
            updatedItems.push({ ...item, qty: newQty, outOfStock: false });
        }
        await cartModel.updateOne({ userId }, { $set: { items: updatedItems } });

        res.status(200).json({ message: "success", cart: { ...cart, items: updatedItems, outOfStockItems } });
    } catch (error) {
        console.log("problem in Fetching cart ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const clearCart = async (req, res) => {
    try {
        let userId = req.user._id;

        const cart = await cartModel.findOne({ userId: userId })
        cart.items = []
        await cart?.save()

        res.status(200).json({ message: "success" })
    } catch (error) {
        console.log("problem in clear cart ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const addToCart = async (req, res) => {
    try {
        let userId = req.user._id;
        const { productId, title, price, qty, imgScr } = req.body;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (qty > product.qty) {
            return res.status(400).json({ error: "Out of Stock" });
        }

        const cart = await cartModel.findOne({ userId: userId });

        let itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            if (cart.items[itemIndex].qty + qty > product.qty) {
                return res.status(400).json({ error: "Exceeds available stock" });
            }
            cart.items[itemIndex].qty += qty;
        } else {
            cart.items.push({
                productId,
                title,
                price,
                qty,
                imgSrc: Array.isArray(imgScr) ? imgScr.join(',') : imgScr
            });
        }

        await cart.save();

        res.status(200).json({ message: "success", cart: cart });
    } catch (error) {
        console.log("problem in Add cart ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const addQty = async (req, res) => {
    try {
        let userId = req.user._id;
        const { productId } = req.body;

        const cart = await cartModel.findOne({ userId: userId });
        const product = await productModel.findById(productId);

        if (!cart || !product) {
            return res.status(404).json({ error: "Product or Cart not found" });
        }

        let itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            if (cart.items[itemIndex].qty + 1 > product.qty) {
                return res.status(400).json({ error: "Exceeds available stock" });
            }
            cart.items[itemIndex].qty++;
            await cart.save();
            return res.status(200).json({ message: "success", cart });
        }

        res.status(200).json({ message: "Product Not Found in cart", cart: cart })
    } catch (error) {
        console.log("problem in Update cart ", error)
        res.status(500).json({ error: "Internal Server Error" })

    }
}
export const removeQty = async (req, res) => {
    try {
        let userId = req.user._id;
        const { productId, qty } = req.body;

        const cart = await cartModel.findOne({ userId: userId });

        let itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].qty--;
            if (cart.items[itemIndex].qty <= 0) {
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            return res.status(200).json({ message: "success", cart });
        }

        res.status(200).json({ message: "Product Not Found inside the cart", cart: cart })
    } catch (error) {
        console.log("problem in Update cart ", error)
        res.status(500).json({ error: "Internal Server Error" })

    }
}
export const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { payment } = req.body;
        const cart = await cartModel.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const address = await addressModel.findOne({ userId });
        if (!address) {
            return res.status(400).json({ message: "No address found. Please add an address." });
        }

        const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

        const newOrder = new orderModel({
            userId,
            items: cart.items,
            address: address._id,
            payment: payment,
            total,
            status: "Placed"
        });

        await newOrder.save();

        for (const item of cart.items) {
            await productModel.findByIdAndUpdate(item.productId, { $inc: { qty: -item.qty } });
        }

        // cartModel.findOneAndUpdate({ userId }, { $set: { items: [] } });
        cart.items = [];
        await cart.save();

        res.status(200).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Server error" });
    }
};