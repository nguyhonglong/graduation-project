const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { indexService } = require('../services');


const createIndex = catchAsync(async (req, res) => {
  const index = await indexService.createIndex(req.body);
  res.status(httpStatus.CREATED).send(index);
});

const createIndexes = catchAsync(async (req, res) => {
  const index = await indexService.createIndexes(req.body);
  res.status(httpStatus.CREATED).send(index);
});

const getIndexes = catchAsync(async (req, res) => {
  const result = await indexService.queryIndexes();
  res.send(result);
});

const getIndexesByDays = catchAsync(async (req, res) => {
  const { date } = req.query;
  const { transformerId } = req.params;
  const result = await indexService.queryIndexesByDate(transformerId, date);
  res.send(result);
});


module.exports = {
  getIndexes,
  createIndex,
  getIndexesByDays,
  createIndexes
};
