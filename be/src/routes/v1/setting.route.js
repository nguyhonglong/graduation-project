const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const settingController = require('../../controllers/setting.controller');
const router = express.Router();

router.route('/')
  .get(auth("getMeasurementSettings"), settingController.getMeasurementSettings)
  .put(auth("updateMeasurementSettings"), settingController.updateMeasurementSettings);

module.exports = router;