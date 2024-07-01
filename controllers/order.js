const { Order, CartItem } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');
const stripe = require("stripe")("sk_test_51P8TDCSDhYcpKPnMNGFQvjwMaXt2m9PPEd5hwCgQ1gWe0irTRrMyBFRcHUx3lWJ0rQ80tNvkq9xe1idwuxlDap5F00hgzqZ8aG"); // Make sure to replace with your Stripe secret key

exports.orderById = async (req, res, next, id) => {
  try {
    const order = await Order.findById(id).populate('products.product', 'name price');
    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }
    req.order = order;
    next();
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};

exports.create = async (req, res) => {
  console.log("req.body.user");
  const id=req.params.userId;
  console.log(id);
  const orderData = {
    ...req.body.order,
    userId:id,
    addresses:req.body.order.address || [], 
  };
  const order = new Order(orderData);

  try {
    const data = await order.save();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: errorHandler(error) });
  }
};


exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', '_id name address').sort('-created');
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};

exports.getStatusValues = (req, res) => {
  res.json(Order.schema.path('status').enumValues);
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.updateOne(
      { _id: req.body.orderId },
      { $set: { status: req.body.status } }
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};

exports.createCheckoutSession = async (req, res) => {
  // console.log("Inside createCheckoutSession");
  try {
    const idd = req.params.userId;
    const { start, end, price } = req.body;
    // console.log(`Start: ${start}, End: ${end}, Price: ${price}`);
    let str = `${start} to ${end}`;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: str
            },
            unit_amount: price * 100
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/success/`,
      cancel_url: 'http://localhost:3000/home',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};