const mongoose = require('mongoose');

const indexSchema = mongoose.Schema({
    transformer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transfromer',
    },
    Hydrogen: Number,
    Methane: Number,
    Acetylene: Number,
    Ethylene: Number,
    Ethane: Number,
    CO2: Number,
    CO: Number,
    O2:Number,
    Water: Number,
    TDCG: Number
}, { timestamps: true });


const Index = mongoose.model('Index', indexSchema);

module.exports = Index;
