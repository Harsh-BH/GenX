
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

async function uploadToPinata(fileData: string) {
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretKey = process.env.PINATA_SECRET_KEY;

  if (!pinataApiKey || !pinataSecretKey) {
    throw new Error('Pinata credentials not configured');
  }

  // Remove data:image/[type];base64, from the string
  const base64Data = fileData.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  const formData = new FormData();
  const blob = new Blob([buffer]);
  formData.append('file', blob, 'image.jpg');

  try {
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretKey,
      },
    });

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw new Error('Failed to upload to Pinata');
  }
}

async function createMetadata(imageUri: string) {
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretKey = process.env.PINATA_SECRET_KEY;

  const metadata = {
    name: 'My NFT',
    description: 'NFT Description',
    image: imageUri,
    attributes: [],
  };

  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretKey,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading metadata:', error);
    throw new Error('Failed to upload metadata');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fileData } = req.body;

    if (!fileData) {
      return res.status(400).json({ message: 'No file data provided' });
    }

    // Upload image to Pinata
    const imageHash = await uploadToPinata(fileData);
    const imageUri = `https://ipfs.io/ipfs/${imageHash}`;

    // Create and upload metadata
    const metadataHash = await createMetadata(imageUri);
    const tokenUri = `https://ipfs.io/ipfs/${metadataHash}`;

    return res.status(200).json({
      success: true,
      imageUri,
      tokenURI: tokenUri,
    });

  } catch (error) {
    console.error('Error processing upload:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing upload',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}