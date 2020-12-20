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

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  const id: string = event.pathParameters.productId;
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const {rows: product} = await client.query(`select * from products where id = '${id}'`);

    if (!product) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: `Product with ${id} was not found`
        })
      }
    }
  
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: JSON.stringify({
        product
      }),
    };
  } catch (error) {
    console.log(error)
  } finally {
    await client.end();
  }
}
