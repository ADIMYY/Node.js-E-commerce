const SubCategory = require(`${__dirname}/../model/subCategoryModel`);
const handlerFactory = require(`${__dirname}/handlerFactory`);



exports.setCategoryIdToBody = (req, res, next) => {
    //! Nested Route
    if (!req.body.category) {
        req.body.category = req.params.categoryId;
    }
    next();
};


exports.createFilterObject = (req, res, next) => {
    let filterObj = {};
    if (req.params.categoryId) {
        filterObj = { category: req.params.categoryId };
    }
    req.filterObj = filterObj;
    next();
};


exports.getAllSubCategory = handlerFactory.getAll(SubCategory);


exports.getSubCategory = handlerFactory.getOne(SubCategory);


exports.createSubCategory = handlerFactory.createOne(SubCategory);


exports.updateSubCategory = handlerFactory.updateOne(SubCategory);


exports.deleteSubCategory = handlerFactory.deleteOne(SubCategory);