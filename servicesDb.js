require('dotenv').config();
require('./src/db/conn');
const Service = require('./src/models/services');
const fs = require('fs'); 


const start = async () => {
    try {
        await process.env.MONGODB_URI;

        // Read data from services.json
        const data = fs.readFileSync('./services.json', 'utf-8');
        const ProductJson = JSON.parse(data); 

        await Service.deleteMany(); 
        await Service.create(ProductJson); 

        console.log('Data successfully replaced');

    } catch (error) {
        console.log(error);
    }
}

start();
