const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { substationService } = require('../services');


const createSubstation = catchAsync(async (req, res) => {
    const substation = await substationService.createSubstation(req.body);
    res.status(httpStatus.CREATED).send(substation);
});

const getSubstations = catchAsync(async (req, res) => {
    const result = await substationService.querySubstations();
    res.send(result);
});


module.exports = {
    getSubstations,
    createSubstation
};
