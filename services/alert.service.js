const Alert = require('../models/alert.model');

async function createAlert(data) {
    const alert = new Alert(data);
    return await alert.save();
}

async function getAlerts() {
    return await Alert.find();
}

async function getAlertById(id) {
    return await Alert.findById(id);
}

async function updateAlert(id, data) {
    return await Alert.findByIdAndUpdate(id, data, { new: true });
}

async function deleteAlert(id) {
    return await Alert.findByIdAndDelete(id);
}

module.exports = {
    createAlert,
    getAlerts,
    getAlertById,
    updateAlert,
    deleteAlert
}; 