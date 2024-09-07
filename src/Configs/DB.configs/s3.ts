import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({ region: 'eu-north-1' });

export const uploadFile = async (params: any) => {
  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log('File uploaded successfully:', params.Key);
    
    // Generate the pre-signed URL
    const getObjectParams = {
      Bucket: params.Bucket, 
      Key: params.Key
    };

    const url = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: 3600 }); // URL expires in 1 hour
    console.log('Pre-signed URL:', url);
    
    return { url }; // Return URL or additional info as needed
  } catch (err) {
    throw new Error(`Failed to upload file: ${err}`);
  }
};
