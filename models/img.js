const { Schema, model } = require("mongoose");

const imgSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    filename: {
        type: String
    },
    data: {
        type: Buffer,
        required: true
    }
});

const img = model("userImg", imgSchema);

module.exports = { img };
