const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // const connection = await mongoose.connect('mongodb+srv://root:root@cluster0.fzfshos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
               const connection = await mongoose.connect(process.env.DB_CONNECTION);

        console.log('MongoDB connected:', connection.connection.host, connection.connection.name);


    }catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
}
module.exports = connectDB; 