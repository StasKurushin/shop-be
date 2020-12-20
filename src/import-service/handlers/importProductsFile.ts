import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import 'source-map-support/register';

export const importProductsFile: APIGatewayProxyHandler = async ({ queryStringParameters }) => {
  const s3 = new S3({ region: 'eu-west-1' });
  let status = 200;
  let signedUrl = '';

  const params = {
    Bucket: 'import-service-hw5',
    Key: `uploaded/${queryStringParameters.name}`,
    ContentType: 'text/csv',
  };

  try {
    signedUrl = await s3.getSignedUrlPromise('putObject', params);
  } catch (err) {
    status = 500;
  }

  const response = {
    statusCode: status,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: signedUrl
  }

  return response;
};
