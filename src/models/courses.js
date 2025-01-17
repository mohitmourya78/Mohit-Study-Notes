const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    description: {
        type: Array,
        required: true,
    },
    status: {
        type: Array,
        required: true,
    },
    Watch_link: {
        type: Array,
        required: true, 
    },

    image_url: String,
})




const Course = mongoose.model('Course', coursesSchema);

module.exports = Course;
