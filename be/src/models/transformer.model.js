const mongoose = require('mongoose');;

const transformerSchema = new mongoose.Schema({
    transformerId: {
        type: String,
        required: true,
        unique: true,
    },
    area: String,
    substation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Substation', 
    },
    ratedVoltage: String,
    monitorType: String,
    name:{
        type: String,
        required: true,
        unique: true,
    },
    serialnumber: String,
    alarmState: {
        type: String,
        default: 'Normal',
    },
    serviceState: {
        type: String,
        default: 'healthy',
    },
    transformerManufacturer: {
        type: String,
        default: 'Null',
    },
    rating: Number,
}, { timestamps: true });

const Transformer = mongoose.model('Transformer', transformerSchema);

module.exports = Transformer;
