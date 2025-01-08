import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  try {
    // Get API credentials
    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretKey = process.env.PINATA_SECRET_KEY;

    if (!pinataApiKey || !pinataSecretKey) {
      return NextResponse.json({ error: 'Missing Pinata credentials' }, { status: 500 });
    }

    // Get file data from request
    const body = await req.json();
    const { fileData } = body;

    if (!fileData) {
      return NextResponse.json({ error: 'No file data provided' }, { status: 400 });
    }

    // Convert base64 to buffer
    const base64Data = fileData.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Create form data with buffer
    const formData = new FormData();
    const stream = Readable.from(buffer);
    formData.append('file', stream, {
      filename: 'image.jpg',
      contentType: 'image/jpeg',
    });

    // Upload to Pinata
    const uploadResponse = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretKey,
          ...formData.getHeaders(),
        },
        maxBodyLength: Infinity, // Add this to handle larger files
      }
    );

    // Return the IPFS URL
    return NextResponse.json({
      success: true,
      ipfsUrl: `https://ipfs.io/ipfs/${uploadResponse.data.IpfsHash}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }, { status: 500 });
  }
} 