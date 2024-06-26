const User = require('../models/user');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = (req, res) => {
  // console.log('user update', req.body);
  // req.body.role = 0; // role will always be 0
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: 'You are not authorized to perform this action',
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  );
};

exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];

  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount,
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: 'Could not update user purchase history',
        });
      }
      next();
    }
  );
};

exports.purchaseHistory = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate('user', '_id name')
    .sort('-created')
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      console.log(orders);
      res.json(orders);
    });
};
exports.getAddress = async (req, res) => {
  try {
    const user = await User.findById(req.profile._id).select('addresses');

    if (!user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    res.json(user.addresses);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(400).json({
      error: 'Could not fetch user address',
    });
  }
};

exports.updateAddress = async (req, res) => {
  const { street, city, state, postalCode } = req.body;
  console.log("hh");

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { addresses: { street, city, state, postalCode } } },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        error: 'Could not update user address',
      });
    }

    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(400).json({
      error: 'Could not update user address',
    });
  }
};
// In controllers/user.js

exports.deleteAddress = async (req, res) => {
  const { index } = req.body;
  console.log("Delete address request received for index:", index);

  try {
    const user = await User.findById(req.profile._id);
    
    if (!user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    if (index < 0 || index >= user.addresses.length) {
      return res.status(400).json({
        error: 'Invalid index',
      });
    }

    user.addresses.splice(index, 1);
    await user.save();

    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(400).json({
      error: 'Could not delete user address',
    });
  }
};
