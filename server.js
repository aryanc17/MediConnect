const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object 
const app = express();

//middlewares
app.use(express.json())
app.use(morgan('dev'))

//routers
app.use("/api/v1/user", require('./routes/userRoutes'));

//port
const port = process.env.PORT || 8080;

//listen port 
app.listen(port, () => {
    console.log(`Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`.bgCyan.white);

})
