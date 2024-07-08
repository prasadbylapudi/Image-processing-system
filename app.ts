  import express, { Request, Response } from 'express';
  import bodyParser from 'body-parser';
  import path from 'path';
  const mongoose = require('mongoose');
  const dotenv = require('dotenv');
  dotenv.config(); 
  const app = express();
  const port: number = 5000;
  const {ProductSchema} = require('./models/ImageProcessingRequest');


  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const mongoUri = process.env.MONGO_URI;


  mongoose.connect(mongoUri).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error:any) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

  
interface Product {
  SerialNumber: number;
  ProductName: string;
  InputImageUrls: string[];
  OutputImageUrls: string[];
}

  app.get('/', (req:Request,res:Response)=>{
    res.render('index')
  });

  app.use('/api', require('./routes/api'));

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });