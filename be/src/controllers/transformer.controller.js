const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { transformerService } = require('../services');


const createTransformer = catchAsync(async (req, res) => {
  const transformer = await transformerService.createTransformer(req.body);
  res.status(httpStatus.CREATED).send(transformer);
});

const getTransformer = catchAsync(async (req, res) => {
  const result = await transformerService.queryTransformers();
  res.send(result);
});

const getTransformerById = catchAsync(async (req, res) => {
  const transformer = await transformerService.queryTransformerById(req.params.transformerId);
  res.send(transformer);
});

module.exports = {
  getTransformer,
  createTransformer,
  getTransformerById
};
