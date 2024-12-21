const { Index } = require('../models');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { User, Transformer } = require('../models');
const { queryMeasurementSettings } = require('./setting.service');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const createIndex = async (indexBody) => {
  try {
    const requestData = {
      transformer: indexBody.transformer,
      Hydrogen: indexBody.Hydrogen,
      Oxygen: indexBody.O2,
      Methane: indexBody.Methane,
      CO: indexBody.CO,
      CO2: indexBody.CO2,
      Ethylene: indexBody.Ethylene,
      Ethane: indexBody.Ethane,
      Acetylene: indexBody.Acetylene,
      H2O: indexBody.Water
    };

    const healthResponse = await fetch('http://18.183.119.120/predict_health', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-API-KEY": "12345"
      },
      body: JSON.stringify(requestData)

    });
    console.log(healthResponse);

    const healthPrediction = await healthResponse.json();
    // Add health_index to request data for life expectation prediction
    const lifeRequestData = {
      Hydrogen: requestData.Hydrogen,
      Oxygen: requestData.Oxygen,
      Methane: requestData.Methane,
      CO: requestData.CO,
      CO2: requestData.CO2,
      Ethylene: requestData.Ethylene,
      Ethane: requestData.Ethane,
      Acetylene: requestData.Acetylene,
      H2O: requestData.H2O,
      Healthy_index: healthPrediction.health_index
    };

    const lifeResponse = await fetch('http://18.183.119.120/predict_life_expectation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-API-KEY": "12345"
      },
      body: JSON.stringify(lifeRequestData)
    });

    const lifePrediction = await lifeResponse.json();

    const indexWithPredictions = {
      ...indexBody,
      health_index: healthPrediction.health_index,
      life_expectation: lifePrediction.life_expectation
    };

    // Get measurement settings to check limits
    const measurementSettings = await queryMeasurementSettings();
    let criticalMeasurements = [];

    // Check each gas measurement against its high high limit
    for (const setting of measurementSettings) {
      const gasValue = indexBody[setting.measurementType];
      console.log(gasValue, setting.highHighLimit);
      if (gasValue && setting.highHighLimit && gasValue > setting.highHighLimit) {
        criticalMeasurements.push({
          gas: setting.measurementType,
          value: gasValue,
          limit: setting.highHighLimit
        });
      }
    }

    // Check health_index and life_expectation for critical values
    if (healthPrediction.health_index < 30 || lifePrediction.life_expectation < 20) {
      criticalMeasurements.push({
        gas: 'Health or Life Expectation',
        value: `Health Index: ${healthPrediction.health_index}, Life Expectation: ${lifePrediction.life_expectation}`,
        limit: 'Health Index < 30 or Life Expectation < 20'
      });
    }

    if (criticalMeasurements.length > 0) {
      // Update transformer alarm state
      await Transformer.findByIdAndUpdate(
        indexBody.transformer,
        { alarmState: 'Critical' }
      );

      // Get all users with notification permission
      const usersToNotify = await User.find({ hasNotificationPermission: true });
      const emailPromises = usersToNotify.map(user => {
        const criticalDetails = criticalMeasurements
          .map(m => `${m.gas}: ${m.value} (Limit: ${m.limit})`)
          .join('\n');

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'CRITICAL ALERT - Gas Measurements Exceeded Limits',
          text: `Critical alert for transformer ${indexBody.transformer}!\n\n` +
            `The following measurements have exceeded their high-high limits:\n${criticalDetails}\n\n` +
            `Health Index: ${healthPrediction.health_index}\n` +
            `Life Expectation: ${lifePrediction.life_expectation}`
        };

        return transporter.sendMail(mailOptions);
      });

      await Promise.all(emailPromises);
      console.log("Critical alert emails sent successfully");
    }

    return Index.create(indexWithPredictions);
  } catch (error) {
    throw error;
  }
};

const createIndexes = async (indexesData) => {
  try {
    if (!Array.isArray(indexesData)) {
      return res.status(400).json({ error: 'Invalid input data. Expected an array of objects.' });
    }
    const newIndexes = await Index.insertMany(indexesData);
    return newIndexes;
  } catch (error) {
    throw error;
  }
}

const queryIndexes = async () => {
  const indexes = await Index.find();
  return indexes;
};

const queryIndexesByDays = async (transformerId, startDate, endDate) => {
  try {
    console.log(startDate, endDate);
    const indexes = await Index.find(
      {
        transformer: mongoose.Types.ObjectId(transformerId),
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    );
    return indexes;
  } catch (error) {
    console.log(error);
  }
};

const queryIndexesByDate = async (transformerId, date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const index = await Index.findOne(
      {
        transformer: mongoose.Types.ObjectId(transformerId),
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }
    );
    return index;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createIndex,
  queryIndexes,
  queryIndexesByDays,
  createIndexes,
  queryIndexesByDate
};
