// In routes/user.js
const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const {
  userById,
  read,
  update,
  purchaseHistory,
  updateAddress,
  getAddress,
  deleteAddress,
} = require('../controllers/user'); // Ensure this line correctly imports deleteAddress

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.get('/user/:userId', requireSignin, isAuth, read);
router.put('/user/:userId', requireSignin, isAuth, update);
router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory);
router.get('/getaddress/:userId', requireSignin, isAuth, getAddress);
router.post('/address/create/:userId', requireSignin, isAuth, updateAddress);
router.post('/address/delete/:userId', requireSignin, isAuth, deleteAddress); // Ensure this line correctly uses deleteAddress

router.param('userId', userById);

module.exports = router;
