const { z } = require('zod');
import { Request, Response } from 'express';
const fs = require('fs');
const axios=require('axios')
import sharp from 'sharp';
const csv = require('csv-parser');
var cloudinary = require("cloudinary").v2;
const dotenv = require('dotenv');
  dotenv.config(); 
const { v4: uuidv4 } = require('uuid');
const {ImageProcessingRequest,ProductSchema} = require('../models/ImageProcessingRequest');

const processImage = require('../utils/imageProcessor');

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});


interface FileRequest extends Request {
  file?: any;
}


// Zod schema for CSV validation
const csvSchema = z.object({
  ' S. No': z.string(),
  ' Product Name': z.string(),
  ' Input Image Urls ': z.string(),
});

interface Product {
  SerialNumber: number;
  ProductName: string;
  InputImageUrls: string[];
  OutputImageUrls: string[];
}


async function uploadToCloudinary(imageBuffer: Buffer, serialNumber: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'compressed', public_id: `${serialNumber}-${Date.now()}` },
      (error:any, result: any) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Unknown error occurred during Cloudinary upload.'));
        }
      }
    );

    uploadStream.end(imageBuffer);
  });
}

async function optimizeImage(url: string, serialNumber: number): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'binary');
    const compressedImage = await sharp(buffer)
    .jpeg({ quality: 50 })
    .toBuffer();

  return await uploadToCloudinary(compressedImage, serialNumber);
}

const handleUpload = async (req: FileRequest, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const requestId = uuidv4();

  const results: any[] = [];
  fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', (data: any) => results.push(data))
    .on('end', async () => {
      try {
        const products: Product[] = results.map((row) => {
          //validating using zod
          csvSchema.parse(row);
          const serialNumber = Number(row[' S. No']);
          const inputImageUrls = row[' Input Image Urls '].split(',').map((url: string) => url.trim());
         
          return {
            SerialNumber: serialNumber,
            ProductName: row[' Product Name'],
            InputImageUrls: inputImageUrls,
            OutputImageUrls: [],
          };
        });

        const newRequest = new ImageProcessingRequest({
          requestId,
          status: 'Pending',
          products,
        });
        await newRequest.save();

         for (const product of products) {
          const outputImageUrls = await Promise.all(product.InputImageUrls.map(async (url: string) => {
            return await optimizeImage(url, product.SerialNumber);
          }));

          product.OutputImageUrls = outputImageUrls;

          const productDocument = new ProductSchema(product);
          await productDocument.save();
        }

        newRequest.status = 'Completed';
        await newRequest.save();

        await triggerWebhook(requestId);

        res.status(200).json({ requestId });
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      } finally {
        fs.unlinkSync(file.path);
      }
    });
};

const triggerWebhook = async (requestId: string) => {
  // Implement webhook triggering logic here
  console.log(`Webhook triggered for request ID: ${requestId}`);
};

const checkStatus = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const request = await ImageProcessingRequest.findOne({ requestId });

  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  res.status(200).json({ status: request.status });
};


  
const getProducts=async (req: Request, res: Response) => {
    try {
        const products: Product[] = await ProductSchema.find();
        res.render('index', { products });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const csvData= async(req:Request,res:Response)=>{
       try {
        const products: Product[] = await ProductSchema.find();
        res.render('productTable', { products });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { handleUpload, checkStatus,getProducts ,csvData};
