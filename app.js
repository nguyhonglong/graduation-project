const express = require('express');
const mongoose = require('mongoose');
const alertRoutes = require('./routes/alert.routes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api', alertRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 