import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ''
  }
});

// ใช้ได้กับทุกอย่าง (สินค้า/สลิป)
export async function getUploadUrl(key, contentType = 'image/jpeg') {
  const cmd = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: 'public-read',
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 });
  // หมายเหตุ: public URL ของ R2/S3 ของคุณอาจต่างจาก endpoint นี้
  const publicUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
  return { url, publicUrl };
}
