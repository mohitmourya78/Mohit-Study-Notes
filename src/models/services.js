const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema({

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
    download_link: {
        type: Array,
        required: true, 
    },
    view_link: {
        type: Array,
        required: true,
    }
})




const Service = mongoose.model('Service', servicesSchema);

module.exports = Service;
