const { MeasurementSetting } = require('../models');

const queryMeasurementSettings = async () => {
  const settings = await MeasurementSetting.find();
  return settings;
};

const updateMeasurementSettings= async (measurementType, highLimit, highHighLimit)  =>  {
    try {
        const updatedSetting = await MeasurementSetting.findOneAndUpdate(
            { measurementType },
            { highLimit, highHighLimit },
            { new: true, runValidators: true }
        );

        if (!updatedSetting) {
            throw new Error(`Measurement type "${measurementType}" not found`);
        }

        return updatedSetting;
    } catch (error) {
        throw new Error(`Failed to update measurement setting: ${error.message}`);
    }
}

module.exports = {
    queryMeasurementSettings,
    updateMeasurementSettings
};
