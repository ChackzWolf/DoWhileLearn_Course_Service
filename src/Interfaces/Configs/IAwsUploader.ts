export interface IAwsUploader {
    uploadImage (imageBinary: Buffer, imageName: string): Promise<{ publicUrl: string }>
    uploadVideo(videoBinary: Uint8Array): Promise<{ publicUrl: string }>
}