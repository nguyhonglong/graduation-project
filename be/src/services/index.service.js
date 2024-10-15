const { Index } = require('../models');
const mongoose = require('mongoose');

const createIndex = async (indexBody) => {
  return Index.create(indexBody);
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
