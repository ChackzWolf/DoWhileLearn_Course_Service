import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({ region: 'eu-north-1' });

export const uploadFile = async (params: any) => {
  try {
    // Upload the file (without ACL, since bucket does not allow ACLs)
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log('File uploaded successfully:', params.Key);

    // Return the public URL of the uploaded file
    const publicUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    console.log('Public URL:', publicUrl);

    return { publicUrl }; // Return the public URL for future use
  } catch (err: any) {
    throw new Error(`Failed to upload file: ${err.message}`);
  }
};
