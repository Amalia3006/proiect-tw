const { Schema, model } = require("mongoose");

// {
//     user_name: [ 'Bogdan', 'Istoc', 'bogdan9898' ],
//     user_country: 'Romania',
//     user_city: 'Iasi',
//     user_email: 'istoc.bogdan98@gmail.com',
//     user_tel: '0765516301',
//     user_gender: 'male',
//     user_password: [ 'bogdan', 'bogdan' ],
//     user_bio: 'some biography or description',
//     user_occupation: 'student',
//     user_company: 'FII',
//     user_job: 'freelancer',
//     user_interest: 'development',
//     language: [ 'c++', 'java', 'javascript', 'python' ],
//     linkedin_user_url: '',
//     github_user_url: 'https://github.com/bogdan9898'
//   }

const userSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    profession: {
        type: String
    },
    company: {
        type: String
    },
    jobRole: {
        type: String
    },
    interests: {
        type: Array
    },
    languages: {
        type: Array
    },
    linkedin: {
        type: String
    },
    github: {
        type: String
    },
    registeredOn: {
        type: Date,
        default: Date.now()
    }
});

const user = model("user", userSchema);

module.exports = { user };
