const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const substationController = require('../../controllers/substation.controller');
const transformerValidation = require('../../validations/transformer.validation');
const substationValidation = require('../../validations/substation.validation')
const router = express.Router();

router
  .route('/')
  .get( auth("getSubstations"), validate(substationValidation.getSubstations), substationController.getSubstations)
  .post(auth("createSubstation"), validate(substationValidation.createSubstation), substationController.createSubstation)

router
  .route('/:substationId')
  .get(auth("getSubstations"), validate(substationValidation.getSubstations), substationController.getSubstationById)
  
module.exports = router;