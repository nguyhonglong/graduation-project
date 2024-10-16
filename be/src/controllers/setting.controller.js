const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { substationService } = require('../services');
const { settingService } = require('../services');


const getMeasurementSettings = catchAsync(async (req, res) => {
    const settings = await settingService.queryMeasurementSettings();
    res.send(settings);
});

const updateMeasurementSettings = catchAsync(async (req, res) => {
    const { measurementType, highLimit, highHighLimit } = req.body;
    const updatedSetting = await settingService.updateMeasurementSettings(measurementType, highLimit, highHighLimit);
    res.send(updatedSetting);
}); 


module.exports = {
    getMeasurementSettings,
    updateMeasurementSettings
};
