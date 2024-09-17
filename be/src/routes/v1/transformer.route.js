const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const transformerController = require('../../controllers/transformer.controller');
const transformerValidation = require('../../validations/transformer.validation');
const router = express.Router();

router
  .route('/')
  .post(auth("createTransformer"), validate(transformerValidation.createTransformer), transformerController.createTransformer)
  .get( transformerController.getTransformer);
module.exports = router;