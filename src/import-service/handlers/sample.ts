import { S3 } from 'aws-sdk';

const BUCKET = 'stas-test-s3';

export const sample = async (event, context) => {
  const s3 = new S3({ region: 'eu-west-1' });
  let status = 200;
  let thumbnails = [];
  const params = {
    Bucket: BUCKET,
    Prefix: 'thumbnails/'
  };

  try {
    const s3Response = await s3.listObjectsV2(params).promise();
    console.log(s3Response);
    thumbnails = s3Response.Contents;
  } catch (error) {
    console.error(error);
    status = 500;
  }

  const response = {
    statusCode: status,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(
      thumbnails
        .filter(thumbnail => thumbnail.Size)
        .map(thumbnail => `https://${BUCKET}.s3-eu-west-1.amazonaws.com/${thumbnail.Key}`)
    )
  }

  return response;
}