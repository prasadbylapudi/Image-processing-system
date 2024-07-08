const mongoose = require('mongoose');

 const productSchema = new mongoose.Schema({
  SerialNumber: Number,
  ProductName: String,
  InputImageUrls: [String],
  OutputImageUrls: [String],
});

const requestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true },
  status: String,
  products: [productSchema],
});

const ImageProcessingRequest = mongoose.model('ImageProcessingRequest', requestSchema);
 const ProductSchema = mongoose.model('ProductSchema', productSchema);

module.exports = {ImageProcessingRequest,ProductSchema};
