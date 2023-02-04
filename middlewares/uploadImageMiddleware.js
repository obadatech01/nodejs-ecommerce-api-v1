const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  // 1- DiskStorage engine
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, 'uploads/categories')
  //   },
  //   filename: function (req, file, cb) {
  //     // const uniqueSuffix = `${Date.now()  }-${  Math.round(Math.random() * 1E9)}`
  //     // cb(null, `${file.fieldname  }-${  uniqueSuffix}`)
  //     const ext = file.mimetype.split('/')[1];
  //     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, filename);
  //   }
  // });

  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('Only images are allowed', 400), false);
    }
  };
  
  const upload = multer({storage: multerStorage, fileFilter: multerFilter});

  return upload;
};

// 2- Memory Storage engine
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);


exports.uploadMultipleImages = (arrayOfFieldes) => multerOptions().fields(arrayOfFieldes);
