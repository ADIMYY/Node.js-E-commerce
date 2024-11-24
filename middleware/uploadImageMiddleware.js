const multer = require('multer');

const appError = require(`${__dirname}/../utils/appError`);



const multerOptions = () => {
    // const multerStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/categories');
//     },
//     filename: function (req, file, cb) {
//         const ext = file.mimetype.split('/')[1];
//         const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
//         cb(null, fileName);
//     },
// });

    //* Memory Storage engine
    const multerStorage = multer.memoryStorage();

    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new appError('only image files allowed', 400), false);
        }
    };


    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

    return upload;
}


exports.uploadSingleImage = (fileName) => multerOptions().single(fileName);


exports.uploadMixImage = (arrayFields) => 
    multerOptions().fields(arrayFields);