const sharp = require('sharp');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const processImage = async (imageUrl:string) => {
  const response = await axios({
    url: imageUrl,
    responseType: 'arraybuffer',
  });

  const buffer = Buffer.from(response.data, 'binary');
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const outputFilename = uuidv4() + path.extname(imageUrl);
  const outputPath = path.join(__dirname, '../public/images', outputFilename);
  
  await image
    .resize({ width: Math.round(metadata.width! / 2) })
    .toFile(outputPath);

  return `/images/${outputFilename}`;
};

module.exports = processImage;
