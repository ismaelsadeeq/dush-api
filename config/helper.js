const imageFilter = function(req, file, cb) {
    
  //make it to accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'File is not an image file!';
      return cb(new Error('File is not an image file!'), false);
  }

  cb(null, true);
};
exports.imageFilter = imageFilter;
