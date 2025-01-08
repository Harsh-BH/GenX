import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

// Log initialization for debugging
console.log("Initializing uploadImage API");

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Allow larger payloads for image uploads
    },
  },
};

// Helper function to validate Pinata credentials
function getPinataCredentials() {
  console.log("hello")
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretKey = process.env.PINATA_SECRET_KEY;

  if (!pinataApiKey || !pinataSecretKey) {
    console.error('Pinata API credentials are missing');
    throw new Error('Pinata API credentials are not configured in environment variables');
  }

  return { pinataApiKey, pinataSecretKey };
}

// Function to upload image to Pinata
async function uploadToPinata(fileData: string) {
  console.log("Uploading image to Pinata...");

  const { pinataApiKey, pinataSecretKey } = getPinataCredentials();

  try {
    // Extract the base64 content from the data URI
    const base64Data = fileData.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    const blob = new Blob([buffer], { type: 'image/jpeg' });


    // Create a FormData object with the image file
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

    // Send the request to Pinata
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretKey,
        ...formData.getHeaders(),
      },
    });

    console.log("Image uploaded successfully:", response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading image to Pinata:", error);
    throw new Error('Failed to upload image to Pinata');
  }
}

// Function to create metadata and upload to Pinata
async function createMetadata(imageUri: string) {
  console.log("Uploading metadata to Pinata...");

  const { pinataApiKey, pinataSecretKey } = getPinataCredentials();

  const metadata = {
    name: 'My NFT',
    description: 'NFT Description',
    image: imageUri,
    attributes: [], // Add NFT-specific attributes if required
  };

  try {
    // Send the metadata to Pinata
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

    console.log("Metadata uploaded successfully:", response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading metadata to Pinata:", error);
    throw new Error('Failed to upload metadata to Pinata');
  }
}

// POST handler
export async function POST(req: NextRequest) {
  console.log("Handling POST request");

  try {
    const body = await req.json();
    const { fileData } = body;

    if (!fileData) {
      return NextResponse.json({ message: 'No file data provided' }, { status: 400 });
    }

    // Upload the image and get its IPFS hash
    const imageHash = await uploadToPinata(fileData);
    const imageUri = `https://ipfs.io/ipfs/${imageHash}`;

    // Create metadata and get its IPFS hash
    const metadataHash = await createMetadata(imageUri);
    const tokenUri = `https://ipfs.io/ipfs/${metadataHash}`;

    console.log("Successfully processed upload:", { imageUri, tokenUri });

    // Respond with the IPFS URIs
    return NextResponse.json({
      success: true,
      imageUri,
      tokenURI: tokenUri,
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error processing upload',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
