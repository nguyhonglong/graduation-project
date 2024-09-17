const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const substationSchema = new mongoose.Schema({
    substationId: String,
    name: String,
}, { timestamps: true });

const Substation = mongoose.model('Substation', substationSchema);

module.exports = Substation;
