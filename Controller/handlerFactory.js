const asyncHandler = require('express-async-handler');

const appError = require(`${__dirname}/../utils/appError`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);


exports.getAll = Model => 
    asyncHandler(async (req, res, next) => {
        let filter = {};
        if (req.filterObj) {
            filter = req.filterObj;
        }
        //* Build Query
        const feature = new APIFeatures(Model.find(filter), req.query)
            .Filter()
            .sort()
            .limitFields()
            .paginate()
            .search();

        //* Execute Query
        const docs = await feature.query;

        res.status(200).json({
            status: 'OK', 
            result: docs.length, 
            data: docs
        });
    });


exports.deleteOne = Model => 
    asyncHandler(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new appError('No document found for this id', 404));
        }

        //* Trigger the deleteOne middleware
        if (doc.product) {
            await Model.calcAverageRatingAndQuantity(doc.product);
        }
        res.status(204).json({
            status: 'OK', 
            data: null
        });
    });


exports.updateOne = (Model, query) => 
    asyncHandler(async (req, res, next) => {
        let queryObj = req.body;
        if (query) {
            queryObj = query;
        }
        
        const doc = await Model.findByIdAndUpdate(req.params.id, queryObj, {
            new: true,
        });

        if (!doc) {
            return next(new appError('No document found for this id', 404));
        }

        //* Trigger "save" event.
        doc.save();
        res.status(200).json({
            status: 'OK', 
            data: doc
        });
    });


exports.createOne = Model => 
    asyncHandler(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'OK', 
            data: doc
        });
    });


exports.getOne = (Model, populateOpt) =>
    asyncHandler(async (req, res, next) => {
        //* build the query
        let query = Model.findById(req.params.id);
        if (populateOpt) {
            query = query.populate(populateOpt);
        }

        //* Execute the query
        const doc = await query;
        if (!doc) {
            return next(new appError('No document found for this id'));
        }
    
        res.status(200).json({
            status: 'OK',
            data: doc
        });
    });