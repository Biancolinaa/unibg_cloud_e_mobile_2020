const mongoose = require('mongoose');

const speaker_schema = new mongoose.Schema({
    speaker: String,
    num_talks: Number,
    description: String
}, { collection: 'speaker_data' });

module.exports = mongoose.model('speaker', speaker_schema);