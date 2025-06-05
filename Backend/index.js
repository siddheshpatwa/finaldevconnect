const express = require('express');
const app =express();
const cors = require('cors');
const  connectDB = require('./Config/dbConnection');
const Users = require('./Models/Users');
const userrouter = require('./Routes/UserRoute');
const profileRouter = require('./Routes/ProfileRoute');
const adminRouter = require('./Routes/AdminRoute');
const {ErrorHandler} = require('./Middleware/ErrorHandler');
require('dotenv').config();
const port = 3000;
connectDB();

app.use(cors());
// app.use(ErrorHandler());
app.use(express.json());
app.use('/api/user',userrouter)
app.use('/api/user/profile',profileRouter)
app.use('/api/admin',adminRouter)


app.listen(port, () => {
    console.log(`server is working on port http://localhost:${port}`);
});