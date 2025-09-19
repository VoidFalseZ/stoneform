import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const S3_ENDPOINT = process.env.NEXT_PUBLIC_S3_ENDPOINT;
const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET;
const S3_ACCESS_KEY = process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID;
const S3_SECRET_KEY = process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: 'sg',
  endpoint: `https://${S3_ENDPOINT}`,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) {
    return res.status(400).json({ error: 'Missing key parameter' });
  }
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    res.status(200).json({ url });
  } catch (err) {
    console.error('S3 signed URL error:', err);
    res.status(500).json({ error: err.message });
  }
}
