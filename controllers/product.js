const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id).populate('category');
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }
    req.product = product;
    next();
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  res.json(req.product);
};

exports.create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Image could not be uploaded' });
    }

    const { name, description, price, category, quantity, shipping } = fields;
    if (!name || !description || !price || !category || !quantity || !shipping) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({ error: 'Image should be less than 1mb in size' });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    try {
      const result = await product.save();
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: errorHandler(err) });
    }
  });
};

exports.remove = async (req, res) => {
  try {
    let product = req.product;
    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};

exports.update = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Image could not be uploaded' });
    }

    let product = req.product;
    product = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({ error: 'Image should be less than 1mb in size' });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    try {
      const result = await product.save();
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: errorHandler(err) });
    }
  });
};

exports.list = async (req, res) => {
  const order = req.query.order || 'asc';
  const sortBy = req.query.sortBy || '_id';
  const limit = parseInt(req.query.limit) || 6;

  try {
    const products = await Product.find()
      .select('-photo')
      .populate('category')
      .sort([[sortBy, order]])
      .limit(limit);
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: 'Products not found' });
  }
};

exports.listRelated = async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;

  try {
    const products = await Product.find({
      _id: { $ne: req.product },
      category: req.product.category,
    })
      .limit(limit)
      .populate('category', '_id name');
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: 'Products not found' });
  }
};

exports.listCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(400).json({ error: 'Categories not found' });
  }
};

exports.listBySearch = async (req, res) => {
  const order = req.body.order || 'desc';
  const sortBy = req.body.sortBy || '_id';
  const limit = parseInt(req.body.limit) || 100;
  const skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  try {
    const data = await Product.find(findArgs)
      .select('-photo')
      .populate('category')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit);
    res.json({ size: data.length, data });
  } catch (err) {
    res.status(400).json({ error: 'Products not found' });
  }
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.listSearch = async (req, res) => {
  const query = {};
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
    if (req.query.category && req.query.category != 'All') {
      query.category = req.query.category;
    }
    try {
      const products = await Product.find(query).select('-photo');
      res.json(products);
    } catch (err) {
      res.status(400).json({ error: errorHandler(err) });
    }
  }
};

exports.decreaseQuantity = async (req, res, next) => {
  const bulkOps = req.body.order.products.map((item) => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $inc: { quantity: -item.count, sold: +item.count } },
    },
  }));

  try {
    await Product.bulkWrite(bulkOps, {});
    next();
  } catch (err) {
    res.status(400).json({ error: 'Could not update product' });
  }
};
