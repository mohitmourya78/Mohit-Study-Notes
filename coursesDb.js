require('dotenv').config();
require('./src/db/conn');
const Course = require('./src/models/courses');
const fs = require('fs'); 


const start = async () => {
    try {
        await process.env.MONGODB_URI;

        // Read data from services.json
        const data = fs.readFileSync('./courses.json', 'utf-8');
        const ProductJson = JSON.parse(data); 

        await Course.deleteMany(); 
        await Course.create(ProductJson); 

        console.log('Data successfully replaced');

    } catch (error) {
        console.log(error);
    }
}

start();
