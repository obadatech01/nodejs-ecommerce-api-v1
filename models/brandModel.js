const mongoose = require('mongoose');
// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand required'],
      unique: [true, 'Brand must be unique'],
      minlength: [3, 'Too short brand name'],
      maxlength: [32, 'Too long brand name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  // set image base url + image name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// apply to findOne, findAll and update
brandSchema.post('init', (doc) => {
  setImageUrl(doc);
});

// apply to create
brandSchema.post('save', (doc) => {
  setImageUrl(doc);
});

// 2- Create model
const BrandModel = mongoose.model('Brand', brandSchema);

module.exports = BrandModel;