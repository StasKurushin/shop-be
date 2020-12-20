import { S3Handler } from 'aws-lambda';
import * as csvParser from 'csv-parser';
import { S3 } from 'aws-sdk';
import 'source-map-support/register';

export const importFileParser: S3Handler = async event => {
  console.log('importFileParser()');
  const s3 = new S3({ region: 'eu-west-1' });
  const BUCKET_NAME = 'import-service-hw5';

  const promises = event.Records.map(async record => {
    const KeyUploaded = record.s3.object.key;
    const KeyParsed = KeyUploaded.replace('uploaded', 'parsed');

    const stream = s3
      .getObject({
        Bucket: BUCKET_NAME,
        Key: KeyUploaded,
      })
      .createReadStream();

    return await new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', data => console.log(data))
        .on('end', async () => {
          console.log(`Copy from ${BUCKET_NAME}/${KeyUploaded}`);

          await s3
            .copyObject({
              Bucket: BUCKET_NAME,
              CopySource: `${BUCKET_NAME}/${KeyUploaded}`,
              Key: KeyParsed,
            })
            .promise();

          await s3
            .deleteObject({
              Bucket: BUCKET_NAME,
              Key: KeyUploaded,
            })
            .promise();
        })
        .on('error', error => reject(error))
        .on('close', () => resolve());
    });
  });

  await Promise.all(promises);
};