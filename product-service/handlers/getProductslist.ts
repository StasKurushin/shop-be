import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMilles: 5000
};

export const getProductsList: APIGatewayProxyHandler = async () => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const {rows: products} = await client.query(`select * from products`);
    
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: JSON.stringify({
        products
      }),
    };
  } catch (error) {
    console.log(error);
  } finally {
    await client.end();
  }
}
