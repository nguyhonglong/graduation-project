const mongoose = require('mongoose');

const measurementSettingSchema = new mongoose.Schema({
    measurementType: {
        type: String,
        required: true,
        enum: [
            'Hydrogen', 
            'Methane', 
            'Acetylene', 
            'Ethylene', 
            'Ethane', 
            'CO', 
            'CO2'
        ],
    },
    highLimit: {
        type: Number,
        default: null 
    },
    highHighLimit: {
        type: Number,
        default: null 
    }
});

const MeasurementSetting = mongoose.model('MeasurementSetting', measurementSettingSchema);

module.exports = MeasurementSetting;
