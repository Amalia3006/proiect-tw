const { Schema, model } = require("mongoose");

const imgSchema = new Schema({
    data: {
        type: Buffer,
        // required: true
    },
    username: {
        type: String,
        required: true
    }
});
const img = model("userImg", imgSchema);
module.exports = { img };